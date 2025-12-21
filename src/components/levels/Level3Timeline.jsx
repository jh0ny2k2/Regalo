import React, { useState } from 'react';
import { Reorder, motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import './Level3Timeline.css';

const initialEvents = [
  { id: 'trip', text: "Nuestro primer viaje juntos" },
  { id: 'meet', text: "El día que nos conocimos" },
  { id: 'kiss', text: "Nuestro primer beso" },
  { id: 'now', text: "Este momento especial" },
];

// El orden correcto de los IDs
const correctOrder = ['meet', 'kiss', 'trip', 'now'];

const Level3Timeline = () => {
  const { completeLevel } = useGame();
  const [items, setItems] = useState(initialEvents);
  const [error, setError] = useState(false);

  const checkOrder = () => {
    const currentOrderIds = items.map(item => item.id);
    const isCorrect = JSON.stringify(currentOrderIds) === JSON.stringify(correctOrder);

    if (isCorrect) {
      completeLevel(3);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="timeline-container">
      <div className="timeline-content">
        <h2 className="level-title">Nivel 3: Nuestra Historia</h2>
        <p className="instruction">Ordena los eventos cronológicamente (arrastra y suelta)</p>

        <Reorder.Group axis="y" values={items} onReorder={setItems} className="reorder-list">
          {items.map((item) => (
            <Reorder.Item key={item.id} value={item} className="reorder-item">
              <span>{item.text}</span>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {error && <p className="error-msg">Hmm... algo no cuadra en la historia.</p>}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="check-btn"
          onClick={checkOrder}
        >
          Verificar Orden
        </motion.button>
      </div>
    </div>
  );
};

export default Level3Timeline;
