import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';
import { formatTime12h } from '@/lib/date';

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getEventsForDate, getTasksForDate } = useTasks();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  const adjustedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const weekDays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const eventsForDay = getEventsForDate(selectedDateStr);
  const tasksForDay = getTasksForDate(selectedDateStr);

  function prevMonth() {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function goToToday() {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  }

  return (
    <div className="space-y-4">
      {/* Month header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy', { locale: es }).replace(/^\w/, c => c.toUpperCase())}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Hoy
          </button>
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100" aria-label="Mes anterior">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100" aria-label="Mes siguiente">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="card">
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map(day => (
            <div key={day} className="text-xs font-bold text-gray-500 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: adjustedStart }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const today = isToday(day);
            const isSelected = isSameDay(day, selectedDate);
            const dateStr = format(day, 'yyyy-MM-dd');
            const hasEvents = getEventsForDate(dateStr).length > 0 || getTasksForDate(dateStr).length > 0;

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`relative text-sm py-2.5 rounded-full transition-all ${
                  today && isSelected
                    ? 'bg-emerald-500 text-white font-bold shadow-md scale-110'
                    : today
                      ? 'bg-emerald-500 text-white font-bold'
                      : isSelected
                        ? 'bg-emerald-100 text-emerald-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {format(day, 'd')}
                {hasEvents && !today && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events for selected date */}
      <div>
        <h2 className="font-bold text-gray-800 mb-3">
          Eventos del día
          <span className="text-sm font-normal text-gray-500 ml-2">
            {format(selectedDate, "d 'de' MMMM", { locale: es })}
          </span>
        </h2>

        {eventsForDay.length === 0 && tasksForDay.length === 0 ? (
          <div className="card text-center py-6">
            <p className="text-gray-400 text-sm">No hay eventos para este día</p>
          </div>
        ) : (
          <div className="space-y-2">
            {eventsForDay.map(event => (
              <div key={event.id} className="card flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-700">{formatTime12h(event.time)}</span>
                  <span className="text-sm text-gray-600 ml-3">{event.title}</span>
                </div>
              </div>
            ))}
            {tasksForDay.map(task => (
              <div key={task.id} className="card flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0 bg-emerald-500" />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-700">📝</span>
                  <span className="text-sm text-gray-600 ml-2">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
