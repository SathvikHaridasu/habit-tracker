import React, { useState, useMemo, useEffect } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(() => {
    return localStorage.getItem('habitTrackerIntroDismissed') !== 'true';
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismissIntro = () => {
    setShowIntro(false);
    localStorage.setItem('habitTrackerIntroDismissed', 'true');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <div className="loading-title">Habit Tracker</div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="intro-screen">
        <h1>Welcome to Habit Tracker!</h1>
        <p>Track your daily habits, build streaks, and reach your goals with ease. Add habits, mark completions, and see your progress over time.</p>
        <button className="intro-btn" onClick={handleDismissIntro}>Get Started</button>
      </div>
    );
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
    const activeStreaks = habits.filter(h => h.currentStreak > 0).length;
    const completionRate = totalHabits > 0 ? Math.round((activeStreaks / totalHabits) * 100) : 0;
    
    return { totalHabits, totalCompletions, activeStreaks, completionRate };
  }, [habits]);

  // Filter habits based on search and category
  const filteredHabits = useMemo(() => {
    return habits.filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (habit.description && habit.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [habits, searchTerm, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = habits.map(h => h.category).filter(Boolean) as string[];
    return ['all', ...Array.from(new Set(cats))];
  }, [habits]);

  const handleAddHabit = (name: string, description: string, category?: string, goal?: number) => {
    if (habits.length >= 20) return;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      description,
      category,
      goal,
      priority: 'medium',
      createdAt: new Date().toISOString(),
      completions: {},
      notes: {},
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
    };
    setHabits([newHabit, ...habits]);
  };

  const recalculateStreaks = (completions: Record<string, boolean>) => {
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
      const { currentStreak, longestStreak } = recalculateStreaks(completions);
      const totalCompletions = Object.keys(completions).filter(d => completions[d]).length;
      return { ...habit, completions, currentStreak, longestStreak, totalCompletions };
    }));
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
      const totalCompletions = Object.keys(completions).filter(d => completions[d]).length;
      return { ...habit, completions, currentStreak, longestStreak, totalCompletions };
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits => habits.filter(h => h.id !== habitId));
  };

  return (
    <div className="app-container">
      <h1>Habit Tracker</h1>
      
      {/* Statistics Dashboard */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalHabits}</div>
          <div className="stat-label">Total Habits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalCompletions}</div>
          <div className="stat-label">Total Completions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activeStreaks}</div>
          <div className="stat-label">Active Streaks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completionRate}%</div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>

      <div className="feature-grid">
        {/* Left Column - Add Habits */}
        <div>
          <div className="section-title">Add New Habit</div>
          <HabitForm onAdd={handleAddHabit} disabled={habits.length >= 20} />
        </div>

        {/* Right Column - Search & Filter */}
        <div>
          <div className="section-title">Search & Filter</div>
          <input
            type="text"
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-3"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="section-title">Your Habits ({filteredHabits.length})</div>
      <HabitList 
        habits={filteredHabits} 
        onToggleComplete={handleToggleComplete} 
        onDelete={handleDeleteHabit} 
        onToggleDayComplete={handleToggleDayComplete} 
      />
    </div>
  );
}

export default App;
