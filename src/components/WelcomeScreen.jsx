import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useGame } from '../context/GameContext';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
  const { goToLevel, unlockedLevels } = useGame();

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="heart-wrapper"
        >
          <Heart size={100} color="#e11d48" fill="#e11d48" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="title"
        >
          Feliz Aniversario, Mi Amor
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="description"
        >
          He preparado algo muy especial para ti. Un pequeño viaje por nuestra historia juntos.
          <br />
          ¿Estás lista para descubrir tu regalo?
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.9 }}
          onClick={() => goToLevel(unlockedLevels > 1 ? unlockedLevels : 1)}
          className="start-button"
        >
          {unlockedLevels > 1 ? 'Continuar' : 'Comenzar Aventura'}
        </motion.button>
      </div>

      
      
    </div>
  );
};

export default WelcomeScreen;
