/**
 * LocalStorageService.js
 * Service for handling all local storage operations
 */

// Keys for localStorage
const STORAGE_KEYS = {
  USER: 'fighting-demons-user',
  DAILY_RECORDS: 'fighting-demons-daily-records',
  ACTIVITIES: 'fighting-demons-activities',
  FACE_OFFS: 'fighting-demons-face-offs'
};

/**
 * User related storage operations
 */
export const userStorage = {
  // Save user data to localStorage
  saveUser: (userData) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  },
  
  // Get user data from localStorage
  getUser: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },
  
  // Create a new user
  createUser: (name) => {
    const newUser = {
      id: Date.now().toString(),
      name,
      userPoints: 0,
      demonPoints: 0,
      joinDate: new Date().toISOString()
    };
    
    userStorage.saveUser(newUser);
    return newUser;
  },
  
  // Update user points
  updatePoints: (userPoints, demonPoints) => {
    const user = userStorage.getUser();
    if (user) {
      user.userPoints += userPoints;
      user.demonPoints += demonPoints;
      userStorage.saveUser(user);
    }
    return user;
  },
  
  // Clear user data
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

/**
 * Daily records storage operations
 */
export const dailyRecordStorage = {
  // Save daily record
  saveDailyRecord: (record) => {
    const records = dailyRecordStorage.getAllDailyRecords();
    const existingIndex = records.findIndex(r => r.date === record.date);
    
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    
    localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
    return record;
  },
  
  // Get all daily records
  getAllDailyRecords: () => {
    const records = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
    return records ? JSON.parse(records) : [];
  },
  
  // Get daily record by date
  getDailyRecord: (date) => {
    const records = dailyRecordStorage.getAllDailyRecords();
    return records.find(record => record.date === date);
  },
  
  // Get today's record or create a new one
  getTodayRecord: () => {
    const today = new Date().toISOString().split('T')[0];
    let record = dailyRecordStorage.getDailyRecord(today);
    
    if (!record) {
      record = {
        id: Date.now().toString(),
        date: today,
        userPoints: 0,
        demonPoints: 0,
        activities: [],
        faceOffs: [],
        mileCompleted: false
      };
      dailyRecordStorage.saveDailyRecord(record);
    }
    
    return record;
  },
  
  // Clear all daily records
  clearAllDailyRecords: () => {
    localStorage.removeItem(STORAGE_KEYS.DAILY_RECORDS);
  }
};

/**
 * Activities storage operations
 */
export const activityStorage = {
  // Save activity
  saveActivity: (activity) => {
    const todayRecord = dailyRecordStorage.getTodayRecord();
    const existingIndex = todayRecord.activities.findIndex(a => a.id === activity.id);
    
    if (existingIndex >= 0) {
      todayRecord.activities[existingIndex] = activity;
    } else {
      todayRecord.activities.push(activity);
    }
    
    // Update user points
    if (activity.completed) {
      userStorage.updatePoints(activity.pointsEarned, 0);
    }
    
    // Update mile completion status if it's a walk activity
    if (activity.type === 'walk' && activity.completed) {
      todayRecord.mileCompleted = true;
    }
    
    dailyRecordStorage.saveDailyRecord(todayRecord);
    return activity;
  },
  
  // Create a new activity
  createActivity: (type, completed = false, pointsEarned = 1) => {
    const activity = {
      id: Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      completed,
      pointsEarned
    };
    
    return activityStorage.saveActivity(activity);
  },
  
  // Get all activities for today
  getTodayActivities: () => {
    const todayRecord = dailyRecordStorage.getTodayRecord();
    return todayRecord.activities;
  }
};

/**
 * Face-offs storage operations
 */
export const faceOffStorage = {
  // Save face-off
  saveFaceOff: (faceOff) => {
    const todayRecord = dailyRecordStorage.getTodayRecord();
    const existingIndex = todayRecord.faceOffs.findIndex(f => f.id === faceOff.id);
    
    if (existingIndex >= 0) {
      todayRecord.faceOffs[existingIndex] = faceOff;
    } else {
      todayRecord.faceOffs.push(faceOff);
    }
    
    // Update points based on the face-off outcome
    if (faceOff.userWon) {
      userStorage.updatePoints(faceOff.pointsImpact, 0);
    } else {
      userStorage.updatePoints(0, faceOff.pointsImpact);
    }
    
    dailyRecordStorage.saveDailyRecord(todayRecord);
    return faceOff;
  },
  
  // Create a new face-off
  createFaceOff: (category, decisionPath, userWon, pointsImpact = 1) => {
    const faceOff = {
      id: Date.now().toString(),
      category,
      decisionPath,
      userWon,
      timestamp: new Date().toISOString(),
      pointsImpact
    };
    
    return faceOffStorage.saveFaceOff(faceOff);
  },
  
  // Get all face-offs for today
  getTodayFaceOffs: () => {
    const todayRecord = dailyRecordStorage.getTodayRecord();
    return todayRecord.faceOffs;
  }
};

// Export a default object with all storage services
export default {
  userStorage,
  dailyRecordStorage,
  activityStorage,
  faceOffStorage
};
