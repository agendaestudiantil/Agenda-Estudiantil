import { parseISO, startOfDay, differenceInCalendarDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Convierte una cadena de fecha `yyyy-MM-dd` (sin hora) en un Date en hora LOCAL.
 *
 * `new Date('2026-10-13')` interpreta la cadena como medianoche UTC; en zonas con
 * desfase negativo (Colombia, UTC-5) eso se muestra como el día anterior (13 -> 12).
 * `parseISO` interpreta una fecha sin hora como medianoche local, evitando el salto.
 */
export function parseLocalDate(dateStr: string): Date {
  return parseISO(dateStr);
}

/**
 * Convierte una hora en formato 24h `HH:mm` a formato 12h con AM/PM en mayúsculas.
 *
 * Ej.: '14:00' -> '2:00 PM', '08:30' -> '8:30 AM', '00:15' -> '12:15 AM'.
 * Si la cadena está vacía o no se puede interpretar, se devuelve sin cambios.
 */
export function formatTime12h(hhmm: string): string {
  if (!hhmm) return hhmm;
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!match) return hhmm;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return hhmm;
  const period = hours < 12 ? 'AM' : 'PM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${match[2]} ${period}`;
}

/**
 * Devuelve la medianoche de HOY en hora local.
 */
export function startOfTodayLocal(): Date {
  return startOfDay(new Date());
}

/**
 * Indica si la fecha `yyyy-MM-dd` corresponde al día de hoy en hora local.
 */
export function isTodayLocal(dateStr: string): boolean {
  return differenceInCalendarDays(parseLocalDate(dateStr), startOfTodayLocal()) === 0;
}

/**
 * Número de días calendario (local) desde `from` (por defecto hoy) hasta `dateStr`.
 * Negativo = fecha pasada, 0 = hoy, positivo = fecha futura.
 */
export function daysBetweenLocal(dateStr: string, from: Date = startOfTodayLocal()): number {
  return differenceInCalendarDays(parseLocalDate(dateStr), from);
}

/**
 * Formatea una fecha `yyyy-MM-dd` o timestamp ISO en una etiqueta relativa en español:
 * "hoy", "ayer", "mañana", o `d 'de' MMM` (p. ej. "13 de oct").
 */
export function formatRelativeDateEs(dateStr: string): string {
  const date = parseISO(dateStr);
  const diff = differenceInCalendarDays(startOfDay(date), startOfTodayLocal());
  if (diff === 0) return 'hoy';
  if (diff === -1) return 'ayer';
  if (diff === 1) return 'mañana';
  return format(date, "d 'de' MMM", { locale: es });
}
