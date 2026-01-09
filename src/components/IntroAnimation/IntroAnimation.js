import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './IntroAnimation.css';

const IntroAnimation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [skipAnimation, setSkipAnimation] = useState(false);

  // Animation steps content
  const steps = [
    {
      title: "Welcome to Your New Life",
      text: "You have been born into a world of great beauty...",
      animation: { opacity: [0, 1], y: [50, 0] }
    },
    {
      title: "But Beware",
      text: "This world is also populated by demons of the dark...",
      animation: { opacity: [0, 1], scale: [0.8, 1] }
    },
    {
      title: "Their Goal",
      text: "The demons' goal is to destroy you by making you stagnant and self-destructive...",
      animation: { opacity: [0, 1], rotate: [-5, 0] }
    },
    {
      title: "Your Mission",
      text: "Fight these demons by making healthy choices and staying active...",
      animation: { opacity: [0, 1], x: [-50, 0] }
    },
    {
      title: "Daily Challenges",
      text: "Walk or run a mile each day, and face the demons in daily decisions...",
      animation: { opacity: [0, 1], y: [-50, 0] }
    },
    {
      title: "Are You Ready?",
      text: "Your journey begins now. Will you rise to the challenge?",
      animation: { opacity: [0, 1], scale: [1.2, 1] }
    }
  ];

  // Auto-advance through steps
  useEffect(() => {
    if (skipAnimation) {
      navigate('/register');
      return;
    }

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        navigate('/register');
      }
    }, 4000); // 4 seconds per step

    return () => clearTimeout(timer);
  }, [currentStep, navigate, skipAnimation, steps.length]);

  // Check if user has seen animation before
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('fighting-demons-seen-intro');
    if (hasSeenIntro) {
      setSkipAnimation(true);
    } else {
      localStorage.setItem('fighting-demons-seen-intro', 'true');
    }
  }, []);

  const handleSkip = () => {
    navigate('/register');
  };

  if (skipAnimation) {
    return null; // Don't render anything if skipping
  }

  const currentContent = steps[currentStep];

  return (
    <div className="intro-animation">
      <div className="intro-content">
        <motion.h1
          key={`title-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={currentContent.animation}
          transition={{ duration: 1 }}
          className="intro-title"
        >
          {currentContent.title}
        </motion.h1>
        
        <motion.p
          key={`text-${currentStep}`}
          initial={{ opacity: 0 }}
          animate={currentContent.animation}
          transition={{ duration: 1, delay: 0.5 }}
          className="intro-text"
        >
          {currentContent.text}
        </motion.p>
        
        <div className="intro-progress">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`progress-dot ${index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
      
      <button className="skip-button" onClick={handleSkip}>
        Skip
      </button>
    </div>
  );
};

export default IntroAnimation;
