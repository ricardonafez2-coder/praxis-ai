'use client';

// Hook: useClinicalSession - Orchestrates ElevenLabs + Simli + Supabase Persistence
// Flow: 1) Register student in DB → 2) Get signed URL → 3) Create session in DB →
//       4) Connect ElevenLabs → 5) Connect Simli → 6) Save messages in real-time →
//       7) On end: mark session completed in DB

import { useState, useCallback, useRef } from 'react';
import { useSimli } from './useSimli';
import { useElevenLabs } from './useElevenLabs';
import type { Message } from '@/types/agents';

const SIMLI_API_KEY = process.env.NEXT_PUBLIC_SIMLI_API_KEY || '7djtfrat4viyt0hbkh59w';

interface UseClinicalSessionOptions {
  onError?: (error: Error) => void;
  onStatusChange?: (status: 'idle' | 'connecting' | 'connected' | 'error') => void;
}

interface UseClinicalSessionReturn {
  status: 'idle' | 'connecting' | 'connected' | 'error';
  isAgentSpeaking: boolean;
  error: string | null;
  transcript: Message[];
  videoRef: React.RefObject<HTMLVideoElement | null>;
  simliConnected: boolean;
  elConnected: boolean;
  startSession: (elevenLabsAgentId: string, faceId: string, studentId: string) => Promise<void>;
  endSession: () => void;
}

async function persistMessage(sessionId: string, role: string, content: string) {
  try {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, role, content }),
    });
  } catch (e) {
    console.warn('[ClinicalSession] Failed to save message:', e);
  }
}

export function useClinicalSession(
  options: UseClinicalSessionOptions = {}
): UseClinicalSessionReturn {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [currentError, setCurrentError] = useState<string | null>(null);
  
  // Track current session for API calls
  const currentSessionIdRef = useRef<string | null>(null);

  const handleStatusChange = useCallback((newStatus: 'idle' | 'connecting' | 'connected' | 'error') => {
    setStatus(newStatus);
    options.onStatusChange?.(newStatus);
  }, [options.onStatusChange]);

  // Simli hook (video)
  const simli = useSimli({
    simliApiKey: SIMLI_API_KEY,
    onError: (err) => {
      setCurrentError(`Simli: ${err.message}`);
      handleStatusChange('error');
      options.onError?.(err);
    },
  });

  // ElevenLabs hook (conversation) — signedUrl passed to connect()
  const elevenLabs = useElevenLabs({
    onAudioChunk: (chunk) => {
      simli.sendAudioData(chunk);
    },
    onInterruption: () => {
      simli.clearBuffer();
    },
    onTranscript: (msg) => {
      const newMsg: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        role: msg.role as 'student' | 'agent',
        content: msg.content,
        timestamp: new Date(),
      };
      setTranscript(prev => [...prev, newMsg]);
      
      // Persist each message to Supabase in real-time
      if (currentSessionIdRef.current) {
        persistMessage(currentSessionIdRef.current, newMsg.role, newMsg.content);
      }
    },
    onError: (err) => {
      setCurrentError(`ElevenLabs: ${err.message}`);
      handleStatusChange('error');
      options.onError?.(err);
    },
  });

  const startSession = useCallback(async (
    elevenLabsAgentId: string,
    faceId: string,
    studentId: string
  ) => {
    handleStatusChange('connecting');
    setCurrentError(null);
    setTranscript([]);

    try {
      // Step 1: Get signed URL + session metadata from backend
      console.log('[ClinicalSession] Requesting signed URL for agent:', elevenLabsAgentId);
      
      const res = await fetch('/api/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: elevenLabsAgentId, studentId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `API error ${res.status}`);
      }

      const { elevenLabsSignedUrl, sessionId } = await res.json();
      // Store session ID for message persistence
      currentSessionIdRef.current = sessionId;
      console.log('[ClinicalSession] Session ID:', sessionId);

      // Step 2: Register student in Supabase
      console.log('[ClinicalSession] Registering student...');
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName: studentId.includes('@') ? studentId.split('@')[0] : studentId,
        }),
      }).catch(e => console.warn('[ClinicalSession] Student registration failed:', e));

      // Step 3: Save session record to Supabase
      console.log('[ClinicalSession] Saving session to DB...');
      fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          status: 'active',
          studentId,
          agentId: elevenLabsAgentId,
        }),
      }).catch(e => console.warn('[ClinicalSession] Session save failed:', e));

      // Step 4: Connect ElevenLabs WebRTC (audio conversation)
      console.log('[ClinicalSession] Connecting ElevenLabs...');
      await elevenLabs.connect(elevenLabsSignedUrl);

      // Step 5: Connect Simli WebRTC (video/animation)
      if (faceId && faceId !== 'PENDING') {
        console.log('[ClinicalSession] Connecting Simli with faceId:', faceId);
        try {
          await simli.connect(faceId);
        } catch (simliErr) {
          console.warn('[ClinicalSession] Simli connection failed (non-blocking):', simliErr);
        }
      } else {
        console.log('[ClinicalSession] No Simli faceId configured — audio-only mode');
      }

      handleStatusChange('connected');
      console.log('[ClinicalSession] Session fully connected');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[ClinicalSession] Failed to start:', error.message);
      setCurrentError(error.message);
      handleStatusChange('error');
      options.onError?.(error);
    }
  }, [elevenLabs, simli, handleStatusChange, options.onError]);

  const endSession = useCallback(() => {
    console.log('[ClinicalSession] Ending session');
    
    // Mark session as completed in Supabase
    const sessionId = currentSessionIdRef.current;
    if (sessionId) {
      fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          status: 'completed',
          endedAt: new Date().toISOString(),
        }),
      }).catch(e => console.warn('[ClinicalSession] Session end save failed:', e));
      currentSessionIdRef.current = null;
    }

    simli.disconnect();
    elevenLabs.disconnect();
    handleStatusChange('idle');
    setTranscript([]);
  }, [elevenLabs, simli, handleStatusChange]);

  return {
    status,
    isAgentSpeaking: elevenLabs.isAgentSpeaking,
    error: currentError || simli.error || elevenLabs.error,
    transcript,
    videoRef: simli.videoRef,
    simliConnected: simli.isConnected,
    elConnected: elevenLabs.isConnected,
    startSession,
    endSession,
  };
}
