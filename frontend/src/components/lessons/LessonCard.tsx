import { Clock, Zap, BookOpen, CheckCircle, Lock } from 'lucide-react';
import type { Lesson, LearningLevel } from '../../types';

interface LessonCardProps {
  lesson: Lesson;
  onStart: (lessonId: string) => void;
  isLocked?: boolean;
}

const levelColors: Record<LearningLevel, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  elementary: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  upper_intermediate: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function LessonCard({ lesson, onStart, isLocked = false }: LessonCardProps) {
  const isCompleted = lesson.is_completed;
  const hasProgress = lesson.progress_percent > 0 && !isCompleted;

  return (
    <div
      className={`
        relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
        p-5 transition-all duration-200
        ${isLocked ? 'opacity-60' : 'hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600'}
      `}
    >
      {/* Completion indicator */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Lock indicator */}
      {isLocked && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center shadow-lg">
          <Lock className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <span
            className={`inline-block text-xs font-medium px-2 py-1 rounded-full mb-2 ${levelColors[lesson.level]}`}
          >
            {lesson.level.replace('_', ' ')}
          </span>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {lesson.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">{lesson.xp_reward}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
        {lesson.description}
      </p>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{lesson.duration_minutes} min</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span>{lesson.vocabulary_count} words</span>
        </div>
      </div>

      {/* Progress bar */}
      {hasProgress && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500 dark:text-slate-400">Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              {lesson.progress_percent}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ width: `${lesson.progress_percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Action button */}
      <button
        onClick={() => !isLocked && onStart(lesson.id)}
        disabled={isLocked}
        className={`
          w-full py-2.5 rounded-lg font-medium transition-colors
          ${
            isLocked
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              : isCompleted
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                : hasProgress
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
          }
        `}
      >
        {isLocked
          ? 'Locked'
          : isCompleted
            ? 'Review'
            : hasProgress
              ? 'Continue'
              : 'Start Lesson'}
      </button>
    </div>
  );
}
