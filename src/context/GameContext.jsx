import React, { createContext, useState, useEffect, useContext } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // 0 = Welcome Screen
  // 1-6 = Game Levels
  // 7 = Final Gift Screen
  const [currentLevel, setCurrentLevel] = useState(0); 
  const [unlockedLevels, setUnlockedLevels] = useState(1); // Max level unlocked (starts at 1)

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('anniversary_game_progress');
    if (savedLevel) {
      const level = parseInt(savedLevel, 10);
      setUnlockedLevels(level);
      // Optional: Start at the latest unlocked level or Welcome screen?
      // Let's start at Welcome screen so she sees the intro again, but can jump.
      // Or maybe jump to where she left off if it's > 1.
      if (level > 1 && level < 7) {
        setCurrentLevel(level);
      }
    }
  }, []);

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
