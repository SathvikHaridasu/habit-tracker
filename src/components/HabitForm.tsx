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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <input
        className="border rounded px-3 py-2"
        type="text"
        placeholder="Habit name"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={32}
        required
        disabled={disabled}
      />
      <input
        className="border rounded px-3 py-2"
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        maxLength={64}
        disabled={disabled}
      />
      <button
        className="bg-blue-500 text-white rounded px-4 py-2 mt-2 disabled:opacity-50"
        type="submit"
        disabled={disabled || !name.trim()}
      >
        Add Habit
      </button>
      {disabled && <div className="text-xs text-red-500">Maximum 20 habits reached.</div>}
    </form>
  );
}; 