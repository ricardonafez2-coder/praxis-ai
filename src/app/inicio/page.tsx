'use client';

// Landing Page: Category Selector → Specialty Pages
// Shows category cards (Psicología, Medicina, Odontología, Fisioterapia)
// Each card links to /specialty where agents are filtered

import Link from 'next/link';
import { AGENTS } from '@/types/agents';

const categories = [
  {
    id: 'psicologia',
    icon: '🧠',
    title: 'Psicología',
    description: 'Entrevistas clínicas, evaluación de trastornos, TCC y más.',
    gradient: 'from-purple-600 to-indigo-600',
    borderColor: 'border-purple-500/30',
    glowColor: 'shadow-purple-500/10',
    agentCount: AGENTS.filter((a) => a.specialty === 'psicologia').length,
  },
  {
    id: 'medicina',
    icon: '🩺',
    title: 'Medicina',
    description: 'Casos clínicos, diagnóstico diferencial e historial médico.',
    gradient: 'from-red-600 to-rose-600',
    borderColor: 'border-red-500/30',
    glowColor: 'shadow-red-500/10',
    agentCount: AGENTS.filter((a) => a.specialty === 'medicina').length,
  },
  {
    id: 'odontologia',
    icon: '🦷',
    title: 'Odontología',
    description: 'Diagnóstico bucal, planes de tratamiento y valoración.',
    gradient: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/10',
    agentCount: AGENTS.filter((a) => a.specialty === 'odontologia').length,
  },
  {
    id: 'fisioterapia',
    icon: '💪',
    title: 'Fisioterapia',
    description: 'Evaluación biomecánica, rehabilitación y planes de ejercicio.',
    gradient: 'from-green-600 to-emerald-600',
    borderColor: 'border-green-500/30',
    glowColor: 'shadow-green-500/10',
    agentCount: AGENTS.filter((a) => a.specialty === 'fisioterapia').length,
  },
  {
    id: 'veterinaria',
    icon: '🐾',
    title: 'Veterinaria',
    description: 'Casos clínicos veterinarios, diagnóstico y manejo de especies.',
    gradient: 'from-amber-600 to-yellow-600',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-amber-500/10',
    agentCount: AGENTS.filter((a) => a.specialty === 'veterinaria').length,
  },
  {
    id: 'nutricion',
    icon: '🥗',
    title: 'Nutrición',
    description: 'Evaluación nutricional, plan alimenticio y entrevista motivacional.',
    gradient: 'from-teal-600 to-green-600',
    borderColor: 'border-teal-500/30',
    glowColor: 'shadow-teal-500/10',
    agentCount: AGENTS.filter((a) => a.specialty === 'nutricion').length,
  },
];

function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-praxis-6.jpg" alt="Praxis AI" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm">
            👤
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          🏥 Pacientes Virtuales con IA
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Practica entrevistas clínicas con pacientes simulados impulsados por
          inteligencia artificial. Selecciona tu especialidad para comenzar.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm">
            {AGENTS.length} pacientes disponibles · Sesiones ilimitadas
          </span>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/inicio/${cat.id}`}
              className={`group relative bg-gray-900 border ${cat.borderColor} rounded-2xl p-6 hover:scale-[1.02] hover:border-white/20 hover:shadow-lg ${cat.glowColor} transition-all duration-300`}
            >
              {/* Gradient top bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${cat.gradient}`}
              />

              <div className="flex items-start gap-5">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-3xl flex-shrink-0`}
                >
                  {cat.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-xl mb-1 group-hover:text-blue-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">{cat.description}</p>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600">
                      {cat.agentCount} paciente{cat.agentCount !== 1 ? 's' : ''} disponible{cat.agentCount !== 1 ? 's' : ''}
                    </span>
                    {cat.agentCount > 0 ? (
                      <span className="text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Explorar →
                      </span>
                    ) : (
                      <span className="text-yellow-500/70 text-xs">Próximamente</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-gray-800 py-6 text-center">
        <p className="text-gray-600 text-xs">
          Praxis AI 🚀 · Plataforma de Pacientes Virtuales · Simulación Clínica con IA
        </p>
      </footer>
    </div>
  );
}
