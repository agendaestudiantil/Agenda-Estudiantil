import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  Flame,
  Lock,
  Award,
  Check,
  TrendingUp,
  Zap,
  Crown,
  Clock,
  Target,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import { computeStats, computeAchievements, levelForPoints } from '@/lib/gamification';

// Mapea el nombre de icono (string del catálogo) al componente de lucide-react.
const ICONS: Record<string, LucideIcon> = {
  Check,
  TrendingUp,
  Zap,
  Crown,
  Clock,
  Flame,
  Target,
  Star,
  Award,
};

export function AchievementsPage() {
  const { user } = useAuth();
  const { tasks, goals } = useTasks();

  const points = user?.points ?? 0;
  const streak = user?.streak ?? 0;
  const stats = computeStats(tasks, goals, points, streak);
  const achievements = computeAchievements(stats);
  const { level, progress } = levelForPoints(points);

  return (
    <div className="space-y-6">
      <Link to="/perfil" className="flex items-center gap-1 text-gray-500 hover:text-emerald-700">
        <ArrowLeft size={18} />
        <span className="text-sm">Volver al perfil</span>
      </Link>

      <h1 className="text-xl font-bold text-gray-800">Logros</h1>

      {/* Resumen: puntos, racha, nivel + progreso */}
      <div className="card space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50">
            <Trophy size={18} className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">{points} pts</span>
          </div>
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50">
            <Flame size={18} className="text-orange-500" />
            <span className="text-sm font-semibold text-gray-700">{streak} días</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold text-emerald-800">Nivel: {level.nombre}</span>
            {level.next !== null && (
              <span className="text-xs text-gray-500">
                faltan {Math.max(level.next - points, 0)} pts para el siguiente nivel
              </span>
            )}
          </div>
          <div className="h-2.5 w-full rounded-full bg-emerald-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Insignias */}
      <div className="grid grid-cols-2 gap-3">
        {achievements.map(achievement => {
          const Icon = ICONS[achievement.icon] ?? Award;
          return (
            <div
              key={achievement.id}
              className={
                achievement.unlocked
                  ? 'card border border-emerald-200 flex flex-col items-center text-center gap-1.5 py-4 transition-transform hover:scale-[1.02]'
                  : 'card border border-gray-100 flex flex-col items-center text-center gap-1.5 py-4 opacity-60 grayscale'
              }
            >
              <div
                className={
                  achievement.unlocked
                    ? 'w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center'
                    : 'w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center'
                }
              >
                {achievement.unlocked ? (
                  <Icon size={24} className="text-emerald-600" />
                ) : (
                  <Lock size={22} className="text-gray-400" />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-800">{achievement.nombre}</span>
              <span className="text-xs text-gray-600">{achievement.descripcion}</span>
              {!achievement.unlocked && (
                <span className="text-[11px] text-gray-400 font-medium">Bloqueado</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
