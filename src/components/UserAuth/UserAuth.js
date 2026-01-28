import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userStorage } from '../../services/LocalStorageService';
import './UserAuth.css';

const UserAuth = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Redirect if already has user
  useEffect(() => {
    const user = userStorage.getUser();
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    // Create user
    userStorage.createUser(name.trim());
    navigate('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="user-auth">
      <motion.div
        className="auth-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="spirit-guide-greeting" variants={itemVariants}>
          <span className="guide-icon">✦</span>
        </motion.div>

        <motion.h1
          className="auth-title"
          variants={itemVariants}
        >
          What Is Your Name?
        </motion.h1>

        <motion.p
          className="auth-subtitle"
          variants={itemVariants}
        >
          The Spirit Guide must know who it protects.
        </motion.p>

        {error && (
          <motion.div
            className="auth-error"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          variants={itemVariants}
          className="auth-form"
        >
          <div className="form-group">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              autoComplete="off"
            />
          </div>

          <motion.button
            type="submit"
            className="auth-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Begin
          </motion.button>
        </motion.form>

        <motion.p className="auth-note" variants={itemVariants}>
          Your data is stored locally on this device.
        </motion.p>
      </motion.div>

      <div className="auth-background">
        <div className="ambient-glow"></div>
      </div>
    </div>
  );
};

export default UserAuth;
