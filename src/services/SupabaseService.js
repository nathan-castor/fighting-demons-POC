/**
 * SupabaseService.js
 * Handles all Supabase operations: auth, profiles, daily records, activities, face-offs
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// AUTH OPERATIONS
// ============================================
export const authService = {
  // Sign up with email and password
  signUp: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Send password reset email
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  }
};

// ============================================
// PROFILE OPERATIONS
// ============================================
export const profileService = {
  // Get current user's profile
  getProfile: async () => {
    const user = await authService.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  },

  // Update profile
  updateProfile: async (updates) => {
    const user = await authService.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update points
  updatePoints: async (userPointsDelta, demonPointsDelta = 0) => {
    const profile = await profileService.getProfile();
    if (!profile) throw new Error('Profile not found');

    const updates = {
      total_points: profile.total_points + userPointsDelta,
      demon_points: profile.demon_points + demonPointsDelta
    };

    // Also update life_force if gaining points
    if (userPointsDelta > 0) {
      updates.life_force = Math.min(200, profile.life_force + userPointsDelta);
    }

    return profileService.updateProfile(updates);
  },

  // Check if user has seen intro
  hasSeenIntro: async () => {
    try {
      const profile = await profileService.getProfile();
      return profile?.intro_seen || false;
    } catch (err) {
      return false;
    }
  },

  // Mark intro as seen
  markIntroSeen: async () => {
    try {
      return await profileService.updateProfile({ intro_seen: true });
    } catch (err) {
      console.error('Error marking intro as seen:', err);
      // Fallback to localStorage if not authenticated
      localStorage.setItem('fighting-demons-seen-intro', 'true');
    }
  }
};

// ============================================
// DAILY RECORD OPERATIONS
// ============================================
export const dailyRecordService = {
  // Get today's date string (YYYY-MM-DD)
  getTodayDateString: () => {
    return new Date().toISOString().split('T')[0];
  },

  // Get or create today's record
  getTodayRecord: async () => {
    const user = await authService.getUser();
    if (!user) return null;

    const today = dailyRecordService.getTodayDateString();

    // Try to get existing record
    let { data, error } = await supabase
      .from('daily_records')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    // If no record exists, create one
    if (error && error.code === 'PGRST116') {
      const { data: newRecord, error: insertError } = await supabase
        .from('daily_records')
        .insert({
          user_id: user.id,
          date: today
        })
        .select()
        .single();

      if (insertError) throw insertError;
      data = newRecord;
    } else if (error) {
      throw error;
    }

    return data;
  },

  // Update today's record
  updateTodayRecord: async (updates) => {
    const user = await authService.getUser();
    if (!user) throw new Error('Not authenticated');

    const today = dailyRecordService.getTodayDateString();

    const { data, error } = await supabase
      .from('daily_records')
      .update(updates)
      .eq('user_id', user.id)
      .eq('date', today)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all daily records
  getAllRecords: async () => {
    const user = await authService.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('daily_records')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// ============================================
// ACTIVITY OPERATIONS
// ============================================
export const activityService = {
  // Create an activity
  createActivity: async (type, completed = false, pointsEarned = 0, metadata = {}) => {
    const user = await authService.getUser();
    if (!user) throw new Error('Not authenticated');

    const todayRecord = await dailyRecordService.getTodayRecord();

    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: user.id,
        daily_record_id: todayRecord.id,
        type,
        completed,
        points_earned: pointsEarned,
        metadata
      })
      .select()
      .single();

    if (error) throw error;

    // Update profile points if completed
    if (completed && pointsEarned > 0) {
      await profileService.updatePoints(pointsEarned);
    }

    return data;
  },

  // Get today's activities
  getTodayActivities: async () => {
    const todayRecord = await dailyRecordService.getTodayRecord();
    if (!todayRecord) return [];

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('daily_record_id', todayRecord.id)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// ============================================
// FACE-OFF OPERATIONS
// ============================================
export const faceOffService = {
  // Create a face-off
  createFaceOff: async (category, decisionPath, userWon, pointsImpact, note = null) => {
    const user = await authService.getUser();
    if (!user) throw new Error('Not authenticated');

    const todayRecord = await dailyRecordService.getTodayRecord();

    const { data, error } = await supabase
      .from('face_offs')
      .insert({
        user_id: user.id,
        daily_record_id: todayRecord.id,
        category,
        decision_path: decisionPath,
        user_won: userWon,
        points_impact: pointsImpact,
        note
      })
      .select()
      .single();

    if (error) throw error;

    // Update profile points
    if (userWon) {
      await profileService.updatePoints(pointsImpact, 0);
    } else {
      await profileService.updatePoints(0, pointsImpact);
    }

    return data;
  },

  // Get today's face-offs
  getTodayFaceOffs: async () => {
    const todayRecord = await dailyRecordService.getTodayRecord();
    if (!todayRecord) return [];

    const { data, error } = await supabase
      .from('face_offs')
      .select('*')
      .eq('daily_record_id', todayRecord.id)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Default export with all services
export default {
  supabase,
  authService,
  profileService,
  dailyRecordService,
  activityService,
  faceOffService
};
