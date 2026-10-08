import type { Task, Reminder } from '@/types';
import { parseISO, format } from 'date-fns';
import {
  daysBetweenLocal,
  formatTime12h,
} from '@/lib/date';

export type NotificationType =
  | 'tarea_vencida'
  | 'tarea_vence_hoy'
  | 'tarea_vence_pronto'
  | 'tarea_urgente'
  | 'recordatorio';

export type NotificationSeverity = 'danger' | 'warning' | 'info';

export interface NotificationAlert {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  link?: string;
  date: string;
}

const SEVERITY_RANK: Record<NotificationSeverity, number> = {
  danger: 0,
  warning: 1,
  info: 2,
};

/**
 * Construye la lista de alertas (notificaciones) derivadas de las tareas y
 * recordatorios del usuario. Función pura: todo el cálculo de fechas es en
 * hora local vía `daysBetweenLocal` / `parseLocalDate` para evitar el desfase
 * UTC. Produce como máximo UNA alerta por tarea (por precedencia de urgencia).
 */
export function buildAlerts(
  tasks: Task[],
  reminders: Reminder[],
  now: Date = new Date(),
): NotificationAlert[] {
  const alerts: NotificationAlert[] = [];

  for (const task of tasks) {
    if (task.status === 'completada') continue;

    const d = daysBetweenLocal(task.due_date);
    const lead = task.reminder_days_before > 0 ? task.reminder_days_before : 2;

    if (d < 0) {
      alerts.push({
        id: `task-${task.id}-vencida`,
        type: 'tarea_vencida',
        title: 'Tarea vencida',
        message: `Tarea vencida: ${task.title}`,
        severity: 'danger',
        link: '/tareas',
        date: task.due_date,
      });
    } else if (d === 0) {
      alerts.push({
        id: `task-${task.id}-hoy`,
        type: 'tarea_vence_hoy',
        title: 'Vence hoy',
        message: `Vence hoy: ${task.title}`,
        severity: 'warning',
        link: '/tareas',
        date: task.due_date,
      });
    } else if (d <= lead) {
      const dayWord = d === 1 ? 'día' : 'días';
      if (task.priority === 'urgente') {
        alerts.push({
          id: `task-${task.id}-urgente`,
          type: 'tarea_urgente',
          title: 'Tarea urgente',
          message: `Tarea urgente — vence en ${d} ${dayWord}: ${task.title}`,
          severity: 'warning',
          link: '/tareas',
          date: task.due_date,
        });
      } else {
        alerts.push({
          id: `task-${task.id}-pronto`,
          type: 'tarea_vence_pronto',
          title: 'Vence pronto',
          message: `Vence en ${d} ${dayWord}: ${task.title}`,
          severity: 'info',
          link: '/tareas',
          date: task.due_date,
        });
      }
    }
  }

  for (const reminder of reminders) {
    if (reminder.active === false) continue;
    const remindAt = parseISO(reminder.remind_at);
    if (remindAt.getTime() > now.getTime()) continue;

    const baseMessage = reminder.message || reminder.title;
    const timeLabel = extractTimeLabel(reminder.remind_at);
    const message = timeLabel ? `${baseMessage} · ${timeLabel}` : baseMessage;

    alerts.push({
      id: `reminder-${reminder.id}`,
      type: 'recordatorio',
      title: reminder.title,
      message,
      severity: 'info',
      link: '/perfil/recordatorios',
      date: reminder.remind_at,
    });
  }

  alerts.sort((a, b) => {
    const rank = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (rank !== 0) return rank;
    return parseISO(a.date).getTime() - parseISO(b.date).getTime();
  });

  return dedupeById(alerts);
}

function extractTimeLabel(remindAt: string): string {
  const parsed = parseISO(remindAt);
  if (Number.isNaN(parsed.getTime())) return '';
  const hhmm = format(parsed, 'HH:mm');
  // Omite el sufijo cuando la hora es medianoche exacta (probable fecha sin hora).
  if (hhmm === '00:00' && !remindAt.includes('T')) return '';
  return formatTime12h(hhmm);
}

function dedupeById(alerts: NotificationAlert[]): NotificationAlert[] {
  const seen = new Set<string>();
  const result: NotificationAlert[] = [];
  for (const alert of alerts) {
    if (seen.has(alert.id)) continue;
    seen.add(alert.id);
    result.push(alert);
  }
  return result;
}

/* ----------------------------- Browser notifications ----------------------------- */

/** Detecta si el navegador admite la Web Notifications API. */
export function isBrowserNotifSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/** Devuelve el permiso actual, o 'unsupported' si el navegador no lo admite. */
export function getBrowserNotifPermission(): NotificationPermission | 'unsupported' {
  if (!isBrowserNotifSupported()) return 'unsupported';
  return Notification.permission;
}

/** Solicita permiso de notificaciones; no-op seguro si no hay soporte. */
export async function requestBrowserNotifPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isBrowserNotifSupported()) return 'unsupported';
  return Notification.requestPermission();
}

/** Muestra una notificación del navegador si hay soporte y permiso concedido. */
export function showBrowserNotification(title: string, body: string): void {
  if (!isBrowserNotifSupported()) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: '/logo-agenda.png' });
  } catch {
    // Algunos navegadores lanzan si se construye fuera de un gesto de usuario; no-op.
  }
}
