'use client';

// Hook: useSimli - Uses official simli-client package
// Connects to Simli WebRTC, displays avatar video, routes audio for lip-sync

import { useEffect, useRef, useState, useCallback } from 'react';
import { SimliClient } from 'simli-client';

interface UseSimliOptions {
  simliApiKey: string; // Only used in backend, not exposed client-side
  onError?: (error: Error) => void;
}

interface UseSimliReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  sendAudioData: (audioChunk: ArrayBuffer) => void;
  clearBuffer: () => void;
  connect: (faceId: string) => Promise<void>;
  disconnect: () => void;
}

export function useSimli(options: UseSimliOptions): UseSimliReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clientRef = useRef<SimliClient | null>(null);
  const isConnectedRef = useRef(false);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (faceId: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      // Step 1: Get session token from backend
      console.log('[Simli] Requesting session token for faceId:', faceId);
      const tokenRes = await fetch('/api/simli-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceId }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.json().catch(() => ({}));
        throw new Error(err.error || `Simli token error ${tokenRes.status}`);
      }

      const { sessionToken, iceServers } = await tokenRes.json();
      console.log('[Simli] Session token + ICE servers obtained');

      // Step 2: SimliClient needs ICE servers (TURN/STUN) for P2P mode
      // We get them from the backend (never expose API key client-side)

      // Step 3: Create video + audio elements if not already attached
      if (!videoRef.current) {
        console.warn('[Simli] No video element attached to ref');
      }
      if (!audioRef.current) {
        // Create hidden MUTED audio element for Simli
        // We mute Simli audio because ElevenLabs SDK handles audio output
        // Simli only needs to receive audio for lip-sync, not playback
        const audio = document.createElement('audio');
        audio.autoplay = true;
        audio.muted = true; // CRITICAL: prevent audio duplication
        (audio as any).playsInline = true;
        audio.setAttribute('data-attached', 'true');
        document.body.appendChild(audio);
        audioRef.current = audio;
      }

      // Step 4: Create and start SimliClient
      const simliClient = new SimliClient(
        sessionToken,
        videoRef.current!,
        audioRef.current!,
        iceServers, // ICE servers from backend (required for P2P)
        0, // LogLevel = Info
        'p2p', // Transport mode
        'websockets', // Signaling mode
        'wss://api.simli.ai', // Simli WebSocket URL
        6000 // Audio buffer size (bytes)
      );

      // Listen to events
      simliClient.on('start', () => {
        console.log('[Simli] Started!');
        setIsConnected(true);
        setIsConnecting(false);
        isConnectedRef.current = true;
      });

      simliClient.on('stop', () => {
        console.log('[Simli] Stopped');
        setIsConnected(false);
        isConnectedRef.current = false;
      });

      simliClient.on('error', (detail: string) => {
        console.error('[Simli] Error:', detail);
        setError(detail);
        setIsConnecting(false);
        options.onError?.(new Error(detail));
      });

      simliClient.on('startup_error', (message: string) => {
        console.error('[Simli] Startup error:', message);
        setError(message);
        setIsConnecting(false);
        options.onError?.(new Error(message));
      });

      await simliClient.start();
      clientRef.current = simliClient;
      console.log('[Simli] Client started successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('[Simli] Failed to connect:', errorMsg);
      setError(errorMsg);
      setIsConnecting(false);
      options.onError?.(err instanceof Error ? err : new Error(errorMsg));
    }
  }, [options.simliApiKey, options.onError]);

  const sendAudioData = useCallback((audioChunk: ArrayBuffer) => {
    if (clientRef.current && isConnectedRef.current) {
      clientRef.current.sendAudioData(new Uint8Array(audioChunk));
    }
  }, []);

  const clearBuffer = useCallback(() => {
    if (clientRef.current && isConnectedRef.current) {
      clientRef.current.ClearBuffer();
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (!clientRef.current) return;

    const client = clientRef.current;
    // Null ref immediately to prevent double-disconnect
    clientRef.current = null;

    // Only attempt stop if still connected; skip if already disconnected
    if (!isConnectedRef.current) {
      console.log('[Simli] Already disconnected, skipping stop()');
    } else {
      try {
        // Wrap stop() with a 3-second timeout to prevent hanging
        await Promise.race([
          client.stop(),
          new Promise<void>((resolve) => setTimeout(resolve, 3000)),
        ]);
        console.log('[Simli] Disconnected gracefully');
      } catch (e) {
        // SimliClient may log "FAILED TO SEND FINAL MESSAGE" internally
        // when the WebSocket is already closed. This is non-critical cleanup noise.
        console.warn('[Simli] Cleanup warning (non-critical):', e);
      }
    }

    // Clean up audio element if we created it
    if (audioRef.current && audioRef.current.hasAttribute('data-attached')) {
      audioRef.current.remove();
      audioRef.current = null;
    }

    setIsConnected(false);
    isConnectedRef.current = false;
  }, []);

  useEffect(() => {
    return () => { disconnect(); };
  }, [disconnect]);

  return {
    videoRef,
    audioRef,
    isConnecting,
    isConnected,
    error,
    sendAudioData,
    clearBuffer,
    connect,
    disconnect,
  };
}
