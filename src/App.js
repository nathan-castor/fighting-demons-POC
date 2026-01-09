import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroAnimation from './components/IntroAnimation/IntroAnimation';
import UserAuth from './components/UserAuth/UserAuth';
import Dashboard from './components/Dashboard/Dashboard';
import FaceOff from './components/FaceOff/FaceOff';
import ActivityTracker from './components/ActivityTracker/ActivityTracker';
import { userStorage } from './services/LocalStorageService';
import './styles/colors.css';
import './App.css';

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return userStorage.getUser() !== null;
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/register" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Intro Animation Route */}
          <Route path="/" element={<IntroAnimation />} />

          {/* User Authentication Route */}
          <Route path="/register" element={<UserAuth />} />

          {/* Dashboard Route (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to the intro */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
