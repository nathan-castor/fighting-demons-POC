import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userStorage, dailyRecordStorage } from '../../services/LocalStorageService';
import { scheduleDeferredNotification } from '../../services/NotificationService';
import { 
  getSpiritGuideStage, 
  checkEvolution
} from '../../config/gameConfig';
import EvolutionCelebration from '../EvolutionCelebration/EvolutionCelebration';
import {
  GREETINGS,
  ACTIVITY_INSTRUCTIONS,
  DEFER_MESSAGES,
  MEDITATION_PROMPT,
  COMPLETION_MESSAGES,
  PR_MESSAGE,
  getRandomLore
} from './loreData';
import './FaceOff.css';

// Points configuration per face-off type
const POINTS = {
  dawn: 10,  // Mile + meditation
  noon: 6,   // Pushups + meditation
  dusk: 6    // Pullups + meditation
};

const FaceOff = ({ faceOffType: propType, onComplete }) => {
  const navigate = useNavigate();
  const { type: routeType } = useParams();
  const faceOffType = propType || routeType || 'dawn';

  // Get current Spirit Guide stage
  const user = userStorage.getUser();
  const spiritGuide = getSpiritGuideStage(user?.totalPoints || 0);

  // Evolution celebration state
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionData, setEvolutionData] = useState({ fromStage: null, toStage: null });

  // State management
  const [currentStep, setCurrentStep] = useState('greeting');
  const [stepHistory, setStepHistory] = useState([]); // Track navigation history for back button
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [activityValue, setActivityValue] = useState('');
  const [meditationCompleted, setMeditationCompleted] = useState(false);
  const [meditationTimeRemaining, setMeditationTimeRemaining] = useState(600); // 10 minutes in seconds
  const [meditationActive, setMeditationActive] = useState(false);
  const [deferReason, setDeferReason] = useState('');
  const [isPR, setIsPR] = useState(false);
  const [displayedLoreIndex, setDisplayedLoreIndex] = useState(0);

  // Navigate to a step and track history
  const goToStep = (step) => {
    setStepHistory(prev => [...prev, currentStep]);
    setCurrentStep(step);
  };

  // Go back to previous step
  const goBack = () => {
    if (stepHistory.length > 0) {
      const previousStep = stepHistory[stepHistory.length - 1];
      setStepHistory(prev => prev.slice(0, -1));
      setCurrentStep(previousStep);
    } else {
      navigate('/dashboard');
    }
  };

  // Check if back button should be shown
  const canGoBack = currentStep !== 'greeting' && currentStep !== 'summary';

  // Select random lore on mount
  const selectedLore = useMemo(() => getRandomLore(), []);

  // Animation variants
  const stepVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
  };

  // Typewriter effect for lore
  useEffect(() => {
    if (currentStep === 'lore' && displayedLoreIndex < selectedLore.length) {
      const timer = setTimeout(() => {
        setDisplayedLoreIndex(prev => prev + 1);
      }, 40); // 40ms per character
      return () => clearTimeout(timer);
    }
  }, [currentStep, displayedLoreIndex, selectedLore]);

  // Meditation timer
  useEffect(() => {
    let interval;
    if (meditationActive && meditationTimeRemaining > 0) {
      interval = setInterval(() => {
        setMeditationTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (meditationTimeRemaining === 0) {
      setMeditationActive(false);
    }
    return () => clearInterval(interval);
  }, [meditationActive, meditationTimeRemaining]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get activity label based on type
  const getActivityLabel = () => {
    switch (faceOffType) {
      case 'dawn': return 'Mile Walk/Run';
      case 'noon': return 'Pushups';
      case 'dusk': return 'Pullups';
      default: return 'Activity';
    }
  };

  // Calculate deferred time (now + 1 hour)
  const getDeferredTime = () => {
    const deferredTime = new Date();
    deferredTime.setHours(deferredTime.getHours() + 1);
    return deferredTime.toISOString();
  };

  // Handle "Yes, I'm ready" click
  const handleReady = () => {
    goToStep('activity');
  };

  // Handle "Not yet" click
  const handleDefer = () => {
    goToStep('defer');
  };

  // Handle defer submission
  const handleDeferSubmit = async () => {
    const dailyRecord = dailyRecordStorage.getTodayRecord();
    const deferKey = `${faceOffType}DeferredUntil`;

    dailyRecordStorage.saveDailyRecord({
      ...dailyRecord,
      [deferKey]: getDeferredTime(),
      [`${faceOffType}DeferReason`]: deferReason || null
    });

    // Schedule a notification reminder for 1 hour from now
    await scheduleDeferredNotification(faceOffType);

    // Return to dashboard
    if (onComplete) {
      onComplete({ deferred: true });
    } else {
      navigate('/dashboard');
    }
  };

  // Handle activity completion
  const handleActivityComplete = () => {
    // For dawn (mile), just mark complete
    if (faceOffType === 'dawn') {
      setActivityCompleted(true);
      goToStep('meditation');
      return;
    }

    // For noon/dusk, validate and check PR
    const count = parseInt(activityValue, 10);
    if (isNaN(count) || count < 0) {
      return; // Don't proceed with invalid input
    }

    setActivityCompleted(true);

    // Check for PR
    const user = userStorage.getUser();
    const prKey = faceOffType === 'noon' ? 'pushupPR' : 'pullupPR';
    const currentPR = user?.[prKey] || 0;

    if (count > currentPR) {
      setIsPR(true);
      userStorage.saveUser({
        ...user,
        [prKey]: count
      });
    }

    goToStep('meditation');
  };

  // Handle starting meditation timer
  const handleStartMeditation = () => {
    setMeditationActive(true);
    goToStep('meditationTimer');
  };

  // Handle meditation complete
  const handleMeditationComplete = () => {
    setMeditationCompleted(true);
    setDisplayedLoreIndex(0); // Reset for typewriter effect
    goToStep('lore');
  };

  // Handle lore continue
  const handleLoreContinue = () => {
    goToStep('summary');
  };

  // Handle final completion
  const handleFinalComplete = useCallback(() => {
    const currentUser = userStorage.getUser();
    const dailyRecord = dailyRecordStorage.getTodayRecord();
    const oldPoints = currentUser?.totalPoints || 0;

    // Update daily record
    const updates = {
      [`${faceOffType}Completed`]: true
    };

    // Add specific data based on type
    if (faceOffType === 'dawn') {
      updates.mileCompleted = true;
    } else if (faceOffType === 'noon') {
      updates.pushupCount = parseInt(activityValue, 10) || 0;
    } else if (faceOffType === 'dusk') {
      updates.pullupCount = parseInt(activityValue, 10) || 0;
    }

    // Add meditation minutes
    updates.meditationMinutes = (dailyRecord.meditationMinutes || 0) + 10;

    dailyRecordStorage.saveDailyRecord({
      ...dailyRecord,
      ...updates
    });

    // Award points
    const pointsEarned = POINTS[faceOffType] + (isPR ? 5 : 0);
    const newLifeForce = (currentUser?.lifeForce || 100) + pointsEarned;
    const newTotalPoints = oldPoints + pointsEarned;

    // Update lifetime stats
    const lifetimeUpdates = {
      totalMeditationMinutes: (currentUser?.totalMeditationMinutes || 0) + 10,
      totalFaceOffsCompleted: (currentUser?.totalFaceOffsCompleted || 0) + 1
    };

    if (faceOffType === 'dawn') {
      lifetimeUpdates.totalMiles = (currentUser?.totalMiles || 0) + 1;
    } else if (faceOffType === 'noon') {
      lifetimeUpdates.totalPushups = (currentUser?.totalPushups || 0) + (parseInt(activityValue, 10) || 0);
    } else if (faceOffType === 'dusk') {
      lifetimeUpdates.totalPullups = (currentUser?.totalPullups || 0) + (parseInt(activityValue, 10) || 0);
    }

    userStorage.saveUser({
      ...currentUser,
      lifeForce: newLifeForce,
      totalPoints: newTotalPoints,
      ...lifetimeUpdates
    });

    // Check for Spirit Guide evolution
    const evolutionResult = checkEvolution(oldPoints, newTotalPoints);
    if (evolutionResult.evolved) {
      setEvolutionData({
        fromStage: evolutionResult.fromStage,
        toStage: evolutionResult.toStage
      });
      setShowEvolution(true);
      return; // Don't navigate yet - wait for evolution celebration
    }

    // Navigate to dashboard
    if (onComplete) {
      onComplete({
        completed: true,
        pointsEarned,
        isPR,
        activityValue: activityValue ? parseInt(activityValue, 10) : null
      });
    } else {
      navigate('/dashboard');
    }
  }, [faceOffType, activityValue, isPR, onComplete, navigate]);

  // Handle evolution celebration complete
  const handleEvolutionComplete = useCallback(() => {
    setShowEvolution(false);
    if (onComplete) {
      onComplete({ completed: true, evolved: true });
    } else {
      navigate('/dashboard');
    }
  }, [onComplete, navigate]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'greeting':
  return (
        <motion.div
            key="greeting"
            className="face-off-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="spirit-guide-container">
              <div className="spirit-guide-glow"></div>
              <div className="spirit-guide-icon spirit-guide-emoji">{spiritGuide.icon}</div>
              <div className="spirit-guide-stage-name">{spiritGuide.name}</div>
            </div>

            <p className="spirit-guide-text">{GREETINGS[faceOffType]}</p>

            <div className="button-group">
              <button className="primary-button" onClick={handleReady}>
                Yes, I'm ready
              </button>
              <button className="secondary-button" onClick={handleDefer}>
                Not yet
              </button>
            </div>
          </motion.div>
        );

      case 'defer':
        return (
          <motion.div
            key="defer"
            className="face-off-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="spirit-guide-container">
              <div className="spirit-guide-glow dim"></div>
              <div className="spirit-guide-icon spirit-guide-emoji dim">{spiritGuide.icon}</div>
            </div>

            <p className="spirit-guide-text">{DEFER_MESSAGES[faceOffType]}</p>

            <div className="defer-input-container">
              <label className="defer-label">What prevents you? (optional)</label>
              <textarea
                className="defer-input"
                placeholder="Share your reason if you wish..."
                value={deferReason}
                onChange={(e) => setDeferReason(e.target.value)}
                rows={3}
              />
          </div>

            <button className="primary-button" onClick={handleDeferSubmit}>
              Set Reminder
            </button>
          </motion.div>
        );

      case 'activity':
        return (
          <motion.div
            key="activity"
            className="face-off-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="activity-icon-container">
              {faceOffType === 'dawn' && <span className="activity-emoji">🏃</span>}
              {faceOffType === 'noon' && <span className="activity-emoji">💪</span>}
              {faceOffType === 'dusk' && <span className="activity-emoji">🧗</span>}
            </div>

            <h2 className="activity-title">{getActivityLabel()}</h2>
            <p className="spirit-guide-text">{ACTIVITY_INSTRUCTIONS[faceOffType]}</p>

            {faceOffType === 'dawn' ? (
              <button className="primary-button large" onClick={handleActivityComplete}>
                Mark Complete
              </button>
            ) : (
              <div className="count-input-container">
                <label className="count-label">How many?</label>
                <input
                  type="number"
                  className="count-input"
                  min="0"
                  placeholder="0"
                  value={activityValue}
                  onChange={(e) => setActivityValue(e.target.value)}
                  autoFocus
                />
                <button
                  className="primary-button"
                  onClick={handleActivityComplete}
                  disabled={activityValue === ''}
                >
                  Submit
                </button>
            </div>
          )}
        </motion.div>
        );

      case 'meditation':
        return (
          <motion.div
            key="meditation"
            className="face-off-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="meditation-icon">🧘</div>

            <h2 className="activity-title">Meditation</h2>
            <p className="spirit-guide-text">{MEDITATION_PROMPT}</p>

            <button className="primary-button large" onClick={handleStartMeditation}>
              Start Timer
            </button>
          </motion.div>
        );

      case 'meditationTimer':
        return (
        <motion.div
            key="meditationTimer"
            className="face-off-step timer-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          transition={{ duration: 0.5 }}
        >
            <div className={`timer-display ${meditationTimeRemaining === 0 ? 'complete' : ''}`}>
              <span className="timer-time">{formatTime(meditationTimeRemaining)}</span>
              {meditationActive && meditationTimeRemaining > 0 && (
                <div className="timer-pulse"></div>
              )}
          </div>

            {meditationTimeRemaining > 0 ? (
              <p className="timer-instruction">Breathe. Watch. Be still.</p>
            ) : (
              <>
                <p className="timer-complete-text">The silence has been kept.</p>
                <button className="primary-button" onClick={handleMeditationComplete}>
                  Meditation Complete
                </button>
              </>
            )}

            {meditationTimeRemaining > 0 && (
              <button
                className="skip-button"
                onClick={handleMeditationComplete}
              >
                Complete Early
              </button>
            )}
          </motion.div>
        );

      case 'lore':
        return (
          <motion.div
            key="lore"
            className="face-off-step lore-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="lore-container">
              <div className="lore-glow"></div>
              <blockquote className="lore-text">
                "{selectedLore.substring(0, displayedLoreIndex)}"
                <span className="lore-cursor">|</span>
              </blockquote>
            </div>

            {displayedLoreIndex >= selectedLore.length && (
          <motion.button
                className="primary-button"
                onClick={handleLoreContinue}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
          >
            Continue
          </motion.button>
            )}
          </motion.div>
        );

      case 'summary':
        const pointsEarned = POINTS[faceOffType] + (isPR ? 5 : 0);
        const user = userStorage.getUser();

        return (
          <motion.div
            key="summary"
            className="face-off-step summary-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="victory-icon">⚔️</div>

            <h2 className="summary-title">Face-Off Complete</h2>
            <p className="spirit-guide-text">{COMPLETION_MESSAGES[faceOffType]}</p>

            <div className="points-earned">
              <span className="points-number">+{pointsEarned}</span>
              <span className="points-label">Life Force</span>
            </div>

            {isPR && (
              <motion.div
                className="pr-celebration"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <span className="pr-icon">🏆</span>
                <span className="pr-text">{PR_MESSAGE}</span>
        </motion.div>
      )}

            {activityValue && faceOffType !== 'dawn' && (
              <div className="activity-summary">
                <span>{faceOffType === 'noon' ? 'Pushups' : 'Pullups'}: </span>
                <span className="activity-count">{activityValue}</span>
              </div>
            )}

            <div className="total-life-force">
              <span>Total Life Force: </span>
              <span className="total-number">{(user?.lifeForce || 100) + pointsEarned}</span>
            </div>

            <button className="primary-button large" onClick={handleFinalComplete}>
              Return to Dashboard
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Progress indicator
  const steps = ['greeting', 'activity', 'meditation', 'lore', 'summary'];
  const currentStepIndex = steps.indexOf(
    currentStep === 'defer' ? 'greeting' :
      currentStep === 'meditationTimer' ? 'meditation' :
        currentStep
  );

  return (
    <>
      <div className="face-off">
        <div className="face-off-background">
          <div className="ambient-glow"></div>
        </div>

        <div className="face-off-header">
          {canGoBack && (
            <button className="back-button" onClick={goBack} aria-label="Go back">
              ← Back
            </button>
          )}
          <span className="face-off-type">{faceOffType.toUpperCase()} FACE-OFF</span>
          {!canGoBack && <div className="back-button-placeholder"></div>}
        </div>

        <div className="progress-indicator">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`progress-dot ${index <= currentStepIndex ? 'active' : ''} ${index === currentStepIndex ? 'current' : ''}`}
            />
          ))}
        </div>

        <div className="face-off-content">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>

      {/* Evolution Celebration Modal */}
      <EvolutionCelebration
        isVisible={showEvolution}
        fromStage={evolutionData.fromStage}
        toStage={evolutionData.toStage}
        onComplete={handleEvolutionComplete}
      />
    </>
  );
};

export default FaceOff;
