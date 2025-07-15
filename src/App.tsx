import React from 'react';
import { useHabits } from './hooks/useHabits';
import { HabitList } from './components/HabitList';
import { Habit } from './types';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function toggleCompletion(habit: Habit): Habit {
  const today = getToday();
  const completed = habit.completions[today];
  const completions = { ...habit.completions, [today]: !completed };
  // Streak logic will be improved later
  let currentStreak = habit.currentStreak;
  let longestStreak = habit.longestStreak;
  if (!completed) {
    currentStreak += 1;
    if (currentStreak > longestStreak) longestStreak = currentStreak;
  } else {
    currentStreak = 0;
  }
  return { ...habit, completions, currentStreak, longestStreak };
}

function App() {
  const [habits, setHabits] = useHabits();

  const handleToggleComplete = (habitId: string) => {
    setHabits(habits => habits.map(habit =>
      habit.id === habitId ? toggleCompletion(habit) : habit
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 border-b border-gray-200 mb-4">
        <h1 className="text-2xl font-bold text-center">Habit Tracker</h1>
      </header>
      <main className="max-w-xl mx-auto p-4">
        <HabitList habits={habits} onToggleComplete={handleToggleComplete} />
      </main>
    </div>
  );
}

export default App; 