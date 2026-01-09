import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userStorage } from '../../services/LocalStorageService';
import './UserAuth.css';

const UserAuth = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);

  // Check if user already exists
  useEffect(() => {
    const existingUser = userStorage.getUser();
    if (existingUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (isRegistering) {
      // Create a new user
      userStorage.createUser(name);
      navigate('/dashboard');
    } else {
      // Login logic - for now just check if name exists
      const existingUser = userStorage.getUser();
      if (existingUser && existingUser.name.toLowerCase() === name.toLowerCase()) {
        navigate('/dashboard');
      } else {
        setError('User not found. Please register first.');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
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
        <motion.h1 
          className="auth-title"
          variants={itemVariants}
        >
          {isRegistering ? 'Begin Your Journey' : 'Welcome Back'}
        </motion.h1>
        
        <motion.p 
          className="auth-subtitle"
          variants={itemVariants}
        >
          {isRegistering 
            ? 'Enter your name to start fighting demons' 
            : 'Enter your name to continue your battle'}
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
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          
          <motion.button 
            type="submit"
            className="auth-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRegistering ? 'Start Your Journey' : 'Continue Journey'}
          </motion.button>
        </motion.form>
        
        <motion.div 
          className="auth-toggle"
          variants={itemVariants}
        >
          <p>
            {isRegistering 
              ? 'Already have a journey?' 
              : 'Need to start a new journey?'}
          </p>
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="toggle-button"
          >
            {isRegistering ? 'Login Instead' : 'Register Instead'}
          </button>
        </motion.div>
      </motion.div>
      
      <div className="auth-background">
        <div className="light-beam"></div>
        <div className="demon-silhouette"></div>
      </div>
    </div>
  );
};

export default UserAuth;
