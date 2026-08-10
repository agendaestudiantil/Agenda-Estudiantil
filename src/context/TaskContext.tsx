import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Task, TaskFilter, Event, Note, Goal, Reminder } from '@/types';
import { sortByPriority } from '@/lib/priority';

interface TaskContextType {
  tasks: Task[];
  events: Event[];
  notes: Note[];
  goals: Goal[];
  reminders: Reminder[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'completed_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addEvent: (event: Omit<Event, 'id' | 'user_id' | 'created_at'>) => void;
  deleteEvent: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'user_id' | 'created_at'>) => void;
  deleteNote: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at'>) => void;
  deleteReminder: (id: string) => void;
  getFilteredTasks: () => Task[];
  getTasksForDate: (date: string) => Task[];
  getEventsForDate: (date: string) => Event[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Demo data
const DEMO_TASKS: Task[] = [
  {
    id: '1',
    user_id: 'demo-user-1',
    title: 'Trabajo Matemáticas',
    description: 'Resolver ejercicios del libro de actividades pág. 31 de función cuadrática.',
    subject: 'Matemáticas',
    priority: 'urgente',
    status: 'pendiente',
    due_date: '2026-08-06',
    completed_at: null,
    created_at: '2026-08-01T10:00:00Z',
    reminder_days_before: 2,
  },
  {
    id: '2',
    user_id: 'demo-user-1',
    title: 'Estudiar Inglés',
    description: 'Repasar tiempos verbales y hacer ejercicios.',
    subject: 'Inglés',
    priority: 'importante',
    status: 'pendiente',
    due_date: '2026-08-08',
    completed_at: null,
    created_at: '2026-08-01T11:00:00Z',
    reminder_days_before: 2,
  },
  {
    id: '3',
    user_id: 'demo-user-1',
    title: 'Proyecto Ciencias',
    description: 'Investigar sobre energías renovables.',
    subject: 'Ciencias',
    priority: 'importante',
    status: 'en_progreso',
    due_date: '2026-08-10',
    completed_at: null,
    created_at: '2026-08-01T12:00:00Z',
    reminder_days_before: 3,
  },
  {
    id: '4',
    user_id: 'demo-user-1',
    title: 'Lectura Español',
    description: 'Leer capítulos 5-7 del libro asignado.',
    subject: 'Español',
    priority: 'tiempo',
    status: 'completada',
    due_date: '2026-08-02',
    completed_at: '2026-08-02T15:00:00Z',
    created_at: '2026-07-28T09:00:00Z',
    reminder_days_before: 1,
  },
];

const DEMO_EVENTS: Event[] = [
  {
    id: '1',
    user_id: 'demo-user-1',
    title: 'Clases de Matemáticas',
    description: 'Aula 201',
    date: '2026-08-04',
    time: '08:00',
    color: '#fbbf24',
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'demo-user-1',
    title: 'Reunión de equipo',
    description: 'Proyecto de ciencias',
    date: '2026-08-04',
    time: '10:00',
    color: '#34d399',
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: '3',
    user_id: 'demo-user-1',
    title: 'Entrega de tarea de Inglés',
    description: '',
    date: '2026-08-04',
    time: '14:00',
    color: '#60a5fa',
    created_at: '2026-08-01T10:00:00Z',
  },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [events, setEvents] = useState<Event[]>(DEMO_EVENTS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('todas');

  const addTask = useCallback((task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'completed_at'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      user_id: 'demo-user-1',
      created_at: new Date().toISOString(),
      completed_at: null,
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const isCompleting = t.status !== 'completada';
      return {
        ...t,
        status: isCompleting ? 'completada' as const : 'pendiente' as const,
        completed_at: isCompleting ? new Date().toISOString() : null,
      };
    }));
  }, []);

  const addEvent = useCallback((event: Omit<Event, 'id' | 'user_id' | 'created_at'>) => {
    const newEvent: Event = {
      ...event,
      id: generateId(),
      user_id: 'demo-user-1',
      created_at: new Date().toISOString(),
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const addNote = useCallback((note: Omit<Note, 'id' | 'user_id' | 'created_at'>) => {
    const newNote: Note = {
      ...note,
      id: generateId(),
      user_id: 'demo-user-1',
      created_at: new Date().toISOString(),
    };
    setNotes(prev => [...prev, newNote]);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
    const newGoal: Goal = {
      ...goal,
      id: generateId(),
      user_id: 'demo-user-1',
      created_at: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const addReminder = useCallback((reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: generateId(),
      user_id: 'demo-user-1',
      created_at: new Date().toISOString(),
    };
    setReminders(prev => [...prev, newReminder]);
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const getFilteredTasks = useCallback(() => {
    let filtered = tasks;
    switch (filter) {
      case 'pendientes':
        filtered = tasks.filter(t => t.status === 'pendiente');
        break;
      case 'en_progreso':
        filtered = tasks.filter(t => t.status === 'en_progreso');
        break;
      case 'completadas':
        filtered = tasks.filter(t => t.status === 'completada');
        break;
    }
    return sortByPriority(filtered);
  }, [tasks, filter]);

  const getTasksForDate = useCallback((date: string) => {
    return tasks.filter(t => t.due_date === date);
  }, [tasks]);

  const getEventsForDate = useCallback((date: string) => {
    return events.filter(e => e.date === date);
  }, [events]);

  return (
    <TaskContext.Provider value={{
      tasks, events, notes, goals, reminders, filter,
      setFilter, addTask, updateTask, deleteTask, toggleTaskComplete,
      addEvent, deleteEvent, addNote, deleteNote,
      addGoal, updateGoal, deleteGoal,
      addReminder, deleteReminder,
      getFilteredTasks, getTasksForDate, getEventsForDate,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
