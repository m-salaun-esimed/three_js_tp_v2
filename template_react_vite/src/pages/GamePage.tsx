import { FC, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { getGameById, gameComponents } from '@/games/registry';

const GamePage: FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  if (!gameId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Jeu non trouvé</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          > 
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const game = getGameById(gameId);
  const GameComponent = gameComponents[gameId];

  if (!game || !GameComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Jeu non disponible</h1>
          <p className="mb-6 text-gray-400">
            Le jeu "{gameId}" n'existe pas ou n'est pas encore disponible.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Barre de navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <FaArrowLeft />
          <span>Retour au hub</span>
        </button>
      </div>

      <div className="flex-1 p-6">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-xl">Chargement de {game.name}...</p>
              </div>
            </div>
          }
        >
          <GameComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default GamePage;
