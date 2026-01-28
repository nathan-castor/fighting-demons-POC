import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userStorage, dailyRecordStorage, dataExportImport, statsCalculator, achievementStorage } from '../../services/LocalStorageService';
import { initializeNotifications, checkPermissions, scheduleDailyNotifications, cancelAllNotifications, sendTestNotification, getPendingNotifications } from '../../services/NotificationService';
import { 
  getSpiritGuideStage, 
  getUserTitle, 
  getEvolutionProgress, 
  getNextEvolution,
  ACHIEVEMENTS 
} from '../../config/gameConfig';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);
  const [lifetimeStats, setLifetimeStats] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsTab, setSettingsTab] = useState('account'); // 'account', 'notifications', 'devtools'
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'stats', 'achievements'
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('unknown');
  const [exportMessage, setExportMessage] = useState('');
  const fileInputRef = useRef(null);

  // Load user data and today's record
  useEffect(() => {
    const loadData = async () => {
      const userData = userStorage.getUser();
      if (!userData) {
        navigate('/register');
        return;
      }

      setUser(userData);

      const record = dailyRecordStorage.getTodayRecord();
      setTodayRecord(record);

      // Load lifetime stats
      const stats = statsCalculator.getLifetimeStats();
      setLifetimeStats(stats);

      // Load achievements
      const achievements = achievementStorage.getUnlockedAchievements();
      setUnlockedAchievements(achievements);

      // Check notification permissions
      const permissionStatus = await checkPermissions();
      setNotificationsEnabled(permissionStatus.granted);
      setNotificationStatus(permissionStatus.granted ? 'enabled' : 'disabled');

      setLoading(false);
    };

    loadData();
  }, [navigate]);

  // Initialize notifications on first load if permitted
  useEffect(() => {
    const initNotifs = async () => {
      if (notificationsEnabled) {
        await scheduleDailyNotifications();
      }
    };
    initNotifs();
  }, [notificationsEnabled]);

  // Get Spirit Guide and User Title based on total points
  const spiritGuide = getSpiritGuideStage(user?.totalPoints || 0);
  const userTitle = getUserTitle(user?.totalPoints || 0);
  const evolutionProgress = getEvolutionProgress(user?.totalPoints || 0);
  const nextEvolution = getNextEvolution(user?.totalPoints || 0);

  // Get face-off status
  const getFaceOffStatus = (type) => {
    if (!todayRecord) return 'pending';

    const completedKey = `${type}Completed`;
    const deferredKey = `${type}DeferredUntil`;

    if (todayRecord[completedKey]) return 'completed';
    if (todayRecord[deferredKey]) {
      const deferredTime = new Date(todayRecord[deferredKey]);
      if (deferredTime > new Date()) {
        return `deferred until ${deferredTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    }
    return 'pending';
  };

  // Handle starting a face-off
  const handleStartFaceOff = (type) => {
    navigate(`/face-off/${type}`);
  };

  // Handle logging out
  const handleLogout = () => {
    navigate('/register');
  };

  // Handle full reset (new user experience)
  const handleFullReset = () => {
    if (window.confirm('This will clear all your data and start fresh. Continue?')) {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
    }
  };

  // Handle replay intro
  const handleReplayIntro = () => {
    localStorage.removeItem('fighting-demons-seen-intro');
    navigate('/');
  };

  // Handle enabling notifications
  const handleEnableNotifications = async () => {
    setNotificationStatus('enabling...');
    const result = await initializeNotifications();
    if (result.success) {
      setNotificationsEnabled(true);
      setNotificationStatus('enabled');
    } else {
      setNotificationStatus(`failed: ${result.message}`);
    }
  };

  // Handle disabling notifications
  const handleDisableNotifications = async () => {
    await cancelAllNotifications();
    setNotificationsEnabled(false);
    setNotificationStatus('disabled');
  };

  // Handle data export
  const handleExportData = () => {
    try {
      const filename = dataExportImport.downloadExport();
      setExportMessage(`✅ Exported to ${filename}`);
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      setExportMessage(`❌ Export failed: ${error.message}`);
    }
  };

  // Handle data import
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = dataExportImport.importFromFile(e.target.result);
        if (result.success) {
          setExportMessage(`✅ Imported data from ${result.originalExportDate}`);
          // Reload to reflect imported data
          setTimeout(() => window.location.reload(), 1500);
        }
      } catch (error) {
        setExportMessage(`❌ Import failed: ${error.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  // Handle fresh start while keeping data backed up
  const handleFreshStartKeepData = () => {
    if (window.confirm('This will export your current data, then reset the app for a fresh experience. Continue?')) {
      // Export first
      dataExportImport.downloadExport();
      // Then reset
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
      }, 500);
    }
  };

  // Handle creating a new profile (keeps history but resets user)
  const handleNewProfile = () => {
    if (window.confirm('Create a new profile? Your history will be kept in storage.')) {
      userStorage.clearUser();
      localStorage.removeItem('fighting-demons-seen-intro');
      navigate('/');
    }
  };

  // Calculate life force percentage for display
  const getLifeForcePercentage = () => {
    const lifeForce = user?.lifeForce || 100;
    return Math.min(100, Math.max(0, lifeForce));
  };

  // Get life force bar color
  const getLifeForceColor = () => {
    const percentage = getLifeForcePercentage();
    if (percentage > 60) return '#4CAF50';
    if (percentage > 30) return '#FFD93D';
    return '#e74c3c';
  };

  // Get data summary for dev tools
  const getDataSummary = () => {
    return dataExportImport.getDataSummary();
  };

  if (loading || !user) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading your journey...</p>
      </div>
    );
  }

  const completedCount = [
    todayRecord?.dawnCompleted,
    todayRecord?.noonCompleted,
    todayRecord?.duskCompleted
  ].filter(Boolean).length;
  const dataSummary = getDataSummary();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Fighting Demons</h1>
        <div className="user-info">
          <span className="user-title-badge">{userTitle.name}</span>
          <span>{user.name}</span>
          <button className="settings-button" onClick={() => setShowSettingsModal(true)}>⚙️</button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Spirit Guide & User Profile Section */}
        <section className="spirit-guide-section">
          <div className="spirit-guide-display">
            <div className="spirit-guide-icon-container">
              <div className="spirit-guide-icon">{spiritGuide.icon}</div>
              <div className="evolution-progress-ring" style={{ '--progress': `${evolutionProgress}%` }}></div>
            </div>
            <div className="spirit-guide-info">
              <span className="spirit-guide-name">{spiritGuide.name}</span>
              <span className="spirit-guide-label">Spirit Guide</span>
              {nextEvolution && (
                <span className="next-evolution-hint">
                  {nextEvolution.pointsNeeded} pts to {nextEvolution.stage.name}
                </span>
              )}
            </div>
          </div>

          <div className="life-force-display">
            <div className="life-force-header">
              <span className="life-force-label">Life Force</span>
              <span className="life-force-value">{user.lifeForce || 100}</span>
            </div>
            <div className="life-force-bar">
              <div
                className="life-force-fill"
                style={{
                  width: `${getLifeForcePercentage()}%`,
                  backgroundColor: getLifeForceColor()
                }}
              ></div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-value">{user.totalPoints || 0}</span>
              <span className="stat-label">Total Points</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.currentStreak || 0}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{completedCount}/3</span>
              <span className="stat-label">Today</span>
            </div>
          </div>
        </section>

        {/* Daily Face-Offs Section */}
        <section className="face-offs-section">
          <h2>Daily Face-Offs</h2>
          <p className="section-description">Three battles each day. Dawn, Noon, and Dusk.</p>

          <div className="face-off-cards">
            {/* Dawn Face-Off */}
            <motion.div
              className={`face-off-card dawn ${getFaceOffStatus('dawn') === 'completed' ? 'completed' : ''}`}
              whileHover={{ scale: getFaceOffStatus('dawn') === 'completed' ? 1 : 1.02 }}
              whileTap={{ scale: getFaceOffStatus('dawn') === 'completed' ? 1 : 0.98 }}
              onClick={() => getFaceOffStatus('dawn') !== 'completed' && handleStartFaceOff('dawn')}
            >
              <div className="face-off-card-header">
                <span className="face-off-time">DAWN</span>
                <span className="face-off-icon">🌅</span>
              </div>
              <div className="face-off-card-content">
                <h3>Morning Stand-Off</h3>
                <p>1 Mile • 10 Min Meditation</p>
                <span className="face-off-points">+10 Life Force</span>
              </div>
              <div className="face-off-card-status">
                {getFaceOffStatus('dawn') === 'completed' ? (
                  <span className="status-completed">✓ Complete</span>
                ) : getFaceOffStatus('dawn').startsWith('deferred') ? (
                  <span className="status-deferred">{getFaceOffStatus('dawn')}</span>
                ) : (
                  <span className="status-pending">Begin →</span>
                )}
              </div>
            </motion.div>

            {/* Noon Face-Off */}
            <motion.div
              className={`face-off-card noon ${getFaceOffStatus('noon') === 'completed' ? 'completed' : ''}`}
              whileHover={{ scale: getFaceOffStatus('noon') === 'completed' ? 1 : 1.02 }}
              whileTap={{ scale: getFaceOffStatus('noon') === 'completed' ? 1 : 0.98 }}
              onClick={() => getFaceOffStatus('noon') !== 'completed' && handleStartFaceOff('noon')}
            >
              <div className="face-off-card-header">
                <span className="face-off-time">NOON</span>
                <span className="face-off-icon">☀️</span>
              </div>
              <div className="face-off-card-content">
                <h3>Midday Strength</h3>
                <p>Max Pushups • 10 Min Meditation</p>
                <span className="face-off-points">+6 Life Force</span>
              </div>
              <div className="face-off-card-status">
                {getFaceOffStatus('noon') === 'completed' ? (
                  <>
                    <span className="status-completed">✓ Complete</span>
                    {todayRecord?.pushupCount && (
                      <span className="activity-count">{todayRecord.pushupCount} pushups</span>
                    )}
                  </>
                ) : getFaceOffStatus('noon').startsWith('deferred') ? (
                  <span className="status-deferred">{getFaceOffStatus('noon')}</span>
                ) : (
                  <span className="status-pending">Begin →</span>
                )}
              </div>
            </motion.div>

            {/* Dusk Face-Off */}
            <motion.div
              className={`face-off-card dusk ${getFaceOffStatus('dusk') === 'completed' ? 'completed' : ''}`}
              whileHover={{ scale: getFaceOffStatus('dusk') === 'completed' ? 1 : 1.02 }}
              whileTap={{ scale: getFaceOffStatus('dusk') === 'completed' ? 1 : 0.98 }}
              onClick={() => getFaceOffStatus('dusk') !== 'completed' && handleStartFaceOff('dusk')}
            >
              <div className="face-off-card-header">
                <span className="face-off-time">DUSK</span>
                <span className="face-off-icon">🌙</span>
              </div>
              <div className="face-off-card-content">
                <h3>Evening Stand</h3>
                <p>Max Pullups • 10 Min Meditation</p>
                <span className="face-off-points">+6 Life Force</span>
              </div>
              <div className="face-off-card-status">
                {getFaceOffStatus('dusk') === 'completed' ? (
                  <>
                    <span className="status-completed">✓ Complete</span>
                    {todayRecord?.pullupCount && (
                      <span className="activity-count">{todayRecord.pullupCount} pullups</span>
                    )}
                  </>
                ) : getFaceOffStatus('dusk').startsWith('deferred') ? (
                  <span className="status-deferred">{getFaceOffStatus('dusk')}</span>
                ) : (
                  <span className="status-pending">Begin →</span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tab Navigation for Records/Stats/Achievements */}
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Records
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Lifetime
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Badges
          </button>
        </div>

        {/* Personal Records Tab */}
        {activeTab === 'today' && (
          <section className="records-section">
            <h2>Personal Records</h2>
            <div className="records-grid">
              <div className="record-item">
                <span className="record-icon">💪</span>
                <span className="record-value">{user.pushupPR || 0}</span>
                <span className="record-label">Pushup PR</span>
              </div>
              <div className="record-item">
                <span className="record-icon">🧗</span>
                <span className="record-value">{user.pullupPR || 0}</span>
                <span className="record-label">Pullup PR</span>
              </div>
              <div className="record-item">
                <span className="record-icon">🧘</span>
                <span className="record-value">{todayRecord?.meditationMinutes || 0}</span>
                <span className="record-label">Min Today</span>
              </div>
              <div className="record-item">
                <span className="record-icon">🏆</span>
                <span className="record-value">{user.longestStreak || 0}</span>
                <span className="record-label">Best Streak</span>
              </div>
            </div>
          </section>
        )}

        {/* Lifetime Stats Tab */}
        {activeTab === 'stats' && lifetimeStats && (
          <section className="stats-section">
            <h2>Lifetime Stats</h2>
            <div className="lifetime-stats-grid">
              <div className="lifetime-stat-card">
                <span className="stat-icon">🏃</span>
                <span className="stat-big-value">{lifetimeStats.totalMiles || user.totalMiles || 0}</span>
                <span className="stat-unit">miles</span>
                <span className="stat-desc">Total Distance</span>
              </div>
              <div className="lifetime-stat-card">
                <span className="stat-icon">💪</span>
                <span className="stat-big-value">{lifetimeStats.totalPushups || user.totalPushups || 0}</span>
                <span className="stat-unit">reps</span>
                <span className="stat-desc">Total Pushups</span>
              </div>
              <div className="lifetime-stat-card">
                <span className="stat-icon">🧗</span>
                <span className="stat-big-value">{lifetimeStats.totalPullups || user.totalPullups || 0}</span>
                <span className="stat-unit">reps</span>
                <span className="stat-desc">Total Pullups</span>
              </div>
              <div className="lifetime-stat-card">
                <span className="stat-icon">🧘</span>
                <span className="stat-big-value">{lifetimeStats.totalMeditationMinutes || user.totalMeditationMinutes || 0}</span>
                <span className="stat-unit">min</span>
                <span className="stat-desc">Meditation</span>
              </div>
              <div className="lifetime-stat-card">
                <span className="stat-icon">⚔️</span>
                <span className="stat-big-value">{lifetimeStats.totalFaceOffs || user.totalFaceOffsCompleted || 0}</span>
                <span className="stat-unit">battles</span>
                <span className="stat-desc">Face-Offs Won</span>
              </div>
              <div className="lifetime-stat-card">
                <span className="stat-icon">⭐</span>
                <span className="stat-big-value">{lifetimeStats.perfectDays || user.totalPerfectDays || 0}</span>
                <span className="stat-unit">days</span>
                <span className="stat-desc">Perfect Days</span>
              </div>
            </div>
          </section>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <section className="achievements-section">
            <h2>Badges ({unlockedAchievements.length})</h2>
            <div className="achievements-grid">
              {Object.values(ACHIEVEMENTS)
                .filter(a => !a.secret || unlockedAchievements.some(u => u.id === a.id))
                .map(achievement => {
                  const isUnlocked = unlockedAchievements.some(u => u.id === achievement.id);
                  return (
                    <div 
                      key={achievement.id} 
                      className={`achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}`}
                    >
                      <span className="achievement-icon">
                        {isUnlocked ? achievement.icon : '🔒'}
                      </span>
                      <span className="achievement-name">{achievement.name}</span>
                      <span className="achievement-desc">{achievement.description}</span>
                    </div>
                  );
                })}
            </div>
          </section>
        )}
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={() => setShowSettingsModal(false)}
            >
              ×
            </button>
            <h2>⚙️ Settings</h2>

            {/* Tab Navigation */}
            <div className="settings-tabs">
              <button
                className={`settings-tab ${settingsTab === 'account' ? 'active' : ''}`}
                onClick={() => setSettingsTab('account')}
              >
                Account
              </button>
              <button
                className={`settings-tab ${settingsTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setSettingsTab('notifications')}
              >
                Notifications
              </button>
              <button
                className={`settings-tab ${settingsTab === 'devtools' ? 'active' : ''}`}
                onClick={() => setSettingsTab('devtools')}
              >
                Dev Tools
              </button>
            </div>

            <div className="settings-content">
              {/* Account Tab */}
              {settingsTab === 'account' && (
                <>
                  <div className="settings-section">
                    <h3>Profile</h3>
                    <p className="settings-name">{user.name}</p>
                    <div className="settings-stats">
                      <p>Life Force: {user.lifeForce || 100}</p>
                      <p>Total Points: {user.totalPoints || 0}</p>
                      <p>Spirit Guide: {spiritGuide.name}</p>
                      <p>Member since: {new Date(user.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="settings-section">
                    <h3>Actions</h3>
                    <div className="settings-actions">
                      <button
                        className="settings-action-button replay-intro"
                        onClick={handleReplayIntro}
                      >
                        🎬 Replay Intro Animation
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Notifications Tab */}
              {settingsTab === 'notifications' && (
                <div className="settings-section">
                  <h3>Push Notifications</h3>
                  <p className="settings-description">
                    Get reminders for your Dawn, Noon, and Dusk Face-Offs.
                  </p>

                  <div className="notification-status">
                    Status: <span className={notificationsEnabled ? 'status-on' : 'status-off'}>
                      {notificationStatus}
                    </span>
                  </div>

                  <div className="settings-actions">
                    {!notificationsEnabled ? (
                      <button
                        className="settings-action-button enable-notifs"
                        onClick={handleEnableNotifications}
                      >
                        🔔 Enable Notifications
                      </button>
                    ) : (
                      <button
                        className="settings-action-button disable-notifs"
                        onClick={handleDisableNotifications}
                      >
                        🔕 Disable Notifications
                      </button>
                    )}
                  </div>

                  <div className="notification-times">
                    <p><strong>Reminder Times:</strong></p>
                    <ul>
                      <li>🌅 Dawn: 6:00 AM</li>
                      <li>☀️ Noon: 12:00 PM</li>
                      <li>🌙 Dusk: 6:00 PM</li>
                    </ul>
                  </div>

                  <div className="settings-actions" style={{ marginTop: '1rem' }}>
                    <button
                      className="settings-action-button test-notif"
                      onClick={async () => {
                        const result = await sendTestNotification();
                        if (result.success) {
                          alert('Test notification scheduled! It will appear in ~5 seconds.');
                        } else {
                          alert('Test notification failed: ' + (result.reason || result.error?.message || 'Unknown error'));
                        }
                      }}
                    >
                      🧪 Send Test Notification
                    </button>
                    <button
                      className="settings-action-button check-pending"
                      onClick={async () => {
                        const result = await getPendingNotifications();
                        if (result.success) {
                          const count = result.notifications.length;
                          const details = result.notifications.map(n => `${n.id}: ${n.title}`).join('\n');
                          alert(`${count} pending notification(s):\n\n${details || 'None scheduled'}`);
                        } else {
                          alert('Could not check pending: ' + (result.reason || 'Unknown error'));
                        }
                      }}
                    >
                      📋 Check Pending Notifications
                    </button>
                  </div>
                </div>
              )}

              {/* Dev Tools Tab */}
              {settingsTab === 'devtools' && (
                <>
                  <div className="settings-section">
                    <h3>Data Management</h3>
                    <p className="settings-description">
                      Export your data to backup or transfer to another device/Supabase.
                    </p>

                    <div className="data-summary">
                      <p>Days tracked: {dataSummary.totalDays}</p>
                      {dataSummary.oldestRecord && (
                        <p>First record: {dataSummary.oldestRecord}</p>
                      )}
                      <p>Total points: {dataSummary.userPoints}</p>
                    </div>

                    {exportMessage && (
                      <div className="export-message">{exportMessage}</div>
                    )}

                    <div className="settings-actions">
                      <button
                        className="settings-action-button export-data"
                        onClick={handleExportData}
                      >
                        📤 Export Data (JSON)
                      </button>

                      <button
                        className="settings-action-button import-data"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        📥 Import Data
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={handleImportData}
                      />
                    </div>
                  </div>

                  <div className="settings-section">
                    <h3>Reset Options</h3>
                    <div className="settings-actions">
                      <button
                        className="settings-action-button new-profile"
                        onClick={handleNewProfile}
                      >
                        👤 New Profile (Keep History)
                      </button>

                      <button
                        className="settings-action-button fresh-start"
                        onClick={handleFreshStartKeepData}
                      >
                        🔄 Fresh Start (Export + Reset)
                      </button>

                      <button
                        className="settings-action-button full-reset"
                        onClick={handleFullReset}
                      >
                        🗑️ Full Reset (Delete Everything)
                      </button>
                    </div>
                  </div>

                  <div className="settings-section">
                    <h3>Debug Info</h3>
                    <div className="debug-info">
                      <p>User ID: {user.id}</p>
                      <p>Pushup PR: {user.pushupPR || 0}</p>
                      <p>Pullup PR: {user.pullupPR || 0}</p>
                      <p>App Version: 0.3.0</p>
                      <p>Platform: {window.Capacitor?.isNativePlatform() ? 'Native' : 'Web'}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
