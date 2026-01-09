import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { faceOffStorage, userStorage } from '../../services/LocalStorageService';
import './FaceOff.css';

// Decision trees for each category
const decisionTrees = {
  walk: {
    question: "Have you started your day?",
    yes: {
      question: "Do you have time to walk a mile?",
      yes: {
        question: "Will you choose to walk?",
        yes: {
          outcome: "win",
          message: "You chose to walk! You've earned a point in your battle against the demons."
        },
        no: {
          outcome: "lose",
          message: "You chose not to walk. The demons grow stronger."
        }
      },
      no: {
        question: "Can you schedule time later today?",
        yes: {
          outcome: "neutral",
          message: "Good planning! Remember to follow through later."
        },
        no: {
          outcome: "lose",
          message: "The demons win this round. Try to make time for your health tomorrow."
        }
      }
    },
    no: {
      question: "Will you commit to walking when you start your day?",
      yes: {
        outcome: "neutral",
        message: "Good intention! Remember to follow through when you start your day."
      },
      no: {
        outcome: "lose",
        message: "The demons are pleased with your lack of commitment."
      }
    }
  },
  
  alcohol: {
    question: "Are you considering having a drink?",
    yes: {
      question: "Have you already had alcohol today?",
      yes: {
        question: "Will you choose to have another drink?",
        yes: {
          outcome: "lose",
          message: "You chose to have another drink. The demons grow stronger."
        },
        no: {
          outcome: "win",
          message: "You chose moderation! You've earned a point in your battle against the demons."
        }
      },
      no: {
        question: "Is it a special occasion?",
        yes: {
          outcome: "neutral",
          message: "Enjoying in moderation is okay. Just be mindful."
        },
        no: {
          question: "Will you choose to skip the drink?",
          yes: {
            outcome: "win",
            message: "You chose to skip the drink! You've earned a point in your battle."
          },
          no: {
            outcome: "lose",
            message: "The demons win this round. Try to be more mindful next time."
          }
        }
      }
    },
    no: {
      outcome: "win",
      message: "You're not even tempted! You've earned a point in your battle against the demons."
    }
  },
  
  stretch: {
    question: "Have you been sitting for more than an hour?",
    yes: {
      question: "Do you feel any stiffness or discomfort?",
      yes: {
        question: "Will you take a break to stretch?",
        yes: {
          outcome: "win",
          message: "You chose to stretch! You've earned a point in your battle against the demons."
        },
        no: {
          outcome: "lose",
          message: "You chose to remain stiff. The demons grow stronger."
        }
      },
      no: {
        question: "Will you still take a quick stretch break?",
        yes: {
          outcome: "win",
          message: "Proactive stretching! You've earned a point in your battle."
        },
        no: {
          outcome: "lose",
          message: "The demons win this round. Your body will thank you for stretching next time."
        }
      }
    },
    no: {
      question: "Have you stretched at all today?",
      yes: {
        outcome: "win",
        message: "You're already taking care of yourself! You've earned a point."
      },
      no: {
        question: "Will you do a quick stretch now?",
        yes: {
          outcome: "win",
          message: "Proactive stretching! You've earned a point in your battle."
        },
        no: {
          outcome: "lose",
          message: "The demons win this round. Remember to take care of your body."
        }
      }
    }
  }
};

const FaceOff = ({ category, onComplete }) => {
  const [currentNode, setCurrentNode] = useState(null);
  const [decisionPath, setDecisionPath] = useState([]);
  const [result, setResult] = useState(null);
  const [animation, setAnimation] = useState('fadeIn');

  // Initialize with the root node of the selected category
  useEffect(() => {
    if (category && decisionTrees[category]) {
      setCurrentNode(decisionTrees[category]);
      setDecisionPath([]);
      setResult(null);
    }
  }, [category]);

  // Handle user's choice (yes/no)
  const handleChoice = (choice) => {
    // Add to decision path
    const newPath = [...decisionPath, choice];
    setDecisionPath(newPath);
    
    // Animate transition
    setAnimation('fadeOut');
    
    setTimeout(() => {
      // Navigate to next node based on choice
      const nextNode = currentNode[choice.toLowerCase()];
      
      if (nextNode) {
        if (nextNode.outcome) {
          // We've reached a leaf node with an outcome
          setResult({
            outcome: nextNode.outcome,
            message: nextNode.message
          });
          
          // Record the face-off result
          const userWon = nextNode.outcome === 'win';
          const pointsImpact = 1; // Default point value
          
          if (nextNode.outcome !== 'neutral') {
            faceOffStorage.createFaceOff(category, newPath, userWon, pointsImpact);
          }
        } else {
          // Continue to next question
          setCurrentNode(nextNode);
        }
      }
      
      setAnimation('fadeIn');
    }, 300); // Match this with CSS transition time
  };

  // Handle completing the face-off
  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  if (!currentNode) {
    return <div className="face-off-loading">Loading face-off...</div>;
  }

  return (
    <div className="face-off">
      {!result ? (
        <motion.div 
          className={`question-container ${animation}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="question">{currentNode.question}</h3>
          
          <div className="choice-buttons">
            <motion.button 
              className="choice-button yes"
              onClick={() => handleChoice('Yes')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Yes
            </motion.button>
            
            <motion.button 
              className="choice-button no"
              onClick={() => handleChoice('No')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              No
            </motion.button>
          </div>
          
          {decisionPath.length > 0 && (
            <div className="decision-path">
              <h4>Your path so far:</h4>
              <ul>
                {decisionPath.map((decision, index) => (
                  <li key={index}>
                    <strong>Q:</strong> {getQuestionAtIndex(index)}
                    <br />
                    <strong>A:</strong> {decision}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className={`result-container ${result.outcome}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`result-icon ${result.outcome}`}>
            {result.outcome === 'win' && '✓'}
            {result.outcome === 'lose' && '✗'}
            {result.outcome === 'neutral' && '!'}
          </div>
          
          <h3 className="result-title">
            {result.outcome === 'win' && 'Victory!'}
            {result.outcome === 'lose' && 'Defeat!'}
            {result.outcome === 'neutral' && 'Draw!'}
          </h3>
          
          <p className="result-message">{result.message}</p>
          
          <motion.button 
            className="complete-button"
            onClick={handleComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </motion.div>
      )}
    </div>
  );
  
  // Helper function to get the question at a specific index in the decision path
  function getQuestionAtIndex(index) {
    let node = decisionTrees[category];
    for (let i = 0; i < index; i++) {
      if (node[decisionPath[i].toLowerCase()]) {
        node = node[decisionPath[i].toLowerCase()];
      }
    }
    return node.question;
  }
};

export default FaceOff;
