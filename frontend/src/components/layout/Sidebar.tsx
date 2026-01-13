import { NavLink } from 'react-router-dom';
import {
  MessageCircle,
  BookOpen,
  BarChart3,
  Settings,
  Flame,
  Zap,
  X,
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
  { to: '/lessons', icon: BookOpen, label: 'Lessons' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useUser();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LK</span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              LingoKa
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* User Stats */}
        {user && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-5 h-5 animate-flicker" />
                <span className="font-semibold">{user.current_streak}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Zap className="w-5 h-5" />
                <span className="font-semibold">{user.total_xp}</span>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Learning {user.target_language}
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-progress"
                  style={{ width: '35%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0) || 'L'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 dark:text-white truncate">
                {user?.name || 'Learner'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {user?.current_level || 'Beginner'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
