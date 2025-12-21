import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Music } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import './Level1Piano.css';

// Configuración del juego
const WIN_SCORE = 50; // Puntos necesarios para ganar (Aumentado)
const GAME_SPEED = 1.8; // Velocidad de caída (Aumentada de 1.0 a 1.8)
const SPAWN_RATE = 400; // Milisegundos entre notas (Reducido de 600 a 400)
const LANES = [0, 1, 2, 3];

const Level1Piano = () => {
  const { completeLevel } = useGame();
  
  // Estados para UI
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start'); // start, playing, gameover, won
  const [tiles, setTiles] = useState([]);
  
  // Refs para lógica del bucle (evitar closures obsoletos)
  const gameStateRef = useRef('start');
  const gameLoopRef = useRef();
  const spawnTimeoutRef = useRef();
  const audioRef = useRef(new Audio('/saturno.mp3'));

  // Limpiar timers al desmontar
  useEffect(() => {
    return () => {
      cancelAnimationFrame(gameLoopRef.current);
      clearTimeout(spawnTimeoutRef.current);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  // Función para manejar el estado globalmente
  const updateGameState = (newState) => {
    setGameState(newState);
    gameStateRef.current = newState;
  };

  // Iniciar juego
  const startGame = () => {
    updateGameState('playing');
    setScore(0);
    setTiles([]);
    
    // Intentar reproducir música
    audioRef.current.volume = 0.5;
    audioRef.current.loop = true;
    audioRef.current.play().catch(e => console.log("Audio play failed (user interaction needed first)", e));

    // Iniciar bucles
    spawnTile();
    gameLoop();
  };

  // Loop principal de animación
  const gameLoop = () => {
    if (gameStateRef.current !== 'playing') return;

    setTiles(prevTiles => {
      // Mover tiles
      const newTiles = prevTiles.map(tile => ({ ...tile, y: tile.y + GAME_SPEED }));
      
      // Verificar Game Over (si alguna nota pasa el 100%)
      const missedTile = newTiles.find(tile => tile.y > 100);
      if (missedTile) {
        handleGameOver();
        return prevTiles; // Detener actualización visual
      }

      return newTiles;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Generar nuevas notas
  const spawnTile = () => {
    if (gameStateRef.current !== 'playing') return;

    const lane = Math.floor(Math.random() * 4);
    const newTile = {
      id: Date.now() + Math.random(), // ID único
      lane: lane,
      y: -20, // Empieza arriba fuera de pantalla
      clicked: false
    };

    setTiles(prev => [...prev, newTile]);

    spawnTimeoutRef.current = setTimeout(spawnTile, SPAWN_RATE);
  };

  // Manejar click en nota
  const handleTileClick = (e, id) => {
    e.stopPropagation(); // Evitar que el click pase al carril (si implementamos penalización)
    if (gameStateRef.current !== 'playing') return;

    setTiles(prev => prev.filter(t => t.id !== id));
    
    const newScore = score + 1;
    setScore(newScore);

    if (newScore >= WIN_SCORE) {
      handleWin();
    }
  };

  const handleGameOver = () => {
    updateGameState('gameover');
    cancelAnimationFrame(gameLoopRef.current);
    clearTimeout(spawnTimeoutRef.current);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleWin = () => {
    updateGameState('won');
    cancelAnimationFrame(gameLoopRef.current);
    clearTimeout(spawnTimeoutRef.current);
    
    // Dejar la música un poco más
    setTimeout(() => {
      audioRef.current.pause();
      completeLevel(1);
    }, 2000);
  };

  return (
    <div className="piano-container">
      <div className="game-area">
        {/* Carriles */}
        {LANES.map(lane => (
          <div key={lane} className="lane" />
        ))}

        {/* Notas cayendo */}
        {tiles.map(tile => (
          <div
            key={tile.id}
            className="piano-tile"
            style={{ 
              left: `${tile.lane * 25}%`, 
              top: `${tile.y}%` 
            }}
            onMouseDown={(e) => handleTileClick(e, tile.id)}
            onTouchStart={(e) => handleTileClick(e, tile.id)}
          />
        ))}

        {/* UI Overlay */}
        <div className="ui-overlay">
          <div className="score-display">Puntuación: {score} / {WIN_SCORE}</div>
          
          {gameState === 'start' && (
            <div className="start-screen">
              <Music size={48} className="mb-4 text-pink-500" />
              <h2>Nivel 1: Ritmo de Saturno</h2>
              <p>Toca las notas negras al ritmo de la música.</p>
              <p className="text-sm text-gray-400 mt-2">(Asegúrate de poner 'saturno.mp3' en la carpeta public)</p>
              <button className="play-btn" onClick={startGame}>
                <Play fill="currentColor" /> Jugar
              </button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="game-over-screen">
              <h2>¡Se escapó una nota!</h2>
              <p>No dejes que la música pare.</p>
              <button className="retry-btn" onClick={startGame}>
                <RotateCcw /> Reintentar
              </button>
            </div>
          )}

          {gameState === 'won' && (
            <div className="win-screen">
              <h2>¡Perfecto!</h2>
              <p>Nuestra melodía suena hermosa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Level1Piano;
