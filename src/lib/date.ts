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
