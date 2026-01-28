/**
 * NotificationService.js
 * Handles local notifications for Dawn/Noon/Dusk Face-Off reminders
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Notification IDs (fixed so we can update/cancel them)
const NOTIFICATION_IDS = {
  DAWN: 1,
  NOON: 2,
  DUSK: 3,
  DEFERRED: 100 // Base ID for deferred notifications
};

// Default times for each face-off
const DEFAULT_TIMES = {
  dawn: { hour: 6, minute: 0 },
  noon: { hour: 12, minute: 0 },
  dusk: { hour: 18, minute: 0 }
};

/**
 * Check if we're running on a native platform (not web)
 */
const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Request notification permissions
 */
export const requestPermissions = async () => {
  if (!isNativePlatform()) {
    console.log('Notifications not available on web');
    return { granted: false, reason: 'web' };
  }

  try {
    const permission = await LocalNotifications.requestPermissions();
    return { granted: permission.display === 'granted', permission };
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return { granted: false, error };
  }
};

/**
 * Check if notifications are permitted
 */
export const checkPermissions = async () => {
  if (!isNativePlatform()) {
    return { granted: false, reason: 'web' };
  }

  try {
    const permission = await LocalNotifications.checkPermissions();
    return { granted: permission.display === 'granted', permission };
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return { granted: false, error };
  }
};

/**
 * Schedule daily Face-Off notifications
 */
export const scheduleDailyNotifications = async (customTimes = {}) => {
  if (!isNativePlatform()) {
    console.log('Skipping notification scheduling on web');
    return { success: false, reason: 'web' };
  }

  const times = { ...DEFAULT_TIMES, ...customTimes };

  try {
    // Cancel any existing scheduled notifications first
    await cancelAllNotifications();

    const notifications = [];

    // Dawn notification - repeats daily at specified time
    notifications.push({
      id: NOTIFICATION_IDS.DAWN,
      title: '🌅 Dawn Face-Off',
      body: 'The sun rises. Your Spirit Guide awaits. Time for your morning mile.',
      schedule: {
        on: {
          hour: times.dawn.hour,
          minute: times.dawn.minute
        },
        every: 'day',
        allowWhileIdle: true
      },
      sound: 'default',
      smallIcon: 'ic_launcher_foreground',
      actionTypeId: 'FACE_OFF_DAWN',
      extra: { type: 'dawn' }
    });

    // Noon notification - repeats daily at specified time
    notifications.push({
      id: NOTIFICATION_IDS.NOON,
      title: '☀️ Noon Face-Off',
      body: 'Midday approaches. The demons whisper. Prove your strength with pushups.',
      schedule: {
        on: {
          hour: times.noon.hour,
          minute: times.noon.minute
        },
        every: 'day',
        allowWhileIdle: true
      },
      sound: 'default',
      smallIcon: 'ic_launcher_foreground',
      actionTypeId: 'FACE_OFF_NOON',
      extra: { type: 'noon' }
    });

    // Dusk notification - repeats daily at specified time
    notifications.push({
      id: NOTIFICATION_IDS.DUSK,
      title: '🌆 Dusk Face-Off',
      body: 'The day fades. One final stand. Show your resolve with pullups.',
      schedule: {
        on: {
          hour: times.dusk.hour,
          minute: times.dusk.minute
        },
        every: 'day',
        allowWhileIdle: true
      },
      sound: 'default',
      smallIcon: 'ic_launcher_foreground',
      actionTypeId: 'FACE_OFF_DUSK',
      extra: { type: 'dusk' }
    });

    await LocalNotifications.schedule({ notifications });

    console.log('Scheduled daily notifications:', notifications);
    return { success: true, notifications };
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return { success: false, error };
  }
};

/**
 * Schedule a deferred notification (1 hour from now)
 */
export const scheduleDeferredNotification = async (faceOffType, customMessage = null) => {
  if (!isNativePlatform()) {
    console.log('Skipping deferred notification on web');
    return { success: false, reason: 'web' };
  }

  try {
    const deferredTime = new Date();
    deferredTime.setHours(deferredTime.getHours() + 1);

    const typeLabels = {
      dawn: { title: '🌅 Dawn Reminder', body: 'Your Spirit Guide has returned. Ready for your morning mile?' },
      noon: { title: '☀️ Noon Reminder', body: 'An hour has passed. Ready to face the demons with pushups?' },
      dusk: { title: '🌆 Dusk Reminder', body: 'The time has come. Ready for your final stand with pullups?' }
    };

    const content = typeLabels[faceOffType] || {
      title: 'Face-Off Reminder',
      body: customMessage || 'Your Spirit Guide awaits.'
    };

    const notificationId = NOTIFICATION_IDS.DEFERRED + Object.keys(NOTIFICATION_IDS).indexOf(faceOffType.toUpperCase());

    await LocalNotifications.schedule({
      notifications: [{
        id: notificationId,
        title: content.title,
        body: content.body,
        schedule: { 
          at: deferredTime,
          allowWhileIdle: true 
        },
        sound: 'default',
        smallIcon: 'ic_launcher_foreground',
        extra: { type: faceOffType, deferred: true }
      }]
    });

    console.log(`Scheduled deferred notification for ${faceOffType} at ${deferredTime}`);
    return { success: true, scheduledFor: deferredTime };
  } catch (error) {
    console.error('Error scheduling deferred notification:', error);
    return { success: false, error };
  }
};

/**
 * Send a test notification immediately (for debugging)
 */
export const sendTestNotification = async () => {
  if (!isNativePlatform()) {
    console.log('Test notifications not available on web');
    return { success: false, reason: 'web' };
  }

  try {
    // Schedule notification for 5 seconds from now
    const testTime = new Date();
    testTime.setSeconds(testTime.getSeconds() + 5);

    await LocalNotifications.schedule({
      notifications: [{
        id: 999,
        title: '✦ Spirit Guide Test',
        body: 'Notifications are working! Your Spirit Guide can reach you.',
        schedule: { 
          at: testTime,
          allowWhileIdle: true 
        },
        sound: 'default',
        smallIcon: 'ic_launcher_foreground'
      }]
    });

    console.log('Test notification scheduled for 5 seconds from now');
    return { success: true, scheduledFor: testTime };
  } catch (error) {
    console.error('Error sending test notification:', error);
    return { success: false, error };
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  if (!isNativePlatform()) {
    return { success: false, reason: 'web' };
  }

  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
    console.log('Cancelled all notifications');
    return { success: true };
  } catch (error) {
    console.error('Error cancelling notifications:', error);
    return { success: false, error };
  }
};

/**
 * Get all pending (scheduled) notifications
 */
export const getPendingNotifications = async () => {
  if (!isNativePlatform()) {
    return { success: false, reason: 'web', notifications: [] };
  }

  try {
    const pending = await LocalNotifications.getPending();
    return { success: true, notifications: pending.notifications };
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return { success: false, error, notifications: [] };
  }
};

/**
 * Register notification action listeners
 */
export const registerNotificationListeners = (onNotificationReceived, onNotificationAction) => {
  if (!isNativePlatform()) {
    return () => {}; // Return empty cleanup function
  }

  // Listener for when notification is received while app is open
  const receivedListener = LocalNotifications.addListener('localNotificationReceived', (notification) => {
    console.log('Notification received:', notification);
    if (onNotificationReceived) {
      onNotificationReceived(notification);
    }
  });

  // Listener for when user taps on notification
  const actionListener = LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
    console.log('Notification action:', action);
    if (onNotificationAction) {
      onNotificationAction(action);
    }
  });

  // Return cleanup function
  return () => {
    receivedListener.remove();
    actionListener.remove();
  };
};

/**
 * Initialize notifications (request permissions and schedule daily)
 */
export const initializeNotifications = async () => {
  const permission = await requestPermissions();

  if (permission.granted) {
    await scheduleDailyNotifications();
    return { success: true, message: 'Notifications initialized' };
  } else {
    return { success: false, message: 'Notification permission denied', reason: permission.reason };
  }
};

// Export default object
export default {
  requestPermissions,
  checkPermissions,
  scheduleDailyNotifications,
  scheduleDeferredNotification,
  sendTestNotification,
  cancelAllNotifications,
  getPendingNotifications,
  registerNotificationListeners,
  initializeNotifications,
  NOTIFICATION_IDS,
  DEFAULT_TIMES
};
