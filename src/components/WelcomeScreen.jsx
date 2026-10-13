import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Layers, Type, Hand, Puzzle, KeyRound, ScanSearch } from 'lucide-react';
import { useGame, TOTAL_LEVELS } from '../context/GameContext';
import './WelcomeScreen.css';

const LEVEL_ICONS = [Layers, Type, Hand, Puzzle, KeyRound, ScanSearch];

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
});

const WelcomeScreen = () => {
  const { goToLevel, unlockedLevels } = useGame();
  const hasProgress = unlockedLevels > 1;
  const nextLevel = Math.min(unlockedLevels, TOTAL_LEVELS + 1);

  return (
    <div className="welcome">
      <div className="welcome-card">
        <motion.div
          className="welcome-heart"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        >
          <Heart size={40} fill="currentColor" strokeWidth={1.5} />
        </motion.div>

        <motion.p className="eyebrow" {...fadeUp(0.2)}>Un regalo hecho para ti</motion.p>

        <motion.h1 className="welcome-title" {...fadeUp(0.3)}>
          Feliz aniversario,
          <span>mi amor</span>
        </motion.h1>

        <motion.p className="welcome-text" {...fadeUp(0.45)}>
          He preparado un pequeño viaje por nuestra historia. {TOTAL_LEVELS} retos te separan
          de tu sorpresa. ¿Lista para descubrirla?
        </motion.p>

        <motion.ol className="welcome-steps" {...fadeUp(0.6)} aria-label="Niveles">
          {LEVEL_ICONS.map((Icon, i) => {
            const n = i + 1;
            const state = n < unlockedLevels ? 'done' : n === unlockedLevels ? 'current' : '';
            return (
              <li key={n} className={state}>
                <Icon size={16} />
              </li>
            );
          })}
        </motion.ol>

        <motion.button
          className="btn btn-primary welcome-cta"
          onClick={() => goToLevel(nextLevel)}
          {...fadeUp(0.75)}
        >
          {hasProgress ? 'Continuar la aventura' : 'Empezar'}
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
