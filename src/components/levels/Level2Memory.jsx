import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Sun, Moon, Cloud, Music, Camera, Gift, RefreshCw, Home } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import './Level2Memory.css';

// Configuración de cartas
const cardIcons = [Heart, Star, Sun, Moon, Cloud, Music, Camera, Gift];

const Level2Memory = () => {
  const { completeLevel, goToLevel } = useGame();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Duplicar y mezclar
    const shuffled = [...cardIcons, ...cardIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false }));
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
  };

  useEffect(() => {
    if (cards.length > 0 && solved.length === cards.length) {
      const timer = setTimeout(() => completeLevel(2), 1000);
      return () => clearTimeout(timer);
    }
  }, [solved, cards, completeLevel]);

  const handleClick = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return;

    if (flipped.length === 0) {
      setFlipped([id]);
    } else {
      setFlipped([flipped[0], id]);
      setDisabled(true);
      checkForMatch(id);
    }
  };

  const checkForMatch = (secondId) => {
    const [firstId] = flipped;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard.icon === secondCard.icon) {
      setSolved(prev => [...prev, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  return (
    <div className="memory-container">
      <motion.div 
        className="memory-board"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="level-title">Nivel 2: Encuentra las Parejas</h2>
        <p className="instruction">Une los símbolos que nos representan</p>
        
        <div className="controls">
          <button className="icon-btn" onClick={() => goToLevel(0)} title="Volver al Inicio">
            <Home size={20} />
          </button>
          <button className="icon-btn" onClick={initializeGame} title="Reiniciar nivel">
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="grid-container">
          {cards.map((card) => {
            const Icon = card.icon;
            const isFlipped = flipped.includes(card.id) || solved.includes(card.id);
            
            return (
              <motion.div
                key={card.id}
                className={`card ${isFlipped ? 'flipped' : ''} ${solved.includes(card.id) ? 'solved' : ''}`}
                onClick={() => handleClick(card.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="card-inner">
                  <div className="card-front">?</div>
                  <div className="card-back">
                    <Icon size={24} color="#e11d48" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Level2Memory;
