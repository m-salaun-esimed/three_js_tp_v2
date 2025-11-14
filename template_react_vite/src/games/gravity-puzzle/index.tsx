import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaRedo, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GravityGame } from './utils/GravityGame.ts';

const GravityPuzzle = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GravityGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsLoading(false);

    return () => {
      if (gameRef.current) {
        gameRef.current.cleanup();
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || isComplete) return;

    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, isComplete]);

  const startGame = () => {
    if (!containerRef.current) return;

    if (gameRef.current) {
      console.warn('Le jeu est déjà en cours');
      return;
    }

    try {
      const game = new GravityGame(containerRef.current);
      gameRef.current = game;

      game.onMoveCountUpdate = (count: number) => {
        setMoves(count);
      };

      game.onLevelComplete = () => {
        setIsComplete(true);
      };

      game.onNextLevel = () => {
        setLevel(prev => prev + 1);
        setMoves(0);
        setTime(0);
        setIsComplete(false);
      };

      setGameStarted(true);
      console.log('Gravity Puzzle démarré avec succès');
    } catch (error) {
      console.error('Erreur lors du démarrage du jeu:', error);
      if (gameRef.current) {
        gameRef.current.cleanup();
        gameRef.current = null;
      }
    }
  };

  const restartLevel = () => {
    if (gameRef.current) {
      gameRef.current.restartLevel();
      setMoves(0);
      setTime(0);
      setIsComplete(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      <div className="flex-1 relative" ref={containerRef}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-xl">Chargement du jeu...</p>
            </div>
          </div>
        )}

        {!gameStarted && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-40">
            <div className="text-center text-white max-w-2xl px-6">
              <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Gravity Puzzle
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Manipulez la gravité pour guider la bille jusqu'à la sortie !
              </p>

              <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">Comment jouer</h2>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400"></span>
                    <span><strong>Flèche Haut / Z</strong> - Gravité vers le haut</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400"></span>
                    <span><strong>Flèche Bas / S</strong> - Gravité vers le bas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400"></span>
                    <span><strong>Flèche Gauche / Q</strong> - Gravité vers la gauche</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400"></span>
                    <span><strong>Flèche Droite / D</strong> - Gravité vers la droite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400"></span>
                    <span><strong>R</strong> - Recommencer le niveau</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startGame}
                className="flex items-center gap-3 mx-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <FaPlay />
                <span>Commencer le défi</span>
              </button>
            </div>
          </div>
        )}

        {/* Game HUD */}
        {gameStarted && (
          <div className="absolute top-4 left-4 z-30 space-y-2">
            {/* Stats */}
            <div className="bg-black bg-opacity-70 rounded-lg px-6 py-3 text-white">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm text-gray-400">Niveau</span>
                  <div className="text-2xl font-bold text-cyan-400">{level}</div>
                </div>
                <div className="w-px h-10 bg-gray-600"></div>
                <div>
                  <span className="text-sm text-gray-400">Mouvements</span>
                  <div className="text-2xl font-bold text-purple-400">{moves}</div>
                </div>
                <div className="w-px h-10 bg-gray-600"></div>
                <div>
                  <span className="text-sm text-gray-400">Temps</span>
                  <div className="text-2xl font-bold text-yellow-400">{formatTime(time)}</div>
                </div>
              </div>
            </div>

            {/* Restart button */}
            <button
              onClick={restartLevel}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FaRedo />
              <span>Recommencer (R)</span>
            </button>

            {/* Editor button */}
            <button
              onClick={() => navigate('/editor/gravity-puzzle')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <FaEdit />
              <span>Éditeur de Niveau</span>
            </button>
          </div>
        )}

        {/* Level complete overlay */}
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="text-center text-white bg-gray-800 rounded-lg p-8 max-w-md">
              <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Niveau Réussi !
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-xl">
                  <span className="text-gray-400">Mouvements:</span>{' '}
                  <span className="text-cyan-400 font-bold">{moves}</span>
                </p>
                <p className="text-xl">
                  <span className="text-gray-400">Temps:</span>{' '}
                  <span className="text-yellow-400 font-bold">{formatTime(time)}</span>
                </p>
              </div>
              <button
                onClick={() => gameRef.current?.nextLevel()}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Niveau Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GravityPuzzle;
