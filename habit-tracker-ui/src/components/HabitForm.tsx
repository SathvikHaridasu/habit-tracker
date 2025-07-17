import React, { useState } from 'react';

interface HabitFormProps {
  onAdd: (name: string, description: string, category?: string, goal?: number) => void;
  disabled?: boolean;
}

const CATEGORIES = [
  'Health & Fitness',
  'Productivity',
  'Learning',
  'Mindfulness',
  'Social',
  'Finance',
  'Creativity',
  'Other'
];

export const HabitForm: React.FC<HabitFormProps> = ({ onAdd, disabled }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [goal, setGoal] = useState<number>(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim(), category || undefined, goal);
    setName('');
    setDescription('');
    setCategory('');
    setGoal(7);
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <div className="form-header">
        <h3>Add New Habit</h3>
        <p>Create a new habit to track daily</p>
      </div>
      
      <div className="form-fields">
        <div className="field-group">
          <label htmlFor="habit-name">Habit Name *</label>
          <input
            id="habit-name"
            type="text"
            placeholder="e.g., Exercise, Read, Meditate"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={32}
            required
            disabled={disabled}
          />
        </div>

        <div className="field-group">
          <label htmlFor="habit-description">Description (optional)</label>
          <input
            id="habit-description"
            type="text"
            placeholder="Brief description of your habit"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={64}
            disabled={disabled}
          />
        </div>

        <div className="field-row">
          <div className="field-group">
            <label htmlFor="habit-category">Category</label>
            <select
              id="habit-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              disabled={disabled}
            >
              <option value="">Choose category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="habit-goal">Weekly Goal</label>
            <select
              id="habit-goal"
              value={goal}
              onChange={e => setGoal(Number(e.target.value))}
              disabled={disabled}
            >
              <option value={7}>7 days</option>
              <option value={5}>5 days</option>
              <option value={3}>3 days</option>
              <option value={1}>1 day</option>
            </select>
          </div>
        </div>
      </div>

      <button
        className="add-habit-btn"
        type="submit"
        disabled={disabled || !name.trim()}
      >
        <span className="btn-icon">+</span>
        Add Habit
      </button>
      
      {disabled && (
        <div className="form-message error">
          Maximum 20 habits reached. Delete some habits to add more.
        </div>
      )}
    </form>
  );
}; 