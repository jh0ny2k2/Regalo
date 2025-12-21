import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Delete, Check, RefreshCw, Lightbulb } from 'lucide-react';
import './Level2Wordle.css';

// Palabra secreta (6 letras)
const SOLUTION = "MADRID";
const WORD_LENGTH = 6;
const MAX_TURNS = 6;

const Level2Wordle = () => {
  const { completeLevel } = useGame();
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([...Array(MAX_TURNS)]); 
  const [history, setHistory] = useState([]); 
  const [isCorrect, setIsCorrect] = useState(false);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [hint, setHint] = useState(null);

  // Manejo de teclas físicas
  useEffect(() => {
    const handleKeyup = (e) => {
      if (gameOver || isCorrect) return;

      const key = e.key.toUpperCase();

      if (key === 'ENTER') {
        if (currentGuess.length !== WORD_LENGTH) {
          showMessage("Faltan letras");
          return;
        }
        submitGuess();
      }
      if (key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }
      if (/^[A-ZÑ]$/.test(key)) {
        if (currentGuess.length < WORD_LENGTH) {
          setCurrentGuess((prev) => prev + key);
        }
      }
    };

    window.addEventListener('keyup', handleKeyup);
    return () => window.removeEventListener('keyup', handleKeyup);
  }, [currentGuess, turn, isCorrect, gameOver]);

  // Lógica de Pistas automáticas
  useEffect(() => {
    if (turn === 2) { // Intento 3 (índice 2)
      setHint("Pista: Momento junto a mi");
    } else if (turn === 3) { // Intento 4 (índice 3)
      setHint("Pista: Viaje");
    }
  }, [turn]);

  // Enviar intento
  const submitGuess = () => {
    if (history.includes(currentGuess)) {
      showMessage("Ya probaste esa palabra");
      return;
    }

    const formattedGuess = formatGuess();
    addNewGuess(formattedGuess);
  };

  // Formatear intento (calcular colores)
  const formatGuess = () => {
    let solutionChars = [...SOLUTION];
    let formattedGuess = [...currentGuess].map((l) => ({ key: l, color: 'grey' }));

    // Paso 1: Encontrar verdes (posición correcta)
    formattedGuess.forEach((l, i) => {
      if (SOLUTION[i] === l.key) {
        formattedGuess[i].color = 'green';
        solutionChars[i] = null;
      }
    });

    // Paso 2: Encontrar amarillos (letra correcta, posición incorrecta)
    formattedGuess.forEach((l, i) => {
      if (l.color !== 'green' && solutionChars.includes(l.key)) {
        formattedGuess[i].color = 'yellow';
        solutionChars[solutionChars.indexOf(l.key)] = null;
      }
    });

    return formattedGuess;
  };

  // Añadir intento al estado
  const addNewGuess = (formattedGuess) => {
    if (currentGuess === SOLUTION) {
      setIsCorrect(true);
      setTimeout(() => completeLevel(2), 2000); 
      showMessage("¡Correcto! Eres mi persona favorita ❤️");
    }

    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });

    setHistory((prevHistory) => [...prevHistory, currentGuess]);
    setTurn((prevTurn) => prevTurn + 1);
    setCurrentGuess('');

    if (turn >= MAX_TURNS - 1 && currentGuess !== SOLUTION) {
      setGameOver(true);
      showMessage(`Oh no... La palabra era ${SOLUTION}`);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Teclado virtual
  const handleKeyClick = (key) => {
    if (gameOver || isCorrect) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        showMessage("Faltan letras");
        return;
      }
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else {
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + key);
      }
    }
  };

  // Obtener color para teclas del teclado virtual
  const getKeyColor = (key) => {
    let color = '';
    guesses.slice(0, turn).forEach((guess) => {
      guess.forEach((l) => {
        if (l.key === key) {
          if (l.color === 'green') color = 'green';
          else if (l.color === 'yellow' && color !== 'green') color = 'yellow';
          else if (l.color === 'grey' && color !== 'green' && color !== 'yellow') color = 'grey';
        }
      });
    });
    return color;
  };

  return (
    <div className="wordle-container">
      <h2 className="level-title">Nivel 2: Palabra Secreta</h2>
      <p className="instruction">Adivina la palabra de 6 letras</p>
      
      {/* Pista Dinámica */}
      {hint && (
        <motion.div 
          className="hint-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Lightbulb size={18} /> {hint}
        </motion.div>
      )}

      {/* Grid de palabras */}
      <div className="wordle-grid">
        {guesses.map((guess, i) => {
          if (turn === i) {
            return (
              <div key={i} className="wordle-row current">
                {[...Array(WORD_LENGTH)].map((_, j) => (
                  <div key={j} className="wordle-cell filled">
                    {currentGuess[j]}
                  </div>
                ))}
              </div>
            );
          }
          return (
            <div key={i} className="wordle-row">
              {guess &&
                guess.map((l, j) => (
                  <motion.div
                    key={j}
                    className={`wordle-cell ${l.color}`}
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: 360 }}
                    transition={{ delay: j * 0.2 }}
                  >
                    {l.key}
                  </motion.div>
                ))}
              {!guess &&
                [...Array(WORD_LENGTH)].map((_, j) => (
                  <div key={j} className="wordle-cell"></div>
                ))}
            </div>
          );
        })}
      </div>

      {message && <div className="message-toast">{message}</div>}

      {/* Teclado Virtual */}
      <div className="keyboard">
        {['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM'].map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.split('').map((key) => (
              <button
                key={key}
                className={`key-btn ${getKeyColor(key)}`}
                onClick={() => handleKeyClick(key)}
              >
                {key}
              </button>
            ))}
            {i === 2 && (
              <>
                <button className="key-btn action" onClick={() => handleKeyClick('BACKSPACE')}>
                  <Delete size={20} />
                </button>
                <button className="key-btn action" onClick={() => handleKeyClick('ENTER')}>
                  <Check size={20} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      
      {gameOver && (
          <button className="reset-btn" onClick={() => window.location.reload()}>
            <RefreshCw size={20} /> Reintentar
          </button>
      )}
    </div>
  );
};

export default Level2Wordle;
