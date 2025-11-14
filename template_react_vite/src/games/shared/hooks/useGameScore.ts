import { useState, useCallback, useEffect } from 'react';

interface UseGameScoreOptions {
  gameId: string;
  autoSave?: boolean;
}

export const useGameScore = ({ gameId, autoSave = true }: UseGameScoreOptions) => {
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const savedHighScore = localStorage.getItem(`highscore_${gameId}`);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, [gameId]);

  const saveScore = useCallback((score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(`highscore_${gameId}`, score.toString());
      return true;
    }
    return false;
  }, [gameId, highScore]);

  const updateScore = useCallback((score: number) => {
    if (autoSave) {
      return saveScore(score);
    }
    return false;
  }, [autoSave, saveScore]);

  const resetHighScore = useCallback(() => {
    setHighScore(0);
    localStorage.removeItem(`highscore_${gameId}`);
  }, [gameId]);

  return {
    highScore,
    saveScore,
    updateScore,
    resetHighScore,
  };
};
