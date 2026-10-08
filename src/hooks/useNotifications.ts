import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import {
  buildAlerts,
  getBrowserNotifPermission,
  showBrowserNotification,
} from '@/lib/notifications';
import type { NotificationAlert } from '@/lib/notifications';

const SEEN_KEY = 'agenda:notif:seen';
const BROWSER_ENABLED_KEY = 'notif_browser_enabled';
const TICK_MS = 60_000;

function readSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return new Set(parsed.filter((v): v is string => typeof v === 'string'));
    return new Set();
  } catch {
    return new Set();
  }
}

function writeSeen(ids: Set<string>): void {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
  } catch {
    // Ignorar errores de almacenamiento (p. ej. modo privado lleno).
  }
}

interface UseNotificationsResult {
  alerts: NotificationAlert[];
  unreadCount: number;
  markAllSeen: () => void;
}

export function useNotifications(): UseNotificationsResult {
  const { tasks, reminders } = useTasks();
  const [now, setNow] = useState(() => new Date());
  const [seen, setSeen] = useState<Set<string>>(() => readSeen());

  // Refresca el cálculo basado en tiempo (vence hoy / hora de recordatorio).
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(interval);
  }, []);

  const alerts = useMemo(
    () => buildAlerts(tasks, reminders, now),
    [tasks, reminders, now],
  );

  const unreadCount = useMemo(
    () => alerts.reduce((count, alert) => (seen.has(alert.id) ? count : count + 1), 0),
    [alerts, seen],
  );

  const markAllSeen = useCallback(() => {
    setSeen(prev => {
      const next = new Set(prev);
      for (const alert of alerts) next.add(alert.id);
      writeSeen(next);
      return next;
    });
  }, [alerts]);

  // Notificaciones del navegador (solo primer plano): dispara una vez por id
  // y por sesión, sin reenviar el lote inicial presente al montar.
  const notifiedRef = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (notifiedRef.current === null) {
      // Sembrar con los ids actuales para no notificar el lote inicial.
      notifiedRef.current = new Set(alerts.map(a => a.id));
      return;
    }
    const notified = notifiedRef.current;
    const enabled =
      localStorage.getItem(BROWSER_ENABLED_KEY) === 'true' &&
      getBrowserNotifPermission() === 'granted';

    for (const alert of alerts) {
      if (notified.has(alert.id)) continue;
      if (enabled) showBrowserNotification(alert.title, alert.message);
      notified.add(alert.id);
    }
  }, [alerts]);

  return { alerts, unreadCount, markAllSeen };
}
