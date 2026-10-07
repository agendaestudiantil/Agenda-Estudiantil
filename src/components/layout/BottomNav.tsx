import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Send, BookOpen, Calendar, PlusCircle, User } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Inicio' },
  { path: '/mensajes', icon: Send, label: 'Mensajes' },
  { path: '/tareas', icon: BookOpen, label: 'Tareas' },
  { path: '/calendario', icon: Calendar, label: 'Calendario' },
  { path: '/agregar', icon: PlusCircle, label: 'Agregar' },
  { path: '/perfil', icon: User, label: 'Perfil' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-2 py-2 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`nav-item p-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-600 bg-emerald-50 scale-110'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && path === '/agregar' ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg -mt-4">
                  <Icon size={20} className="text-white" />
                </div>
              ) : (
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              )}
              <span className="text-[10px] mt-0.5">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
