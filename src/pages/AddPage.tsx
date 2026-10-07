import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Calendar, FileText, Target, Star, ArrowLeft } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { TaskForm } from '@/components/TaskForm';

type AddType = 'menu' | 'tarea' | 'evento' | 'nota' | 'meta' | 'recordatorio';

const SAVE_ERROR = 'No se pudo guardar. Revisa los datos e intenta de nuevo.';

const menuItems = [
  { type: 'tarea' as const, icon: CheckSquare, label: 'Nueva Tarea', color: 'bg-emerald-100' },
  { type: 'evento' as const, icon: Calendar, label: 'Nuevo Evento', color: 'bg-yellow-100' },
  { type: 'nota' as const, icon: FileText, label: 'Nueva Nota', color: 'bg-green-100' },
  { type: 'meta' as const, icon: Target, label: 'Meta Personal', color: 'bg-green-100' },
  { type: 'recordatorio' as const, icon: Star, label: 'Recordatorio', color: 'bg-blue-100' },
];

function SubmitError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
      {message}
    </div>
  );
}

export function AddPage() {
  const [currentView, setCurrentView] = useState<AddType>('menu');
  const [taskError, setTaskError] = useState<string | null>(null);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
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

      {currentView === 'tarea' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Nueva Tarea</h2>
          <SubmitError message={taskError} />
          <TaskForm
            submitLabel={taskSubmitting ? 'Guardando...' : 'Guardar Tarea'}
            onSubmit={async (v) => {
              setTaskSubmitting(true);
              setTaskError(null);
              const { error } = await addTask({ ...v, status: 'pendiente' });
              setTaskSubmitting(false);
              if (error) {
                setTaskError(SAVE_ERROR);
                return;
              }
              navigate('/tareas');
            }}
          />
        </div>
      )}
      {currentView === 'evento' && (
        <AddEventForm onSubmit={async (event) => {
          const { error } = await addEvent(event);
          if (!error) navigate('/calendario');
          return { error };
        }} />
      )}
      {currentView === 'nota' && (
        <AddNoteForm onSubmit={async (note) => {
          const { error } = await addNote(note);
          if (!error) navigate('/tareas');
          return { error };
        }} />
      )}
      {currentView === 'meta' && (
        <AddGoalForm onSubmit={async (goal) => {
          const { error } = await addGoal(goal);
          if (!error) navigate('/perfil');
          return { error };
        }} />
      )}
      {currentView === 'recordatorio' && (
        <AddReminderForm onSubmit={async (reminder) => {
          const { error } = await addReminder(reminder);
          if (!error) navigate('/');
          return { error };
        }} />
      )}
    </div>
  );
}

// --- Sub-forms ---

function AddEventForm({ onSubmit }: { onSubmit: (event: { title: string; description: string; date: string; time: string; color: string }) => Promise<{ error: string | null }> }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [color, setColor] = useState('#60a5fa');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const colors = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#59BA6D', '#149656'];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !date || !time) return;
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await onSubmit({ title, description, date, time, color });
    setSubmitting(false);
    if (error) setSubmitError(SAVE_ERROR);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Nuevo Evento</h2>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Clase de Matemáticas" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" required />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Aula 201" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Fecha *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" required />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Hora *</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" required />
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

      <SubmitError message={submitError} />
      <button type="submit" disabled={submitting} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? 'Guardando...' : 'Guardar Evento'}
      </button>
    </form>
  );
}

function AddNoteForm({ onSubmit }: { onSubmit: (note: { title: string; content: string }) => Promise<{ error: string | null }> }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await onSubmit({ title, content });
    setSubmitting(false);
    if (error) setSubmitError(SAVE_ERROR);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Nueva Nota</h2>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mi nota" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" required />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Contenido *</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe tu nota aquí..." rows={5} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-none" required />
      </div>
      <SubmitError message={submitError} />
      <button type="submit" disabled={submitting} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? 'Guardando...' : 'Guardar Nota'}
      </button>
    </form>
  );
}

function AddGoalForm({ onSubmit }: { onSubmit: (goal: { title: string; description: string; progress: number; completed: boolean; target_date: string }) => Promise<{ error: string | null }> }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !targetDate) return;
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await onSubmit({ title, description, progress: 0, completed: false, target_date: targetDate });
    setSubmitting(false);
    if (error) setSubmitError(SAVE_ERROR);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Meta Personal</h2>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mejorar en matemáticas" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" required />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe tu meta..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-none" />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Fecha objetivo *</label>
        <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" required />
      </div>
      <SubmitError message={submitError} />
      <button type="submit" disabled={submitting} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? 'Guardando...' : 'Guardar Meta'}
      </button>
    </form>
  );
}

function AddReminderForm({ onSubmit }: { onSubmit: (reminder: { task_id: string | null; title: string; message: string; remind_at: string; active: boolean }) => Promise<{ error: string | null }> }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !remindAt) return;
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await onSubmit({ task_id: null, title, message, remind_at: remindAt, active: true });
    setSubmitting(false);
    if (error) setSubmitError(SAVE_ERROR);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Recordatorio</h2>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="No olvidar..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" required />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Mensaje</label>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Detalles del recordatorio" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Fecha y hora *</label>
        <input type="datetime-local" value={remindAt} onChange={(e) => setRemindAt(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" required />
      </div>
      <SubmitError message={submitError} />
      <button type="submit" disabled={submitting} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? 'Guardando...' : 'Guardar Recordatorio'}
      </button>
    </form>
  );
}
