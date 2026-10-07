import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="header-gradient px-4 py-3 shadow-sm">
      {/* Logo Banner */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-3xl mr-2">🌞📚</span>
        <h1 className="text-xl font-bold tracking-wide">
          <span className="text-emerald-700">AGENDA </span>
          <span className="text-emerald-600">ESTUDIANTIL</span>
        </h1>
      </div>

      {/* User Bar */}
      <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-500 text-sm">👤</span>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {user?.name || 'Usuario'}
          </span>
        </div>
      </div>
    </header>
  );
}
