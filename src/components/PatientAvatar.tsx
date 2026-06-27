'use client';

// Component: PatientAvatar - Simli WebRTC video with patient face
// Redesigned: contained video, not full-panel

import { useEffect, useRef } from 'react';

interface PatientAvatarProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isConnecting: boolean;
  isConnected: boolean;
  isSpeaking: boolean;
  patientName: string;
  scenario?: string;
}

export default function PatientAvatar({
  videoRef,
  isConnecting,
  isConnected,
  isSpeaking,
  patientName,
  scenario,
}: PatientAvatarProps) {
  return (
    <div className="relative w-full max-w-[500px] mx-auto rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl shadow-black/50">
      {/* 4:5 aspect ratio — portrait orientation for patient */}
      <div className="relative" style={{ paddingBottom: '125%' }}>
        {/* Simli Video Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isConnected ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Loading State */}
        {isConnecting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-base font-medium">
              Conectando con {patientName}...
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Preparando videollamada clínica
            </p>
          </div>
        )}

        {/* Not Connected State */}
        {!isConnecting && !isConnected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-3">
              <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
              </svg>
            </div>
            <p className="text-gray-400 text-base">{patientName}</p>
            <p className="text-gray-500 text-xs mt-1">Paciente virtual</p>
          </div>
        )}

        {/* Speaking Indicator */}
        {isConnected && isSpeaking && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-green-500/25 backdrop-blur-sm rounded-full px-3 py-1 z-10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-xs font-medium">Hablando</span>
          </div>
        )}

        {/* Patient Info Overlay (bottom of video) */}
        {isConnected && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
            <h3 className="text-white font-semibold text-sm">{patientName}</h3>
            {scenario && (
              <p className="text-gray-300 text-xs mt-1 line-clamp-2">{scenario}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
