import type {
  ChatRequest,
  ChatResponse,
  UserProfile,
  UserSession,
  ChatMessage,
  Lesson,
  UserProgress,
} from '../types';

const API_BASE_URL = '/api';

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.detail || `HTTP error ${response.status}`
    );
  }

  return response.json();
}

// Health & Status
export async function checkHealth(): Promise<{ status: string; message: string }> {
  return fetchApi('/health');
}

export async function getAgents(): Promise<{ agents: Record<string, unknown>[] }> {
  return fetchApi('/agents');
}

// Chat
export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  return fetchApi('/chat', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

// Sessions
export async function getSession(sessionId: string): Promise<UserSession> {
  return fetchApi(`/sessions/${sessionId}`);
}

export async function getSessionHistory(sessionId: string): Promise<{ messages: ChatMessage[] }> {
  return fetchApi(`/sessions/${sessionId}/history`);
}

export async function endSession(sessionId: string): Promise<{ message: string }> {
  return fetchApi(`/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}

// Users
export async function createUser(userData: Partial<UserProfile>): Promise<UserProfile> {
  return fetchApi('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function getUser(userId: string): Promise<UserProfile> {
  return fetchApi(`/users/${userId}`);
}

export async function updateUser(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  return fetchApi(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

// Lessons (placeholder - backend endpoints may not exist yet)
export async function getLessons(level?: string): Promise<Lesson[]> {
  const query = level ? `?level=${level}` : '';
  try {
    return await fetchApi(`/lessons${query}`);
  } catch {
    // Return mock data if endpoint doesn't exist
    return getMockLessons();
  }
}

export async function getLesson(lessonId: string): Promise<Lesson> {
  try {
    return await fetchApi(`/lessons/${lessonId}`);
  } catch {
    const lessons = getMockLessons();
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  }
}

// Progress (placeholder - backend endpoints may not exist yet)
export async function getUserProgress(userId: string): Promise<UserProgress> {
  try {
    return await fetchApi(`/users/${userId}/progress`);
  } catch {
    return getMockProgress();
  }
}

// Mock data for development
function getMockLessons(): Lesson[] {
  return [
    {
      id: '1',
      title: 'Greetings & Introductions',
      description: 'Learn basic greetings and how to introduce yourself in Hiligaynon',
      level: 'beginner',
      topic: 'Basics',
      duration_minutes: 15,
      xp_reward: 50,
      vocabulary_count: 12,
      is_completed: false,
      progress_percent: 0,
    },
    {
      id: '2',
      title: 'Numbers 1-20',
      description: 'Master counting from one to twenty in Hiligaynon',
      level: 'beginner',
      topic: 'Numbers',
      duration_minutes: 10,
      xp_reward: 40,
      vocabulary_count: 20,
      is_completed: false,
      progress_percent: 0,
    },
    {
      id: '3',
      title: 'Common Phrases',
      description: 'Essential everyday phrases for basic communication',
      level: 'beginner',
      topic: 'Phrases',
      duration_minutes: 20,
      xp_reward: 60,
      vocabulary_count: 15,
      is_completed: false,
      progress_percent: 0,
    },
    {
      id: '4',
      title: 'Family Members',
      description: 'Learn vocabulary for family relationships',
      level: 'beginner',
      topic: 'Family',
      duration_minutes: 15,
      xp_reward: 50,
      vocabulary_count: 18,
      is_completed: false,
      progress_percent: 0,
    },
    {
      id: '5',
      title: 'Food & Dining',
      description: 'Vocabulary and phrases for ordering food and dining',
      level: 'elementary',
      topic: 'Food',
      duration_minutes: 25,
      xp_reward: 70,
      vocabulary_count: 25,
      is_completed: false,
      progress_percent: 0,
      prerequisites: ['1', '3'],
    },
    {
      id: '6',
      title: 'Basic Verb Conjugation',
      description: 'Understanding how verbs change in Hiligaynon',
      level: 'elementary',
      topic: 'Grammar',
      duration_minutes: 30,
      xp_reward: 80,
      vocabulary_count: 10,
      is_completed: false,
      progress_percent: 0,
      prerequisites: ['1', '3'],
    },
    {
      id: '7',
      title: 'Directions & Places',
      description: 'Ask for and give directions, learn place vocabulary',
      level: 'intermediate',
      topic: 'Travel',
      duration_minutes: 25,
      xp_reward: 75,
      vocabulary_count: 20,
      is_completed: false,
      progress_percent: 0,
      prerequisites: ['5', '6'],
    },
    {
      id: '8',
      title: 'Past Tense',
      description: 'Talk about events that happened in the past',
      level: 'intermediate',
      topic: 'Grammar',
      duration_minutes: 35,
      xp_reward: 90,
      vocabulary_count: 8,
      is_completed: false,
      progress_percent: 0,
      prerequisites: ['6'],
    },
  ];
}

function getMockProgress(): UserProgress {
  return {
    user_id: 'demo-user',
    total_xp: 1250,
    current_streak: 7,
    longest_streak: 14,
    lessons_completed: 12,
    words_learned: 156,
    practice_time_minutes: 420,
    skill_breakdown: {
      speaking: 45,
      listening: 60,
      reading: 75,
      writing: 30,
      vocabulary: 65,
      grammar: 50,
    },
    recent_activity: [
      {
        date: new Date().toISOString(),
        type: 'conversation',
        title: 'Practice Conversation',
        xp_earned: 25,
        duration_minutes: 10,
      },
      {
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'lesson',
        title: 'Common Phrases',
        xp_earned: 60,
        duration_minutes: 18,
      },
      {
        date: new Date(Date.now() - 172800000).toISOString(),
        type: 'practice',
        title: 'Vocabulary Review',
        xp_earned: 30,
        duration_minutes: 8,
      },
    ],
    achievements: [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: 'trophy',
        earned_at: new Date(Date.now() - 604800000).toISOString(),
      },
      {
        id: '2',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'flame',
        earned_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Word Collector',
        description: 'Learn 100 words',
        icon: 'book',
        earned_at: new Date(Date.now() - 259200000).toISOString(),
      },
      {
        id: '4',
        title: 'Conversation Master',
        description: 'Complete 50 conversations',
        icon: 'message-circle',
        progress: 23,
        target: 50,
      },
    ],
    weekly_xp: [120, 85, 150, 200, 175, 180, 340],
  };
}

export { ApiError };
