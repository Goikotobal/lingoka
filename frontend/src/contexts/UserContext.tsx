import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserProfile, UserPreferences } from '../types';

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  setUser: (user: UserProfile | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  user_id: 'demo-user',
  email: 'demo@lingoka.app',
  name: 'Learner',
  native_language: 'English',
  target_language: 'Hiligaynon',
  current_level: 'beginner',
  current_streak: 7,
  total_xp: 1250,
  energy: 5,
  preferences: {
    daily_goal_minutes: 15,
    notification_enabled: true,
    sound_enabled: true,
    dark_mode: false,
    voice_speed: 'normal',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Load user from localStorage or use default
    const savedUser = localStorage.getItem('lingoka_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DEFAULT_USER);
      }
    } else {
      setUser(DEFAULT_USER);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Persist user to localStorage
    if (user) {
      localStorage.setItem('lingoka_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    // Apply dark mode preference
    if (user?.preferences.dark_mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.preferences.dark_mode]);

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    if (!user) return;
    setUser({
      ...user,
      preferences: { ...user.preferences, ...prefs },
      updated_at: new Date().toISOString(),
    });
  };

  return (
    <UserContext.Provider
      value={{ user, isLoading, error, updatePreferences, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
