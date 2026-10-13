import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import LevelLayout from '../LevelLayout';
import './Level6Differences.css';

const ORIGINAL_IMG = '/foto.jpeg';
const MODIFIED_IMG = '/foto con cambios.jpg';

// Posición de cada diferencia en % de la foto
const DIFFERENCES = [
  { id: 1, x: 48, y: 20, radius: 8, hint: 'Mira arriba en la pared blanca' },
  { id: 2, x: 58, y: 39, radius: 8, hint: 'Al fondo, cerca de los tejados' },
  { id: 3, x: 36, y: 52, radius: 8, hint: 'Cerca del cuello de ella' },
  { id: 4, x: 50, y: 48, radius: 8, hint: 'Por el cuello de la camisa de él' },
  { id: 5, x: 48, y: 57, radius: 8, hint: 'En la chaqueta del traje' },
];

const PhotoPanel = ({ src, label, found, misses, onPick }) => {
  const ref = useRef(null);

  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    onPick(((e.clientX - rect.left) / rect.width) * 100, ((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <figure className="diff-photo">
      <div className="diff-photo-frame" ref={ref} onClick={handleClick}>
        <img src={src} alt={label} draggable={false} />
        {DIFFERENCES.filter((d) => found.includes(d.id)).map((d) => (
          <motion.span
            key={d.id}
            className="diff-marker"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          />
        ))}
        <AnimatePresence>
          {misses.map((m) => (
            <motion.span
              key={m.id}
              className="diff-miss"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              initial={{ scale: 0.4, opacity: 1 }}
              animate={{ scale: 1.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </AnimatePresence>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
};

const Level6Differences = () => {
  const [found, setFound] = useState([]);
  const [misses, setMisses] = useState([]);
  const [hintCount, setHintCount] = useState(0);
  const missId = useRef(0);

  const pending = DIFFERENCES.filter((d) => !found.includes(d.id));
  const won = pending.length === 0;

  const handlePick = (x, y) => {
    if (won) return;
    const hit = pending.find((d) => Math.hypot(x - d.x, y - d.y) <= d.radius);
    if (hit) {
      setFound((prev) => [...prev, hit.id]);
      return;
    }
    const miss = { id: missId.current++, x, y };
    setMisses((prev) => [...prev, miss]);
    setTimeout(() => setMisses((prev) => prev.filter((m) => m.id !== miss.id)), 600);
  };

  const hints = pending.slice(0, hintCount);

  return (
    <LevelLayout
      level={6}
      title="Encuentra las diferencias"
      subtitle={`Hay ${DIFFERENCES.length} cambios escondidos en nuestra foto. Toca sobre cualquiera de las dos imágenes.`}
      won={won}
      winTitle="¡Ojo de lince!"
      winText="Último reto superado. Tu regalo te está esperando…"
      wide
    >
      <div className="diff-counter" aria-label={`${found.length} de ${DIFFERENCES.length} encontradas`}>
        {DIFFERENCES.map((d) => (
          <span key={d.id} className={found.includes(d.id) ? 'is-found' : ''} />
        ))}
      </div>

      <div className="diff-photos">
        <PhotoPanel src={ORIGINAL_IMG} label="Original" found={found} misses={misses} onPick={handlePick} />
        <PhotoPanel src={MODIFIED_IMG} label="Con cambios" found={found} misses={misses} onPick={handlePick} />
      </div>

      {hints.length > 0 && (
        <div className="diff-hints">
          {hints.map((d) => (
            <div key={d.id} className="hint-note">
              <Lightbulb size={16} /> {d.hint}
            </div>
          ))}
        </div>
      )}

      {!won && hintCount < pending.length && (
        <button className="btn btn-ghost btn-sm" onClick={() => setHintCount((n) => n + 1)}>
          <Lightbulb size={16} /> {hintCount === 0 ? 'Necesito una pista' : 'Otra pista'}
        </button>
      )}
    </LevelLayout>
  );
};

export default Level6Differences;
