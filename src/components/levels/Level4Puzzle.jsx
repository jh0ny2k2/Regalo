import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import './Level4Puzzle.css';

// IMAGEN DEL PUZZLE
const IMAGE_URL = "/orden.jpeg";

const Level4Puzzle = () => {
  const { completeLevel } = useGame();
  const [tiles, setTiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Crear tiles 0-8 y mezclar
    const shuffled = [...Array(9).keys()].sort(() => Math.random() - 0.5);
    setTiles(shuffled);
  }, []);

  const handleTileClick = (index) => {
    if (isComplete) return;

    if (selected === null) {
      setSelected(index);
    } else if (selected === index) {
      setSelected(null);
    } else {
      // Swap logic
      const newTiles = [...tiles];
      const temp = newTiles[selected];
      newTiles[selected] = newTiles[index];
      newTiles[index] = temp;
      
      setTiles(newTiles);
      setSelected(null);
      checkCompletion(newTiles);
    }
  };

  const checkCompletion = (currentTiles) => {
    const isSorted = currentTiles.every((val, index) => val === index);
    if (isSorted) {
      setIsComplete(true);
      setTimeout(() => completeLevel(4), 1500);
    }
  };

  return (
    <div className="puzzle-container">
      <motion.div 
        className="puzzle-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="level-title">Nivel 4: Nuestra Imagen</h2>
        <p className="instruction">Toca dos piezas para intercambiarlas y formar la foto</p>

        <div className="puzzle-grid">
          {tiles.map((tileNumber, index) => (
            <div
              key={tileNumber}
              className={`puzzle-piece-wrapper ${selected === index ? 'selected' : ''}`}
              onClick={() => handleTileClick(index)}
            >
              <div 
                className={`puzzle-piece ${isComplete ? 'complete' : ''}`}
                style={{
                  backgroundImage: `url(${IMAGE_URL})`,
                  backgroundPosition: `${(tileNumber % 3) * 50}% ${Math.floor(tileNumber / 3) * 50}%`,
                  backgroundSize: '300% 300%'
                }}
              />
            </div>
          ))}
        </div>
        
        {isComplete && <p className="success-msg">¡Perfecto!</p>}
      </motion.div>
    </div>
  );
};

export default Level4Puzzle;
