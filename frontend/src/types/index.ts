// User types
export interface UserProfile {
  user_id: string;
  email: string;
  name: string;
  native_language: string;
  target_language: string;
  current_level: LearningLevel;
  current_streak: number;
  total_xp: number;
  energy: number;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export type LearningLevel =
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'upper_intermediate'
  | 'advanced';

export interface UserPreferences {
  daily_goal_minutes: number;
  notification_enabled: boolean;
  sound_enabled: boolean;
  dark_mode: boolean;
  voice_speed: 'slow' | 'normal' | 'fast';
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  agent_type?: string;
  confidence?: number;
  vocabulary?: VocabularyItem[];
  grammar_notes?: string[];
  audio_url?: string;
}

export interface ChatRequest {
  message: string;
  user_id?: string;
  session_id?: string;
  language?: string;
  include_audio?: boolean;
}

export interface ChatResponse {
  message: string;
  agent_type: string;
  session_id: string;
  confidence: number;
  vocabulary?: VocabularyItem[];
  grammar_notes?: string[];
  audio_url?: string;
  suggested_responses?: string[];
}

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation?: string;
  part_of_speech?: string;
  example?: string;
}

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: LearningLevel;
  topic: string;
  duration_minutes: number;
  xp_reward: number;
  vocabulary_count: number;
  is_completed: boolean;
  progress_percent: number;
  prerequisites?: string[];
  thumbnail?: string;
}

export interface LessonContent {
  id: string;
  sections: LessonSection[];
}

export interface LessonSection {
  type: 'introduction' | 'vocabulary' | 'grammar' | 'practice' | 'conversation';
  title: string;
  content: string;
  vocabulary?: VocabularyItem[];
  exercises?: Exercise[];
}

// Exercise types
export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  hint?: string;
  audio_url?: string;
}

export type ExerciseType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'translation'
  | 'matching'
  | 'speaking'
  | 'listening';

// Progress types
export interface UserProgress {
  user_id: string;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  lessons_completed: number;
  words_learned: number;
  practice_time_minutes: number;
  skill_breakdown: SkillBreakdown;
  recent_activity: ActivityItem[];
  achievements: Achievement[];
  weekly_xp: number[];
}

export interface SkillBreakdown {
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
  vocabulary: number;
  grammar: number;
}

export interface ActivityItem {
  date: string;
  type: 'lesson' | 'practice' | 'conversation';
  title: string;
  xp_earned: number;
  duration_minutes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned_at?: string;
  progress?: number;
  target?: number;
}

// Session types
export interface UserSession {
  session_id: string;
  user_id: string;
  is_active: boolean;
  current_agent: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
