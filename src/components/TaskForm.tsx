import { useState } from 'react';
import type { Priority } from '@/types';

export interface TaskFormValues {
  title: string;
  description: string;
  subject: string;
  priority: Priority;
  due_date: string;
  reminder_days_before: number;
}

interface TaskFormProps {
  initialValues?: Partial<TaskFormValues>;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => void;
}

export function TaskForm({ initialValues, submitLabel, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [subject, setSubject] = useState(initialValues?.subject ?? '');
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? 'importante');
  const [dueDate, setDueDate] = useState(initialValues?.due_date ?? '');
  const [reminderDays, setReminderDays] = useState<number>(initialValues?.reminder_days_before ?? 2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !dueDate) return;
    onSubmit({
      title,
      description,
      subject,
      priority,
      due_date: dueDate,
      reminder_days_before: reminderDays,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Trabajo Matemáticas"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
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
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Materia</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Matemáticas"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
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
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Aviso (días antes)</label>
        <select
          value={reminderDays}
          onChange={(e) => setReminderDays(Number(e.target.value))}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
        >
          <option value={1}>Un día antes</option>
          <option value={2}>Dos días antes</option>
          <option value={3}>Tres días antes</option>
          <option value={7}>Una semana antes</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
      >
        {submitLabel}
      </button>
    </form>
  );
}
