export type Priority = 'urgente' | 'importante' | 'tiempo';
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';
export type TaskFilter = 'todas' | 'pendientes' | 'en_progreso' | 'completadas';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  subject: string;
  priority: Priority;
  status: TaskStatus;
  due_date: string;
  completed_at: string | null;
  created_at: string;
  reminder_days_before: number;
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  color: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  content: string;
  title: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  target_date: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  task_id: string | null;
  title: string;
  message: string;
  remind_at: string;
  active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  points: number;
  streak: number;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: 'text' | 'audio';
  created_at: string;
}

export interface MotivationalMessage {
  id: number;
  text: string;
  emoji: string;
}
