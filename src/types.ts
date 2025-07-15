export interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // ISO date string
  completions: { [date: string]: boolean }; // e.g., { '2024-07-15': true }
  currentStreak: number;
  longestStreak: number;
} 