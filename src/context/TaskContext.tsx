import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Task, TaskFilter, Event, Note, Goal, Reminder } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
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

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('todas');

  // Load all collections for the authenticated user; reset on sign-out.
  useEffect(() => {
    let active = true;

    async function syncCollections(uid: string | null) {
      if (!uid) {
        if (!active) return;
        setTasks([]);
        setEvents([]);
        setNotes([]);
        setGoals([]);
        setReminders([]);
        return;
      }

      const [tasksRes, eventsRes, notesRes, goalsRes, remindersRes] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', uid),
        supabase.from('events').select('*').eq('user_id', uid),
        supabase.from('notes').select('*').eq('user_id', uid),
        supabase.from('goals').select('*').eq('user_id', uid),
        supabase.from('reminders').select('*').eq('user_id', uid),
      ]);

      if (!active) return;

      setTasks((tasksRes.data as Task[] | null) ?? []);
      setEvents((eventsRes.data as Event[] | null) ?? []);
      setNotes((notesRes.data as Note[] | null) ?? []);
      setGoals((goalsRes.data as Goal[] | null) ?? []);
      setReminders((remindersRes.data as Reminder[] | null) ?? []);
    }

    void syncCollections(userId);

    return () => {
      active = false;
    };
  }, [userId]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'completed_at'>) => {
    if (!userId) return;
    void (async () => {
      const { data } = await supabase
        .from('tasks')
        .insert({ ...task, user_id: userId, completed_at: null })
        .select()
        .single();
      if (data) {
        setTasks(prev => [...prev, data as Task]);
      }
    })();
  }, [userId]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    void (async () => {
      const { error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (!error) {
        setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
      }
    })();
  }, []);

  const deleteTask = useCallback((id: string) => {
    void (async () => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (!error) {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
    })();
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    void (async () => {
      const current = tasks.find(t => t.id === id);
      if (!current) return;
      const isCompleting = current.status !== 'completada';
      const updates: Partial<Task> = {
        status: isCompleting ? 'completada' : 'pendiente',
        completed_at: isCompleting ? new Date().toISOString() : null,
      };
      const { error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (!error) {
        setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
      }
    })();
  }, [tasks]);

  const addEvent = useCallback((event: Omit<Event, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;
    void (async () => {
      const { data } = await supabase
        .from('events')
        .insert({ ...event, user_id: userId })
        .select()
        .single();
      if (data) {
        setEvents(prev => [...prev, data as Event]);
      }
    })();
  }, [userId]);

  const deleteEvent = useCallback((id: string) => {
    void (async () => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (!error) {
        setEvents(prev => prev.filter(e => e.id !== id));
      }
    })();
  }, []);

  const addNote = useCallback((note: Omit<Note, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;
    void (async () => {
      const { data } = await supabase
        .from('notes')
        .insert({ ...note, user_id: userId })
        .select()
        .single();
      if (data) {
        setNotes(prev => [...prev, data as Note]);
      }
    })();
  }, [userId]);

  const deleteNote = useCallback((id: string) => {
    void (async () => {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (!error) {
        setNotes(prev => prev.filter(n => n.id !== id));
      }
    })();
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;
    void (async () => {
      const { data } = await supabase
        .from('goals')
        .insert({ ...goal, user_id: userId })
        .select()
        .single();
      if (data) {
        setGoals(prev => [...prev, data as Goal]);
      }
    })();
  }, [userId]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    void (async () => {
      const { error } = await supabase.from('goals').update(updates).eq('id', id);
      if (!error) {
        setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
      }
    })();
  }, []);

  const deleteGoal = useCallback((id: string) => {
    void (async () => {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (!error) {
        setGoals(prev => prev.filter(g => g.id !== id));
      }
    })();
  }, []);

  const addReminder = useCallback((reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at'>) => {
    if (!userId) return;
    void (async () => {
      const { data } = await supabase
        .from('reminders')
        .insert({ ...reminder, user_id: userId })
        .select()
        .single();
      if (data) {
        setReminders(prev => [...prev, data as Reminder]);
      }
    })();
  }, [userId]);

  const deleteReminder = useCallback((id: string) => {
    void (async () => {
      const { error } = await supabase.from('reminders').delete().eq('id', id);
      if (!error) {
        setReminders(prev => prev.filter(r => r.id !== id));
      }
    })();
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
