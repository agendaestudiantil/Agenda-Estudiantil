import { useAuth } from '@/context/AuthContext';
import { Menu, Phone, Users } from 'lucide-react';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="header-gradient px-4 py-3 shadow-sm">
      {/* Logo Banner */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-3xl mr-2">🌞📚</span>
        <h1 className="text-xl font-bold tracking-wide">
          <span className="text-pink-500">AGENDA </span>
          <span className="text-purple-500">ESTUDIANTIL</span>
        </h1>
      </div>

      {/* User Bar */}
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-500 text-sm">👤</span>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {user?.name || 'Usuario'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-blue-400 hover:text-blue-600 transition-colors" aria-label="Llamar">
            <Phone size={18} />
          </button>
          <button className="text-blue-400 hover:text-blue-600 transition-colors" aria-label="Contactos">
            <Users size={18} />
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Menú">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
