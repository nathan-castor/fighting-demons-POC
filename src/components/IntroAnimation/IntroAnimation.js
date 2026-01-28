import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userStorage } from '../../services/LocalStorageService';
import { SPIRIT_GUIDE_STAGES } from '../../config/gameConfig';
import './IntroAnimation.css';

const INTRO_SEEN_KEY = 'fighting-demons-seen-intro';

const IntroAnimation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [skipAnimation] = useState(false);
  const [isPaused] = useState(false);

  // Animation steps content with Spirit Guide integration - memoized to prevent recreating on each render
  const steps = useMemo(() => [
    {
      type: 'text',
      title: "Awakening",
      text: "You have been born into a world of great beauty... and great danger.",
      subtext: null,
      showGuide: false,
      animation: { opacity: [0, 1], y: [50, 0] }
    },
    {
      type: 'text',
      title: "The Kenoma",
      text: "This realm is called the Kenoma — the Emptiness. A place where entropy slowly consumes all things.",
      subtext: "But emptiness can be filled with light.",
      showGuide: false,
      animation: { opacity: [0, 1], scale: [0.9, 1] }
    },
    {
      type: 'text',
      title: "The Demons",
      text: "Demons inhabit this world — forces of lethargy, distraction, and self-destruction.",
      subtext: "They do not attack directly. They whisper. They convince you that nothing matters.",
      showGuide: false,
      animation: { opacity: [0, 1], x: [30, 0] }
    },
    {
      type: 'text',
      title: "Their Weapons",
      text: "Comfort is their favorite poison. They want you numb, asleep, compliant.",
      subtext: "Every moment of stillness, every skipped effort — they grow stronger.",
      showGuide: false,
      animation: { opacity: [0, 1], rotate: [-1, 0] }
    },
    {
      type: 'guide-intro',
      title: "Your Spirit Guide",
      text: "But you are not alone. A Spirit Guide has bonded to you.",
      subtext: "It is faint now — barely an ember. But it seeks to protect you.",
      showGuide: true,
      guideStage: 0,
      animation: { opacity: [0, 1], scale: [0.8, 1] }
    },
    {
      type: 'guide-evolution',
      title: "Evolution",
      text: "Your Spirit Guide grows stronger as you do. Each victory feeds its light.",
      subtext: null,
      showGuide: true,
      showEvolution: true,
      animation: { opacity: [0, 1], y: [-20, 0] }
    },
    {
      type: 'text',
      title: "The Ancient Wisdom",
      text: "The Hermetic masters knew: As above, so below. Your body is a temple. Your mind is an altar.",
      subtext: "Physical movement generates spiritual momentum. The demons made you forget.",
      showGuide: false,
      animation: { opacity: [0, 1], x: [-30, 0] }
    },
    {
      type: 'text',
      title: "The Three Pillars",
      text: "Move your body. Still your mind. Face the darkness.",
      subtext: "These are not optional goals — they are survival requirements.",
      showGuide: false,
      animation: { opacity: [0, 1], y: [30, 0] }
    },
    {
      type: 'face-offs',
      title: "Daily Face-Offs",
      text: "Three battles each day mark your stand against the demons:",
      faceOffs: [
        { time: 'Dawn', icon: '🌅', task: '1 Mile Walk/Run', desc: 'Break the stillness of night' },
        { time: 'Noon', icon: '☀️', task: 'Max Pushups', desc: 'Defy the noonday demon' },
        { time: 'Dusk', icon: '🌙', task: 'Max Pullups', desc: 'One final stand before rest' }
      ],
      showGuide: false,
      animation: { opacity: [0, 1], scale: [0.95, 1] }
    },
    {
      type: 'text',
      title: "Meditation",
      text: "After each physical trial, still your mind for 10 minutes.",
      subtext: "Silence builds a wall the demons cannot cross.",
      showGuide: true,
      guideStage: 0,
      animation: { opacity: [0, 1], y: [-20, 0] }
    },
    {
      type: 'call-to-action',
      title: "Are You Ready?",
      text: "The demons bet on your weakness every morning. Will you prove them wrong?",
      subtext: "Your Spirit Guide awaits. Your journey begins now.",
      showGuide: true,
      guideStage: 0,
      animation: { opacity: [0, 1], scale: [1.05, 1] }
    }
  ], []);

  // Check if should skip on mount
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(INTRO_SEEN_KEY) === 'true';
    const hasUser = userStorage.getUser() !== null;

    if (hasSeenIntro) {
      if (hasUser) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/register', { replace: true });
      }
    }
  }, [navigate]);

  // Auto-advance through steps
  useEffect(() => {
    if (skipAnimation || isPaused) return;

    // Longer time for evolution step and face-offs
    const stepDuration = steps[currentStep]?.showEvolution ? 6000 : 
                          steps[currentStep]?.type === 'face-offs' ? 5000 : 
                          steps[currentStep]?.type === 'call-to-action' ? 5000 : 4000;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        localStorage.setItem(INTRO_SEEN_KEY, 'true');
        navigate('/register');
      }
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [currentStep, navigate, skipAnimation, isPaused, steps]);

  const handleSkip = () => {
    localStorage.setItem(INTRO_SEEN_KEY, 'true');
    navigate('/register');
  };

  const handleTap = () => {
    // Tap to advance to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem(INTRO_SEEN_KEY, 'true');
      navigate('/register');
    }
  };

  if (skipAnimation) {
    return null;
  }

  const currentContent = steps[currentStep];

  // Render Spirit Guide visual
  const renderSpiritGuide = (stageIndex = 0, size = 'medium') => {
    const stage = SPIRIT_GUIDE_STAGES[stageIndex];
    const sizeClass = size === 'large' ? 'spirit-guide-large' : 
                      size === 'small' ? 'spirit-guide-small' : '';
    
    return (
      <motion.div 
        className={`intro-spirit-guide ${sizeClass}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <div className="spirit-guide-glow-intro"></div>
        <span className="spirit-guide-emoji">{stage.icon}</span>
        {size !== 'small' && (
          <span className="spirit-guide-name-intro">{stage.name}</span>
        )}
      </motion.div>
    );
  };

  // Render evolution showcase
  const renderEvolution = () => (
    <div className="evolution-showcase">
      {SPIRIT_GUIDE_STAGES.map((stage, index) => (
        <motion.div
          key={stage.name}
          className="evolution-stage"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.3, duration: 0.5 }}
        >
          <span className="evolution-icon">{stage.icon}</span>
          <span className="evolution-name">{stage.name}</span>
          <span className="evolution-points">{stage.minPoints}+ pts</span>
        </motion.div>
      ))}
    </div>
  );

  // Render face-offs list
  const renderFaceOffs = () => (
    <div className="face-offs-preview">
      {currentContent.faceOffs.map((faceOff, index) => (
        <motion.div
          key={faceOff.time}
          className="face-off-preview-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.3, duration: 0.4 }}
        >
          <span className="face-off-icon">{faceOff.icon}</span>
          <div className="face-off-details">
            <span className="face-off-time-label">{faceOff.time}</span>
            <span className="face-off-task">{faceOff.task}</span>
          </div>
        </motion.div>
      ))}
      <motion.p 
        className="meditation-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        + 10 min meditation after each
      </motion.p>
    </div>
  );

  return (
    <div className="intro-animation" onClick={handleTap}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          className="intro-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentContent.showGuide && renderSpiritGuide(currentContent.guideStage || 0, 'large')}
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="intro-title"
          >
            {currentContent.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="intro-text"
          >
            {currentContent.text}
          </motion.p>

          {currentContent.subtext && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="intro-subtext"
            >
              {currentContent.subtext}
            </motion.p>
          )}

          {currentContent.showEvolution && renderEvolution()}
          {currentContent.type === 'face-offs' && renderFaceOffs()}

          {currentContent.type === 'call-to-action' && (
            <motion.button
              className="begin-journey-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
            >
              Begin Your Journey
            </motion.button>
          )}

          <div className="intro-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <button className="skip-button" onClick={(e) => { e.stopPropagation(); handleSkip(); }}>
        Skip
      </button>
      
      <p className="tap-hint">Tap to continue</p>
    </div>
  );
};

export default IntroAnimation;
