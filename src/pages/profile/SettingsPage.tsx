import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  isBrowserNotifSupported,
  getBrowserNotifPermission,
  requestBrowserNotifPermission,
} from '@/lib/notifications';

const PREF_KEY = 'agenda:dailyMessageEnabled';
const BROWSER_NOTIF_KEY = 'notif_browser_enabled';
const APP_VERSION = '1.0.0';

export function SettingsPage() {
  const { signOut } = useAuth();
  const [dailyMessage, setDailyMessage] = useState(() => {
    const stored = localStorage.getItem(PREF_KEY);
    return stored === null ? true : stored === 'true';
  });

  const browserSupported = isBrowserNotifSupported();
  const [browserNotif, setBrowserNotif] = useState(
    () =>
      localStorage.getItem(BROWSER_NOTIF_KEY) === 'true' &&
      getBrowserNotifPermission() === 'granted',
  );
  const [browserHelp, setBrowserHelp] = useState('');

  function toggleDailyMessage() {
    const next = !dailyMessage;
    setDailyMessage(next);
    localStorage.setItem(PREF_KEY, String(next));
  }

  async function toggleBrowserNotif() {
    if (browserNotif) {
      setBrowserNotif(false);
      localStorage.setItem(BROWSER_NOTIF_KEY, 'false');
      setBrowserHelp('');
      return;
    }
    const permission = await requestBrowserNotifPermission();
    if (permission === 'granted') {
      setBrowserNotif(true);
      localStorage.setItem(BROWSER_NOTIF_KEY, 'true');
      setBrowserHelp('');
    } else {
      setBrowserNotif(false);
      localStorage.setItem(BROWSER_NOTIF_KEY, 'false');
      setBrowserHelp('Activa los permisos de notificación en tu navegador para recibir avisos.');
    }
  }

  return (
    <div className="space-y-6">
      <Link to="/perfil" className="flex items-center gap-1 text-gray-500 hover:text-emerald-700">
        <ArrowLeft size={18} />
        <span className="text-sm">Volver al perfil</span>
      </Link>

      <h1 className="text-xl font-bold text-gray-800">Ajustes</h1>

      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-gray-800">
          <Info size={18} className="text-emerald-600" />
          <h2 className="font-semibold">Acerca de</h2>
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Aplicación</dt>
            <dd className="font-medium text-gray-700">Agenda Estudiantil Inteligente</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Institución</dt>
            <dd className="font-medium text-gray-700">Colegio Bethel</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Versión</dt>
            <dd className="font-medium text-gray-700">{APP_VERSION}</dd>
          </div>
        </dl>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Frase motivadora diaria</p>
            <p className="text-sm text-gray-500">Mostrar una frase al abrir la app</p>
          </div>
          <button
            onClick={toggleDailyMessage}
            role="switch"
            aria-checked={dailyMessage}
            aria-label="Frase motivadora diaria"
            className={`relative w-12 h-7 rounded-full transition-colors ${dailyMessage ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${dailyMessage ? 'translate-x-5' : ''}`}
            />
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Notificaciones del navegador</p>
            <p className="text-sm text-gray-500">Recibe avisos de tareas y recordatorios</p>
          </div>
          {browserSupported ? (
            <button
              onClick={toggleBrowserNotif}
              role="switch"
              aria-checked={browserNotif}
              aria-label="Notificaciones del navegador"
              className={`relative w-12 h-7 rounded-full transition-colors ${browserNotif ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${browserNotif ? 'translate-x-5' : ''}`}
              />
            </button>
          ) : (
            <span className="relative w-12 h-7 rounded-full bg-gray-200 opacity-60" aria-hidden="true" />
          )}
        </div>
        {!browserSupported && (
          <p className="text-sm text-gray-500 mt-2">Tu navegador no admite notificaciones.</p>
        )}
        {browserSupported && browserHelp && (
          <p className="text-sm text-gray-500 mt-2">{browserHelp}</p>
        )}
      </div>

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
