import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EvolutionCelebration.css';

/**
 * Evolution Celebration Modal
 * Shows when the Spirit Guide evolves to a new stage
 */
const EvolutionCelebration = ({ 
  isVisible, 
  fromStage, 
  toStage, 
  onComplete 
}) => {
  const [phase, setPhase] = useState('intro'); // intro, transform, reveal, message

  useEffect(() => {
    if (isVisible) {
      setPhase('intro');
      
      // Phase timing
      const timers = [
        setTimeout(() => setPhase('transform'), 1500),
        setTimeout(() => setPhase('reveal'), 3000),
        setTimeout(() => setPhase('message'), 4500)
      ];

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [isVisible]);

  if (!isVisible || !fromStage || !toStage) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="evolution-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="evolution-container">
          {/* Background particles */}
          <div className="evolution-particles">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 300
                }}
                transition={{ 
                  duration: 3,
                  delay: Math.random() * 2,
                  repeat: Infinity
                }}
              />
            ))}
          </div>

          {/* Evolution Visual */}
          <div className="evolution-visual">
            {/* From Stage */}
            <motion.div 
              className="stage-display from-stage"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: phase === 'intro' ? 1 : 0,
                scale: phase === 'intro' ? 1 : 0.5,
                filter: phase === 'transform' ? 'blur(10px)' : 'blur(0px)'
              }}
              transition={{ duration: 1 }}
            >
              <span className="stage-icon">{fromStage.icon}</span>
              <span className="stage-name">{fromStage.name}</span>
            </motion.div>

            {/* Transformation Energy */}
            <AnimatePresence>
              {(phase === 'transform' || phase === 'reveal') && (
                <motion.div 
                  className="transformation-energy"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1.5, 1.2, 0.8]
                  }}
                  transition={{ duration: 2 }}
                >
                  <div className="energy-ring ring-1" />
                  <div className="energy-ring ring-2" />
                  <div className="energy-ring ring-3" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* To Stage */}
            <motion.div 
              className="stage-display to-stage"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: phase === 'reveal' || phase === 'message' ? 1 : 0,
                scale: phase === 'reveal' || phase === 'message' ? 1 : 0.5
              }}
              transition={{ duration: 1, type: 'spring', stiffness: 100 }}
            >
              <motion.span 
                className="stage-icon evolved"
                animate={{ 
                  filter: ['drop-shadow(0 0 20px gold)', 'drop-shadow(0 0 40px gold)', 'drop-shadow(0 0 20px gold)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {toStage.icon}
              </motion.span>
              <span className="stage-name evolved">{toStage.name}</span>
            </motion.div>
          </div>

          {/* Header Text */}
          <motion.div 
            className="evolution-header"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="evolution-title">EVOLUTION</h1>
            <p className="evolution-subtitle">Your Spirit Guide has transformed!</p>
          </motion.div>

          {/* Message from Spirit Guide */}
          <AnimatePresence>
            {phase === 'message' && toStage.evolveMessage && (
              <motion.div 
                className="evolution-message"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="guide-message">"{toStage.evolveMessage}"</p>
                <span className="message-attribution">— {toStage.name}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Button */}
          <AnimatePresence>
            {phase === 'message' && (
              <motion.button
                className="evolution-continue-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={onComplete}
              >
                Continue Journey
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EvolutionCelebration;
