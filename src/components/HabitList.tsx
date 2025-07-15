import React from 'react';
import type { Habit } from '../types';

interface HabitListProps {
  habits: Habit[];
  onToggleComplete: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export const HabitList: React.FC<HabitListProps> = ({ habits, onToggleComplete, onDelete }) => {
  const today = getToday();
  return (
    <div className="space-y-4">
      {habits.length === 0 && <p className="text-center text-gray-400">No habits yet. Add one above!</p>}
      {habits.map(habit => (
        <div key={habit.id} className="flex items-center justify-between bg-white rounded-2xl shadow-md p-4 mb-1 habit-card transition-all duration-300 hover:shadow-lg animate-fadein">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-lg text-blue-900">{habit.name}</div>
            {habit.description && <div className="text-xs text-gray-600 mb-1 truncate">{habit.description}</div>}
            <div className="text-xs text-gray-400 mb-1">Created: {new Date(habit.createdAt).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">Streak: <span className="font-bold text-green-600">{habit.currentStreak}</span> | Longest: {habit.longestStreak}</div>
          </div>
          <button
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors mx-2 text-lg font-bold ${habit.completions[today] ? 'bg-green-400 border-green-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-500 hover:bg-blue-100 hover:border-blue-400'}`}
            onClick={() => onToggleComplete(habit.id)}
            aria-label={habit.completions[today] ? 'Mark incomplete' : 'Mark complete'}
          >
            {habit.completions[today] ? '✓' : ''}
          </button>
          <button
            className="text-gray-300 hover:text-red-500 text-xs px-2 py-1 rounded border border-transparent ml-2 transition-colors"
            onClick={() => { if(window.confirm('Delete this habit?')) onDelete(habit.id); }}
            aria-label="Delete habit"
            title="Delete habit"
          >
            🗑
          </button>
        </div>
      ))}
    </div>
  );
}; 