import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type SaveState = { type: 'idle' | 'success' | 'error'; message: string };

export function PersonalInfoPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<SaveState>({ type: 'idle', message: '' });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setSaving(true);
    setStatus({ type: 'idle', message: '' });

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      const { error } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('id', user.id);
      if (error) {
        setSaving(false);
        setStatus({ type: 'error', message: 'No se pudo guardar el nombre. Intenta de nuevo.' });
        return;
      }
    }

    updateProfile({ name: name.trim() });
    setSaving(false);
    setStatus({ type: 'success', message: 'Nombre actualizado correctamente.' });
  }

  return (
    <div className="space-y-6">
      <Link to="/perfil" className="flex items-center gap-1 text-gray-500 hover:text-emerald-700">
        <ArrowLeft size={18} />
        <span className="text-sm">Volver al perfil</span>
      </Link>

      <h1 className="text-xl font-bold text-gray-800">Información Personal</h1>

      <form onSubmit={handleSave} className="card space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Correo</label>
          <p className="px-4 py-2.5 rounded-xl bg-gray-50 text-gray-600 text-sm">{user?.email}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Rol</label>
          <p className="px-4 py-2.5 rounded-xl bg-gray-50 text-gray-600 text-sm">{user?.role}</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50">
            <Trophy size={18} className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">{user?.points} pts</span>
          </div>
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50">
            <Flame size={18} className="text-orange-500" />
            <span className="text-sm font-semibold text-gray-700">{user?.streak} días</span>
          </div>
        </div>

        {status.type === 'success' && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
            {status.message}
          </div>
        )}
        {status.type === 'error' && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
