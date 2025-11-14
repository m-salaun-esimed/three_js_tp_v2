import { lazy } from 'react';
import type { GameMetadata } from '@/types/game';

export const gamesRegistry: Record<string, GameMetadata> = {
  'cheese-collector': {
    id: 'cheese-collector',
    name: 'Cheese Collector basé sur le tp',
    description: 'Incarnez un chat affamé et collectez tous les fromages dans un monde 3D immersif ! Explorez, courez et devenez le champion du fromage.',
    thumbnail: '/cat_game.png',
    category: '3d',
    minPlayers: 1,
    maxPlayers: 1,
    difficulty: 'easy',
    tags: ['3D', 'Collection', 'Chat', 'Three.js'],
  },
  'gravity-puzzle': {
    id: 'gravity-puzzle',
    name: 'Gravity Puzzle',
    description: 'Manipulez la gravité pour guider la bille jusqu\'à la sortie ! Un puzzle 3D unique où vous contrôlez le monde, pas le personnage.',
    thumbnail: '/gravity-puzzle.svg',
    category: 'puzzle',
    minPlayers: 1,
    maxPlayers: 1,
    difficulty: 'medium',
    tags: ['3D', 'Puzzle', 'Physique', 'Three.js'],
  },
};

export const gameComponents = {
  'cheese-collector': lazy(() => import('./threejs-game')),
  'gravity-puzzle': lazy(() => import('./gravity-puzzle')),
};

export const getAllGames = (): GameMetadata[] => {
  return Object.values(gamesRegistry);
};

export const getGameById = (id: string): GameMetadata | undefined => {
  return gamesRegistry[id];
};

export const getGamesByCategory = (category: string): GameMetadata[] => {
  return getAllGames().filter(game => game.category === category);
};
