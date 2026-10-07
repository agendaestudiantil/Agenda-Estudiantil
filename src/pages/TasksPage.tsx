import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Plus, Pencil, Trash2, X, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '@/context/TaskContext';
import { getPriorityColor, getPriorityLabel } from '@/lib/priority';
import { parseLocalDate } from '@/lib/date';
import { TaskForm } from '@/components/TaskForm';
import type { TaskFilter } from '@/types';

const filters: { key: TaskFilter; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'en_progreso', label: 'En progreso' },
  { key: 'completadas', label: 'Completadas' },
];

export function TasksPage() {
  const { filter, setFilter, getFilteredTasks, toggleTaskComplete, updateTask, deleteTask } = useTasks();
  const navigate = useNavigate();
  const filteredTasks = getFilteredTasks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [exitingId, setExitingId] = useState<string | null>(null);

  function handleConfirmDelete(id: string) {
    setConfirmingId(null);
    setExitingId(id);
    window.setTimeout(() => {
      deleteTask(id);
      setExitingId(null);
    }, 250);
  }

  const statusBadge: Record<string, string> = {
    pendiente: 'bg-gray-100 text-gray-600',
    en_progreso: 'bg-yellow-100 text-yellow-800',
    completada: 'bg-emerald-100 text-emerald-700',
  };
  const statusLabel: Record<string, string> = {
    pendiente: 'Pendiente',
    en_progreso: 'En progreso',
    completada: 'Completada',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Mis Tareas</h1>
        <button
          onClick={() => navigate('/agregar')}
          className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <Plus size={18} />
          Nueva Tarea
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === key
                ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                : 'bg-white/70 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400 text-sm">No hay tareas en esta categoría</p>
            <button
              onClick={() => navigate('/agregar')}
              className="mt-3 text-emerald-600 text-sm font-medium hover:underline"
            >
              Crear una nueva tarea
            </button>
          </div>
        ) : (
          filteredTasks.map(task => (
            editingId === task.id ? (
              <div key={task.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-800">Editar Tarea</h3>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Cancelar edición"
                  >
                    <X size={18} />
                  </button>
                </div>
                <TaskForm
                  initialValues={{
                    title: task.title,
                    description: task.description,
                    subject: task.subject,
                    priority: task.priority,
                    status: task.status,
                    due_date: task.due_date,
                    reminder_days_before: task.reminder_days_before,
                  }}
                  submitLabel="Guardar Cambios"
                  onSubmit={(v) => { updateTask(task.id, v); setEditingId(null); }}
                />
              </div>
            ) : (
            <div
              key={task.id}
              className={`card flex items-start gap-3 transition-all duration-200 ${
                exitingId === task.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTaskComplete(task.id)}
                className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 transition-colors ${
                  task.status === 'completada'
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-gray-300 hover:border-emerald-500'
                }`}
                aria-label={`Marcar "${task.title}" como ${task.status === 'completada' ? 'pendiente' : 'completada'}`}
              >
                {task.status === 'completada' && (
                  <svg viewBox="0 0 12 12" className="w-full h-full text-white p-0.5">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`font-semibold text-sm ${
                    task.status === 'completada' ? 'line-through text-gray-400' : 'text-gray-800'
                  }`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`${getPriorityColor(task.priority)} px-2 py-0.5 rounded-full text-xs font-medium`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <button
                      onClick={() => setEditingId(task.id)}
                      className="text-gray-400 hover:text-emerald-600 transition-colors"
                      aria-label={`Editar "${task.title}"`}
                    >
                      <Pencil size={15} />
                    </button>
                    {confirmingId === task.id ? (
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className="text-gray-500">¿Eliminar?</span>
                        <button
                          onClick={() => handleConfirmDelete(task.id)}
                          className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium hover:bg-red-200 transition-colors"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setConfirmingId(null)}
                          className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium hover:bg-gray-200 transition-colors"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(task.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={`Eliminar "${task.title}"`}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar size={12} />
                    <span>{format(parseLocalDate(task.due_date), "dd / MM / yyyy", { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${statusBadge[task.status]} px-2 py-0.5 rounded-full text-xs font-medium`}>
                      {statusLabel[task.status]}
                    </span>
                    {task.status !== 'completada' && task.status !== 'en_progreso' && (
                      <button
                        onClick={() => updateTask(task.id, { status: 'en_progreso' })}
                        className="flex items-center gap-1 text-xs font-medium text-yellow-700 hover:text-yellow-800 transition-colors"
                        aria-label={`Pasar "${task.title}" a en progreso`}
                      >
                        <PlayCircle size={14} />
                        En progreso
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            )
          ))
        )}
      </div>
    </div>
  );
}
