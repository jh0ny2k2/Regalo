import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LockKeyhole, LockKeyholeOpen } from 'lucide-react';
import LevelLayout from '../LevelLayout';
import './Level5Decoder.css';

// Frase secreta y desplazamiento con el que se cifra (cifrado César)
const SECRET_ANSWER = 'ERES MI TODO';
const SHIFT = 7;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const STEP = 360 / ALPHABET.length;

const rotate = (text, by) =>
  [...text]
    .map((ch) => {
      const i = ALPHABET.indexOf(ch);
      return i === -1 ? ch : ALPHABET[(i + by + ALPHABET.length * 2) % ALPHABET.length];
    })
    .join('');

const ENCRYPTED_MSG = rotate(SECRET_ANSWER, SHIFT);

const Ring = ({ className, rotation }) => (
  <div className={`ring ${className}`} style={{ transform: `rotate(${rotation}deg)` }}>
    {[...ALPHABET].map((letter, i) => (
      <span key={letter} style={{ '--angle': `${i * STEP}deg` }}>
        {letter}
      </span>
    ))}
  </div>
);

const Level5Decoder = () => {
  const [shift, setShift] = useState(0);
  const decoded = rotate(ENCRYPTED_MSG, -shift);
  const solved = decoded === SECRET_ANSWER;

  const turn = (dir) => {
    if (!solved) setShift((s) => s + dir);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') turn(-1);
      if (e.key === 'ArrowRight') turn(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <LevelLayout
      level={5}
      title="El mensaje cifrado"
      subtitle="Gira la rueda interior. Cada letra de fuera se convierte en la de dentro. Cuando el mensaje tenga sentido, el candado se abrirá."
      won={solved}
      winTitle="Mensaje descifrado"
      winText="Y lo digo de verdad: eres mi todo."
    >
      <div className={`decoded ${solved ? 'is-solved' : ''}`} aria-live="polite">
        {SECRET_ANSWER.split(' ').map((word, w, words) => {
          const start = words.slice(0, w).join(' ').length + (w ? 1 : 0);
          return (
            <span key={w} className="decoded-word">
              {[...word].map((_, i) => (
                <motion.span
                  key={`${i}-${decoded[start + i]}`}
                  className="decoded-letter"
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.18, delay: i * 0.02 }}
                >
                  {decoded[start + i]}
                </motion.span>
              ))}
            </span>
          );
        })}
      </div>

      <div className="wheel">
        <Ring className="ring-outer" rotation={0} />
        <Ring className="ring-inner" rotation={shift * STEP} />
        <div className="wheel-pointer" />
        <div className={`wheel-center ${solved ? 'is-open' : ''}`}>
          {solved ? <LockKeyholeOpen size={30} /> : <LockKeyhole size={30} />}
        </div>
      </div>

      <div className="wheel-controls">
        <button className="icon-btn" onClick={() => turn(-1)} aria-label="Girar a la izquierda" disabled={solved}>
          <ChevronLeft size={20} />
        </button>
        <span className="stat-pill">Giro {((shift % 26) + 26) % 26}</span>
        <button className="icon-btn" onClick={() => turn(1)} aria-label="Girar a la derecha" disabled={solved}>
          <ChevronRight size={20} />
        </button>
      </div>
    </LevelLayout>
  );
};

export default Level5Decoder;
