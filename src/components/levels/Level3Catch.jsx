import React, { useEffect, useRef, useState } from 'react';
import { Heart, HeartCrack, Play, RotateCcw } from 'lucide-react';
import LevelLayout from '../LevelLayout';
import './Level3Catch.css';

// Configuración del juego (posiciones en % del área de juego)
const GOAL = 20;
const LIVES = 3;
const SPAWN_MS = 700;
const BAD_CHANCE = 0.25;
const BASKET_HALF_WIDTH = 11;
const CATCH_TOP = 82;
const CATCH_BOTTOM = 94;

const newGame = () => ({ items: [], score: 0, lives: LIVES, basketX: 50, nextId: 0, spawnIn: 0 });
const snapshot = (g) => ({ items: g.items.map((i) => ({ ...i })), score: g.score, lives: g.lives, basketX: g.basketX });

const Level3Catch = () => {
  const [status, setStatus] = useState('ready'); // ready | playing | lost | won
  const game = useRef(newGame());
  const [view, setView] = useState(() => snapshot(newGame()));
  const areaRef = useRef(null);

  useEffect(() => {
    if (status !== 'playing') return;
    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(now - last, 40);
      last = now;
      const g = game.current;
      const speedUp = 1 + g.score / GOAL; // cae más rápido según avanzas

      g.spawnIn -= dt;
      if (g.spawnIn <= 0) {
        g.spawnIn = SPAWN_MS / speedUp;
        g.items.push({
          id: g.nextId++,
          x: 8 + Math.random() * 84,
          y: -6,
          speed: (0.022 + Math.random() * 0.012) * speedUp,
          bad: Math.random() < BAD_CHANCE,
        });
      }

      g.items = g.items.filter((item) => {
        item.y += item.speed * dt;
        const caught =
          item.y >= CATCH_TOP && item.y <= CATCH_BOTTOM && Math.abs(item.x - g.basketX) <= BASKET_HALF_WIDTH;
        if (caught) {
          if (item.bad) g.lives -= 1;
          else g.score += 1;
          return false;
        }
        return item.y < 105;
      });

      if (g.score >= GOAL) setStatus('won');
      else if (g.lives <= 0) setStatus('lost');
      else raf = requestAnimationFrame(tick);
      setView(snapshot(g));
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const g = game.current;
      g.basketX = Math.max(6, Math.min(94, g.basketX + (e.key === 'ArrowLeft' ? -6 : 6)));
      setView(snapshot(g));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const moveBasket = (e) => {
    const rect = areaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    game.current.basketX = Math.max(6, Math.min(94, x));
  };

  const start = () => {
    game.current = newGame();
    setView(snapshot(game.current));
    setStatus('playing');
  };

  const { items, score, lives, basketX } = view;

  return (
    <LevelLayout
      level={3}
      title="Atrapa mi corazón"
      subtitle={`Mueve la cesta y recoge ${GOAL} corazones. Esquiva los rotos: te quitan una vida.`}
      won={status === 'won'}
      winTitle="¡Todos para ti!"
      winText="Ya los tenías todos desde hace tiempo, pero así es más oficial."
    >
      <div className="stat-row">
        <span className="stat-pill">
          <Heart size={14} fill="currentColor" /> {score} / {GOAL}
        </span>
        <span className="stat-pill catch-lives" aria-label={`${lives} vidas`}>
          {Array.from({ length: LIVES }, (_, i) => (
            <Heart key={i} size={14} fill={i < lives ? 'currentColor' : 'none'} />
          ))}
        </span>
      </div>

      <div className="catch-area" ref={areaRef} onPointerMove={moveBasket} onPointerDown={moveBasket}>
        <div className="catch-progress" style={{ height: `${(score / GOAL) * 100}%` }} />

        {items.map((item) => (
          <div
            key={item.id}
            className={`catch-item ${item.bad ? 'bad' : ''}`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.bad ? <HeartCrack size={30} /> : <Heart size={30} fill="currentColor" />}
          </div>
        ))}

        <div className="catch-basket" style={{ left: `${basketX}%` }} />

        {status !== 'playing' && status !== 'won' && (
          <div className="catch-overlay">
            {status === 'lost' && <p className="catch-overlay-title">¡Uy! Se rompieron demasiados</p>}
            <button className="btn btn-primary" onClick={start}>
              {status === 'ready' ? <Play size={18} fill="currentColor" /> : <RotateCcw size={18} />}
              {status === 'ready' ? 'Jugar' : 'Otra vez'}
            </button>
            <p className="catch-overlay-help">Arrastra el dedo o usa las flechas ← →</p>
          </div>
        )}
      </div>
    </LevelLayout>
  );
};

export default Level3Catch;
