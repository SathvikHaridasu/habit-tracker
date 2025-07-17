export interface Habit {
  id: string;
  name: string;
  description?: string;
  category?: string;
  goal?: number; // weekly goal
  priority: 'low' | 'medium' | 'high';
  createdAt: string; // ISO date string
  completions: { [date: string]: boolean }; // e.g., { '2024-07-15': true }
  notes: { [date: string]: string }; // e.g., { '2024-07-15': 'Felt great today!' }
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
} 