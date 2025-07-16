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
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim(), category || undefined, goal);
    setName('');
    setDescription('');
    setCategory('');
    setGoal(7);
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 bg-white rounded-xl shadow-sm p-4 animate-fadein">
      <input
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition mb-1"
        type="text"
        placeholder="Habit name"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={32}
        required
        disabled={disabled}
      />
      <input
        className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition mb-1"
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        maxLength={64}
        disabled={disabled}
      />
      
      <div className="grid grid-cols-2 gap-2">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
          value={category}
          onChange={e => setCategory(e.target.value)}
          disabled={disabled}
        >
          <option value="">Select Category</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
          value={goal}
          onChange={e => setGoal(Number(e.target.value))}
          disabled={disabled}
        >
          <option value={7}>Weekly Goal: 7 days</option>
          <option value={5}>Weekly Goal: 5 days</option>
          <option value={3}>Weekly Goal: 3 days</option>
          <option value={1}>Weekly Goal: 1 day</option>
        </select>
      </div>

      <div className="flex gap-2">
        {(['low', 'medium', 'high'] as const).map(p => (
          <button
            key={p}
            type="button"
            className={`flex-1 py-2 px-3 rounded-lg border transition ${
              priority === p 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => setPriority(p)}
            disabled={disabled}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 mt-2 font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={disabled || !name.trim()}
      >
        Add Habit
      </button>
      {disabled && <div className="text-xs text-red-500">Maximum 20 habits reached.</div>}
    </form>
  );
}; 