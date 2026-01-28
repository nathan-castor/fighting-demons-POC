import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroAnimation from './components/IntroAnimation/IntroAnimation';
import UserAuth from './components/UserAuth/UserAuth';
import Dashboard from './components/Dashboard/Dashboard';
import FaceOff from './components/FaceOff/FaceOff';
import { userStorage } from './services/LocalStorageService';
import { initializeNotifications, registerNotificationListeners } from './services/NotificationService';
import './styles/colors.css';
import './App.css';

// App version - increment this when you make breaking changes to clear old cache
const APP_VERSION = '0.3.0';
const VERSION_KEY = 'fighting-demons-version';

// Check and clear stale cache on app load
const checkAndClearCache = () => {
  const storedVersion = localStorage.getItem(VERSION_KEY);

  if (storedVersion !== APP_VERSION) {
    console.log(`App updated from ${storedVersion || 'none'} to ${APP_VERSION}. Clearing cache...`);

    // Clear all fighting-demons related localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('fighting-demons')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Set new version
    localStorage.setItem(VERSION_KEY, APP_VERSION);

    // Reload to start fresh
    window.location.reload();
  }
};

// Check if intro has been seen
const hasSeenIntro = () => {
  return localStorage.getItem('fighting-demons-seen-intro') === 'true';
};

// Check if user exists
const hasUser = () => {
  return userStorage.getUser() !== null;
};

// Route wrapper for /register - must have seen intro first
const NewUserRoute = ({ children }) => {
  // If user already exists, go to dashboard
  if (hasUser()) {
    return <Navigate to="/dashboard" replace />;
  }

  // If hasn't seen intro, send to intro first
  if (!hasSeenIntro()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protected route - requires user
const ProtectedRoute = ({ children }) => {
  // No user? Start from the beginning
  if (!hasUser()) {
    if (!hasSeenIntro()) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/register" replace />;
  }

  return children;
};

// Loading screen component
const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-spinner"></div>
    <p>Awakening...</p>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Intro Animation Route */}
      <Route path="/" element={<IntroAnimation />} />

      {/* User Registration Route - must have seen intro */}
      <Route
        path="/register"
        element={
          <NewUserRoute>
            <UserAuth />
          </NewUserRoute>
        }
      />

      {/* Dashboard Route (Protected) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Face-Off Routes (Protected) */}
      <Route
        path="/face-off/:type"
        element={
          <ProtectedRoute>
            <FaceOff />
          </ProtectedRoute>
        }
      />

      {/* Redirect any unknown routes to the intro */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  // Check for stale cache on mount and initialize notifications
  useEffect(() => {
    checkAndClearCache();

    // Initialize notifications if user exists
    const initNotifications = async () => {
      const user = userStorage.getUser();
      if (user) {
        console.log('User exists, initializing notifications...');
        const result = await initializeNotifications();
        console.log('Notification initialization result:', result);
      }
    };

    initNotifications();

    // Register notification listeners
    const cleanup = registerNotificationListeners(
      (notification) => {
        console.log('Notification received in foreground:', notification);
      },
      (action) => {
        console.log('Notification action performed:', action);
        // Navigate to face-off if notification tapped
        const faceOffType = action?.notification?.extra?.type;
        if (faceOffType && ['dawn', 'noon', 'dusk'].includes(faceOffType)) {
          window.location.href = `/face-off/${faceOffType}`;
        }
      }
    );

    return cleanup;
  }, []);

  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
