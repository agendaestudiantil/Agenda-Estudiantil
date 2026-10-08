import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Clock, Bell, BellOff, X } from 'lucide-react';
import type { NotificationAlert, NotificationSeverity } from '@/lib/notifications';
import { formatRelativeDateEs } from '@/lib/date';

interface NotificationPanelProps {
  alerts: NotificationAlert[];
  onClose: () => void;
  onNavigate: (link: string) => void;
  /** Coordenadas (viewport) para anclar el panel bajo la campana. */
  anchor: { top: number; right: number };
}

function SeverityIcon({ severity }: { severity: NotificationSeverity }) {
  if (severity === 'danger') return <AlertTriangle size={18} className="text-red-500 shrink-0" />;
  if (severity === 'warning') return <Clock size={18} className="text-amber-500 shrink-0" />;
  return <Bell size={18} className="text-emerald-500 shrink-0" />;
}

/**
 * Panel de notificaciones. Se renderiza mediante un portal a `document.body` para
 * escapar de todo contexto de apilamiento (stacking context) que compita:
 * el `<header>` y las tarjetas `.card` usan `backdrop-blur`/`bg-white/80`, lo que
 * creaba un contexto propio y dejaba que el contenido de `<main>` se viera a través
 * del panel. Al portar a `body` con `position: fixed`, fondo SÓLIDO (`bg-white`) y
 * `z-50`, el panel flota opaco por encima de todo el contenido de la página.
 */
export const NotificationPanel = forwardRef<HTMLDivElement, NotificationPanelProps>(
  function NotificationPanel({ alerts, onClose, onNavigate, anchor }, ref) {
    return createPortal(
      <>
        {/* Backdrop tenue para cerrar al hacer clic fuera. El panel permanece opaco. */}
        <div
          className="fixed inset-0 z-40 bg-black/10"
          aria-hidden="true"
          onClick={onClose}
        />
        <div
          ref={ref}
          role="dialog"
          aria-label="Notificaciones"
          style={{ top: anchor.top, right: anchor.right }}
          className="fixed z-50 w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-emerald-100"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-100 bg-emerald-50 rounded-t-2xl">
            <h2 className="font-semibold text-emerald-800">Notificaciones</h2>
            <button
              onClick={onClose}
              aria-label="Cerrar notificaciones"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-6 py-10 gap-3">
              <BellOff size={32} className="text-emerald-500" />
              <p className="text-sm text-gray-600">¡Todo al día! No tienes notificaciones.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {alerts.map(alert => (
                <li key={alert.id}>
                  <button
                    onClick={() => {
                      onNavigate(alert.link ?? '/');
                      onClose();
                    }}
                    className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors"
                  >
                    <span className="mt-0.5">
                      <SeverityIcon severity={alert.severity} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-gray-800 truncate">{alert.title}</span>
                      <span className="block text-sm text-gray-600 break-words">{alert.message}</span>
                      <span className="block text-xs text-gray-400 mt-0.5">{formatRelativeDateEs(alert.date)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </>,
      document.body,
    );
  },
);
