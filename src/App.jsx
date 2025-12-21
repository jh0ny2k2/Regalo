import React from 'react';
import { GameProvider } from './context/GameContext';
import GameManager from './components/GameManager';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <GameManager />
      </div>
    </GameProvider>
  );
}

export default App;
