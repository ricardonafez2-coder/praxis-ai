'use client';

// Dynamic Specialty Page: Shows agents filtered by specialty (psicologia, medicina, etc.)
// Route: /psicologia, /medicina, /odontologia, /fisioterapia

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AGENTS } from '@/types/agents';
import type { Agent } from '@/types/agents';
import AgentSelector from '@/components/AgentSelector';

const ClinicalRoom = dynamic(() => import('@/components/ClinicalRoom'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Cargando sala clínica...</p>
      </div>
    </div>
  ),
});

const specialtyMeta: Record<string, { icon: string; title: string; subtitle: string; gradient: string }> = {
  psicologia: {
    icon: '🧠',
    title: 'Psicología',
    subtitle: 'Pacientes virtuales para practicar entrevistas clínicas, evaluación y terapia psicológica.',
    gradient: 'from-purple-600 to-indigo-600',
  },
  medicina: {
    icon: '🩺',
    title: 'Medicina',
    subtitle: 'Casos clínicos para diagnóstico diferencial y práctica de historial médico.',
    gradient: 'from-red-600 to-rose-600',
  },
  odontologia: {
    icon: '🦷',
    title: 'Odontología',
    subtitle: 'Pacientes virtuales para práctica de diagnóstico y planificación dental.',
    gradient: 'from-blue-600 to-cyan-600',
  },
  fisioterapia: {
    icon: '💪',
    title: 'Fisioterapia',
    subtitle: 'Simulaciones para evaluación biomecánica y planes de rehabilitación.',
    gradient: 'from-green-600 to-emerald-600',
  },
  veterinaria: {
    icon: '🐾',
    title: 'Veterinaria',
    subtitle: 'Casos clínicos veterinarios para práctica de diagnóstico y manejo de especies.',
    gradient: 'from-amber-600 to-yellow-600',
  },
};

function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <div>
            <h1 className="text-white font-bold">Praxis AI</h1>
            <p className="text-gray-500 text-xs">Pacientes Virtuales</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600 hidden sm:block">Simulación Clínica con IA</span>
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm">👤</div>
        </div>
      </div>
    </header>
  );
}

export default function SpecialtyPage() {
  const params = useParams();
  const specialty = (params.specialty as string) || '';
  const meta = specialtyMeta[specialty];

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Filter agents by specialty
  const specialtyAgents = AGENTS.filter((a) => a.specialty === specialty);

  const handleEndSession = () => {
    setSelectedAgent(null);
  };

  // Unknown specialty → redirect or show empty
  if (!meta) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="p-8 max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-3">Especialidad no encontrada</h2>
          <p className="text-gray-400 mb-6">La categoría "{specialty}" no existe.</p>
          <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {selectedAgent ? (
        <ClinicalRoom
          agent={selectedAgent}
          studentName="Estudiante"
          onEndSession={handleEndSession}
        />
      ) : (
        <div className="min-h-screen bg-gray-950">
          <Header />

          {/* Category Hero */}
          <div className="border-b border-gray-800">
            <div className="max-w-6xl mx-auto px-8 py-8">
              <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-4 transition-colors">
                ← Volver al inicio
              </Link>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-3xl`}>
                  {meta.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{meta.title}</h1>
                  <p className="text-gray-400 mt-1">{meta.subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {specialtyAgents.length === 0 ? (
            <div className="p-8 max-w-6xl mx-auto text-center">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12">
                <div className="text-5xl mb-4">🚧</div>
                <h3 className="text-white font-semibold text-lg mb-2">Próximamente</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Estamos desarrollando los pacientes virtuales para {meta.title}. Vuelve pronto.
                </p>
              </div>
            </div>
          ) : (
            <AgentSelector
              agents={specialtyAgents}
              onSelectAgent={setSelectedAgent}
              title={`Pacientes — ${meta.title}`}
            />
          )}

          <footer className="border-t border-gray-800 mt-12 py-6 text-center">
            <p className="text-gray-600 text-xs">
              Praxis AI 🚀 · Plataforma de Pacientes Virtuales
            </p>
          </footer>
        </div>
      )}
    </>
  );
}
