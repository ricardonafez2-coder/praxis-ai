'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  nombre: string;
  matricula: string;
  programa: string | null;
  semestre: number | null;
  total_sessions: number;
  last_session: string | null;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      // Fetch via backend API (service_role, no RLS issues)
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error(`API error ${res.status}`);

      const { students: studentsData } = await res.json();
      setStudents(studentsData || []);
    } catch (err) {
      console.error('[Students] Error loading students:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Alumnos</h2>
        <p className="text-gray-400 mt-1">Registro de alumnos que han usado el simulador</p>
      </div>

      {students.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-white font-semibold mb-2">No hay alumnos registrados</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Los alumnos aparecerán aquí cuando comiencen a usar el simulador de pacientes virtuales.
          </p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Alumno</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Matrícula</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Programa</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Semestre</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sesiones</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Última sesión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm">
                          {s.nombre?.[0] || '?'}
                        </div>
                        <span className="text-white text-sm font-medium">{s.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm font-mono">{s.matricula}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{s.programa || '—'}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{s.semestre || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-white font-bold">{s.total_sessions || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {s.last_session
                        ? new Date(s.last_session).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
