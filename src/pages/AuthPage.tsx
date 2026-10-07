import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'login' | 'register';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setMode(isRegister ? 'login' : 'register');
    setError('');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Agenda Estudiantil</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isRegister ? 'Crea tu cuenta para empezar' : 'Inicia sesión para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Cargando...'
              : isRegister
                ? 'Registrarse'
                : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          {isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            {isRegister ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </p>
      </div>
    </div>
  );
}
