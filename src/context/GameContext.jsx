import React, { createContext, useState, useContext } from 'react';

export const TOTAL_LEVELS = 6;

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // 0 = Welcome Screen
  // 1-6 = Game Levels
  // 7 = Final Gift Screen
  // Progreso guardado: si ya había empezado, retoma donde lo dejó
  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    try {
      return parseInt(localStorage.getItem('anniversary_game_progress'), 10) || 1;
    } catch {
      return 1;
    }
  });
  const [currentLevel, setCurrentLevel] = useState(() =>
    unlockedLevels > 1 && unlockedLevels <= TOTAL_LEVELS ? unlockedLevels : 0
  );

  const completeLevel = (level) => {
    const nextLevel = level + 1;
    if (nextLevel > unlockedLevels) {
      setUnlockedLevels(nextLevel);
      localStorage.setItem('anniversary_game_progress', nextLevel);
    }
    setCurrentLevel(nextLevel);
  };

  const goToLevel = (level, force = false) => {
    if (force || level <= unlockedLevels || level === 0) {
      setCurrentLevel(level);
    }
  };

  const resetProgress = () => {
    localStorage.removeItem('anniversary_game_progress');
    setUnlockedLevels(1);
    setCurrentLevel(0);
    window.location.reload(); // Forzar recarga para reiniciar completamente la app
  };

  return (
    <GameContext.Provider value={{ 
      currentLevel, 
      unlockedLevels, 
      completeLevel, 
      goToLevel, 
      resetProgress 
    }}>
      {children}
    </GameContext.Provider>
  );
};
