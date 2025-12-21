import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Key } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import './Level5Cipher.css';

const SECRET_ANSWER = "ERES MI TODO";
const ENCRYPTED_MSG = "FSFT NJ UPEP"; // Shift +1

const Level5Cipher = () => {
  const { completeLevel } = useGame();
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toUpperCase().trim() === SECRET_ANSWER) {
      completeLevel(5);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="cipher-container">
      <motion.div 
        className="cipher-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="icon-container">
          <Lock size={48} color="#db2777" />
        </div>
        
        <h2 className="level-title">Nivel 5: El Mensaje Secreto</h2>
        <p className="instruction">Descifra la frase oculta para avanzar.</p>
        
        <div className="cipher-box">
          <p className="code-text">{ENCRYPTED_MSG}</p>
        </div>

        <div className="hint-box">
          <Key size={16} />
          <span>Pista: A = B (Cada letra se mueve un paso)</span>
        </div>

        <form onSubmit={handleSubmit} className="cipher-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe la respuesta..."
            className={`cipher-input ${error ? 'error' : ''}`}
          />
          <button type="submit" className="submit-btn">
            Desbloquear
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Level5Cipher;
