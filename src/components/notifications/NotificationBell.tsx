import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationPanel } from './NotificationPanel';

export function NotificationBell() {
  const { alerts, unreadCount, markAllSeen } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Calcula la posición del panel bajo la campana, alineado al borde derecho
  // del viewport (el layout está limitado a max-w-lg y centrado).
  function updateAnchor() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setAnchor({ top: rect.bottom + 8, right: Math.max(window.innerWidth - rect.right, 8) });
  }

  // Cerrar al hacer clic fuera. El panel vive en un portal a document.body, por lo
  // que el click puede caer fuera del wrapper de la campana; tratamos como "dentro"
  // tanto el botón como el panel portado.
  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function handleResize() {
      updateAnchor();
    }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);

  function openPanel() {
    updateAnchor();
    setOpen(true);
    markAllSeen();
  }

  function handleNavigate(link: string) {
    navigate(link);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label="Notificaciones"
        aria-expanded={open}
        className="relative p-1.5 rounded-full text-emerald-700 hover:bg-white/60 transition-colors"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#FFE51D] text-emerald-900 text-[10px] font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationPanel
          ref={panelRef}
          alerts={alerts}
          anchor={anchor}
          onClose={() => setOpen(false)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
