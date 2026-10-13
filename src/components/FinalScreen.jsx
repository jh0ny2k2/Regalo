import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Heart, Music, Calendar, MapPin, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import './FinalScreen.css';

const COLORS = ['#d6336c', '#7a1f3d', '#f6d3de', '#c49a5a', '#ffffff'];

const celebrate = () => {
  const end = Date.now() + 1600;
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS, disableForReducedMotion: true });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS, disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
};

const FinalScreen = () => {
  const { resetProgress } = useGame();
  const [stage, setStage] = useState('gift'); // gift | message | ticket

  useEffect(() => {
    celebrate();
  }, []);

  const showTicket = () => {
    setStage('ticket');
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.55 }, colors: COLORS, disableForReducedMotion: true });
  };

  return (
    <div className="final">
      <AnimatePresence mode="wait">
        {stage !== 'ticket' ? (
          <motion.div
            key="intro"
            className="final-card"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <p className="eyebrow">Todos los retos superados</p>
            <h1 className="final-title">
              ¡Lo conseguiste,
              <span>amor!</span>
            </h1>
            <p className="final-text">
              Has completado todos los desafíos, igual que completas mis días con tu alegría.
              Gracias por cada momento, cada risa y cada recuerdo. Eres mi persona favorita en el mundo.
            </p>

            <motion.button
              className="gift-box"
              onClick={() => setStage('message')}
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="gift-box-icon">
                <Gift size={56} strokeWidth={1.5} />
              </span>
              <span className="gift-box-label">Abrir regalo</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="ticket"
            className="final-ticket-wrap"
            initial={{ opacity: 0, y: 40, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          >
            <article className="ticket">
              <div className="ticket-main">
                <p className="ticket-kicker">
                  <Music size={14} /> Vale por una noche mágica
                </p>
                <h2 className="ticket-artist">Pablo Alborán</h2>
                <p className="ticket-sub">Viendo el concierto junto a mí</p>
                <dl className="ticket-details">
                  <div>
                    <dt><Calendar size={14} /> Fecha</dt>
                    <dd>26 de junio · 22:00h</dd>
                  </div>
                  <div>
                    <dt><MapPin size={14} /> Lugar</dt>
                    <dd>Plaza de Toros de Granada</dd>
                  </div>
                </dl>
              </div>
              <div className="ticket-stub">
                <Heart size={22} fill="currentColor" />
                <span className="ticket-stub-text">Admit two · Love seat</span>
                <span className="ticket-barcode" aria-hidden="true" />
              </div>
            </article>

            <button className="btn btn-ghost btn-sm final-reset" onClick={resetProgress}>
              <RotateCcw size={14} /> Volver a empezar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 'message' && (
          <motion.div
            className="final-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="final-modal-card"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              role="dialog"
              aria-modal="true"
            >
              <Heart className="final-modal-heart" size={44} fill="currentColor" />
              <p className="final-modal-text">Te quiero para toda mi vida…</p>
              <p className="final-modal-script">y esto solo es el inicio</p>
              <button className="btn btn-primary" onClick={showTicket} autoFocus>
                Ver sorpresa
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalScreen;
