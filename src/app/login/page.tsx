'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        setMessage('Revisa tu correo para confirmar tu cuenta.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError('Ingresa tu correo electrónico.');
      return;
    }
    setResetLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        resetEmail,
        { redirectTo: `${window.location.origin}/auth/reset-password` }
      );
      if (resetError) throw resetError;
      setMessage('Revisa tu correo. Te enviamos un enlace para restablecer tu contraseña.');
      setShowForgot(false);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de restablecimiento.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            P
          </div>
          <h1 className="text-2xl font-bold text-white">Praxis AI</h1>
          <p className="text-gray-500 mt-1">
            {showForgot ? 'Recuperar contraseña' : isSignUp ? 'Crear cuenta de docente' : 'Iniciar sesión'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {message && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg p-4 mb-6 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          {showForgot ? (
            <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }} className="space-y-5">
              <p className="text-gray-400 text-sm">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  placeholder="docente@uvmnet.edu"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 transition-all"
              >
                {resetLoading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setShowForgot(false); setError(null); }}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ← Volver al inicio de sesión
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="docente@uvmnet.edu"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-400">
                      Contraseña
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => { setShowForgot(true); setError(null); setMessage(null); }}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
                    </span>
                  ) : isSignUp ? (
                    'Crear cuenta'
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {isSignUp
                    ? '¿Ya tienes cuenta? Inicia sesión'
                    : '¿No tienes cuenta? Regístrate'}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          Acceso exclusivo para docentes · Praxis AI 🚀
        </p>
      </div>
    </div>
  );
}
