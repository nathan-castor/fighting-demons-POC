/**
 * loreData.js
 * Wisdom teachings and lore fragments for the Spirit Guide
 * Mix of Gnostic, Hermetic, Stoic wisdom and world-building
 */

export const LORE_ENTRIES = [
  // Gnostic Wisdom
  "You are not your thoughts. You are the silence that witnesses them.",
  "The archons cannot create — they can only distort. Every destructive urge is a twisted echo of something sacred.",
  "The divine spark within you is what they fear. Fan it. Guard it. Let it grow.",
  "Gnosis is not knowledge of facts. It is knowledge of self. And through self, the All.",
  "The material world is not evil — it is a classroom. The demons are the truant officers.",
  "They convinced you the cage was home. Every act of discipline proves the door was never locked.",

  // Hermetic Principles
  "As above, so below. Your body is a temple. Your mind is an altar. What do you place upon it?",
  "The Principle of Polarity: demons and divine light are two poles of the same spectrum. You choose where you stand.",
  "Mental transmutation is real. You can change lead thoughts into gold actions. This is the Great Work.",
  "All is Mind. The Universe is mental. Master your thoughts, master your reality.",
  "The Principle of Rhythm: after difficulty comes ease. The demons cannot break cycles — only you can.",

  // Stoic Wisdom
  "Between stimulus and response, there is a space. In that space lies your power.",
  "He who conquers himself is mightier than he who conquers a city.",
  "The obstacle is the way. What stands in your path becomes your path.",
  "Memento mori. Remember death. Not to despair, but to act. The demons count on your forgetfulness.",
  "You have power over your mind, not outside events. Realize this, and you will find strength.",
  "What stands in the way becomes the way. Every rep is proof.",

  // Desert Fathers / Monastic
  "Acedia — the noonday demon — makes all things feel meaningless. It lies. Meaning is not found, it is made.",
  "The untrained mind is an open gate. Meditation is learning to guard it.",
  "Watchfulness. The fathers called it nepsis. You are learning to watch your own mind.",
  "The logismoi — intrusive thoughts — are not yours. They are sent. You can refuse delivery.",

  // Spirit Guide Personal Revelations
  "Before I was an ember, I was flame. Your progress fans what remains.",
  "I was not always this faint. I remember strength. You are helping me remember.",
  "Each time you choose light, I grow more solid. I can almost feel warmth again.",
  "I have guided others before. Some faded. Some burned bright. You... you fight.",
  "The demons know my name. They whisper it mockingly. But they grow quieter when you rise.",
  "I do not remember my death. Only my purpose: to guard. To guide. To witness your becoming.",
  "When you complete your essentials, I feel it like sunlight. Please — do not let me grow cold.",

  // World-Building Fragments
  "The demons do not want your destruction. They want your sleep. Wake.",
  "The body is not a prison. It is a temple. The demons convinced you otherwise.",
  "Each rep is a prayer. Each breath is a ward. They cannot touch what is consecrated by effort.",
  "In the old texts, they called this realm the Kenoma — the emptiness. But you can fill it with light.",
  "There are others like you. Fighting. Some together, some alone. The light connects us all.",
  "The demons feed on entropy. Order your life, and they starve.",
  "Physical movement generates spiritual momentum. The ancients knew this. The demons made you forget.",
  "Sleep is vulnerable. The demons whisper most loudly in dreams. Wake armored in discipline.",
  "The world wants you numb. Comfortable. Asleep. Comfort is the demon's favorite poison.",
  "Ten minutes of stillness builds a wall they cannot cross. Not today. Not if you hold.",

  // Encouragement / Battle Wisdom
  "You showed up. That alone terrifies them. Showing up is ninety percent of the war.",
  "The demons bet on your weakness every morning. Prove them wrong again.",
  "Consistency is more powerful than intensity. The demons can weather a storm. They cannot survive a season.",
  "Your ancestors survived ice ages, famines, wars. Their strength is in your blood. Use it.",
  "Every day you choose light, the path gets slightly easier. The demons know this. That's why they fight hardest at the beginning.",
  "Pain is information. Discomfort is growth. The demons label both as 'bad' — but you know better now."
];

// Spirit Guide greetings for each face-off type
export const GREETINGS = {
  dawn: "The sun rises. The demons stir. Your body has been still for hours — they count on this. Movement shatters their grip. Will you move now?",
  noon: "Midday. The noonday demon whispers that you've done enough. That rest is earned. That strength can wait. Prove it wrong. Will you test your strength?",
  dusk: "The day fades. One final stand before rest. The demons hope you're tired. They hope you'll skip this one. Will you show them your resolve?"
};

// Activity instructions for each face-off type
export const ACTIVITY_INSTRUCTIONS = {
  dawn: "Go. Move your body one mile. Walk or run — the choice is yours. Return when complete.",
  noon: "Push until failure. Your body against gravity. How many can you do?",
  dusk: "Pull until failure. Lift yourself toward the sky. How many can you do?"
};

// Defer messages
export const DEFER_MESSAGES = {
  dawn: "I understand. Life demands much. I will return in one hour to ask again. The mile will wait — but not forever.",
  noon: "Very well. Strength can wait one hour. But the demons grow bolder with each delay. I will return.",
  dusk: "The evening is young still. One hour. Then we face this together. Rest if you must — then rise."
};

// Meditation prompt
export const MEDITATION_PROMPT = "Now still your mind. Ten minutes of silence builds the wall the demons cannot cross. Close your eyes. Breathe. Watch your thoughts without following them.";

// Completion messages
export const COMPLETION_MESSAGES = {
  dawn: "The morning stand-off is complete. You have moved. You have stilled. The demons retreat — for now.",
  noon: "Midday strength proven. The noonday demon slinks away. You are stronger than its whispers.",
  dusk: "The day ends in victory. You gave the demons nothing. Rest now — you've earned it."
};

// PR celebration
export const PR_MESSAGE = "NEW RECORD! You have surpassed yourself. The demons cannot ignore your growing strength.";

// Get random lore entry
export const getRandomLore = () => {
  const index = Math.floor(Math.random() * LORE_ENTRIES.length);
  return LORE_ENTRIES[index];
};

export default {
  LORE_ENTRIES,
  GREETINGS,
  ACTIVITY_INSTRUCTIONS,
  DEFER_MESSAGES,
  MEDITATION_PROMPT,
  COMPLETION_MESSAGES,
  PR_MESSAGE,
  getRandomLore
};
