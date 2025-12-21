import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import './Level3LightsOut.css';

const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

const Level3LightsOut = () => {
  const { completeLevel } = useGame();
  const [grid, setGrid] = useState(Array(TOTAL_CELLS).fill(true)); // Start all ON
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize with a solvable puzzle
  useEffect(() => {
    generatePuzzle();
  }, []);

  const generatePuzzle = () => {
    let newGrid = Array(TOTAL_CELLS).fill(true);
    // Simulate random clicks to ensure solvability
    // 20-30 moves to make it "complicated" but solvable
    const moves = 20;
    
    for (let i = 0; i < moves; i++) {
      const randomIdx = Math.floor(Math.random() * TOTAL_CELLS);
      newGrid = toggleLogic(newGrid, randomIdx);
    }
    
    // Ensure it's not accidentally solved already
    if (newGrid.every(cell => cell)) {
       newGrid = toggleLogic(newGrid, Math.floor(Math.random() * TOTAL_CELLS));
    }
    
    setGrid(newGrid);
  };

  const toggleLogic = (currentGrid, index) => {
    const newGrid = [...currentGrid];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;

    // Toggle clicked cell
    newGrid[index] = !newGrid[index];

    // Neighbors
    const neighbors = [
      { r: row - 1, c: col }, // Top
      { r: row + 1, c: col }, // Bottom
      { r: row, c: col - 1 }, // Left
      { r: row, c: col + 1 }  // Right
    ];

    neighbors.forEach(({ r, c }) => {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        const neighborIdx = r * GRID_SIZE + c;
        newGrid[neighborIdx] = !newGrid[neighborIdx];
      }
    });

    return newGrid;
  };

  const handleCellClick = (index) => {
    if (isAnimating) return;
    
    const newGrid = toggleLogic(grid, index);
    setGrid(newGrid);

    // Check win condition
    if (newGrid.every(cell => cell)) {
      setIsAnimating(true);
      setTimeout(() => {
        completeLevel(3);
      }, 500);
    }
  };

  return (
    <div className="lights-out-container">
      <div className="lights-out-content">
        <h2 className="level-title">Nivel 3: Ilumina mi Corazón</h2>
        <p className="instruction">
          Haz que todos los corazones se enciendan. <br/>
          <span style={{fontSize: '0.9em', opacity: 0.8}}>Pero cuidado: al tocar uno, cambian los de al lado.</span>
        </p>

        <div className="grid-container">
          {grid.map((isOn, index) => (
            <motion.button
              key={index}
              className="heart-btn"
              onClick={() => handleCellClick(index)}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.02 }}
            >
              <Heart 
                className={`heart-icon ${isOn ? 'is-on' : 'is-off'}`} 
                fill={isOn ? "currentColor" : "none"}
              />
            </motion.button>
          ))}
        </div>

        <div className="controls">
          <button className="reset-btn" onClick={generatePuzzle}>
            <RefreshCw size={16} style={{marginRight: '8px'}} />
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Level3LightsOut;
