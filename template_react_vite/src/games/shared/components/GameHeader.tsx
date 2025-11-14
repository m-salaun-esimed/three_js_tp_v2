import { FaTrophy, FaHeart, FaClock } from 'react-icons/fa';

interface GameHeaderProps {
  score: number;
  level: number;
  lives?: number;
  time?: number;
  showLives?: boolean;
  showTime?: boolean;
}

export const GameHeader = ({
  score,
  level,
  lives,
  time,
  showLives = false,
  showTime = false,
}: GameHeaderProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <FaTrophy className="text-yellow-500" />
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Score: <span className="text-blue-600 dark:text-blue-400">{score}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Niveau: <span className="text-purple-600 dark:text-purple-400">{level}</span>
          </span>
        </div>

        {showLives && lives !== undefined && (
          <div className="flex items-center gap-2">
            <FaHeart className="text-red-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              <span className="text-red-600 dark:text-red-400">{lives}</span>
            </span>
          </div>
        )}

        {showTime && time !== undefined && (
          <div className="flex items-center gap-2">
            <FaClock className="text-green-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              <span className="text-green-600 dark:text-green-400">{formatTime(time)}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
