import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, Target, Star, Settings, HelpCircle, LogOut, Trophy, Flame } from 'lucide-react';

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Información Personal', action: () => navigate('/perfil/info') },
    { icon: Target, label: 'Metas', action: () => navigate('/perfil/metas') },
    { icon: Star, label: 'Recordatorios', action: () => navigate('/perfil/recordatorios') },
    { icon: Settings, label: 'Ajustes', action: () => navigate('/perfil/ajustes') },
    { icon: HelpCircle, label: 'Ayuda y Soporte', action: () => navigate('/perfil/ayuda') },
  ];

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="card flex flex-col items-center py-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-200 to-green-300 flex items-center justify-center shadow-md">
          <span className="text-4xl">👩‍🎓</span>
        </div>

        {/* Name & info */}
        <h2 className="mt-3 text-lg font-bold text-gray-800">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <span className="mt-2 px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
          {user?.role}
        </span>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-1.5">
            <Trophy size={16} className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">{user?.points} pts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={16} className="text-orange-500" />
            <span className="text-sm font-semibold text-gray-700">{user?.streak} días</span>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="card divide-y divide-gray-100">
        {menuItems.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center justify-between py-3.5 px-1 hover:bg-gray-50 transition-colors first:pt-1 last:pb-1"
          >
            <div className="flex items-center gap-3">
              <Icon size={20} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <span className="text-gray-400 text-lg">›</span>
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Cerrar Sesión
      </button>
    </div>
  );
}
