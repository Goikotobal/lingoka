import { useState } from 'react';
import {
  User,
  Bell,
  Volume2,
  Moon,
  Globe,
  Clock,
  Save,
  Loader2,
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import type { LearningLevel } from '../types';

const levels: { value: LearningLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'elementary', label: 'Elementary' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'upper_intermediate', label: 'Upper Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const dailyGoals = [
  { value: 5, label: '5 min - Casual' },
  { value: 10, label: '10 min - Regular' },
  { value: 15, label: '15 min - Serious' },
  { value: 20, label: '20 min - Intense' },
  { value: 30, label: '30 min - Insane' },
];

const voiceSpeeds = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
];

export function SettingsPage() {
  const { user, updatePreferences, setUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Customize your learning experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Profile
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Level
              </label>
              <select
                value={user.current_level}
                onChange={(e) =>
                  setUser({ ...user, current_level: e.target.value as LearningLevel })
                }
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors text-slate-900 dark:text-white appearance-none cursor-pointer"
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Learning Goals Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Learning Goals
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Daily Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {dailyGoals.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() =>
                    updatePreferences({ daily_goal_minutes: goal.value })
                  }
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      user.preferences.daily_goal_minutes === goal.value
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }
                  `}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Audio Settings Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Volume2 className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Audio
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Sound Effects
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Play sounds for correct/incorrect answers
                </p>
              </div>
              <Toggle
                enabled={user.preferences.sound_enabled}
                onChange={(enabled) => updatePreferences({ sound_enabled: enabled })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Voice Speed
              </label>
              <div className="flex gap-2">
                {voiceSpeeds.map((speed) => (
                  <button
                    key={speed.value}
                    onClick={() =>
                      updatePreferences({
                        voice_speed: speed.value as 'slow' | 'normal' | 'fast',
                      })
                    }
                    className={`
                      flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        user.preferences.voice_speed === speed.value
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }
                    `}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Notifications
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Practice Reminders
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Get reminded to practice daily
              </p>
            </div>
            <Toggle
              enabled={user.preferences.notification_enabled}
              onChange={(enabled) =>
                updatePreferences({ notification_enabled: enabled })
              }
            />
          </div>
        </section>

        {/* Appearance Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Moon className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                Dark Mode
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Use dark theme for the app
              </p>
            </div>
            <Toggle
              enabled={user.preferences.dark_mode}
              onChange={(enabled) => updatePreferences({ dark_mode: enabled })}
            />
          </div>
        </section>

        {/* Language Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Language
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Native Language
              </label>
              <input
                type="text"
                value={user.native_language}
                onChange={(e) =>
                  setUser({ ...user, native_language: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Learning Language
              </label>
              <input
                type="text"
                value={user.target_language}
                disabled
                className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4">
          {savedMessage && (
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">
              {savedMessage}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        relative w-12 h-6 rounded-full transition-colors
        ${enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}
      `}
    >
      <span
        className={`
          absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
          ${enabled ? 'left-7' : 'left-1'}
        `}
      />
    </button>
  );
}
