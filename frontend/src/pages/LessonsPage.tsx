import { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import type { Lesson, LearningLevel } from '../types';
import { getLessons } from '../services/api';
import { LessonCard } from '../components/lessons';
import { useNavigate } from 'react-router-dom';

const levels: { value: LearningLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'elementary', label: 'Elementary' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'upper_intermediate', label: 'Upper Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function LessonsPage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel | 'all'>('all');

  useEffect(() => {
    async function fetchLessons() {
      setIsLoading(true);
      try {
        const data = await getLessons(
          selectedLevel === 'all' ? undefined : selectedLevel
        );
        setLessons(data);
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLessons();
  }, [selectedLevel]);

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const completedLessons = lessons.filter((l) => l.is_completed).length;
  const totalXp = lessons.reduce(
    (sum, l) => sum + (l.is_completed ? l.xp_reward : 0),
    0
  );

  const handleStartLesson = (lessonId: string) => {
    // In a real app, this would navigate to the lesson detail page
    navigate(`/chat?lesson=${lessonId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Lessons
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Master Hiligaynon step by step with structured lessons
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Lessons"
          value={lessons.length}
          icon="📚"
        />
        <StatCard
          label="Completed"
          value={completedLessons}
          icon="✅"
        />
        <StatCard
          label="In Progress"
          value={lessons.filter((l) => l.progress_percent > 0 && !l.is_completed).length}
          icon="🔄"
        />
        <StatCard
          label="XP Earned"
          value={totalXp}
          icon="⚡"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors text-slate-900 dark:text-white"
          />
        </div>

        {/* Level filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as LearningLevel | 'all')}
            className="pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors text-slate-900 dark:text-white appearance-none cursor-pointer"
          >
            {levels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lessons grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No lessons found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onStart={handleStartLesson}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
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
