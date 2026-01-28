/**
 * LocalStorageService.js
 * Service for handling all local storage operations
 */

// Keys for localStorage
const STORAGE_KEYS = {
  USER: 'fighting-demons-user',
  DAILY_RECORDS: 'fighting-demons-daily-records',
  ACTIVITIES: 'fighting-demons-activities',
  FACE_OFFS: 'fighting-demons-face-offs',
  ACHIEVEMENTS: 'fighting-demons-achievements',
  LORE_UNLOCKS: 'fighting-demons-lore-unlocks'
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
      avatar: null, // Will be set later - emoji or image
      userPoints: 0,
      demonPoints: 0,
      lifeForce: 100,
      totalPoints: 0,
      pushupPR: 0,
      pullupPR: 0,
      currentStreak: 0,
      longestStreak: 0,
      deaths: 0,
      spiritGuideStage: 1,
      // Lifetime stats
      totalPushups: 0,
      totalPullups: 0,
      totalMiles: 0,
      totalMeditationMinutes: 0,
      totalFaceOffsCompleted: 0,
      totalPerfectDays: 0,
      // Evolution tracking
      lastEvolutionStage: 'ember',
      evolutionHistory: [],
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
        // Face-off completion status
        dawnCompleted: false,
        noonCompleted: false,
        duskCompleted: false,
        // Deferred timestamps
        dawnDeferredUntil: null,
        noonDeferredUntil: null,
        duskDeferredUntil: null,
        // Defer reasons (for pattern tracking)
        dawnDeferReason: null,
        noonDeferReason: null,
        duskDeferReason: null,
        // Activity data
        mileCompleted: false,
        pushupCount: null,
        pullupCount: null,
        meditationMinutes: 0
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

/**
 * Achievements storage operations
 */
export const achievementStorage = {
  // Get all unlocked achievements
  getUnlockedAchievements: () => {
    const achievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return achievements ? JSON.parse(achievements) : [];
  },

  // Unlock an achievement
  unlockAchievement: (achievementId) => {
    const achievements = achievementStorage.getUnlockedAchievements();
    
    if (!achievements.find(a => a.id === achievementId)) {
      achievements.push({
        id: achievementId,
        unlockedAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      return { unlocked: true, achievement: achievementId };
    }
    return { unlocked: false, reason: 'already_unlocked' };
  },

  // Check if achievement is unlocked
  isUnlocked: (achievementId) => {
    const achievements = achievementStorage.getUnlockedAchievements();
    return achievements.some(a => a.id === achievementId);
  },

  // Clear all achievements
  clearAchievements: () => {
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
  }
};

/**
 * Lore unlocks storage operations
 */
export const loreStorage = {
  // Get all unlocked lore
  getUnlockedLore: () => {
    const lore = localStorage.getItem(STORAGE_KEYS.LORE_UNLOCKS);
    return lore ? JSON.parse(lore) : [];
  },

  // Unlock lore
  unlockLore: (loreId) => {
    const lore = loreStorage.getUnlockedLore();
    
    if (!lore.includes(loreId)) {
      lore.push(loreId);
      localStorage.setItem(STORAGE_KEYS.LORE_UNLOCKS, JSON.stringify(lore));
      return { unlocked: true, loreId };
    }
    return { unlocked: false };
  },

  // Check if lore is unlocked
  isUnlocked: (loreId) => {
    const lore = loreStorage.getUnlockedLore();
    return lore.includes(loreId);
  }
};

/**
 * Stats calculator - aggregates data from daily records
 */
export const statsCalculator = {
  // Calculate lifetime stats from all daily records
  getLifetimeStats: () => {
    const records = dailyRecordStorage.getAllDailyRecords();
    const user = userStorage.getUser();
    
    let totalPushups = 0;
    let totalPullups = 0;
    let totalMiles = 0;
    let totalMeditationMinutes = 0;
    let totalFaceOffs = 0;
    let perfectDays = 0;
    
    records.forEach(record => {
      if (record.pushupCount) totalPushups += record.pushupCount;
      if (record.pullupCount) totalPullups += record.pullupCount;
      if (record.mileCompleted) totalMiles += 1;
      if (record.meditationMinutes) totalMeditationMinutes += record.meditationMinutes;
      
      // Count completed face-offs
      if (record.dawnCompleted) totalFaceOffs++;
      if (record.noonCompleted) totalFaceOffs++;
      if (record.duskCompleted) totalFaceOffs++;
      
      // Check for perfect day
      if (record.dawnCompleted && record.noonCompleted && record.duskCompleted) {
        perfectDays++;
      }
    });
    
    return {
      totalPushups,
      totalPullups,
      totalMiles,
      totalMeditationMinutes,
      totalFaceOffs,
      perfectDays,
      totalDays: records.length,
      currentStreak: user?.currentStreak || 0,
      longestStreak: user?.longestStreak || 0,
      pushupPR: user?.pushupPR || 0,
      pullupPR: user?.pullupPR || 0,
      totalPoints: user?.totalPoints || 0,
      joinDate: user?.joinDate || null
    };
  },

  // Get weekly stats (last 7 days)
  getWeeklyStats: () => {
    const records = dailyRecordStorage.getAllDailyRecords();
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekRecords = records.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate >= weekAgo && recordDate <= today;
    });
    
    let pushups = 0;
    let pullups = 0;
    let miles = 0;
    let meditationMinutes = 0;
    let faceOffs = 0;
    let perfectDays = 0;
    
    weekRecords.forEach(record => {
      if (record.pushupCount) pushups += record.pushupCount;
      if (record.pullupCount) pullups += record.pullupCount;
      if (record.mileCompleted) miles += 1;
      if (record.meditationMinutes) meditationMinutes += record.meditationMinutes;
      
      if (record.dawnCompleted) faceOffs++;
      if (record.noonCompleted) faceOffs++;
      if (record.duskCompleted) faceOffs++;
      
      if (record.dawnCompleted && record.noonCompleted && record.duskCompleted) {
        perfectDays++;
      }
    });
    
    return {
      pushups,
      pullups,
      miles,
      meditationMinutes,
      faceOffs,
      perfectDays,
      daysActive: weekRecords.length
    };
  },

  // Get data for charts (last N days)
  getChartData: (days = 14) => {
    const records = dailyRecordStorage.getAllDailyRecords();
    const today = new Date();
    const chartData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const record = records.find(r => r.date === dateStr);
      
      chartData.push({
        date: dateStr,
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        shortLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
        pushups: record?.pushupCount || 0,
        pullups: record?.pullupCount || 0,
        miles: record?.mileCompleted ? 1 : 0,
        meditation: record?.meditationMinutes || 0,
        faceOffs: (record?.dawnCompleted ? 1 : 0) + (record?.noonCompleted ? 1 : 0) + (record?.duskCompleted ? 1 : 0),
        isPerfect: record?.dawnCompleted && record?.noonCompleted && record?.duskCompleted
      });
    }
    
    return chartData;
  }
};

/**
 * Data export/import operations
 */
export const dataExportImport = {
  // Export all app data as a JSON object
  exportAllData: () => {
    const exportData = {
      version: '1.1',
      exportDate: new Date().toISOString(),
      data: {
        user: localStorage.getItem(STORAGE_KEYS.USER),
        dailyRecords: localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS),
        activities: localStorage.getItem(STORAGE_KEYS.ACTIVITIES),
        faceOffs: localStorage.getItem(STORAGE_KEYS.FACE_OFFS),
        achievements: localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
        loreUnlocks: localStorage.getItem(STORAGE_KEYS.LORE_UNLOCKS)
      }
    };
    return exportData;
  },

  // Download export as JSON file
  downloadExport: () => {
    const exportData = dataExportImport.exportAllData();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().split('T')[0];
    const filename = `fighting-demons-backup-${date}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return filename;
  },

  // Import data from JSON object
  importData: (importedData) => {
    // Validate the import structure
    if (!importedData || !importedData.version || !importedData.data) {
      throw new Error('Invalid backup file format');
    }

    const { data } = importedData;

    // Clear existing data first
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.DAILY_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.FACE_OFFS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.LORE_UNLOCKS);

    // Restore each key if it exists in the backup
    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.USER, data.user);
    }
    if (data.dailyRecords) {
      localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, data.dailyRecords);
    }
    if (data.activities) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, data.activities);
    }
    if (data.faceOffs) {
      localStorage.setItem(STORAGE_KEYS.FACE_OFFS, data.faceOffs);
    }
    if (data.achievements) {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, data.achievements);
    }
    if (data.loreUnlocks) {
      localStorage.setItem(STORAGE_KEYS.LORE_UNLOCKS, data.loreUnlocks);
    }

    return {
      success: true,
      importDate: new Date().toISOString(),
      originalExportDate: importedData.exportDate
    };
  },

  // Import from file (to be called with FileReader result)
  importFromFile: (fileContent) => {
    try {
      const parsed = JSON.parse(fileContent);
      return dataExportImport.importData(parsed);
    } catch (e) {
      throw new Error('Failed to parse backup file: ' + e.message);
    }
  },

  // Get summary of current data for display
  getDataSummary: () => {
    const user = userStorage.getUser();
    const records = dailyRecordStorage.getAllDailyRecords();

    return {
      hasUser: !!user,
      userName: user?.name || null,
      totalDays: records.length,
      oldestRecord: records.length > 0
        ? records.sort((a, b) => new Date(a.date) - new Date(b.date))[0].date
        : null,
      newestRecord: records.length > 0
        ? records.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
        : null,
      userPoints: user?.userPoints || 0,
      demonPoints: user?.demonPoints || 0
    };
  }
};

// Export a default object with all storage services
export default {
  userStorage,
  dailyRecordStorage,
  activityStorage,
  faceOffStorage,
  achievementStorage,
  loreStorage,
  statsCalculator,
  dataExportImport
};