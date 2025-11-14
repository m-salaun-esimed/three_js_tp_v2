import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

export const GameControls = ({
  isPlaying,
  isPaused,
  onStart,
  onPause,
  onResume,
  onRestart,
}: GameControlsProps) => {
  return (
    <div className="flex gap-3 items-center">
      {!isPlaying ? (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <FaPlay />
          <span>Commencer</span>
        </button>
      ) : isPaused ? (
        <button
          onClick={onResume}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <FaPlay />
          <span>Reprendre</span>
        </button>
      ) : (
        <button
          onClick={onPause}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
        >
          <FaPause />
          <span>Pause</span>
        </button>
      )}

      <button
        onClick={onRestart}
        className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        <FaRedo />
        <span>Recommencer</span>
      </button>
    </div>
  );
};
