export type GameCategory = 'action' | '3d' | 'puzzle' | 'arcade' | 'strategy' | 'sports';

export interface GameMetadata {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: GameCategory;
  minPlayers: number;
  maxPlayers: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface GameState {
  score: number;
  level: number;
  isPlaying: boolean;
  isPaused: boolean;
  startTime?: number;
  endTime?: number;
}

export interface GameCallbacks {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onGameOver: (score: number) => void;
  onScoreUpdate?: (score: number) => void;
}

export interface GameProps {
  onGameStateChange?: (state: GameState) => void;
  callbacks?: GameCallbacks;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  level: number;
  date: string;
  gameId: string;
}
