import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import WelcomeScreen from './WelcomeScreen';
import Level1Memory from './levels/Level1Memory';
import Level2Wordle from './levels/Level2Wordle';
import Level3Catch from './levels/Level3Catch';
import Level4Sliding from './levels/Level4Sliding';
import Level5Decoder from './levels/Level5Decoder';
import Level6Differences from './levels/Level6Differences';
import FinalScreen from './FinalScreen';

const SCREENS = {
  0: WelcomeScreen,
  1: Level1Memory,
  2: Level2Wordle,
  3: Level3Catch,
  4: Level4Sliding,
  5: Level5Decoder,
  6: Level6Differences,
  7: FinalScreen,
};

const GameManager = () => {
  const { currentLevel } = useGame();
  const Screen = SCREENS[currentLevel] ?? WelcomeScreen;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentLevel}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Screen />
      </motion.div>
    </AnimatePresence>
  );
};

export default GameManager;
