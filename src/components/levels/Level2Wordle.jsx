import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, CornerDownLeft, Lightbulb, RotateCcw } from 'lucide-react';
import LevelLayout from '../LevelLayout';
import './Level2Wordle.css';

// Palabra secreta y pistas que aparecen según los intentos fallados
const SOLUTION = 'MADRID';
const WORD_LENGTH = SOLUTION.length;
const MAX_TURNS = 6;
const HINTS = [
  { after: 2, text: 'Un momento junto a mí' },
  { after: 3, text: 'Fue un viaje' },
];
const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'];
const STATUS_RANK = { absent: 1, present: 2, correct: 3 };

const evaluate = (guess) => {
  const remaining = [...SOLUTION];
  const result = [...guess].map((letter, i) => {
    if (SOLUTION[i] === letter) {
      remaining[i] = null;
      return { letter, status: 'correct' };
    }
    return { letter, status: 'absent' };
  });
  result.forEach((cell) => {
    if (cell.status === 'correct') return;
    const idx = remaining.indexOf(cell.letter);
    if (idx !== -1) {
      cell.status = 'present';
      remaining[idx] = null;
    }
  });
  return result;
};

const Level2Wordle = () => {
  const [rows, setRows] = useState([]);
  const [current, setCurrent] = useState('');
  const [status, setStatus] = useState('playing'); // playing | won | lost
  const [toast, setToast] = useState('');
  const [shake, setShake] = useState(false);
  const toastTimer = useRef();

  const flash = (msg) => {
    setToast(msg);
    setShake(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast('');
      setShake(false);
    }, 1800);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const handleKey = useCallback(
    (key) => {
      if (status !== 'playing') return;

      if (key === 'ENTER') {
        if (current.length !== WORD_LENGTH) return flash('Faltan letras');
        if (rows.some((r) => r.word === current)) return flash('Ya probaste esa palabra');
        const next = [...rows, { word: current, cells: evaluate(current) }];
        setRows(next);
        setCurrent('');
        if (current === SOLUTION) setStatus('won');
        else if (next.length === MAX_TURNS) setStatus('lost');
        return;
      }
      if (key === 'BACKSPACE') {
        setCurrent((c) => c.slice(0, -1));
        return;
      }
      if (/^[A-ZÑ]$/.test(key) && current.length < WORD_LENGTH) {
        setCurrent((c) => c + key);
      }
    },
    [status, current, rows]
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  const restart = () => {
    setRows([]);
    setCurrent('');
    setStatus('playing');
  };

  // Mejor estado conocido de cada letra para colorear el teclado
  const keyStatus = {};
  rows.forEach(({ cells }) =>
    cells.forEach(({ letter, status: s }) => {
      if (!keyStatus[letter] || STATUS_RANK[s] > STATUS_RANK[keyStatus[letter]]) keyStatus[letter] = s;
    })
  );

  const visibleHints = HINTS.filter((h) => rows.length >= h.after || status === 'lost');

  return (
    <LevelLayout
      level={2}
      title="La palabra secreta"
      subtitle={`Adivina la palabra de ${WORD_LENGTH} letras. Tienes ${MAX_TURNS} intentos.`}
      won={status === 'won'}
      winTitle="¡Madrid!"
      winText="Ese viaje sigue siendo uno de mis recuerdos favoritos contigo."
    >
      <div className="wordle-legend">
        <span><i className="correct" /> En su sitio</span>
        <span><i className="present" /> Está, pero en otro sitio</span>
        <span><i className="absent" /> No está</span>
      </div>

      <div className="wordle-board">
        {Array.from({ length: MAX_TURNS }, (_, r) => {
          const row = rows[r];
          const isCurrent = r === rows.length && status === 'playing';
          return (
            <motion.div
              key={r}
              className="wordle-row"
              animate={isCurrent && shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {Array.from({ length: WORD_LENGTH }, (_, c) => {
                if (row) {
                  const cell = row.cells[c];
                  return (
                    <motion.div
                      key={c}
                      className={`wordle-cell ${cell.status}`}
                      initial={{ rotateX: -90 }}
                      animate={{ rotateX: 0 }}
                      transition={{ delay: c * 0.12, duration: 0.3 }}
                    >
                      {cell.letter}
                    </motion.div>
                  );
                }
                const letter = isCurrent ? current[c] : '';
                return (
                  <div key={c} className={`wordle-cell ${letter ? 'filled' : ''}`}>
                    {letter}
                  </div>
                );
              })}
            </motion.div>
          );
        })}
        <AnimatePresence>
          {toast && (
            <motion.div
              className="wordle-toast"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {visibleHints.length > 0 && (
        <div className="wordle-hints">
          {visibleHints.map((h) => (
            <motion.div key={h.text} className="hint-note" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <Lightbulb size={16} /> {h.text}
            </motion.div>
          ))}
        </div>
      )}

      {status === 'lost' ? (
        <div className="wordle-lost">
          <p>¡Casi! Las pistas siguen ahí para ayudarte.</p>
          <button className="btn btn-primary" onClick={restart}>
            <RotateCcw size={18} /> Intentar de nuevo
          </button>
        </div>
      ) : (
        <div className="keyboard">
          {KEY_ROWS.map((row, i) => (
            <div key={row} className="keyboard-row">
              {i === 2 && (
                <button className="key wide" onClick={() => handleKey('ENTER')} aria-label="Enviar">
                  <CornerDownLeft size={18} />
                </button>
              )}
              {[...row].map((k) => (
                <button key={k} className={`key ${keyStatus[k] ?? ''}`} onClick={() => handleKey(k)}>
                  {k}
                </button>
              ))}
              {i === 2 && (
                <button className="key wide" onClick={() => handleKey('BACKSPACE')} aria-label="Borrar">
                  <Delete size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </LevelLayout>
  );
};

export default Level2Wordle;
