import { Trophy, Flame, BookOpen, MessageCircle, Star, Award } from 'lucide-react';
import type { Achievement } from '../../types';

const iconMap: Record<string, typeof Trophy> = {
  trophy: Trophy,
  flame: Flame,
  book: BookOpen,
  'message-circle': MessageCircle,
  star: Star,
  award: Award,
};

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const Icon = iconMap[achievement.icon] || Trophy;
  const isEarned = !!achievement.earned_at;
  const hasProgress = achievement.progress !== undefined && achievement.target !== undefined;

  return (
    <div
      className={`
        p-4 rounded-xl border transition-all
        ${
          isEarned
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700'
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${
              isEarned
                ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                : 'bg-slate-200 dark:bg-slate-700'
            }
          `}
        >
          <Icon
            className={`w-6 h-6 ${isEarned ? 'text-white' : 'text-slate-400'}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium ${
              isEarned
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {achievement.title}
          </h4>
          <p
            className={`text-sm ${
              isEarned
                ? 'text-slate-600 dark:text-slate-300'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {achievement.description}
          </p>

          {/* Progress bar for unearned achievements */}
          {!isEarned && hasProgress && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500">{achievement.progress} / {achievement.target}</span>
                <span className="text-slate-500">
                  {Math.round((achievement.progress! / achievement.target!) * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 dark:bg-slate-500 rounded-full"
                  style={{
                    width: `${(achievement.progress! / achievement.target!) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Earned date */}
          {isEarned && achievement.earned_at && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Earned {new Date(achievement.earned_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
