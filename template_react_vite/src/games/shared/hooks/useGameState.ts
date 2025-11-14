import { useState, useCallback } from 'react';
import type { GameState } from '@/types/game';

export const useGameState = (initialState?: Partial<GameState>) => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    isPlaying: false,
    isPaused: false,
    ...initialState,
  });

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      startTime: Date.now(),
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  const endGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      endTime: Date.now(),
    }));
  }, []);

  const updateScore = useCallback((score: number) => {
    setGameState(prev => ({
      ...prev,
      score,
    }));
  }, []);

  const incrementScore = useCallback((amount: number = 1) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + amount,
    }));
  }, []);

  const updateLevel = useCallback((level: number) => {
    setGameState(prev => ({
      ...prev,
      level,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      level: 1,
      isPlaying: false,
      isPaused: false,
    });
  }, []);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    updateScore,
    incrementScore,
    updateLevel,
    resetGame,
  };
};
