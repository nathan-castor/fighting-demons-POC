import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userStorage, dailyRecordStorage, activityStorage, faceOffStorage } from '../../services/LocalStorageService';
import FaceOff from '../FaceOff/FaceOff';
import ActivityTracker from '../ActivityTracker/ActivityTracker';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [activities, setActivities] = useState([]);
  const [faceOffs, setFaceOffs] = useState([]);
  const [showFaceOffModal, setShowFaceOffModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load user data and today's record
  useEffect(() => {
    const userData = userStorage.getUser();
    if (!userData) {
      navigate('/register');
      return;
    }
    
    setUser(userData);
    
    const record = dailyRecordStorage.getTodayRecord();
    setTodayRecord(record);
    
    setActivities(record.activities);
    setFaceOffs(record.faceOffs);
  }, [navigate]);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!user) return 0;
    const total = user.userPoints + user.demonPoints;
    return total > 0 ? Math.round((user.userPoints / total) * 100) : 50;
  };

  // Handle starting a new face-off
  const handleStartFaceOff = (category) => {
    setSelectedCategory(category);
    setShowFaceOffModal(true);
  };

  // Handle completing a walk activity
  const handleCompleteWalk = () => {
    const newActivity = activityStorage.createActivity('walk', true, 2);
    setActivities([...activities, newActivity]);
    
    // Update the today record
    const updatedRecord = dailyRecordStorage.getTodayRecord();
    setTodayRecord(updatedRecord);
    
    // Update user state with new points
    setUser(userStorage.getUser());
  };

  // Handle completing a stretch activity
  const handleCompleteStretch = () => {
    const newActivity = activityStorage.createActivity('stretch', true, 1);
    setActivities([...activities, newActivity]);
    
    // Update the today record
    const updatedRecord = dailyRecordStorage.getTodayRecord();
    setTodayRecord(updatedRecord);
    
    // Update user state with new points
    setUser(userStorage.getUser());
  };

  // Handle logging out
  const handleLogout = () => {
    // We don't actually clear the user data, just redirect to login
    navigate('/register');
  };

  if (!user || !todayRecord) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Fighting Demons</h1>
        <div className="user-info">
          <span>{user.name}</span>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <section className="battle-status">
          <h2>Today's Battle</h2>
          
          <div className="progress-container">
            <div className="progress-labels">
              <span>You: {user.userPoints} pts</span>
              <span>Demons: {user.demonPoints} pts</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            
            <div className="battle-message">
              {calculateProgress() > 50 
                ? "You're winning the battle!" 
                : "The demons are gaining strength!"}
            </div>
          </div>
          
          <div className="daily-mile-status">
            <h3>Daily Mile Challenge</h3>
            {todayRecord.mileCompleted ? (
              <div className="completed-status">
                <span className="checkmark">✓</span>
                <span>Completed! (+2 points)</span>
              </div>
            ) : (
              <button 
                className="action-button"
                onClick={handleCompleteWalk}
              >
                Record Mile Walk/Run
              </button>
            )}
          </div>
        </section>
        
        <section className="face-offs">
          <h2>Face the Demons</h2>
          <p>Record your choices in daily face-offs against the demons</p>
          
          <div className="face-off-categories">
            <motion.div 
              className="category-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartFaceOff('walk')}
            >
              <div className="category-icon walk-icon">🚶</div>
              <h3>Walking</h3>
              <p>Face-offs about daily movement</p>
            </motion.div>
            
            <motion.div 
              className="category-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartFaceOff('alcohol')}
            >
              <div className="category-icon alcohol-icon">🍷</div>
              <h3>Alcohol</h3>
              <p>Face-offs about drinking choices</p>
            </motion.div>
            
            <motion.div 
              className="category-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStartFaceOff('stretch')}
            >
              <div className="category-icon stretch-icon">🧘</div>
              <h3>Stretching</h3>
              <p>Face-offs about flexibility</p>
            </motion.div>
          </div>
        </section>
        
        <section className="recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button 
              className="record-activity-button"
              onClick={() => setShowActivityModal(true)}
            >
              Record Activity
            </button>
          </div>
          
          {activities.length === 0 && faceOffs.length === 0 ? (
            <div className="empty-state">
              <p>No activities recorded today. Start by recording your daily mile or a face-off!</p>
            </div>
          ) : (
            <div className="activity-list">
              {[...activities, ...faceOffs]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 5)
                .map(item => {
                  const isActivity = 'completed' in item;
                  const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div key={item.id} className="activity-item">
                      <div className="activity-time">{time}</div>
                      <div className="activity-details">
                        {isActivity ? (
                          <>
                            <div className="activity-title">
                              {item.type === 'walk' ? 'Walked a mile' : 
                               item.type === 'stretch' ? 'Completed stretching' : 
                               'Recorded activity'}
                            </div>
                            <div className="activity-points">+{item.pointsEarned} points</div>
                          </>
                        ) : (
                          <>
                            <div className="activity-title">
                              Face-off: {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </div>
                            <div className={`activity-points ${item.userWon ? 'win' : 'loss'}`}>
                              {item.userWon ? `+${item.pointsImpact} points` : `Demons +${item.pointsImpact} points`}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      </main>
      
      {showFaceOffModal && (
        <div className="modal-overlay">
          <div className="face-off-modal">
            <button 
              className="close-modal"
              onClick={() => setShowFaceOffModal(false)}
            >
              ×
            </button>
            <h2>Face-off: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2>
            
            <FaceOff 
              category={selectedCategory} 
              onComplete={() => {
                setShowFaceOffModal(false);
                // Update state after face-off completion
                const updatedRecord = dailyRecordStorage.getTodayRecord();
                setTodayRecord(updatedRecord);
                setFaceOffs(updatedRecord.faceOffs);
                setUser(userStorage.getUser());
              }} 
            />
          </div>
        </div>
      )}
      
      {showActivityModal && (
        <div className="modal-overlay">
          <div className="activity-modal">
            <button 
              className="close-modal"
              onClick={() => setShowActivityModal(false)}
            >
              ×
            </button>
            <h2>Record Activity</h2>
            
            <ActivityTracker 
              onComplete={() => {
                setShowActivityModal(false);
                // Update state after activity completion
                const updatedRecord = dailyRecordStorage.getTodayRecord();
                setTodayRecord(updatedRecord);
                setActivities(updatedRecord.activities);
                setUser(userStorage.getUser());
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
