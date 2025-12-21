import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, DoorOpen, Flashlight, Battery, Paperclip, Search, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import './Level1Escape.css';

const Level1Escape = () => {
  const { completeLevel } = useGame();
  
  // Inventario y Estado del Juego
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState("La puerta está cerrada. Necesitas una llave.");
  const [gameState, setGameState] = useState({
    drawerOpen: false,
    cornerLit: false,
    hasFlashlight: false,
    hasBatteries: false,
    hasClip: false,
    flashlightFixed: false,
    hasKey: false
  });

  // Efecto para combinar linterna y pilas automáticamente
  useEffect(() => {
    if (gameState.hasFlashlight && gameState.hasBatteries && !gameState.flashlightFixed) {
      setMessage("¡Has puesto las pilas a la linterna! Ahora funciona.");
      setGameState(prev => ({ ...prev, flashlightFixed: true }));
    }
  }, [gameState.hasFlashlight, gameState.hasBatteries]);

  const addToInventory = (item) => {
    if (!inventory.includes(item)) {
      setInventory(prev => [...prev, item]);
    }
  };

  const handleInteraction = (target) => {
    switch (target) {
      case 'sofa':
        if (!gameState.hasFlashlight) {
          setMessage("Has encontrado una linterna vieja entre los cojines... pero no tiene pilas.");
          setGameState(prev => ({ ...prev, hasFlashlight: true }));
          addToInventory('flashlight');
        } else {
          setMessage("Ya no hay nada más en el sofá.");
        }
        break;

      case 'rug':
        if (!gameState.hasClip) {
          setMessage("Levantas la alfombra y... ¡un clip! Podría servir para forzar algo.");
          setGameState(prev => ({ ...prev, hasClip: true }));
          addToInventory('clip');
        } else {
          setMessage("Solo hay polvo debajo de la alfombra.");
        }
        break;

      case 'drawer':
        if (gameState.drawerOpen) {
          setMessage("El cajón está vacío.");
        } else if (gameState.hasClip) {
          setMessage("¡Usaste el clip para abrir la cerradura del cajón! Encontraste unas pilas.");
          setGameState(prev => ({ ...prev, drawerOpen: true, hasBatteries: true }));
          addToInventory('batteries');
        } else {
          setMessage("El cajón está atascado. Necesitas algo fino y metálico para abrirlo.");
        }
        break;

      case 'darkCorner':
        if (gameState.hasKey) {
          setMessage("Ya tienes la llave.");
        } else if (gameState.flashlightFixed) {
          setMessage("Alumbras la oscuridad... ¡Hay algo brillante! ¡Es la llave de la puerta!");
          setGameState(prev => ({ ...prev, cornerLit: true, hasKey: true }));
          addToInventory('key');
        } else if (gameState.hasFlashlight) {
          setMessage("Está demasiado oscuro. Tu linterna no enciende sin pilas.");
        } else {
          setMessage("Hay un rincón muy oscuro ahí. No se ve nada a simple vista.");
        }
        break;

      case 'door':
        if (gameState.hasKey) {
          setMessage("¡La puerta se abre! ¡Eres increíble!");
          setTimeout(() => completeLevel(1), 2000);
        } else {
          setMessage("La puerta está cerrada a cal y canto.");
        }
        break;

      default:
        setMessage("No parece haber nada interesante ahí.");
    }
  };

  return (
    <div className="escape-container-advanced">
      <div className="game-area">
        <h2 className="level-title">Nivel 1: La Habitación Cerrada</h2>
        
        {/* Escenario */}
        <div className="room-scene-advanced">
          
          {/* Objetos en la habitación */}
          
          {/* 1. Sofá */}
          <motion.button 
            className="scene-object sofa-obj"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleInteraction('sofa')}
          >
            🛋️
            <span className="label">Sofá</span>
          </motion.button>

          {/* 2. Alfombra */}
          <motion.button 
            className="scene-object rug-obj"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleInteraction('rug')}
          >
            🧶
            <span className="label">Alfombra</span>
          </motion.button>

          {/* 3. Mueble con Cajón */}
          <motion.button 
            className="scene-object drawer-obj"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleInteraction('drawer')}
          >
            🗄️
            <span className="label">{gameState.drawerOpen ? 'Cajón Abierto' : 'Cajón Cerrado'}</span>
          </motion.button>

          {/* 4. Rincón Oscuro */}
          <motion.button 
            className={`scene-object corner-obj ${gameState.flashlightFixed ? 'lit' : 'dark'}`}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleInteraction('darkCorner')}
          >
            {gameState.flashlightFixed ? '🔦' : '🌑'}
            <span className="label">Rincón Oscuro</span>
          </motion.button>

          {/* 5. Puerta */}
          <motion.button 
            className="scene-object door-obj"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleInteraction('door')}
          >
            🚪
            <span className="label">Salida</span>
          </motion.button>

        </div>

        {/* Panel de Mensajes */}
        <div className="message-panel">
          <p>{message}</p>
        </div>

        {/* Inventario */}
        <div className="inventory-panel">
          <h3>Mochila</h3>
          <div className="inventory-slots">
            {inventory.length === 0 && <span className="empty-text">Vacía</span>}
            
            {inventory.includes('flashlight') && (
              <div className={`inv-item ${gameState.flashlightFixed ? 'fixed' : ''}`} title="Linterna">
                <Flashlight size={24} className={gameState.flashlightFixed ? 'text-yellow-400' : ''} />
                {gameState.flashlightFixed && <span className="status-badge">ON</span>}
              </div>
            )}
            
            {inventory.includes('clip') && (
              <div className="inv-item" title="Clip">
                <Paperclip size={24} />
              </div>
            )}

            {inventory.includes('batteries') && !gameState.flashlightFixed && (
              <div className="inv-item" title="Pilas">
                <Battery size={24} />
              </div>
            )}

            {inventory.includes('key') && (
              <div className="inv-item key-item" title="Llave">
                <Key size={24} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level1Escape;
