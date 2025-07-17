import type { Habit } from '../types';

const HABITS_KEY = 'habits';

export function loadHabits(): Habit[] {
  const data = localStorage.getItem(HABITS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Habit[];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
} 