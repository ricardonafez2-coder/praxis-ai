'use client';

// Hook: useElevenLabs - Uses official @elevenlabs/client SDK
// Conversations via signed URL (WebSocket) with voice support

import { useEffect, useRef, useState, useCallback } from 'react';
import { Conversation } from '@elevenlabs/client';
import type { Conversation as ConvInstance } from '@elevenlabs/client';

interface TranscriptMessage {
  role: string;
  content: string;
}

interface UseElevenLabsOptions {
  onAudioChunk?: (audioChunk: ArrayBuffer) => void;
  onInterruption?: () => void;
  onAgentSpeaking?: (isSpeaking: boolean) => void;
  onTranscript?: (message: TranscriptMessage) => void;
  onError?: (error: Error) => void;
  onMetadata?: (metadata: {
    conversationId: string;
    agentOutputFormat?: string;
    userInputFormat?: string;
  }) => void;
}

interface UseElevenLabsReturn {
  isConnecting: boolean;
  isConnected: boolean;
  isAgentSpeaking: boolean;
  error: string | null;
  conversationId: string | null;
  connect: (signedUrl: string) => Promise<void>;
  disconnect: () => void;
}

export function useElevenLabs(options: UseElevenLabsOptions = {}): UseElevenLabsReturn {
  const conversationRef = useRef<ConvInstance | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const connect = useCallback(async (signedUrl: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!signedUrl) throw new Error('No signed URL provided');

      console.log('[ElevenLabs] Starting conversation via official SDK...');

      // Check for microphone availability BEFORE starting session
      let hasMicrophone = false;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Release immediately
        hasMicrophone = true;
      } catch (micErr) {
        console.warn('[ElevenLabs] Microphone not available:', micErr);
      }

      const useTextOnly = !hasMicrophone;

      const conversation = await Conversation.startSession({
        signedUrl,
        textOnly: useTextOnly, // Fallback to text-only if no mic
        connectionType: 'websocket',
        language: 'es',
        overrides: {
          conversation: {
            textOnly: useTextOnly,
          },
        },
        // Only pass inputDeviceId if microphone is available
        ...(hasMicrophone ? { inputDeviceId: undefined } : {}),
        useWakeLock: hasMicrophone, // Only keep screen awake for voice calls
        onConnect: ({ conversationId: convId }) => {
          console.log('[ElevenLabs] Connected! Conversation ID:', convId);
          setConversationId(convId);
          setIsConnected(true);
          setIsConnecting(false);
          options.onMetadata?.({ conversationId: convId });
        },
        onDisconnect: (details) => {
          console.log('[ElevenLabs] Disconnected:', details);
          setIsConnected(false);
          setIsAgentSpeaking(false);
        },
        onMessage: (props) => {
          console.log('[ElevenLabs] Transcript:', props.role, props.message?.substring(0, 80));
          options.onTranscript?.({
            role: props.role === 'user' ? 'student' : 'agent',
            content: props.message,
          });
        },
        onAudio: (base64Audio: string) => {
          // Convert base64 to ArrayBuffer and route to Simli
          try {
            const binary = atob(base64Audio);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            options.onAudioChunk?.(bytes.buffer);
            setIsAgentSpeaking(true);
          } catch {
            // Ignore decode errors
          }
        },
        onModeChange: ({ mode }) => {
          console.log('[ElevenLabs] Mode:', mode);
          setIsAgentSpeaking(mode === 'speaking');
          options.onAgentSpeaking?.(mode === 'speaking');
        },
        onInterruption: () => {
          console.log('[ElevenLabs] User interrupted');
          options.onInterruption?.();
          setIsAgentSpeaking(false);
        },
        onError: (message: string) => {
          console.error('[ElevenLabs] Error:', message);
          setError(message);
          setIsConnecting(false);
          options.onError?.(new Error(message));
        },
        onStatusChange: ({ status }) => {
          console.log('[ElevenLabs] Status:', status);
          if (status === 'connected') {
            setIsConnected(true);
            setIsConnecting(false);
          } else if (status === 'disconnected') {
            setIsConnected(false);
          }
        },
        onCanSendFeedbackChange: ({ canSendFeedback }) => {
          console.log('[ElevenLabs] Can send feedback:', canSendFeedback);
        },
      });

      conversationRef.current = conversation;
      console.log('[ElevenLabs] Conversation session started successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('[ElevenLabs] Failed to start conversation:', errorMsg);
      setError(errorMsg);
      setIsConnecting(false);
      options.onError?.(err instanceof Error ? err : new Error(errorMsg));
    }
  }, [options.onAudioChunk, options.onInterruption, options.onAgentSpeaking, options.onTranscript, options.onError, options.onMetadata]);

  const disconnect = useCallback(() => {
    if (conversationRef.current) {
      conversationRef.current.endSession();
      conversationRef.current = null;
    }
    setIsConnected(false);
    setIsAgentSpeaking(false);
    setConversationId(null);
  }, []);

  useEffect(() => {
    return () => { disconnect(); };
  }, [disconnect]);

  return {
    isConnecting,
    isConnected,
    isAgentSpeaking,
    error,
    conversationId,
    connect,
    disconnect,
  };
}
