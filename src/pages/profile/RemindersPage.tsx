import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Bell, BellOff } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { formatTime12h } from '@/lib/date';

/** Formatea un `remind_at` (ISO o 'yyyy-MM-ddTHH:mm') como fecha local + hora AM/PM. */
function formatRemindAt(remindAt: string): string {
  if (!remindAt) return '';
  const date = new Date(remindAt);
  if (Number.isNaN(date.getTime())) return remindAt;
  const dateStr = date.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });
  const hhmm = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return `${dateStr} · ${formatTime12h(hhmm)}`;
}

export function RemindersPage() {
  const { reminders, updateReminder, deleteReminder } = useTasks();

  return (
    <div className="space-y-6">
      <Link to="/perfil" className="flex items-center gap-1 text-gray-500 hover:text-emerald-700">
        <ArrowLeft size={18} />
        <span className="text-sm">Volver al perfil</span>
      </Link>

      <h1 className="text-xl font-bold text-gray-800">Recordatorios</h1>

      {reminders.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-10">Aún no tienes recordatorios.</p>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="card space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{reminder.title}</h3>
                  {reminder.message && <p className="text-sm text-gray-500 mt-0.5">{reminder.message}</p>}
                  <p className="text-xs text-emerald-700 font-medium mt-1">{formatRemindAt(reminder.remind_at)}</p>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  aria-label="Eliminar recordatorio"
                  className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <button
                onClick={() => updateReminder(reminder.id, { active: !reminder.active })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  reminder.active
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {reminder.active ? <Bell size={14} /> : <BellOff size={14} />}
                {reminder.active ? 'Activo' : 'Inactivo'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
