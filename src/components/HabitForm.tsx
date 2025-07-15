import React, { useState } from 'react';

interface HabitFormProps {
  onAdd: (name: string, description: string) => void;
  disabled?: boolean;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onAdd, disabled }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim());
    setName('');
    setDescription('');
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