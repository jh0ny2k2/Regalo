import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, House } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame, TOTAL_LEVELS } from '../context/GameContext';
import './LevelLayout.css';

// Estructura común de todos los niveles: barra de progreso, cabecera,
// tarjeta con el juego y la celebración al superarlo.
const LevelLayout = ({ level, title, subtitle, children, won, winTitle, winText, wide = false }) => {
  const { completeLevel, goToLevel } = useGame();

  useEffect(() => {
    if (!won) return;
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#d6336c', '#7a1f3d', '#f6d3de', '#c49a5a'],
      disableForReducedMotion: true,
    });
  }, [won]);

  const isLast = level === TOTAL_LEVELS;

  return (
    <div className="level-page">
      <header className="level-topbar">
        <button className="icon-btn" onClick={() => goToLevel(0)} aria-label="Volver al inicio">
          <House size={18} />
        </button>
        <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL_LEVELS} aria-valuenow={level}>
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
            const n = i + 1;
            const state = n < level ? 'done' : n === level ? 'current' : '';
            return <span key={n} className={`progress-step ${state}`} />;
          })}
        </div>
        <span className="level-count">
          {level}<span>/{TOTAL_LEVELS}</span>
        </span>
      </header>

      <main className={`level-card ${wide ? 'is-wide' : ''}`}>
        <div className="level-header">
          <p className="eyebrow">Nivel {level}</p>
          <h1 className="level-title">{title}</h1>
          {subtitle && <p className="level-subtitle">{subtitle}</p>}
        </div>
        <div className="level-body">{children}</div>
      </main>

      <AnimatePresence>
        {won && (
          <motion.div
            className="win-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="win-card"
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 20 }}
              role="dialog"
              aria-modal="true"
            >
              <div className="win-icon">
                <Heart size={30} fill="currentColor" />
              </div>
              <h2>{winTitle}</h2>
              {winText && <p>{winText}</p>}
              <button className="btn btn-primary" onClick={() => completeLevel(level)} autoFocus>
                {isLast ? 'Abrir mi regalo' : 'Siguiente nivel'}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LevelLayout;
