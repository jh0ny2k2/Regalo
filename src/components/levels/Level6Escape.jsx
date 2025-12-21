import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import './Level6Escape.css';

// Código final: 1221 (Diciembre 21)
const FINAL_CODE = "1221";

const Level6Escape = () => {
  const { completeLevel } = useGame();
  const [modalContent, setModalContent] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);

  // Objetos clicables en la habitación
  // Posiciones en porcentaje (top, left)
  const clues = [
    {
      id: 1,
      top: '20%',
      left: '30%',
      icon: '🖼️',
      content: "Un cuadro en la pared... Tiene escrito un número pequeño en la esquina: '12'"
    },
    {
      id: 2,
      top: '60%',
      left: '70%',
      icon: '📚',
      content: "Un libro de poemas. La página 21 está marcada con un pétalo de rosa."
    },
    {
      id: 3,
      top: '40%',
      left: '10%',
      icon: '🧸',
      content: "Tu peluche favorito. Parece que no tiene nada, solo es muy suave."
    }
  ];

  const handleObjectClick = (clue) => {
    setModalContent(clue.content);
  };

  const handleKeypadSubmit = () => {
    if (inputCode === FINAL_CODE) {
      completeLevel(6);
    } else {
      alert("Código incorrecto");
      setInputCode("");
    }
  };

  return (
    <div className="escape-container">
      <h2 className="level-title-overlay">Nivel 6: La Habitación Secreta</h2>
      <p className="instruction-overlay">Busca pistas y encuentra el código</p>

      <div className="room-bg">
        {/* Objetos clicables */}
        {clues.map((clue) => (
          <motion.button
            key={clue.id}
            className="clue-object"
            style={{ top: clue.top, left: clue.left }}
            whileHover={{ scale: 1.2 }}
            onClick={() => handleObjectClick(clue)}
          >
            {clue.icon}
          </motion.button>
        ))}

        {/* Caja fuerte / Keypad */}
        <motion.button
          className="safe-object"
          style={{ top: '70%', left: '40%' }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowKeypad(true)}
        >
          🔒 Caja Fuerte
        </motion.button>
      </div>

      {/* Modal de Pistas */}
      <AnimatePresence>
        {modalContent && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalContent(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setModalContent(null)}>
                <X />
              </button>
              <p>{modalContent}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Keypad */}
      <AnimatePresence>
        {showKeypad && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowKeypad(false)}
          >
            <motion.div 
              className="keypad-modal"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setShowKeypad(false)}>
                <X />
              </button>
              <h3>Introduce el Código</h3>
              <div className="keypad-display">{inputCode || "----"}</div>
              <div className="keypad-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((key) => (
                  <button
                    key={key}
                    className="key-btn"
                    onClick={() => {
                      if (key === 'C') setInputCode("");
                      else if (key === 'OK') handleKeypadSubmit();
                      else if (inputCode.length < 4) setInputCode(prev => prev + key);
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Level6Escape;
