import React, { useState } from 'react';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import LevelLayout from '../LevelLayout';
import './Level4Sliding.css';

// Foto del puzzle (en /public) y su proporción ancho / alto
const IMAGE_URL = '/orden.jpeg';
const IMAGE_RATIO = 722 / 1599;
const SIZE = 3;
const EMPTY = SIZE * SIZE - 1;
const SHUFFLE_MOVES = 120;

const neighbors = (pos) => {
  const r = Math.floor(pos / SIZE);
  const c = pos % SIZE;
  return [
    r > 0 && pos - SIZE,
    r < SIZE - 1 && pos + SIZE,
    c > 0 && pos - 1,
    c < SIZE - 1 && pos + 1,
  ].filter((p) => p !== false);
};

const isSolved = (board) => board.every((tile, pos) => tile === pos);

// Mezcla haciendo movimientos válidos desde la solución: siempre tiene solución
const buildBoard = () => {
  const board = [...Array(SIZE * SIZE).keys()];
  let empty = EMPTY;
  let prev = -1;
  for (let i = 0; i < SHUFFLE_MOVES || isSolved(board); i++) {
    const options = neighbors(empty).filter((p) => p !== prev);
    const pick = options[Math.floor(Math.random() * options.length)];
    [board[empty], board[pick]] = [board[pick], board[empty]];
    prev = empty;
    empty = pick;
  }
  return board;
};

const Level4Sliding = () => {
  const [board, setBoard] = useState(buildBoard);
  const [moves, setMoves] = useState(0);
  const [peek, setPeek] = useState(false);
  const solved = isSolved(board);

  const handleTile = (pos) => {
    if (solved) return;
    const empty = board.indexOf(EMPTY);
    if (!neighbors(empty).includes(pos)) return;
    const next = [...board];
    [next[empty], next[pos]] = [next[pos], next[empty]];
    setBoard(next);
    setMoves((m) => m + 1);
  };

  const restart = () => {
    setBoard(buildBoard());
    setMoves(0);
  };

  const emptyPos = board.indexOf(EMPTY);
  const movable = neighbors(emptyPos);

  return (
    <LevelLayout
      level={4}
      title="Nuestra foto"
      subtitle="Desliza las piezas hacia el hueco hasta recomponer la imagen."
      won={solved}
      winTitle="¡Foto completa!"
      winText={`${moves} movimientos para volver a ponernos en orden. Como siempre.`}
    >
      <div className="stat-row">
        <span className="stat-pill">{moves} movimientos</span>
      </div>

      <div
        className={`slide-board ${solved ? 'is-solved' : ''}`}
        style={{ aspectRatio: IMAGE_RATIO, '--img': `url(${IMAGE_URL})` }}
      >
        {board.map((tile, pos) => {
          if (tile === EMPTY && !solved) return null;
          return (
            <button
              key={tile}
              className={`slide-tile ${movable.includes(pos) ? 'is-movable' : ''}`}
              onClick={() => handleTile(pos)}
              aria-label={`Pieza ${tile + 1}`}
              style={{
                left: `${(pos % SIZE) * (100 / SIZE)}%`,
                top: `${Math.floor(pos / SIZE) * (100 / SIZE)}%`,
                backgroundPosition: `${(tile % SIZE) * 50}% ${Math.floor(tile / SIZE) * 50}%`,
              }}
            />
          );
        })}
        {peek && <div className="slide-peek" />}
      </div>

      <div className="slide-actions">
        <button
          className="btn btn-ghost btn-sm"
          onPointerDown={() => setPeek(true)}
          onPointerUp={() => setPeek(false)}
          onPointerLeave={() => setPeek(false)}
        >
          {peek ? <EyeOff size={16} /> : <Eye size={16} />} Mantén para ver la foto
        </button>
        <button className="btn btn-ghost btn-sm" onClick={restart}>
          <RotateCcw size={16} /> Mezclar
        </button>
      </div>
    </LevelLayout>
  );
};

export default Level4Sliding;
