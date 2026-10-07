import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';

const SAVE_ERROR = 'No se pudo guardar la meta. Revisa los datos e intenta de nuevo.';

export function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !targetDate) return;
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await addGoal({ title, description, progress: 0, completed: false, target_date: targetDate });
    setSubmitting(false);
    if (error) {
      setSubmitError(SAVE_ERROR);
      return;
    }
    setTitle('');
    setDescription('');
    setTargetDate('');
    setShowForm(false);
  }

  function advanceProgress(id: string, current: number, amount: number) {
    const next = Math.min(100, current + amount);
    updateGoal(id, { progress: next, completed: next >= 100 });
  }

  return (
    <div className="space-y-6">
      <Link to="/perfil" className="flex items-center gap-1 text-gray-500 hover:text-emerald-700">
        <ArrowLeft size={18} />
        <span className="text-sm">Volver al perfil</span>
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Metas</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} />
          {showForm ? 'Cerrar' : 'Nueva meta'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Mejorar en matemáticas"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu meta..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Fecha objetivo *</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
              required
            />
          </div>
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Guardando...' : 'Guardar Meta'}
          </button>
        </form>
      )}

      {goals.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-10">Aún no tienes metas. Crea la primera.</p>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                    {goal.completed && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        <CheckCircle2 size={12} />
                        Completada
                      </span>
                    )}
                  </div>
                  {goal.description && <p className="text-sm text-gray-500 mt-0.5">{goal.description}</p>}
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  aria-label="Eliminar meta"
                  className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progreso</span>
                  <span className="font-semibold text-emerald-700">{goal.progress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-emerald-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${Math.min(100, goal.progress)}%` }}
                  />
                </div>
              </div>

              {!goal.completed && (
                <div className="flex gap-2">
                  <button
                    onClick={() => advanceProgress(goal.id, goal.progress, 10)}
                    className="flex-1 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl transition-colors"
                  >
                    +10%
                  </button>
                  <button
                    onClick={() => advanceProgress(goal.id, goal.progress, 25)}
                    className="flex-1 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl transition-colors"
                  >
                    +25%
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
