'use client';

// Component: ClinicalRoom - Real clinical interview with ElevenLabs + Simli
// Redesigned layout: contained video, controls below (not overlapping)

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { Agent } from '@/types/agents';
import { useClinicalSession } from '@/hooks/useClinicalSession';

const PatientAvatar = dynamic(() => import('./PatientAvatar'), { ssr: false });

interface ClinicalRoomProps {
  agent: Agent;
  studentName?: string;
  studentId?: string;
  onEndSession: () => void;
}

export default function ClinicalRoom({
  agent,
  studentName = 'Estudiante',
  studentId,
  onEndSession,
}: ClinicalRoomProps) {
  const [micEnabled, setMicEnabled] = useState(true);
  const [showScenario, setShowScenario] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleError = useCallback((error: Error) => {
    setConnectionError(error.message);
  }, []);

  const session = useClinicalSession({ onError: handleError });

  const handleStartSession = async () => {
    setConnectionError(null);
    const effectiveStudentId = studentId || `student_${Date.now()}`;
    const faceId = agent.simliFaceId || 'PENDING';
    await session.startSession(agent.elevenLabsAgentId, faceId, effectiveStudentId);
  };

  const handleEndSession = () => {
    session.endSession();
    onEndSession();
  };

  const handleToggleMic = () => setMicEnabled(prev => !prev);
  const handleRetry = () => {
    setConnectionError(null);
    handleStartSession();
  };

  const isConnecting = session.status === 'connecting';
  const isConnected = session.status === 'connected';
  const hasError = session.status === 'error';
  const isIdle = session.status === 'idle';

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* ============ LEFT: Video + Controls (flex-1) ============ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* --- Top Bar --- */}
        <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={handleEndSession}
              className="text-gray-400 hover:text-white transition-colors p-1 -ml-1"
              title="Volver a selección de pacientes"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-base font-bold">{agent.name}</h2>
              <p className="text-xs text-gray-400 capitalize">{agent.specialty}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && (
              <span className="flex items-center gap-1.5 bg-green-500/15 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">En vivo</span>
              </span>
            )}
            {isConnecting && (
              <span className="flex items-center gap-1.5 bg-yellow-500/15 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-yellow-400 text-xs">Conectando...</span>
              </span>
            )}
            <span className="text-xs text-gray-600">{studentName}</span>
          </div>
        </header>

        {/* --- Video Area (centered, scrollable if needed) --- */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          {/* Error State */}
          {hasError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
              <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-red-400 font-bold text-lg mb-2">Error de Conexión</h3>
              <p className="text-red-300/70 text-sm mb-5">
                {session.error || connectionError || 'No se pudo conectar con el agente'}
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={handleRetry} className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium text-sm">
                  Reintentar
                </button>
                <button onClick={handleEndSession} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm">
                  Volver
                </button>
              </div>
            </div>
          )}

          {/* Patient Avatar (hidden during error) */}
          {!hasError && (
            <PatientAvatar
              videoRef={session.videoRef}
              isConnecting={isConnecting}
              isConnected={session.simliConnected}
              isSpeaking={session.isAgentSpeaking}
              patientName={agent.name}
              scenario={showScenario ? agent.scenario : undefined}
            />
          )}
        </div>

        {/* --- Controls Bar (always below video, never overlapping) --- */}
        <footer className="flex-shrink-0 border-t border-gray-800 bg-gray-950/90 backdrop-blur-sm px-5 py-3">
          {isIdle && (
            <div className="max-w-[500px] mx-auto">
              {/* Connection status dots */}
              <div className="flex items-center justify-center gap-4 mb-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  ElevenLabs
                </span>
                <span className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.simliFaceId ? 'bg-green-500' : 'bg-gray-600'}`} />
                  Simli {agent.simliFaceId ? '✓' : '(pendiente)'}
                </span>
              </div>
              <button
                onClick={handleStartSession}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                🎬 Iniciar Consulta con {agent.name}
              </button>
              <p className="text-center text-gray-600 text-xs mt-2">
                Se solicitará acceso al micrófono para la conversación
              </p>
            </div>
          )}

          {isConnected && (
            <div className="flex items-center justify-center gap-4">
              {/* Mic Toggle */}
              <button
                onClick={handleToggleMic}
                className={`p-3 rounded-full transition-colors ${
                  micEnabled
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-red-600/20 hover:bg-red-600/40 text-red-400'
                }`}
                title={micEnabled ? 'Micrófono activo' : 'Micrófono silenciado'}
              >
                {micEnabled ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    <line x1="3" y1="3" x2="21" y2="21" strokeWidth={2} />
                  </svg>
                )}
              </button>

              {/* Connection status mini */}
              <div className="text-xs text-gray-600 text-center flex flex-col items-center">
                <span className="text-green-400 font-medium">● Conectado</span>
                <span>
                  {session.elConnected ? 'ElevenLabs' : ''}
                  {session.elConnected && session.simliConnected ? ' + ' : ''}
                  {session.simliConnected ? 'Simli' : ''}
                </span>
              </div>

              {/* End Session */}
              <button
                onClick={handleEndSession}
                className="p-3 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-full transition-colors"
                title="Terminar consulta"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {isConnecting && (
            <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Conectando videollamada...
            </div>
          )}
        </footer>
      </div>

      {/* ============ RIGHT: Transcript Panel ============ */}
      <div className="w-80 border-l border-gray-800 flex flex-col bg-gray-900/30">
        <div className="flex-shrink-0 p-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            📋 Transcripción
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {session.transcript.length === 0 && !isConnected && (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs">La conversación aparecerá aquí</p>
            </div>
          )}

          {session.transcript.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                  msg.role === 'agent'
                    ? 'bg-gray-800 text-gray-200'
                    : 'bg-blue-600/20 text-blue-100'
                }`}
              >
                <p className="text-[10px] text-gray-500 mb-0.5">
                  {msg.role === 'agent' ? agent.name : 'Tú'} ·{' '}
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {isConnected && session.isAgentSpeaking && session.transcript.length === 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-xl px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scenario Toggle */}
        <div className="flex-shrink-0 p-3 border-t border-gray-800">
          <button
            onClick={() => setShowScenario(!showScenario)}
            className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors text-center"
          >
            {showScenario ? 'Ocultar escenario clínico' : 'Mostrar escenario clínico'}
          </button>
        </div>
      </div>
    </div>
  );
}
