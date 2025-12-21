import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Gift, Heart, Music, Calendar, MapPin } from 'lucide-react';
import { useGame } from '../context/GameContext';
import './FinalScreen.css';

const FinalScreen = () => {
  const { resetProgress } = useGame();
  const [showGift, setShowGift] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Disparar confeti inicial
    triggerConfetti();
    
    // Intervalo de fuegos artificiales
    const interval = setInterval(() => {
      triggerConfetti();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    // zIndex bajo para no bloquear botones
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: -1 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, 
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <div className="final-container">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="congrats-card"
      >
        <h1 className="final-title">¡Felicidades, Amor!</h1>
        <p className="final-message">
          Has completado todos los desafíos, tal como completas mis días con tu alegría.
          Gracias por cada momento, cada risa y cada recuerdo.
          <br /><br />
          Eres mi persona favorita en el mundo.
        </p>

        {!showGift ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="gift-button"
            onClick={() => setShowMessage(true)}
          >
            <Gift size={64} className="gift-icon" />
            <span>ABRIR REGALO</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="gift-reveal"
          >
            <div className="concert-ticket">
              <div className="ticket-header">
                <Music size={24} className="ticket-icon" />
                <h2>VALE POR UNA NOCHE MÁGICA</h2>
                <Music size={24} className="ticket-icon" />
              </div>
              
              <div className="ticket-body">
                <h3 className="artist-name">Pablo Alborán</h3>
                <p className="ticket-subtext">Viendo el concierto junto a mí ❤️</p>
                
                <div className="ticket-details">
                  <div className="detail-row">
                    <Calendar size={20} />
                    <span>26 de Junio - 22:00h</span>
                  </div>
                  <div className="detail-row">
                    <MapPin size={20} />
                    <span>Plaza de Toros de Granada</span>
                  </div>
                </div>
              </div>
              
              <div className="ticket-footer">
                <div className="barcode">||| || ||| || |||| |||</div>
                <span className="ticket-id">ADMIT ONE - LOVE SEAT</span>
              </div>
            </div>
            
            <button className="reset-btn" onClick={resetProgress}>
              Volver al inicio
            </button>
          </motion.div>
        )}
      </motion.div>

      {showMessage && (
        <div className="message-modal-overlay">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="message-modal-content"
          >
            <Heart size={50} color="#e11d48" fill="#e11d48" className="modal-heart" />
            <p className="special-message">
              Te quiero para toda mi vida...
              <br />
              <span className="small-text">Y esto solo es el inicio ❤️</span>
            </p>
            <button 
              className="continue-btn"
              onClick={() => {
                setShowMessage(false);
                setShowGift(true);
              }}
            >
              Ver Sorpresa
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FinalScreen;
