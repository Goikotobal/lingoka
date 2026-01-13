import { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  BookOpen,
  Clock,
  Calendar,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import type { UserProgress } from '../types';
import { getUserProgress } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { SkillBar, AchievementCard } from '../components/progress';

const skillColors: Record<string, string> = {
  speaking: 'bg-emerald-500',
  listening: 'bg-blue-500',
  reading: 'bg-purple-500',
  writing: 'bg-pink-500',
  vocabulary: 'bg-amber-500',
  grammar: 'bg-indigo-500',
};

export function ProgressPage() {
  const { user } = useUser();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getUserProgress(user.user_id);
        setProgress(data);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProgress();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">Failed to load progress</p>
      </div>
    );
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxWeeklyXp = Math.max(...progress.weekly_xp);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Your Progress
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track your Hiligaynon learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Flame className="w-6 h-6 text-orange-500 animate-flicker" />}
          value={progress.current_streak}
          label="Day Streak"
          highlight
        />
        <StatCard
          icon={<Zap className="w-6 h-6 text-amber-500" />}
          value={progress.total_xp.toLocaleString()}
          label="Total XP"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-indigo-500" />}
          value={progress.words_learned}
          label="Words Learned"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-emerald-500" />}
          value={`${Math.floor(progress.practice_time_minutes / 60)}h`}
          label="Practice Time"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-8">
          {/* Weekly Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">
                This Week
              </h2>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {progress.weekly_xp.map((xp, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex items-end justify-center h-24">
                    <div
                      className={`w-full max-w-8 rounded-t transition-all ${
                        index === progress.weekly_xp.length - 1
                          ? 'bg-indigo-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      style={{
                        height: `${maxWeeklyXp > 0 ? (xp / maxWeeklyXp) * 100 : 0}%`,
                        minHeight: xp > 0 ? '8px' : '0',
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {weekDays[index]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Weekly Total
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {progress.weekly_xp.reduce((a, b) => a + b, 0)} XP
                </span>
              </div>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Skill Breakdown
              </h2>
            </div>
            <div className="space-y-4">
              {Object.entries(progress.skill_breakdown).map(([skill, value]) => (
                <SkillBar
                  key={skill}
                  skill={skill}
                  percentage={value}
                  color={skillColors[skill] || 'bg-slate-500'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Achievements */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Achievements
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {progress.achievements.filter((a) => a.earned_at).length}/
                {progress.achievements.length}
              </span>
            </div>
            <div className="space-y-3">
              {progress.achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {progress.recent_activity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === 'lesson'
                          ? 'bg-purple-100 dark:bg-purple-900/30'
                          : activity.type === 'conversation'
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-emerald-100 dark:bg-emerald-900/30'
                      }`}
                    >
                      <span>
                        {activity.type === 'lesson'
                          ? '📚'
                          : activity.type === 'conversation'
                            ? '💬'
                            : '🎯'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(activity.date).toLocaleDateString()} •{' '}
                        {activity.duration_minutes} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">+{activity.xp_earned}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  highlight = false,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        p-4 rounded-xl border
        ${
          highlight
            ? 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
