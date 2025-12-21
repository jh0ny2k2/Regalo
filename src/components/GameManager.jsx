import React from 'react';
import { Home } from 'lucide-react';
import { useGame } from '../context/GameContext';
import WelcomeScreen from './WelcomeScreen';
import Level1Piano from './levels/Level1Piano';
import Level2Wordle from './levels/Level2Wordle';
import Level3LightsOut from './levels/Level3LightsOut';
import Level4Puzzle from './levels/Level4Puzzle';
import Level5Cipher from './levels/Level5Cipher';
import Level6Differences from './levels/Level6Differences';
import FinalScreen from './FinalScreen';
import './GameManager.css';

const GameManager = () => {
  const { currentLevel, goToLevel } = useGame();

  const renderLevel = () => {
    switch (currentLevel) {
      case 0: return <WelcomeScreen />;
      case 1: return <Level1Piano />;
      case 2: return <Level2Wordle />;
      case 3: return <Level3LightsOut />;
      case 4: return <Level4Puzzle />;
      case 5: return <Level5Cipher />;
      case 6: return <Level6Differences />;
      case 7: return <FinalScreen />;
      default: return <WelcomeScreen />;
    }
  };

  return (
    <div className="game-wrapper">
      {currentLevel > 0 && (
        <button 
          className="home-button" 
          onClick={() => goToLevel(0)}
          title="Volver al Inicio"
        >
          <Home size={20} />
        </button>
      )}
      {renderLevel()}
    </div>
  );
};

export default GameManager;
