import React from 'react';
import { GameProvider } from './context/GameContext';
import GameManager from './components/GameManager';
import './App.css';

// Corazones flotando de fondo (posiciones fijas para que no cambien en cada render)
const FLOATING_HEARTS = [
  { left: 6, size: 14, delay: 0, duration: 18 },
  { left: 18, size: 22, delay: 6, duration: 22 },
  { left: 31, size: 12, delay: 11, duration: 16 },
  { left: 47, size: 18, delay: 3, duration: 24 },
  { left: 62, size: 13, delay: 9, duration: 19 },
  { left: 74, size: 24, delay: 14, duration: 26 },
  { left: 86, size: 15, delay: 5, duration: 20 },
  { left: 94, size: 11, delay: 12, duration: 17 },
];

function App() {
  return (
    <GameProvider>
      <div className="bg-hearts" aria-hidden="true">
        {FLOATING_HEARTS.map((h, i) => (
          <span
            key={i}
            style={{
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
              animationDelay: `-${h.delay}s`,
              animationDuration: `${h.duration}s`,
            }}
          />
        ))}
      </div>
      <div className="app-container">
        <GameManager />
      </div>
    </GameProvider>
  );
}

export default App;
