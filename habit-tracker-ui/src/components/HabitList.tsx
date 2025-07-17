import React from 'react';
import type { Habit } from '../types';

interface HabitListProps {
  habits: Habit[];
  onToggleComplete: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  onToggleDayComplete?: (habitId: string, date: string) => void;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getLastNDates(n: number) {
  const dates: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export const HabitList: React.FC<HabitListProps> = ({ habits, onToggleComplete, onDelete, onToggleDayComplete }) => {
  const today = getToday();
  const last7 = getLastNDates(7);
  return (
    <div className="space-y-4">
      {habits.length === 0 && <p className="text-center text-gray-400">No habits yet. Add one above!</p>}
      {habits.map(habit => (
        <div key={habit.id} className={"flex items-center justify-between bg-white rounded-2xl shadow-md p-4 mb-1 habit-card transition-all duration-300 hover:shadow-lg animate-fadein"}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-semibold text-lg text-blue-900">{habit.name}</div>
              {habit.priority === 'high' && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">High</span>}
              {habit.priority === 'medium' && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Medium</span>}
              {habit.priority === 'low' && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Low</span>}
            </div>
            {habit.description && <div className="text-xs text-gray-600 mb-1 truncate">{habit.description}</div>}
            {habit.category && <div className="text-xs text-blue-600 mb-1">📂 {habit.category}</div>}
            <div className="text-xs text-gray-400 mb-1">Created: {new Date(habit.createdAt).toLocaleDateString()}</div>
            
            {/* Goal Progress */}
            {habit.goal && (
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Weekly Goal: {habit.totalCompletions}/{habit.goal}</span>
                  <span>{Math.round((habit.totalCompletions / habit.goal) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((habit.totalCompletions / habit.goal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 mr-1">
                🔥 {habit.currentStreak} <span className="ml-1">Current</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                🏆 {habit.longestStreak} <span className="ml-1">Longest</span>
              </span>
            </div>
            <div className="flex gap-1 mt-2">
              {last7.map(date => (
                <button
                  key={date}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold transition-colors
                    ${habit.completions[date] ? 'bg-green-400 border-green-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-blue-100 hover:border-blue-400'}`}
                  onClick={() => onToggleDayComplete && onToggleDayComplete(habit.id, date)}
                  aria-label={habit.completions[date] ? `Unmark ${date}` : `Mark ${date}`}
                  title={date === today ? 'Today' : date}
                >
                  {date === today ? 'T' : new Date(date).getDate()}
                </button>
              ))}
            </div>
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