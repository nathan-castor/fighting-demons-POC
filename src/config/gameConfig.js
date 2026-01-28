/**
 * gameConfig.js
 * Central configuration for all game progression systems
 * 
 * POINT MATH:
 * - Dawn (mile + meditation): 10 points
 * - Noon (pushups + meditation): 6 points  
 * - Dusk (pullups + meditation): 6 points
 * - Perfect day: 22 points
 * - PR bonus: +5 points
 * 
 * Day 1: 22 points | Day 2: 44 | Day 7: 154 | Day 30: 660
 */

// ============================================
// SPIRIT GUIDE EVOLUTION STAGES
// Fast early progression, slows down over time
// Day 2 = first evolution to hook users early!
// ============================================
export const SPIRIT_GUIDE_STAGES = [
  { 
    id: 'ember',
    name: 'Ember', 
    minPoints: 0, 
    icon: '🕯️', 
    description: 'A faint flicker, barely holding on',
    evolveMessage: null // Starting stage
  },
  { 
    id: 'shade',
    name: 'Shade', 
    minPoints: 44, // Day 2!
    icon: '👻', 
    description: 'Growing more defined, gaining form',
    evolveMessage: 'Your dedication has given me form. I am no longer just an ember... I am becoming something more.'
  },
  { 
    id: 'specter',
    name: 'Specter', 
    minPoints: 100, // ~Day 5
    icon: '✨', 
    description: 'Radiant and strong, a true presence',
    evolveMessage: 'I can feel the light coursing through me! The demons... they notice now. They fear what we are becoming.'
  },
  { 
    id: 'wraith',
    name: 'Wraith', 
    minPoints: 200, // ~Day 9
    icon: '🌟', 
    description: 'A force of ethereal power',
    evolveMessage: 'I remember now... fragments of who I was before. Your strength is restoring my memories.'
  },
  { 
    id: 'guardian',
    name: 'Guardian', 
    minPoints: 400, // ~Day 18
    icon: '🛡️', 
    description: 'A powerful protector, shield of light',
    evolveMessage: 'I can protect you now. Not just guide — PROTECT. The demons will not touch you while I stand.'
  },
  { 
    id: 'sentinel',
    name: 'Sentinel', 
    minPoints: 700, // ~Day 32 (1 month!)
    icon: '⚔️', 
    description: 'Warrior of the light, blade drawn',
    evolveMessage: 'A full cycle of the moon, and look what we have become. I am no longer your guide — I am your sword.'
  },
  { 
    id: 'seraph',
    name: 'Seraph', 
    minPoints: 1200, // ~Day 55
    icon: '👼', 
    description: 'Transcendent being of pure radiance',
    evolveMessage: 'The transformation is nearly complete. I ascend... and you ascend with me. We are bound eternal.'
  },
  { 
    id: 'radiant',
    name: 'Radiant', 
    minPoints: 2000, // ~Day 91 (3 months!)
    icon: '☀️', 
    description: 'Blazing with divine light',
    evolveMessage: 'Three moons of battle. Three moons of victory. I AM the light now. And so are you.'
  },
  { 
    id: 'ascendant',
    name: 'Ascendant', 
    minPoints: 3500, // ~Day 159 (5+ months)
    icon: '🔱', 
    description: 'Beyond mortal comprehension',
    evolveMessage: 'There are no more stages. We have transcended. The demons speak of us in whispers. We are legend.'
  }
];

// ============================================
// USER TITLES / RANKS
// Separate from Spirit Guide - YOUR title!
// ============================================
export const USER_TITLES = [
  { 
    id: 'initiate',
    name: 'Initiate', 
    minPoints: 0, 
    description: 'Beginning the journey'
  },
  { 
    id: 'acolyte',
    name: 'Acolyte', 
    minPoints: 50, // ~Day 3
    description: 'Learning the ways of light'
  },
  { 
    id: 'warrior',
    name: 'Warrior', 
    minPoints: 150, // ~Day 7 (1 week!)
    description: 'Proven in battle'
  },
  { 
    id: 'knight',
    name: 'Knight of Light', 
    minPoints: 350, // ~Day 16
    description: 'Sworn defender against darkness'
  },
  { 
    id: 'champion',
    name: 'Champion', 
    minPoints: 600, // ~Day 27
    description: 'Victor of countless face-offs'
  },
  { 
    id: 'crusader',
    name: 'Crusader', 
    minPoints: 1000, // ~Day 45
    description: 'Marching ever forward in holy purpose'
  },
  { 
    id: 'paladin',
    name: 'Paladin', 
    minPoints: 1800, // ~Day 82 (nearly 3 months)
    description: 'Master of body and spirit'
  },
  { 
    id: 'lightbringer',
    name: 'Lightbringer', 
    minPoints: 3000, // ~Day 136
    description: 'Bearer of the sacred flame'
  },
  { 
    id: 'ascended',
    name: 'Ascended', 
    minPoints: 5000, // ~Day 227 (7+ months)
    description: 'Beyond mortal limits'
  }
];

// ============================================
// ACHIEVEMENT BADGES
// ============================================
export const ACHIEVEMENTS = {
  // First steps
  first_light: {
    id: 'first_light',
    name: 'First Light',
    description: 'Complete your first face-off',
    icon: '🌅',
    category: 'milestones',
    secret: false
  },
  perfect_day: {
    id: 'perfect_day',
    name: 'Perfect Day',
    description: 'Complete all 3 face-offs in one day',
    icon: '⭐',
    category: 'milestones',
    secret: false
  },
  
  // Streak achievements
  streak_3: {
    id: 'streak_3',
    name: 'Kindling',
    description: '3-day streak',
    icon: '🔥',
    category: 'streaks',
    secret: false
  },
  streak_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7-day streak',
    icon: '💪',
    category: 'streaks',
    secret: false
  },
  streak_14: {
    id: 'streak_14',
    name: 'Fortnight Fighter',
    description: '14-day streak',
    icon: '⚡',
    category: 'streaks',
    secret: false
  },
  streak_30: {
    id: 'streak_30',
    name: 'Monthly Master',
    description: '30-day streak',
    icon: '🏆',
    category: 'streaks',
    secret: false
  },
  streak_100: {
    id: 'streak_100',
    name: 'Centurion',
    description: '100-day streak',
    icon: '👑',
    category: 'streaks',
    secret: false
  },
  
  // PR achievements
  first_pr: {
    id: 'first_pr',
    name: 'Iron Will',
    description: 'Beat a personal record',
    icon: '🎯',
    category: 'strength',
    secret: false
  },
  pushup_50: {
    id: 'pushup_50',
    name: 'Push It',
    description: '50 pushups in a single set',
    icon: '💥',
    category: 'strength',
    secret: false
  },
  pushup_100: {
    id: 'pushup_100',
    name: 'Century Club',
    description: '100 pushups in a single set',
    icon: '💯',
    category: 'strength',
    secret: false
  },
  pullup_20: {
    id: 'pullup_20',
    name: 'Rising Up',
    description: '20 pullups in a single set',
    icon: '🧗',
    category: 'strength',
    secret: false
  },
  pullup_50: {
    id: 'pullup_50',
    name: 'Gravity Defier',
    description: '50 pullups in a single set',
    icon: '🦅',
    category: 'strength',
    secret: false
  },
  
  // Distance achievements
  miles_10: {
    id: 'miles_10',
    name: 'Trailblazer',
    description: 'Walk/run 10 total miles',
    icon: '🚶',
    category: 'endurance',
    secret: false
  },
  miles_50: {
    id: 'miles_50',
    name: 'Road Warrior',
    description: 'Walk/run 50 total miles',
    icon: '🏃',
    category: 'endurance',
    secret: false
  },
  miles_100: {
    id: 'miles_100',
    name: 'Marathon Mind',
    description: 'Walk/run 100 total miles',
    icon: '🏅',
    category: 'endurance',
    secret: false
  },
  miles_500: {
    id: 'miles_500',
    name: 'Pilgrim',
    description: 'Walk/run 500 total miles',
    icon: '🗺️',
    category: 'endurance',
    secret: true // Secret achievement!
  },
  
  // Meditation achievements
  meditation_100: {
    id: 'meditation_100',
    name: 'Still Mind',
    description: '100 total minutes of meditation',
    icon: '🧘',
    category: 'mindfulness',
    secret: false
  },
  meditation_500: {
    id: 'meditation_500',
    name: 'Inner Peace',
    description: '500 total minutes of meditation',
    icon: '☯️',
    category: 'mindfulness',
    secret: false
  },
  meditation_1000: {
    id: 'meditation_1000',
    name: 'Enlightened',
    description: '1000 total minutes of meditation',
    icon: '🕉️',
    category: 'mindfulness',
    secret: false
  },
  
  // Point milestones
  points_100: {
    id: 'points_100',
    name: 'Rising Power',
    description: 'Earn 100 total points',
    icon: '✨',
    category: 'milestones',
    secret: false
  },
  points_500: {
    id: 'points_500',
    name: 'Force of Nature',
    description: 'Earn 500 total points',
    icon: '🌊',
    category: 'milestones',
    secret: false
  },
  points_1000: {
    id: 'points_1000',
    name: 'Thousand Strong',
    description: 'Earn 1000 total points',
    icon: '⚔️',
    category: 'milestones',
    secret: false
  },
  
  // Evolution achievements
  first_evolution: {
    id: 'first_evolution',
    name: 'Awakening',
    description: 'Spirit Guide evolves for the first time',
    icon: '🦋',
    category: 'evolution',
    secret: false
  },
  guardian_reached: {
    id: 'guardian_reached',
    name: 'Guardian Bond',
    description: 'Spirit Guide reaches Guardian stage',
    icon: '🛡️',
    category: 'evolution',
    secret: false
  },
  seraph_reached: {
    id: 'seraph_reached',
    name: 'Seraphic Bond',
    description: 'Spirit Guide reaches Seraph stage',
    icon: '👼',
    category: 'evolution',
    secret: false
  },
  
  // Secret achievements
  early_bird: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete Dawn face-off before 5 AM',
    icon: '🐦',
    category: 'secret',
    secret: true
  },
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete Dusk face-off after 11 PM',
    icon: '🦉',
    category: 'secret',
    secret: true
  },
  comeback: {
    id: 'comeback',
    name: 'The Comeback',
    description: 'Complete a face-off after deferring 3 times',
    icon: '🔄',
    category: 'secret',
    secret: true
  }
};

// ============================================
// LORE UNLOCKS
// New lore entries unlocked at milestones
// ============================================
export const LORE_UNLOCKS = [
  {
    id: 'lore_origin',
    name: 'The Origin',
    unlocksAt: { type: 'points', value: 50 },
    entries: [
      "In the beginning, there was only the Pleroma — the fullness of divine light. Then came the Fall.",
      "The Kenoma was born from that Fall — an emptiness yearning to be filled.",
      "The demons are not evil by nature. They are absence. Hunger. The void's attempt to consume what it lacks."
    ]
  },
  {
    id: 'lore_guides',
    name: 'The Spirit Guides',
    unlocksAt: { type: 'evolution', value: 'shade' },
    entries: [
      "Spirit Guides are fragments of the original light, scattered during the Fall.",
      "Each Guide bonds to a mortal once, and only once. The bond is eternal.",
      "When a mortal fails completely, the Guide fades. When a mortal transcends, the Guide ascends."
    ]
  },
  {
    id: 'lore_demons',
    name: 'The Nature of Demons',
    unlocksAt: { type: 'streak', value: 7 },
    entries: [
      "The demons have names: Acedia, the noonday demon. Tristitia, the shadow of despair. Vainglory, the mirror's lie.",
      "They cannot create. They can only distort, corrupt, and consume.",
      "Every time you choose light, a demon somewhere grows weaker. They know your name."
    ]
  },
  {
    id: 'lore_body',
    name: 'The Temple of Flesh',
    unlocksAt: { type: 'miles', value: 10 },
    entries: [
      "The Hermetic masters taught: the body is not a prison. It is a temple. A laboratory. A forge.",
      "Physical movement generates spiritual momentum. The ancients knew this before they knew why.",
      "Each mile walked is a prayer. Each breath is a ward. They cannot touch what is consecrated by effort."
    ]
  },
  {
    id: 'lore_mind',
    name: 'The Fortress Mind',
    unlocksAt: { type: 'meditation', value: 100 },
    entries: [
      "The untrained mind is an open gate. Meditation is learning to guard it.",
      "Watchfulness. The desert fathers called it nepsis. You are learning to watch your own mind.",
      "Ten minutes of stillness builds a wall they cannot cross. A lifetime of stillness builds a castle."
    ]
  },
  {
    id: 'lore_strength',
    name: 'The Way of Strength',
    unlocksAt: { type: 'pushups', value: 100 },
    entries: [
      "Strength is not violence. Strength is the capacity to resist entropy.",
      "The Stoics knew: he who conquers himself is mightier than he who conquers a city.",
      "Every rep is an act of defiance. Every failure to failure is proof of will."
    ]
  },
  {
    id: 'lore_ascension',
    name: 'The Path of Ascension',
    unlocksAt: { type: 'evolution', value: 'seraph' },
    entries: [
      "There are those who walked this path before you. Some became legends. Some became warnings.",
      "Ascension is not escape from the body. It is the perfection of body, mind, and spirit in union.",
      "The final stage is not power. It is peace. The demons cannot touch peace."
    ]
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get Spirit Guide stage based on total points
 */
export const getSpiritGuideStage = (totalPoints) => {
  for (let i = SPIRIT_GUIDE_STAGES.length - 1; i >= 0; i--) {
    if (totalPoints >= SPIRIT_GUIDE_STAGES[i].minPoints) {
      return SPIRIT_GUIDE_STAGES[i];
    }
  }
  return SPIRIT_GUIDE_STAGES[0];
};

/**
 * Get User Title based on total points
 */
export const getUserTitle = (totalPoints) => {
  for (let i = USER_TITLES.length - 1; i >= 0; i--) {
    if (totalPoints >= USER_TITLES[i].minPoints) {
      return USER_TITLES[i];
    }
  }
  return USER_TITLES[0];
};

/**
 * Check if user just evolved (comparing old points to new points)
 */
export const checkEvolution = (oldPoints, newPoints) => {
  const oldStage = getSpiritGuideStage(oldPoints);
  const newStage = getSpiritGuideStage(newPoints);
  
  if (newStage.id !== oldStage.id) {
    return {
      evolved: true,
      fromStage: oldStage,
      toStage: newStage
    };
  }
  return { evolved: false };
};

/**
 * Check if user earned a new title
 */
export const checkTitleUp = (oldPoints, newPoints) => {
  const oldTitle = getUserTitle(oldPoints);
  const newTitle = getUserTitle(newPoints);
  
  if (newTitle.id !== oldTitle.id) {
    return {
      titleUp: true,
      fromTitle: oldTitle,
      toTitle: newTitle
    };
  }
  return { titleUp: false };
};

/**
 * Get next evolution milestone
 */
export const getNextEvolution = (totalPoints) => {
  for (let i = 0; i < SPIRIT_GUIDE_STAGES.length; i++) {
    if (SPIRIT_GUIDE_STAGES[i].minPoints > totalPoints) {
      return {
        stage: SPIRIT_GUIDE_STAGES[i],
        pointsNeeded: SPIRIT_GUIDE_STAGES[i].minPoints - totalPoints
      };
    }
  }
  return null; // Max stage reached
};

/**
 * Get progress to next evolution (0-100%)
 */
export const getEvolutionProgress = (totalPoints) => {
  const currentStage = getSpiritGuideStage(totalPoints);
  const currentIndex = SPIRIT_GUIDE_STAGES.findIndex(s => s.id === currentStage.id);
  
  if (currentIndex === SPIRIT_GUIDE_STAGES.length - 1) {
    return 100; // Max stage
  }
  
  const nextStage = SPIRIT_GUIDE_STAGES[currentIndex + 1];
  const pointsInCurrentStage = totalPoints - currentStage.minPoints;
  const pointsNeededForNext = nextStage.minPoints - currentStage.minPoints;
  
  return Math.min(100, Math.round((pointsInCurrentStage / pointsNeededForNext) * 100));
};

export default {
  SPIRIT_GUIDE_STAGES,
  USER_TITLES,
  ACHIEVEMENTS,
  LORE_UNLOCKS,
  getSpiritGuideStage,
  getUserTitle,
  checkEvolution,
  checkTitleUp,
  getNextEvolution,
  getEvolutionProgress
};
