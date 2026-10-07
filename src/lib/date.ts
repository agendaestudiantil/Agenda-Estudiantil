import { parseISO } from 'date-fns';

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
