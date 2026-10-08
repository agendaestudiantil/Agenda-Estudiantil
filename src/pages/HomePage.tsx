import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { getDailyMessage } from '@/data/motivational-messages';
import { getPriorityColor, getPriorityLabel } from '@/lib/priority';
import { parseLocalDate } from '@/lib/date';
import { InstallPrompt } from '@/components/InstallPrompt';

export function HomePage() {
  const { tasks, getFilteredTasks } = useTasks();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const motivationalMessage = getDailyMessage();

  const pendingTasks = useMemo(
    () => getFilteredTasks().filter(t => t.status !== 'completada').slice(0, 3),
    [getFilteredTasks]
  );

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart); // 0=Sun
  const adjustedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Mon=0

  const weekDays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

  function prevMonth() {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  // Check if a date has tasks
  function hasTasksOnDate(date: Date): boolean {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.some(t => t.due_date === dateStr && t.status !== 'completada');
  }

  return (
    <div className="space-y-4">
      <InstallPrompt />

      {/* Top task preview */}
      {pendingTasks.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-3">Próximas Tareas</h2>
          <div className="space-y-2">
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    {format(parseLocalDate(task.due_date), "dd 'de' MMM", { locale: es })}
                  </p>
                </div>
                <span className={`${getPriorityColor(task.priority)} px-2 py-0.5 rounded-full text-xs font-medium`}>
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar mini */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">
            {format(currentMonth, 'MMMM yyyy', { locale: es }).replace(/^\w/, c => c.toUpperCase())}
          </h3>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100" aria-label="Mes anterior">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100" aria-label="Mes siguiente">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map(day => (
            <div key={day} className="text-[10px] font-semibold text-gray-500 py-1">
              {day}
            </div>
          ))}
          {/* Empty cells before month start */}
          {Array.from({ length: adjustedStart }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {/* Days */}
          {days.map(day => {
            const today = isToday(day);
            const hasTasks = hasTasksOnDate(day);
            return (
              <div
                key={day.toISOString()}
                className={`relative text-sm py-1.5 rounded-full transition-colors ${
                  today
                    ? 'bg-emerald-500 text-white font-bold'
                    : isSameMonth(day, currentMonth)
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-300'
                }`}
              >
                {format(day, 'd')}
                {hasTasks && !today && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational message */}
      <div className="motivational-card">
        <div className="flex items-start gap-2">
          <Heart size={18} className="text-emerald-600 mt-0.5 shrink-0" fill="currentColor" />
          <div>
            <h4 className="font-semibold text-gray-800 text-sm mb-1">Mensaje Motivacional</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {motivationalMessage.text} {motivationalMessage.emoji}
            </p>
          </div>
          <Heart size={14} className="text-emerald-500 shrink-0 self-end" fill="currentColor" />
        </div>
      </div>
    </div>
  );
}
