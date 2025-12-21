import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import './Level6Differences.css';

const Level6Differences = () => {
  const { completeLevel } = useGame();
  const [found, setFound] = useState([]);
  const [showHint, setShowHint] = useState(false);
  
  // Coordenadas estimadas basadas en la imagen proporcionada
  const differences = [
    { id: 1, x: 48, y: 20, radius: 8, hint: "Mira arriba en la pared blanca" },
    { id: 2, x: 58, y: 39, radius: 8, hint: "Al fondo, cerca de los tejados" },
    { id: 3, x: 36, y: 52, radius: 8, hint: "Cerca del cuello de ella" },
    { id: 4, x: 50, y: 48, radius: 8, hint: "Por el cuello de la camisa de él" },
    { id: 5, x: 48, y: 57, radius: 8, hint: "En la chaqueta del traje" },
  ];

  const imageRef = useRef(null);

  const handleImageClick = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Para depuración: descomenta esto para ver las coordenadas al hacer click
    console.log(`Click en: x=${x.toFixed(1)}%, y=${y.toFixed(1)}%`);

    const clickedDiff = differences.find(diff => {
      if (found.includes(diff.id)) return false;
      const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
      return distance <= diff.radius;
    });

    if (clickedDiff) {
      const newFound = [...found, clickedDiff.id];
      setFound(newFound);
      
      if (newFound.length === differences.length) {
        setTimeout(() => completeLevel(6), 1500);
      }
    }
  };

  return (
    <div className="differences-container">
      <h2 className="level-title">Nivel 6: Encuentra las Diferencias</h2>
      <p className="instruction">
        Encuentra {differences.length} diferencias en la foto de abajo.
        <br />
        <span className="counter">Encontradas: {found.length} / {differences.length}</span>
      </p>

      <div className="images-wrapper">
        <div className="image-box original">
          <span className="label">Original</span>
          <img src="/foto.jpeg" alt="Original" />
        </div>

        <div className="image-box modified" onClick={handleImageClick}>
          <span className="label">Con Cambios (Toca aquí)</span>
          <div className="img-relative" ref={imageRef}>
            <img src="/foto con cambios.jpg" alt="Modificada" />
            
            {/* Marcadores de diferencias encontradas */}
            {found.map(id => {
              const diff = differences.find(d => d.id === id);
              return (
                <motion.div
                  key={id}
                  className="diff-marker"
                  style={{ left: `${diff.x}%`, top: `${diff.y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <button className="hint-btn" onClick={() => setShowHint(!showHint)}>
        {showHint ? "Ocultar Pistas" : "Necesito una pista"}
      </button>

      {showHint && (
        <div className="hints-panel">
          {differences.map(diff => (
            !found.includes(diff.id) && <p key={diff.id}>💡 {diff.hint}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Level6Differences;
