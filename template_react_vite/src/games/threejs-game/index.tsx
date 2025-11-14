import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Application } from './utils/application';

const CheeseCollectorGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const applicationRef = useRef<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [showCheeseIndicator, setShowCheeseIndicator] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);

    return () => {
      // Cleanup au démontage du composant
      if (applicationRef.current) {
        applicationRef.current.cleanup();
        applicationRef.current = null;
      }
    };
  }, []);

  // Vérifier en continu si le joueur est proche d'un fromage
  useEffect(() => {
    if (!gameStarted || !applicationRef.current) return;

    let animationFrameId: number;

    const checkCheeseProximity = () => {
      if (applicationRef.current?.cheeseCollector) {
        const nearestCheese = applicationRef.current.cheeseCollector.checkNearestCheese();
        const wasdEnabled = applicationRef.current.cameraObj?.wasdEnabled;
        setShowCheeseIndicator(!!nearestCheese && wasdEnabled);
      }
      animationFrameId = requestAnimationFrame(checkCheeseProximity);
    };

    checkCheeseProximity();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameStarted]);

  const startGame = () => {
    if (!containerRef.current) return;

    if (applicationRef.current) {
      console.warn('Le jeu est déjà en cours');
      return;
    }

    try {
      const app = new Application(containerRef.current);
      applicationRef.current = app;

      if (app.cheeseCollector) {
        // Initialiser le maxScore
        setMaxScore(app.cheeseCollector.getMaxScore());
        setScore(0);

        // Sauvegarder les callbacks originaux
        const originalOnScoreUpdate = app.cheeseCollector.onScoreUpdate;
        const originalOnScoreComplete = app.cheeseCollector.onScoreComplete;

        // Chaîner les callbacks pour mettre à jour React ET l'UI du jeu
        app.cheeseCollector.onScoreUpdate = (newScore: number, max: number) => {
          // Appeler le callback original pour l'UI du jeu
          if (originalOnScoreUpdate) {
            originalOnScoreUpdate(newScore, max);
          }
          // Mettre à jour le state React
          setScore(newScore);
          setMaxScore(max);
        };

        app.cheeseCollector.onScoreComplete = () => {
          // Appeler le callback original
          if (originalOnScoreComplete) {
            originalOnScoreComplete();
          }
          // Mettre à jour le state React
          setLevel(prev => prev + 1);
        };
      }

      setGameStarted(true);
      console.log('Jeu démarré avec succès');
    } catch (error) {
      console.error('Erreur lors du démarrage du jeu:', error);
      if (applicationRef.current) {
        applicationRef.current.cleanup();
        applicationRef.current = null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
     {/* Contenu du jeu */}
      <div className="flex-1 relative" ref={containerRef}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-xl">Chargement du jeu...</p>
            </div>
          </div>
        )}

        {!gameStarted && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-40">
            <div className="text-center text-white max-w-2xl px-6">
              <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Cheese Collector
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Incarnez un chat affamé et collectez tous les fromages !
              </p>

              <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Comment jouer</h2>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400"></span>
                    <span><strong>ZQSD</strong> - Déplacer le chat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400"></span>
                    <span><strong>E</strong> - Collecter le fromage (quand proche)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400"></span>
                    <span><strong>Souris</strong> - Regarder autour</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400"></span>
                    <span>Collectez tous les fromages pour passer au niveau suivant !</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startGame}
                className="flex items-center gap-3 mx-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <FaPlay />
                <span>Commencer l'aventure</span>
              </button>
            </div>
          </div>
        )}

        {/* Score overlay - Affiché uniquement quand le jeu est démarré */}
        {gameStarted && (
          <div className="absolute top-4 left-4 z-30 bg-black bg-opacity-70 rounded-lg px-6 py-3 text-white">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-400">Score</span>
                <div className="text-2xl font-bold text-yellow-400">{score} / {maxScore}</div>
              </div>
              <div className="w-px h-10 bg-gray-600"></div>
              <div>
                <span className="text-sm text-gray-400">Niveau</span>
                <div className="text-2xl font-bold text-purple-400">{level}</div>
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${maxScore > 0 ? (score / maxScore) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Indicateur de fromage proche */}
        {gameStarted && showCheeseIndicator && (
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30 bg-yellow-500 bg-opacity-90 rounded-lg px-6 py-3 text-black font-bold text-lg shadow-lg animate-pulse">
            Appuyez sur E pour manger le fromage
          </div>
        )}
      </div>
    </div>
  );
};

export default CheeseCollectorGame;
