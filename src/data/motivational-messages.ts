import type { MotivationalMessage } from '@/types';

export const motivationalMessages: MotivationalMessage[] = [
  { id: 1, text: 'Cada página en blanco es una nueva oportunidad. Escríbela con ganas.', emoji: '🌱' },
  { id: 2, text: 'No tienes que ser perfecto, solo constante. Un pequeño paso hoy vale más que un gran plan mañana.', emoji: '🌱' },
  { id: 3, text: 'Lo que estudias hoy es el futuro que construyes mañana.', emoji: '🌱' },
  { id: 4, text: 'Equivocarte no es fracasar, es aprender. Cada error te acerca a la respuesta correcta.', emoji: '🌱' },
  { id: 5, text: 'Tu esfuerzo de hoy es el orgullo de mañana.', emoji: '🌱' },
  { id: 6, text: 'Organiza tu tiempo, y tus sueños tendrán espacio para crecer.', emoji: '🌱' },
  { id: 7, text: 'Si hoy te cuesta, es porque estás creciendo.', emoji: '🌱' },
  { id: 8, text: 'Cree en ti: llegaste hasta aquí y puedes llegar mucho más lejos.', emoji: '🌱' },
  { id: 9, text: 'Pequeños hábitos, grandes resultados. Un visto a la vez.', emoji: '🌱' },
  { id: 10, text: 'Brilla con tu propia luz. Nadie más puede aprender, soñar y lograr lo que tú harás.', emoji: '🌱' },
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
