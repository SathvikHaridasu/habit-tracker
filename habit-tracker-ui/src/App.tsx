import React from 'react';
import './App.css';
import { HabitForm } from '../../src/components/HabitForm';
import { HabitList } from '../../src/components/HabitList';
import { useHabits } from '../../src/hooks/useHabits';
import type { Habit } from '../../src/types';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [habits, setHabits] = useHabits();

  const handleAddHabit = (name: string, description: string) => {
    if (habits.length >= 20) return;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date().toISOString(),
      completions: {},
      currentStreak: 0,
      longestStreak: 0,
    };
    setHabits([newHabit, ...habits]);
  };

  const handleToggleComplete = (habitId: string) => {
    const today = getToday();
    setHabits(habits => habits.map(habit => {
      if (habit.id !== habitId) return habit;
      const completions = { ...habit.completions };
      if (completions[today]) {
        delete completions[today];
      } else {
        completions[today] = true;
      }
      // Recalculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      // Get all completion dates sorted descending
      const dates = Object.keys(completions).sort((a, b) => b.localeCompare(a));
      let streak = 0;
      let prev = today;
      for (const date of dates) {
        if (date === prev) {
          streak++;
          prev = new Date(new Date(date).getTime() - 86400000).toISOString().slice(0, 10);
        } else {
          streak = 1;
          prev = new Date(new Date(date).getTime() - 86400000).toISOString().slice(0, 10);
        }
        if (streak > longestStreak) longestStreak = streak;
      }
      currentStreak = streak;
      return { ...habit, completions, currentStreak, longestStreak };
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits => habits.filter(h => h.id !== habitId));
  };

  const recalculateStreaks = (completions: Record<string, boolean>) => {
    // Get all completion dates sorted descending
    const dates = Object.keys(completions).filter(d => completions[d]).sort((a, b) => b.localeCompare(a));
    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    let prev = getToday();
    for (const date of dates) {
      if (date === prev) {
        streak++;
        prev = new Date(new Date(date).getTime() - 86400000).toISOString().slice(0, 10);
      } else {
        streak = 1;
        prev = new Date(new Date(date).getTime() - 86400000).toISOString().slice(0, 10);
      }
      if (streak > longestStreak) longestStreak = streak;
    }
    currentStreak = streak;
    return { currentStreak, longestStreak };
  };

  const handleToggleDayComplete = (habitId: string, date: string) => {
    setHabits(habits => habits.map(habit => {
      if (habit.id !== habitId) return habit;
      const completions = { ...habit.completions };
      if (completions[date]) {
        delete completions[date];
      } else {
        completions[date] = true;
      }
      const { currentStreak, longestStreak } = recalculateStreaks(completions);
      return { ...habit, completions, currentStreak, longestStreak };
    }));
  };

  return (
    <div className="app-container">
      <h1>Habit Tracker</h1>
      <HabitForm onAdd={handleAddHabit} disabled={habits.length >= 20} />
      <div className="section-title">Your Habits</div>
      <HabitList habits={habits} onToggleComplete={handleToggleComplete} onDelete={handleDeleteHabit} onToggleDayComplete={handleToggleDayComplete} />
    </div>
  );
}

export default App;
