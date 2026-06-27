'use client';

// Gate Page: First page users see before entering the platform
// Two options: Student (Alumno) or Teacher (Docente)

import Link from 'next/link';
import TermsGate from '@/components/TermsGate';

export default function GatePage() {
  return (
    <TermsGate>
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
      {/* Logo / Brand */}
      <div className="text-center mb-12">
        <img src="/logo-praxis-6.jpg" alt="Praxis AI" className="w-32 h-auto mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-3">Praxis AI</h1>
        <p className="text-gray-400 text-lg">Pacientes Virtuales con Inteligencia Artificial</p>
        <p className="text-gray-600 text-sm mt-2 max-w-md">
          Plataforma de simulación clínica para instituciones educativas
        </p>
      </div>

      {/* Two Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        {/* Alumno Button */}
        <Link
          href="/alumno/ingresar"
          className="flex-1 group relative bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/20"
        >
          <div className="text-4xl mb-3">🎓</div>
          <h2 className="text-xl font-bold mb-1">Soy Alumno</h2>
          <p className="text-blue-200 text-sm">Practicar con pacientes virtuales</p>
        </Link>

        {/* Docente Button */}
        <Link
          href="/login"
          className="flex-1 group relative bg-gradient-to-br from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600 text-white rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/20"
        >
          <div className="text-4xl mb-3">👨‍🏫</div>
          <h2 className="text-xl font-bold mb-1">Soy Docente</h2>
          <p className="text-purple-200 text-sm">Panel de control y supervisión</p>
        </Link>
      </div>

      {/* Footer */}
      <p className="text-gray-700 text-xs mt-12">
        Praxis AI 🚀 · Simulación Clínica con IA · v1.0
      </p>
    </div>
    </TermsGate>
  );
}
