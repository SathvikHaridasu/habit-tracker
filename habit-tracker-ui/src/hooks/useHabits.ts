import { useState, useEffect } from 'react';
import type { Habit } from '../types';
import { loadHabits, saveHabits } from '../utils/storage';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    setHabits(loadHabits());
  }, []);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  return [habits, setHabits] as const;
} 