import type { GameMetadata } from '@/types/game';
import { GameCard } from './GameCard';

interface GameGridProps {
  games: GameMetadata[];
  emptyMessage?: string;
}

export const GameGrid = ({ games, emptyMessage = 'Aucun jeu disponible' }: GameGridProps) => {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        <p className="text-xl">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};
