import { Link } from 'react-router-dom';
import type { GameMetadata } from '@/types/game';
import { FaUser, FaUsers, FaGamepad } from 'react-icons/fa';

interface GameCardProps {
  game: GameMetadata;
}

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <Link
      to={`/game/${game.id}`}
      className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaGamepad className="w-20 h-20 text-white opacity-50" />
          </div>
        )}

        {/* Catégorie Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-black bg-opacity-60 rounded-full text-xs text-white font-semibold">
          {game.category}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {game.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {game.description}
        </p>

        {/* Métadonnées */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {game.maxPlayers > 1 ? (
              <FaUsers className="text-blue-500" />
            ) : (
              <FaUser className="text-green-500" />
            )}
            <span>
              {game.minPlayers === game.maxPlayers
                ? `${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}`
                : `${game.minPlayers}-${game.maxPlayers} joueurs`}
            </span>
          </div>

          {game.difficulty && (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              game.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
              game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
              'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {game.difficulty === 'easy' ? 'Facile' : game.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
            </span>
          )}
        </div>

        {/* Tags */}
        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {game.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};
