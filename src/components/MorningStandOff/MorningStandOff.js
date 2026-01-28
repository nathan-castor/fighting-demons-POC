import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dailyRecordService, activityService } from '../../services/SupabaseService';
import './MorningStandOff.css';

// Wisdom quotes from Gnostic, Hermetic, and Stoic traditions
const WISDOM_QUOTES = [
  "You are not your thoughts. You are the silence that witnesses them.",
  "The demons do not want your destruction. They want your sleep. Wake.",
  "As above, so below. Your body is a temple. What do you place upon it?",
  "The archons cannot create — they can only distort. Every destructive urge is a twisted echo of something sacred.",
  "What you do today writes the story your soul will read tomorrow.",
  "Acedia — the noonday demon — makes all things feel meaningless. It lies. Meaning is not found, it is made.",
  "The untrained mind is an open gate. Meditation is learning to guard it.",
  "Between stimulus and response, there is a space. In that space lies your power.",
  "He who conquers himself is mightier than he who conquers a city.",
  "The obstacle is the way. What stands in your path becomes your path.",
  "Know thyself — for in that knowing, the demons lose their grip.",
  "Your body is the vessel. Your mind is the altar. Your will is the flame.",
  "The light you seek is already within. The demons only make you forget.",
  "Each morning you are born again. What you do today matters most.",
  "Stillness is not weakness. It is the gathering of power before the strike."
];

// Points configuration per game-design.md
const POINTS = {
  MOVEMENT: 10,
  MEDITATION: 5,
  PUSHUPS: 3,
  PULLUPS: 3
};

const MorningStandOff = ({ onComplete }) => {
  // State management
  const [currentStep, setCurrentStep] = useState('greeting');
  const [movementCompleted, setMovementCompleted] = useState(false);
  const [movementDeferredUntil, setMovementDeferredUntil] = useState(null);
  const [movementDeferredReason, setMovementDeferredReason] = useState('');
  const [meditationCompleted, setMeditationCompleted] = useState(false);
  const [meditationDeferredUntil, setMeditationDeferredUntil] = useState(null);
  const [meditationDeferredReason, setMeditationDeferredReason] = useState('');
  const [pushupCount, setPushupCount] = useState('');
  const [pullupCount, setPullupCount] = useState('');
  const [totalLifeForce, setTotalLifeForce] = useState(0);

  // Select random wisdom quote on mount
  const wisdomQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * WISDOM_QUOTES.length);
    return WISDOM_QUOTES[randomIndex];
  }, []);

  // Animation variants for step transitions
  const stepVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
  };

  // Calculate deferred time (now + 1 hour)
  const getDeferredTime = () => {
    const deferredTime = new Date();
    deferredTime.setHours(deferredTime.getHours() + 1);
    return deferredTime.toISOString();
  };

  // Handle movement choice
  const handleMovementChoice = (completed) => {
    if (completed) {
      setMovementCompleted(true);
      setCurrentStep('meditation');
    } else {
      setMovementDeferredUntil(getDeferredTime());
      setCurrentStep('movementDefer');
    }
  };

  // Handle movement defer submission
  const handleMovementDeferSubmit = () => {
    setCurrentStep('meditation');
  };

  // Handle meditation choice
  const handleMeditationChoice = (completed) => {
    if (completed) {
      setMeditationCompleted(true);
      setCurrentStep('strengthTests');
    } else {
      setMeditationDeferredUntil(getDeferredTime());
      setCurrentStep('meditationDefer');
    }
  };

  // Handle meditation defer submission
  const handleMeditationDeferSubmit = () => {
    setCurrentStep('strengthTests');
  };

  // Handle strength tests submission
  const handleStrengthTestsSubmit = () => {
    setCurrentStep('wisdom');
  };

  // Handle wisdom acknowledgment
  const handleWisdomContinue = () => {
    setCurrentStep('summary');
  };

  // Calculate total life force earned
  useEffect(() => {
    let total = 0;
    if (movementCompleted) total += POINTS.MOVEMENT;
    if (meditationCompleted) total += POINTS.MEDITATION;
    if (pushupCount !== '' && pushupCount !== null) total += POINTS.PUSHUPS;
    if (pullupCount !== '' && pullupCount !== null) total += POINTS.PULLUPS;
    setTotalLifeForce(total);
  }, [movementCompleted, meditationCompleted, pushupCount, pullupCount]);

  // Save to Supabase on summary step
  const handleCompleteMorningStandOff = async () => {
    try {
      // Save movement activity if completed
      if (movementCompleted) {
        await activityService.createActivity('movement', true, POINTS.MOVEMENT);
      }

      // Save meditation activity if completed
      if (meditationCompleted) {
        await activityService.createActivity('meditation', true, POINTS.MEDITATION);
      }

      // Save pushups if logged
      if (pushupCount !== '' && pushupCount !== null) {
        await activityService.createActivity('pushups', true, POINTS.PUSHUPS, { count: parseInt(pushupCount, 10) });
      }

      // Save pullups if logged
      if (pullupCount !== '' && pullupCount !== null) {
        await activityService.createActivity('pullups', true, POINTS.PULLUPS, { count: parseInt(pullupCount, 10) });
      }

      // Update daily record with morning standoff data
      await dailyRecordService.updateTodayRecord({
        morning_standoff_completed: true,
        movement_completed: movementCompleted,
        movement_deferred_until: movementDeferredUntil,
        movement_deferred_reason: movementDeferredReason || null,
        meditation_completed: meditationCompleted,
        meditation_deferred_until: meditationDeferredUntil,
        meditation_deferred_reason: meditationDeferredReason || null,
        pushup_count: pushupCount !== '' ? parseInt(pushupCount, 10) : null,
        pullup_count: pullupCount !== '' ? parseInt(pullupCount, 10) : null,
        wisdom_quote: wisdomQuote
      });

      // Call the completion callback if provided
      if (onComplete) {
        onComplete({
          movementCompleted,
          meditationCompleted,
          pushupCount: pushupCount !== '' ? parseInt(pushupCount, 10) : null,
          pullupCount: pullupCount !== '' ? parseInt(pullupCount, 10) : null,
          totalLifeForce
        });
      }
    } catch (err) {
      console.error('Error saving morning stand-off:', err);
      // Still call onComplete even if save fails so user isn't stuck
      if (onComplete) {
        onComplete({
          movementCompleted,
          meditationCompleted,
          pushupCount: pushupCount !== '' ? parseInt(pushupCount, 10) : null,
          pullupCount: pullupCount !== '' ? parseInt(pullupCount, 10) : null,
          totalLifeForce
        });
      }
    }
  };

  // Format deferred time for display
  const formatDeferredTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render current step content
  const renderStep = () => {
    switch (currentStep) {
      case 'greeting':
        return (
          <motion.div
            key="greeting"
            className="step-content"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="spirit-guide-text">
              <p>Good morning.</p>
              <p>The demons have sensed your presence.</p>
              <p>Through the night, they whispered to your sleeping mind. They want you to feel heavy today. To believe that nothing matters. That you can rest — just today.</p>
              <p className="emphasis">Do not listen.</p>
            </div>
            <button
              className="primary-button"
              onClick={() => setCurrentStep('movement')}
            >
              I am awake
            </button>
          </motion.div>
        );

      case 'movement':
        return (
          <motion.div
            key="movement"
            className="step-content"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="spirit-guide-text">
              <p>Physical stagnation is the primary vector for demonic influence.</p>
              <p>Moving the body moves energy, clears the mind, proves agency.</p>
              <p className="question">Will you move your body now?</p>
            </div>
            <div className="choice-buttons">
              <button
                className="primary-button"
                onClick={() => handleMovementChoice(true)}
              >
                Yes
              </button>
              <button
                className="secondary-button"
                onClick={() => handleMovementChoice(false)}
              >
                Not Yet
              </button>
            </div>
          </motion.div>
        );

      case 'movementDefer':
        return (
          <motion.div
            key="movementDefer"
            className="step-content"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="spirit-guide-text">
              <p>I understand. Life has demands.</p>
              <p>I will remind you at <span className="highlight">{formatDeferredTime(movementDeferredUntil)}</span>.</p>
              <p className="optional-prompt">Briefly, what prevents you? <span className="optional-label">(optional)</span></p>
            </div>
            <textarea
              className="defer-reason-input"
              placeholder="Share your reason if you wish..."
              value={movementDeferredReason}
              onChange={(e) => setMovementDeferredReason(e.target.value)}
              rows={3}
            />
            <button
              className="primary-button"
              onClick={handleMovementDeferSubmit}
            >
              Continue
            </button>
          </motion.div>
        );

      case 'meditation':
        return (
          <motion.div
            key="meditation"
            className="step-content"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="spirit-guide-text">
              <p>Movement awakens the body.</p>
              <p>Now, will you still the mind?</p>
              <p>Ten minutes of silence builds the wall the demons cannot cross.</p>
              <p className="question">Will you still your mind?</p>
            </div>
            <div className="choice-buttons">
              <button
                className="primary-button"
                onClick={() => handleMeditationChoice(true)}
              >
                Yes
              </button>
              <button
                className="secondary-button"
                onClick={() => handleMeditationChoice(false)}
              >
                Not Yet
              </button>
            </div>
          </motion.div>
        );

      case 'meditationDefer':
        return (
          <motion.div
            key="meditationDefer"
            className="step-content"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="spirit-guide-text">
              <p>Very well. The stillness will wait.</p>
              <p>I will call to you at <span className="highlight">{formatDeferredTime(meditationDeferredUntil)}</span>.</p>
              <p className="optional-prompt">What draws your attention elsewhere? <span className="optional-label">(optional)</span></p>
            </div>
            <textarea
              className="defer-reason-input"
              placeholder="Share your reason if you wish..."
              value={meditationDeferredReason}
              onChange={(e) => setMeditationDeferredReason(e.target.value)}
              rows={3}
            />
            <button
              className="primary-button"
              onClick={handleMeditationDeferSubmit}
            >
              Continue
            </button>
          </motion.div>
        );

      case 'strengthTests':
        return (
          <motion.div
            key="strengthTests"
            className="step-content"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="spirit-guide-text">
              <p>Now for the strength tests.</p>
              <p>You are not required to hit a number — you are required to attempt your maximum.</p>
              <p>Even one counts if it was your true effort.</p>
            </div>
            <div className="strength-inputs">
              <div className="strength-input-group">
                <label htmlFor="pushups">Max Pushups</label>
                <input
                  type="number"
                  id="pushups"
                  min="0"
                  placeholder="0"
                  value={pushupCount}
                  onChange={(e) => setPushupCount(e.target.value)}
                />
              </div>
              <div className="strength-input-group">
                <label htmlFor="pullups">Max Pullups</label>
                <input
                  type="number"
                  id="pullups"
                  min="0"
                  placeholder="0"
                  value={pullupCount}
                  onChange={(e) => setPullupCount(e.target.value)}
                />
              </div>
            </div>
            <p className="strength-note">If you cannot do pullups yet, log "0" — the attempt counts.</p>
            <button
              className="primary-button"
              onClick={handleStrengthTestsSubmit}
            >
              Continue
            </button>
          </motion.div>
        );

      case 'wisdom':
        return (
          <motion.div
            key="wisdom"
            className="step-content wisdom-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="wisdom-container">
              <div className="wisdom-icon">✦</div>
              <blockquote className="wisdom-quote">
                "{wisdomQuote}"
              </blockquote>
              <p className="wisdom-instruction">Carry this with you today.</p>
            </div>
            <button
              className="primary-button"
              onClick={handleWisdomContinue}
            >
              I receive this wisdom
            </button>
          </motion.div>
        );

      case 'summary':
        return (
          <motion.div
            key="summary"
            className="step-content summary-step"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="spirit-guide-text">
              <p>The morning stand-off is complete.</p>
              <p>Here is where you stand:</p>
            </div>

            <div className="summary-card">
              <h3>Today's Commitments</h3>

              <div className="summary-section">
                <h4>Essentials</h4>
                <div className="summary-item">
                  <span className="summary-label">Movement</span>
                  {movementCompleted ? (
                    <span className="summary-value completed">
                      ✓ Completed <span className="points">+{POINTS.MOVEMENT} Life Force</span>
                    </span>
                  ) : (
                    <span className="summary-value deferred">
                      ⏱ Deferred until {formatDeferredTime(movementDeferredUntil)}
                    </span>
                  )}
                </div>
                <div className="summary-item">
                  <span className="summary-label">Meditation</span>
                  {meditationCompleted ? (
                    <span className="summary-value completed">
                      ✓ Completed <span className="points">+{POINTS.MEDITATION} Life Force</span>
                    </span>
                  ) : (
                    <span className="summary-value deferred">
                      ⏱ Deferred until {formatDeferredTime(meditationDeferredUntil)}
                    </span>
                  )}
                </div>
              </div>

              <div className="summary-section">
                <h4>Strength Tests</h4>
                <div className="summary-item">
                  <span className="summary-label">Pushups</span>
                  <span className="summary-value">
                    {pushupCount !== '' ? (
                      <>
                        {pushupCount} reps <span className="points">+{POINTS.PUSHUPS} Life Force</span>
                      </>
                    ) : (
                      <span className="skipped">Not logged</span>
                    )}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pullups</span>
                  <span className="summary-value">
                    {pullupCount !== '' ? (
                      <>
                        {pullupCount} reps <span className="points">+{POINTS.PULLUPS} Life Force</span>
                      </>
                    ) : (
                      <span className="skipped">Not logged</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="summary-total">
                <span>Total Life Force Earned</span>
                <span className="total-points">+{totalLifeForce}</span>
              </div>
            </div>

            <button
              className="primary-button"
              onClick={handleCompleteMorningStandOff}
            >
              Begin the day
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Progress indicator
  const steps = ['greeting', 'movement', 'meditation', 'strengthTests', 'wisdom', 'summary'];
  const currentStepIndex = steps.indexOf(
    currentStep === 'movementDefer' ? 'movement' :
    currentStep === 'meditationDefer' ? 'meditation' :
    currentStep
  );

  return (
    <div className="morning-standoff">
      <div className="ambient-background"></div>

      <div className="progress-indicator">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`progress-step ${index <= currentStepIndex ? 'active' : ''} ${index === currentStepIndex ? 'current' : ''}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default MorningStandOff;
