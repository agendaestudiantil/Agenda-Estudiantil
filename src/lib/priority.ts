import type { Task } from '@/types';
import { differenceInDays, parseISO } from 'date-fns';

/**
 * Calcula la puntuación de prioridad de una tarea.
 * Mayor puntuación = más urgente/importante.
 */
export function calculatePriorityScore(task: Task): number {
  const now = new Date();
  const dueDate = parseISO(task.due_date);
  const daysUntilDue = differenceInDays(dueDate, now);

  // Factor de prioridad manual
  const priorityWeight: Record<string, number> = {
    urgente: 3,
    importante: 2,
    tiempo: 1,
  };

  const weight = priorityWeight[task.priority] || 1;

  // Si ya pasó la fecha, máxima prioridad
  if (daysUntilDue < 0) return 1000 + weight;

  // Si es hoy, muy alta prioridad
  if (daysUntilDue === 0) return 500 + weight;

  // Fórmula: peso * (1 / días restantes)
  // Más cercana la fecha = mayor score
  return weight * (100 / Math.max(daysUntilDue, 0.5));
}

/**
 * Ordena tareas por prioridad calculada (mayor primero)
 */
export function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a));
}

/**
 * Obtiene el color de la prioridad
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgente': return 'bg-red-100 text-red-700';
    case 'importante': return 'bg-yellow-100 text-yellow-700';
    case 'tiempo': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

/**
 * Obtiene el label de la prioridad
 */
export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'urgente': return 'Urgente';
    case 'importante': return 'Importante';
    case 'tiempo': return 'Tiempo';
    default: return priority;
  }
}
