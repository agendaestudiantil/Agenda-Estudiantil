import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 space-y-5">
      <img src="/logo-agenda.png" alt="Agenda Estudiantil" className="w-20 h-20 rounded-2xl shadow-sm" />
      <div className="space-y-1">
        <p className="text-5xl font-bold text-emerald-600">404</p>
        <h1 className="text-xl font-bold text-gray-800">Página no encontrada</h1>
        <p className="text-sm text-gray-500 max-w-xs">
          La página que buscas no existe o fue movida. Volvamos a un lugar conocido.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
      >
        <Home size={18} />
        Volver al inicio
      </Link>
    </div>
  );
}
