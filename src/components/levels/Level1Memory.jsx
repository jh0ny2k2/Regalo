import React, { useRef, useState } from 'react';
import { Heart, Music, Plane, Coffee, Camera, Star, Moon, Sun, RotateCcw } from 'lucide-react';
import LevelLayout from '../LevelLayout';
import { shuffle } from '../../utils/shuffle';
import './Level1Memory.css';

// Cosas que nos representan: cambia los iconos si quieres
const SYMBOLS = [Heart, Music, Plane, Coffee, Camera, Star, Moon, Sun];

const buildDeck = () =>
  shuffle([...SYMBOLS.keys(), ...SYMBOLS.keys()]).map((symbol, id) => ({ id, symbol }));

const Level1Memory = () => {
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const lockRef = useRef(false);

  const won = matched.length === SYMBOLS.length;

  const handleFlip = (index) => {
    const card = deck[index];
    if (lockRef.current || flipped.includes(index) || matched.includes(card.symbol)) return;

    const next = [...flipped, index];
    setFlipped(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = next.map((i) => deck[i].symbol);
    if (a === b) {
      setMatched((prev) => [...prev, a]);
      setFlipped([]);
    } else {
      lockRef.current = true;
      setTimeout(() => {
        setFlipped([]);
        lockRef.current = false;
      }, 850);
    }
  };

  const restart = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <LevelLayout
      level={1}
      title="Parejas de recuerdos"
      subtitle="Da la vuelta a las cartas y encuentra las parejas. Cada una es un pedacito de lo nuestro."
      won={won}
      winTitle="¡Memoria de elefante!"
      winText={`Lo has conseguido en ${moves} movimientos. Tú nunca olvidas lo importante.`}
    >
      <div className="stat-row">
        <span className="stat-pill">{matched.length} / {SYMBOLS.length} parejas</span>
        <span className="stat-pill">{moves} movimientos</span>
      </div>

      <div className="memory-grid">
        {deck.map((card, index) => {
          const Icon = SYMBOLS[card.symbol];
          const isMatched = matched.includes(card.symbol);
          const isUp = isMatched || flipped.includes(index);
          return (
            <button
              key={card.id}
              className={`memory-card ${isUp ? 'is-up' : ''} ${isMatched ? 'is-matched' : ''}`}
              onClick={() => handleFlip(index)}
              aria-label={isUp ? 'Carta descubierta' : 'Carta oculta'}
            >
              <span className="memory-inner">
                <span className="memory-face memory-back">
                  <Heart size={18} />
                </span>
                <span className="memory-face memory-front">
                  <Icon size={28} strokeWidth={1.75} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button className="btn btn-ghost btn-sm" onClick={restart}>
        <RotateCcw size={16} /> Barajar de nuevo
      </button>
    </LevelLayout>
  );
};

export default Level1Memory;
