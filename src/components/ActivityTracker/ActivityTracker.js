import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { activityStorage, userStorage } from '../../services/LocalStorageService';
import './ActivityTracker.css';

const ActivityTracker = ({ onComplete }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Activity types and their details
  const activityTypes = [
    {
      id: 'walk',
      name: 'Walk/Run a Mile',
      icon: '🚶',
      points: 2,
      description: 'Complete your daily mile to keep the demons at bay'
    },
    {
      id: 'meditation',
      name: 'Meditation',
      icon: '🧘',
      points: 5,
      description: 'Still your mind and build the wall demons cannot cross'
    },
    {
      id: 'alcohol',
      name: 'Avoided Alcohol',
      icon: '🍷',
      points: 1,
      description: 'Resisted the temptation of drinking'
    }
  ];

  // Load today's activities
  useEffect(() => {
    const todayActivities = activityStorage.getTodayActivities();
    setActivities(todayActivities);
  }, []);

  // Handle selecting an activity
  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
  };

  // Handle completing an activity
  const handleCompleteActivity = () => {
    if (!selectedActivity) return;

    // Check if this activity has already been completed today
    const alreadyCompleted = activities.some(
      activity => activity.type === selectedActivity.id && activity.completed
    );

    if (alreadyCompleted && selectedActivity.id === 'walk') {
      setShowConfirmation(true);
      return;
    }

    // Create the activity
    const newActivity = activityStorage.createActivity(
      selectedActivity.id,
      true,
      selectedActivity.points
    );

    // Update the activities list
    setActivities([...activities, newActivity]);

    // Show confirmation
    setShowConfirmation(true);
  };

  // Handle closing the confirmation
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSelectedActivity(null);

    if (onComplete) {
      onComplete();
    }
  };

  // Check if an activity has been completed today
  const isActivityCompleted = (activityId) => {
    return activities.some(
      activity => activity.type === activityId && activity.completed
    );
  };

  return (
    <div className="activity-tracker">
      <h2>Record Your Activities</h2>
      <p className="tracker-description">
        Complete activities to earn points in your battle against the demons
      </p>

      {!showConfirmation ? (
        <>
          <div className="activity-grid">
            {activityTypes.map((activity) => (
              <motion.div
                key={activity.id}
                className={`activity-card ${selectedActivity?.id === activity.id ? 'selected' : ''} ${isActivityCompleted(activity.id) ? 'completed' : ''}`}
                onClick={() => handleSelectActivity(activity)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="activity-icon">{activity.icon}</div>
                <h3>{activity.name}</h3>
                <p>{activity.description}</p>
                <div className="activity-points">+{activity.points} points</div>

                {isActivityCompleted(activity.id) && (
                  <div className="completed-badge">
                    <span className="checkmark">✓</span>
                    <span>Completed Today</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {selectedActivity && (
            <motion.div
              className="activity-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p>
                <strong>{selectedActivity.name}</strong> - {selectedActivity.description}
              </p>

              <button
                className="complete-activity-button"
                onClick={handleCompleteActivity}
              >
                {isActivityCompleted(selectedActivity.id)
                  ? 'Record Again'
                  : 'Complete Activity'}
              </button>

              <button
                className="cancel-button"
                onClick={() => setSelectedActivity(null)}
              >
                Cancel
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          className="confirmation-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="confirmation-icon">✓</div>
          <h3>Activity Recorded!</h3>
          <p>
            You've earned {selectedActivity.points} points in your battle against the demons.
            Keep up the good work!
          </p>
          <button
            className="close-confirmation-button"
            onClick={handleCloseConfirmation}
          >
            Continue
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ActivityTracker;
