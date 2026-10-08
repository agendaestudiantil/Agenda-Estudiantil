import { parseISO, startOfDay, differenceInCalendarDays, format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { parseLocalDate } from '@/lib/date';
import type { Task, Goal } from '@/types';

/**
 * Helpers puros de gamificación (Opción 1: todo DERIVADO de datos existentes,
 * sin tablas nuevas ni cambios de esquema). Las columnas `profiles.points` y
 * `profiles.streak` ya existen y se usan para persistir los valores calculados.
 */

// ---------------------------------------------------------------------------
// Puntos
// ---------------------------------------------------------------------------

/**
 * Puntos ganados al COMPLETAR una tarea:
 *  - +10 si se completa en o antes de la fecha límite (a tiempo).
 *  - +5  si se completa después de la fecha límite (tarde).
 *
 * Comparación por días locales: `daysBetweenLocal` entre `due_date` y el día de
 * `completedAt` es >= 0 ⇒ a tiempo.
 *
 * Nota sobre DES-completar: NO se restan puntos. Es la conducta más simple y
 * correcta (nunca queda negativo). Re-completar NO vuelve a sumar porque los
 * puntos solo se otorgan en la transición pendiente→completada dentro de
 * TaskContext (ver toggleTaskComplete), no en cada render.
 */
export function pointsForCompletion(task: Task, completedAt: Date = new Date()): number {
  const dueDay = startOfDay(parseLocalDate(task.due_date));
  const completedDay = startOfDay(completedAt);
  const diff = differenceInCalendarDays(dueDay, completedDay); // >= 0 ⇒ a tiempo
  return diff >= 0 ? 10 : 5;
}

// ---------------------------------------------------------------------------
// Racha (streak)
// ---------------------------------------------------------------------------

/**
 * Racha = días locales consecutivos en los que se completó al menos una tarea;
 * termina HOY o AYER; se reinicia si pasa un día completo sin completar nada.
 *
 * Toda la aritmética de días es LOCAL (sin UTC): se reduce cada `completed_at`
 * a una clave `yyyy-MM-dd` en hora local.
 */
export function computeStreak(tasks: Task[], today: Date = new Date()): number {
  const dateKeys = new Set<string>();
  for (const task of tasks) {
    if (task.status !== 'completada' || !task.completed_at) continue;
    const completedDay = startOfDay(parseISO(task.completed_at));
    dateKeys.add(format(completedDay, 'yyyy-MM-dd'));
  }
  if (dateKeys.size === 0) return 0;

  const todayStart = startOfDay(today);
  const todayKey = format(todayStart, 'yyyy-MM-dd');
  const yesterdayKey = format(startOfDay(new Date(todayStart.getTime() - 86400000)), 'yyyy-MM-dd');

  // La racha debe terminar hoy o ayer; si no, está rota.
  let cursor: Date;
  if (dateKeys.has(todayKey)) {
    cursor = todayStart;
  } else if (dateKeys.has(yesterdayKey)) {
    cursor = startOfDay(new Date(todayStart.getTime() - 86400000));
  } else {
    return 0;
  }

  let count = 0;
  while (dateKeys.has(format(cursor, 'yyyy-MM-dd'))) {
    count += 1;
    cursor = startOfDay(new Date(cursor.getTime() - 86400000));
  }
  return count;
}

// ---------------------------------------------------------------------------
// Niveles
// ---------------------------------------------------------------------------

export interface Level {
  nombre: string;
  min: number;
  next: number | null;
}

const LEVELS: Level[] = [
  { nombre: 'Novato', min: 0, next: 50 },
  { nombre: 'Dedicado', min: 50, next: 150 },
  { nombre: 'Experto', min: 150, next: 300 },
  { nombre: 'Maestro', min: 300, next: null },
];

/**
 * Nivel actual según los puntos y el progreso (0–1) hacia el siguiente umbral.
 * Maestro (nivel máximo) ⇒ progress = 1.
 */
export function levelForPoints(points: number): { level: Level; progress: number } {
  const pts = Number.isFinite(points) ? points : 0;
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (pts >= l.min) level = l;
  }
  if (level.next === null) return { level, progress: 1 };
  const span = level.next - level.min;
  const progress = span > 0 ? Math.min(Math.max((pts - level.min) / span, 0), 1) : 1;
  return { level, progress };
}

// ---------------------------------------------------------------------------
// Estadísticas y logros
// ---------------------------------------------------------------------------

/** Nº de tareas completadas a tiempo (día local de completado <= due_date). */
export function onTimeCompletedCount(tasks: Task[]): number {
  let count = 0;
  for (const task of tasks) {
    if (task.status !== 'completada' || !task.completed_at) continue;
    const dueDay = startOfDay(parseLocalDate(task.due_date));
    const completedDay = startOfDay(parseISO(task.completed_at));
    if (differenceInCalendarDays(dueDay, completedDay) >= 0) count += 1;
  }
  return count;
}

export interface GamificationStats {
  completedCount: number;
  onTimeCount: number;
  streak: number;
  points: number;
  goalsCount: number;
}

export interface Achievement {
  id: string;
  nombre: string;
  descripcion: string;
  /** Nombre del icono de lucide-react; la UI lo mapea a su componente. */
  icon: string;
  unlocked: boolean;
}

/** Agrega las estadísticas base usadas por los logros. */
export function computeStats(tasks: Task[], goals: Goal[], points: number, streak: number): GamificationStats {
  const completedCount = tasks.filter(t => t.status === 'completada').length;
  return {
    completedCount,
    onTimeCount: onTimeCompletedCount(tasks),
    streak: Number.isFinite(streak) ? streak : 0,
    points: Number.isFinite(points) ? points : 0,
    goalsCount: goals.length,
  };
}

/**
 * Catálogo estático de logros (ES). Cada entrada calcula `unlocked` a partir de
 * las estadísticas. Sin persistencia de fecha de desbloqueo.
 */
export function computeAchievements(stats: GamificationStats): Achievement[] {
  return [
    {
      id: 'primer-paso',
      nombre: 'Primer paso',
      descripcion: 'Completa tu primera tarea.',
      icon: 'Check',
      unlocked: stats.completedCount >= 1,
    },
    {
      id: 'en-marcha',
      nombre: 'En marcha',
      descripcion: 'Completa 5 tareas.',
      icon: 'TrendingUp',
      unlocked: stats.completedCount >= 5,
    },
    {
      id: 'imparable',
      nombre: 'Imparable',
      descripcion: 'Completa 10 tareas.',
      icon: 'Zap',
      unlocked: stats.completedCount >= 10,
    },
    {
      id: 'maestro-tareas',
      nombre: 'Maestro de tareas',
      descripcion: 'Completa 25 tareas.',
      icon: 'Crown',
      unlocked: stats.completedCount >= 25,
    },
    {
      id: 'puntual',
      nombre: 'Puntual',
      descripcion: 'Completa 5 tareas a tiempo.',
      icon: 'Clock',
      unlocked: stats.onTimeCount >= 5,
    },
    {
      id: 'racha-fuego',
      nombre: 'Racha de fuego',
      descripcion: 'Mantén una racha de 7 días.',
      icon: 'Flame',
      unlocked: stats.streak >= 7,
    },
    {
      id: 'organizado',
      nombre: 'Organizado',
      descripcion: 'Crea tu primera meta.',
      icon: 'Target',
      unlocked: stats.goalsCount >= 1,
    },
    {
      id: 'coleccionista',
      nombre: 'Coleccionista de puntos',
      descripcion: 'Alcanza los 100 puntos.',
      icon: 'Star',
      unlocked: stats.points >= 100,
    },
  ];
}

// ---------------------------------------------------------------------------
// Persistencia (misma pauta que PersonalInfoPage)
// ---------------------------------------------------------------------------

/**
 * Persiste puntos/racha en Supabase SOLO si hay URL configurada (en modo demo
 * no hay URL, así que solo se actualiza el estado local vía updateProfile en el
 * llamador). No imprime secretos: solo lee el flag `VITE_SUPABASE_URL`.
 */
export async function persistProfileStats(
  userId: string,
  updates: { points?: number; streak?: number },
): Promise<void> {
  if (import.meta.env.VITE_SUPABASE_URL) {
    await supabase.from('profiles').update(updates).eq('id', userId);
  }
}
