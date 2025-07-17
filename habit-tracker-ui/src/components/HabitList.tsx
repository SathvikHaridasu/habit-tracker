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

  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No habits yet!</h3>
        <p>Add your first habit above to start tracking your progress.</p>
      </div>
    );
  }

  return (
    <div className="habits-list">
      {habits.map(habit => (
        <div key={habit.id} className="habit-card">
          <div className="habit-header">
            <div className="habit-info">
              <h3 className="habit-name">{habit.name}</h3>
              {habit.description && <p className="habit-description">{habit.description}</p>}
              {habit.category && <span className="habit-category">📂 {habit.category}</span>}
            </div>
            
            <div className="habit-actions">
              {/* Main completion button - most prominent */}
              <button
                className={`complete-btn ${habit.completions[today] ? 'completed' : ''}`}
                onClick={() => onToggleComplete(habit.id)}
                title={habit.completions[today] ? 'Mark as incomplete' : 'Mark as complete for today'}
              >
                {habit.completions[today] ? (
                  <>
                    <span className="check-icon">✓</span>
                    <span className="btn-text">Done!</span>
                  </>
                ) : (
                  <>
                    <span className="plus-icon">+</span>
                    <span className="btn-text">Mark Done</span>
                  </>
                )}
              </button>
              
              <button
                className="delete-btn"
                onClick={() => { if(window.confirm('Delete this habit?')) onDelete(habit.id); }}
                title="Delete habit"
              >
                🗑
              </button>
            </div>
          </div>

          {/* Progress and stats */}
          <div className="habit-progress">
            <div className="progress-row">
              <div className="streak-info">
                <span className="streak current">🔥 {habit.currentStreak} day streak</span>
                <span className="streak best">🏆 Best: {habit.longestStreak} days</span>
              </div>
              
              {habit.goal && (
                <div className="goal-progress">
                  <span className="goal-text">This week: {habit.totalCompletions}/{habit.goal}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${Math.min((habit.totalCompletions / habit.goal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Weekly calendar - simplified and clearer */}
            <div className="weekly-calendar">
              <div className="calendar-header">This Week:</div>
              <div className="calendar-days">
                {last7.map((date, index) => {
                  const isCompleted = habit.completions[date];
                  const isToday = date === today;
                  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()];
                  
                  return (
                    <button
                      key={date}
                      className={`calendar-day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                      onClick={() => onToggleDayComplete && onToggleDayComplete(habit.id, date)}
                      title={`${dayName} ${new Date(date).toLocaleDateString()} - ${isCompleted ? 'Completed' : 'Not completed'}`}
                    >
                      <span className="day-name">{dayName}</span>
                      <span className="day-number">{new Date(date).getDate()}</span>
                      {isCompleted && <span className="day-check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 