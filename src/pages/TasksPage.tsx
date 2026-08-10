import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '@/context/TaskContext';
import { getPriorityColor, getPriorityLabel } from '@/lib/priority';
import type { TaskFilter } from '@/types';

const filters: { key: TaskFilter; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'en_progreso', label: 'En progreso' },
  { key: 'completadas', label: 'Completadas' },
];

export function TasksPage() {
  const { filter, setFilter, getFilteredTasks, toggleTaskComplete } = useTasks();
  const navigate = useNavigate();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Mis Tareas</h1>
        <button
          onClick={() => navigate('/agregar')}
          className="flex items-center gap-1 text-sm font-medium text-pink-500 hover:text-pink-600 transition-colors"
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
                ? 'bg-pink-100 text-pink-700 shadow-sm'
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
              className="mt-3 text-pink-500 text-sm font-medium hover:underline"
            >
              Crear una nueva tarea
            </button>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="card flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => toggleTaskComplete(task.id)}
                className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 transition-colors ${
                  task.status === 'completada'
                    ? 'bg-emerald-400 border-emerald-400'
                    : 'border-gray-300 hover:border-pink-400'
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
                  <span className={`${getPriorityColor(task.priority)} px-2 py-0.5 rounded-full text-xs font-medium shrink-0`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Calendar size={12} />
                  <span>{format(new Date(task.due_date), "dd / MM / yyyy", { locale: es })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
