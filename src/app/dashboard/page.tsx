'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SessionSummary {
  id: string;
  agent_name: string;
  student_name: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  messages?: { count: number }[] | null;
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    avgDuration: 0,
    evaluatedSessions: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch via backend API (service_role, no RLS issues)
      const res = await fetch('/api/sessions?limit=50');
      if (!res.ok) throw new Error(`API error ${res.status}`);

      const { sessions: sessionsData } = await res.json();

      if (sessionsData && sessionsData.length > 0) {
        const formatted = sessionsData.map((s: any) => ({
          id: s.id,
          agent_name: s.agent_name || 'Desconocido',
          student_name: s.student_name || 'Estudiante',
          status: s.status || 'unknown',
          started_at: s.started_at,
          ended_at: s.ended_at,
          duration_minutes: s.duration_minutes,
          message_count: s.message_count || 0,
          has_evaluation: false,
        }));

        setSessions(formatted);
        setStats({
          totalSessions: formatted.length,
          completedSessions: formatted.filter((s: any) => s.status === 'completed').length,
          avgDuration: formatted.length > 0
            ? Math.round(formatted.reduce((a: number, s: any) => a + (s.duration_minutes || 0), 0) / formatted.length)
            : 0,
          evaluatedSessions: formatted.filter((s: any) => s.has_evaluation).length,
        });
      } else {
        setSessions([]);
        setStats({ totalSessions: 0, completedSessions: 0, avgDuration: 0, evaluatedSessions: 0 });
      }
    } catch (err) {
      console.error('[Dashboard] Error loading sessions:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Activa' },
      completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Completada' },
      interrupted: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Interrumpida' },
    };
    const c = config[status] || { bg: 'bg-gray-500/10', text: 'text-gray-400', label: status };
    return (
      <span className={`${c.bg} ${c.text} px-2.5 py-1 rounded-full text-xs font-medium`}>
        {c.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
        <p className="text-gray-400 mt-1">Supervisa las sesiones clínicas de tus alumnos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📋" label="Total Sesiones" value={stats.totalSessions} color="blue" />
        <StatCard icon="✅" label="Completadas" value={stats.completedSessions} color="green" />
        <StatCard icon="⏱️" label="Duración Promedio" value={`${stats.avgDuration} min`} color="purple" />
        <StatCard icon="⭐" label="Evaluadas" value={stats.evaluatedSessions} color="yellow" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-white font-semibold">Sesiones Recientes</h3>
          <button onClick={loadData} className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
            🔄 Actualizar
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-white font-semibold mb-2">No hay sesiones aún</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Las sesiones clínicas aparecerán aquí cuando los alumnos comiencen a usar el simulador.
            </p>
            <div className="mt-6">
              <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-500 transition-colors">
                🏠 Ir al Simulador
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Alumno</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Duración</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {(session.agent_name || 'P')[0]}
                        </div>
                        <span className="text-white text-sm font-medium">{session.agent_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{session.student_name}</td>
                    <td className="px-6 py-4">{statusBadge(session.status)}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(session.started_at).toLocaleDateString('es-MX', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {session.duration_minutes ? `${session.duration_minutes} min` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/sessions/${session.id}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                        Ver sesión →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: string; label: string; value: string | number; color: 'blue' | 'green' | 'purple' | 'yellow';
}) {
  const borders: Record<string, string> = {
    blue: 'border-blue-500/30', green: 'border-green-500/30',
    purple: 'border-purple-500/30', yellow: 'border-yellow-500/30',
  };
  return (
    <div className={`bg-gray-900 border ${borders[color]} rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
}
