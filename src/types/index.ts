export type ScreenType = 'home' | 'quests' | 'quest_runner' | 'leaderboard' | 'achievements' | 'progress' | 'profile' | 'settings' | 'login' | 'register' | 'help_desk';
export type QuestCategory = 'all' | 'coding' | 'logic' | 'memory' | 'problem' | 'quiz';

export interface Quest {
  id: string;
  title: string;
  course: string;
  category: QuestCategory;
  categoryLabel: string;
  description: string;
  xp: number;
  estTime: string;
  rank: string;
  rankColor?: string;
  tag: string;
  badge?: string;
  status: 'available' | 'in_progress' | 'completed';
  completed?: boolean;
  problemStatement?: string;
  options?: { id: string; text: string }[];
  correctOption?: string;
  hint?: string;
  codeSnippet?: string;
  language?: string;
}

export interface Scholar {
  rank: number;
  name: string;
  initials: string;
  callsign?: string;
  avatarUrl?: string;
  discipline: string;
  house: string;
  classYear: string;
  tier: string;
  questsCount: number;
  xp: number;
  trend: 'up' | 'down' | 'same';
  trendValue?: string;
  badgesCount?: number;
  isCurrentUser?: boolean;
}

export interface UserProfile {
  uid?: string;
  name: string;
  callsign: string;
  email: string;
  guild: string;
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  bestStreak: number;
  solvedCount: number;
  accuracy: number;
  inkSeals: number;
  college: string;
  isLoggedIn: boolean;
  bountyClaimed: boolean;
  completedQuests?: string[];
  photoURL?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}
