import type { MotivationalMessage } from '@/types';

export const motivationalMessages: MotivationalMessage[] = [
  { id: 1, text: '¡Tú puedes con esto y más! Cada tarea que haces hoy, te acerca a tus sueños. No lo dejes para después, tu futuro te lo agradecerá.', emoji: '💪📚✨' },
  { id: 2, text: '¡Cada pequeño paso cuenta! No importa qué tan lento vayas, lo importante es no detenerte.', emoji: '🚀🌟' },
  { id: 3, text: 'El éxito no es casualidad. Es trabajo duro, perseverancia y amor por lo que estás aprendiendo.', emoji: '🎯💫' },
  { id: 4, text: '¡Hoy es un gran día para aprender algo nuevo! Tu esfuerzo de hoy será tu orgullo de mañana.', emoji: '🌈📖' },
  { id: 5, text: 'No te compares con otros. Compárate con quien eras ayer y celebra cada avance.', emoji: '🏆✨' },
  { id: 6, text: '¡Ánimo! Los grandes logros comienzan con la decisión de intentarlo. ¡Tú ya diste ese paso!', emoji: '💪🌟' },
  { id: 7, text: 'Recuerda: cada tarea completada es una victoria. ¡Colecciona victorias hoy!', emoji: '🎉📝' },
  { id: 8, text: 'El conocimiento es el único tesoro que nadie te puede quitar. ¡Sigue aprendiendo!', emoji: '💎📚' },
  { id: 9, text: '¡Confía en ti! Ya has superado retos antes y este no será la excepción.', emoji: '⭐💪' },
  { id: 10, text: 'La disciplina es el puente entre tus metas y tus logros. ¡Cruza ese puente hoy!', emoji: '🌉🎓' },
  { id: 11, text: 'No necesitas ser perfecto, solo necesitas ser constante. ¡Sigue adelante!', emoji: '🔥📖' },
  { id: 12, text: '¡Tu dedicación de hoy construye el profesional que serás mañana!', emoji: '🏗️🌟' },
];

export function getRandomMessage(): MotivationalMessage {
  const index = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[index];
}

export function getDailyMessage(): MotivationalMessage {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % motivationalMessages.length;
  return motivationalMessages[index];
}
