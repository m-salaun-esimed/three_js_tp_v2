import { useState } from 'react';
import type { GameCategory } from '@/types/game';

interface GameFiltersProps {
  onFilterChange: (category: GameCategory | 'all') => void;
}

const categories: Array<{ value: GameCategory | 'all'; label: string }> = [
  { value: 'all', label: 'Tous' },
  { value: '3d', label: '3D' },
  { value: 'action', label: 'Action' },
  { value: 'puzzle', label: 'Puzzle' },
  { value: 'arcade', label: 'Arcade' },
  { value: 'strategy', label: 'Stratégie' },
  { value: 'sports', label: 'Sports' },
];

export const GameFilters = ({ onFilterChange }: GameFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'all'>('all');

  const handleCategoryChange = (category: GameCategory | 'all') => {
    setSelectedCategory(category);
    onFilterChange(category);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => handleCategoryChange(category.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === category.value
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};
