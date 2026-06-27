'use client';

// Component: AgentSelector
// Grid of available patient agents to start a clinical session

import type { Agent } from '@/types/agents';

interface AgentSelectorProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  selectedId?: string;
  title?: string;
}

const specialtyIcons: Record<string, string> = {
  psicologia: '🧠',
  medicina: '🩺',
  odontologia: '🦷',
  fisioterapia: '💪',
  veterinaria: '🐾',
};

const specialtyColors: Record<string, string> = {
  psicologia: 'from-purple-600 to-indigo-600',
  medicina: 'from-red-600 to-rose-600',
  odontologia: 'from-blue-600 to-cyan-600',
  fisioterapia: 'from-green-600 to-emerald-600',
  veterinaria: 'from-amber-600 to-yellow-600',
};

export default function AgentSelector({
  agents,
  onSelectAgent,
  selectedId,
  title,
}: AgentSelectorProps) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          {title || '🏥 Pacientes Virtuales con IA'}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Practica entrevistas clínicas con pacientes simulados impulsados por
          inteligencia artificial. Cada paciente tiene una personalidad y caso
          clínico único.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-8 flex-wrap justify-center">
        {['psicologia', 'medicina', 'odontologia', 'fisioterapia', 'veterinaria'].map((spec) => (
          <span
            key={spec}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              agents.some(a => a.specialty === spec)
                ? 'bg-gray-800 text-gray-300'
                : 'bg-gray-900 text-gray-600'
            }`}
          >
            {specialtyIcons[spec]} {spec}
          </span>
        ))}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(agent)}
            className={`group relative text-left p-6 rounded-2xl border transition-all duration-300 ${
              selectedId === agent.id
                ? 'border-blue-500 bg-gray-800/80 shadow-lg shadow-blue-500/10 scale-[1.02]'
                : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/50 hover:scale-[1.01]'
            }`}
          >
            {/* Gradient accent top bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${
                specialtyColors[agent.specialty] || 'from-gray-600 to-gray-500'
              }`}
            />

            <div className="flex items-start gap-4">
              {/* Avatar placeholder */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                specialtyColors[agent.specialty] || 'from-gray-700 to-gray-600'
              } flex items-center justify-center text-2xl flex-shrink-0`}>
                {specialtyIcons[agent.specialty]}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-gray-500 text-xs capitalize mt-0.5">
                  {specialtyIcons[agent.specialty]} {agent.specialty}
                </p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {agent.description}
                </p>
              </div>
            </div>

            {/* Hover action */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {agent.scenario ? 'Caso clínico disponible' : 'En desarrollo'}
              </span>
              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                Iniciar →
              </span>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
