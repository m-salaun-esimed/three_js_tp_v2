import { useState, useCallback, useEffect } from 'react';

interface UseGameScoreOptions {
  gameId: string;
  autoSave?: boolean;
}

export const useGameScore = ({ gameId, autoSave = true }: UseGameScoreOptions) => {
  const [highScore, setHighScore] = useState<number>(0);

  // Charger le meilleur score depuis localStorage au montage
  useEffect(() => {
    const savedHighScore = localStorage.getItem(`highscore_${gameId}`);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, [gameId]);

  // Sauvegarder le score
  const saveScore = useCallback((score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(`highscore_${gameId}`, score.toString());
      return true; // Nouveau record
    }
    return false;
  }, [gameId, highScore]);

  // Sauvegarder automatiquement si autoSave est activé
  const updateScore = useCallback((score: number) => {
    if (autoSave) {
      return saveScore(score);
    }
    return false;
  }, [autoSave, saveScore]);

  // Réinitialiser le meilleur score
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
