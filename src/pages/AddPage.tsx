import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Calendar, FileText, Target, Star, ArrowLeft } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import type { Priority, TaskStatus } from '@/types';

type AddType = 'menu' | 'tarea' | 'evento' | 'nota' | 'meta' | 'recordatorio';

const menuItems = [
  { type: 'tarea' as const, icon: CheckSquare, label: 'Nueva Tarea', color: 'bg-pink-100' },
  { type: 'evento' as const, icon: Calendar, label: 'Nuevo Evento', color: 'bg-yellow-100' },
  { type: 'nota' as const, icon: FileText, label: 'Nueva Nota', color: 'bg-green-100' },
  { type: 'meta' as const, icon: Target, label: 'Meta Personal', color: 'bg-purple-100' },
  { type: 'recordatorio' as const, icon: Star, label: 'Recordatorio', color: 'bg-blue-100' },
];

export function AddPage() {
  const [currentView, setCurrentView] = useState<AddType>('menu');
  const navigate = useNavigate();
  const { addTask, addEvent, addNote, addGoal, addReminder } = useTasks();

  if (currentView === 'menu') {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-gray-800 text-center">¿Qué deseas agregar?</h1>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              onClick={() => setCurrentView(type)}
              className={`${color} rounded-2xl p-6 flex flex-col items-center gap-3 hover:scale-105 transition-transform shadow-sm`}
            >
              <Icon size={36} className="text-gray-700" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setCurrentView('menu')}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Volver</span>
      </button>

      {currentView === 'tarea' && <AddTaskForm onSubmit={(task) => { addTask(task); navigate('/tareas'); }} />}
      {currentView === 'evento' && <AddEventForm onSubmit={(event) => { addEvent(event); navigate('/calendario'); }} />}
      {currentView === 'nota' && <AddNoteForm onSubmit={(note) => { addNote(note); navigate('/tareas'); }} />}
      {currentView === 'meta' && <AddGoalForm onSubmit={(goal) => { addGoal(goal); navigate('/perfil'); }} />}
      {currentView === 'recordatorio' && <AddReminderForm onSubmit={(reminder) => { addReminder(reminder); navigate('/'); }} />}
    </div>
  );
}

// --- Sub-forms ---

function AddTaskForm({ onSubmit }: { onSubmit: (task: { title: string; description: string; subject: string; priority: Priority; status: TaskStatus; due_date: string; reminder_days_before: number }) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<Priority>('importante');
  const [dueDate, setDueDate] = useState('');
  const [reminderDays, setReminderDays] = useState(2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !dueDate) return;
    onSubmit({ title, description, subject, priority, status: 'pendiente', due_date: dueDate, reminder_days_before: reminderDays });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Nueva Tarea</h2>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Trabajo Matemáticas"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Resolver ejercicios del libro..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Materia</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Matemáticas"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Prioridad</label>
        <div className="flex gap-2">
          {(['urgente', 'importante', 'tiempo'] as Priority[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                priority === p
                  ? p === 'urgente' ? 'bg-red-100 text-red-700 ring-2 ring-red-200'
                    : p === 'importante' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200'
                    : 'bg-blue-100 text-blue-700 ring-2 ring-blue-200'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Fecha de Entrega *</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Aviso (días antes)</label>
        <select
          value={reminderDays}
          onChange={(e) => setReminderDays(Number(e.target.value))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
        >
          <option value={1}>Un día antes</option>
          <option value={2}>Dos días antes</option>
          <option value={3}>Tres días antes</option>
          <option value={7}>Una semana antes</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
      >
        Guardar Tarea
      </button>
    </form>
  );
}

function AddEventForm({ onSubmit }: { onSubmit: (event: { title: string; description: string; date: string; time: string; color: string }) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState('#60a5fa');

  const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !date || !time) return;
    onSubmit({ title, description, date, time, color });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Nuevo Evento</h2>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Clase de Matemáticas" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" required />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Aula 201" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Fecha *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Hora *</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" required />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Color</label>
        <div className="flex gap-3">
          {colors.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-gray-300' : ''}`} style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>

      <button type="submit" className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl transition-colors shadow-sm">
        Guardar Evento
      </button>
    </form>
  );
}

function AddNoteForm({ onSubmit }: { onSubmit: (note: { title: string; content: string }) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;
    onSubmit({ title, content });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Nueva Nota</h2>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mi nota" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" required />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Contenido *</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe tu nota aquí..." rows={5} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none resize-none" required />
      </div>
      <button type="submit" className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl transition-colors shadow-sm">
        Guardar Nota
      </button>
    </form>
  );
}

function AddGoalForm({ onSubmit }: { onSubmit: (goal: { title: string; description: string; progress: number; completed: boolean; target_date: string }) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !targetDate) return;
    onSubmit({ title, description, progress: 0, completed: false, target_date: targetDate });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Meta Personal</h2>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mejorar en matemáticas" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" required />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe tu meta..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none resize-none" />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Fecha objetivo *</label>
        <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" required />
      </div>
      <button type="submit" className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl transition-colors shadow-sm">
        Guardar Meta
      </button>
    </form>
  );
}

function AddReminderForm({ onSubmit }: { onSubmit: (reminder: { task_id: string | null; title: string; message: string; remind_at: string; active: boolean }) => void }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [remindAt, setRemindAt] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !remindAt) return;
    onSubmit({ task_id: null, title, message, remind_at: remindAt, active: true });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Recordatorio</h2>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="No olvidar..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" required />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Mensaje</label>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Detalles del recordatorio" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Fecha y hora *</label>
        <input type="datetime-local" value={remindAt} onChange={(e) => setRemindAt(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none" required />
      </div>
      <button type="submit" className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-xl transition-colors shadow-sm">
        Guardar Recordatorio
      </button>
    </form>
  );
}
