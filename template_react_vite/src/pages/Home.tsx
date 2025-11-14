import { FC, useState } from "react";
import Sidebar from "../components/SideBar";
import { GameGrid } from "@/features/game-library/GameGrid";
import { GameFilters } from "@/features/game-library/GameFilters";
import { getAllGames, getGamesByCategory } from "@/games/registry";
import type { GameCategory } from "@/types/game";

const Home: FC = () => {
  const [filteredGames, setFilteredGames] = useState(getAllGames());

  const handleFilterChange = (category: GameCategory | 'all') => {
    if (category === 'all') {
      setFilteredGames(getAllGames());
    } else {
      setFilteredGames(getGamesByCategory(category));
    }
  };

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:p-6 sm:ml-64 min-h-screen transition-all duration-300 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Hub de Jeux
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Découvrez et jouez à nos jeux incroyables
            </p>
          </div>

          {/* Filtres */}
          <GameFilters onFilterChange={handleFilterChange} />

          {/* Grille de jeux */}
          <GameGrid games={filteredGames} />
        </div>
      </div>
    </>
  );
};

export default Home;