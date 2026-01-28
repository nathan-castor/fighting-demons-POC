# Fighting Demons — Development Roadmap

> **Last Updated:** Jan 27, 2026
> **Purpose:** Track progress across Cursor AI, Browser Claude, and personal todos

---

## 🚀 Current State (Jan 27, 2026)

### ✅ What's Working
| Component | Status | Notes |
|-----------|--------|-------|
| IntroAnimation | ✅ Working | 6-step lore intro with Framer Motion |
| UserAuth | ✅ Basic | Name-only registration (localStorage) |
| Dashboard | ✅ Working | Shows 3 Face-Off cards (Dawn/Noon/Dusk), Spirit Guide, PRs |
| FaceOff | ✅ Working | Full stepped flow: Greeting → Activity → Meditation → Lore → Summary |
| LocalStorageService | ✅ Working | Handles all data persistence locally |
| **Android App** | ✅ NEW | Capacitor setup complete, runs on phone! |
| Local Notifications | 🔌 Installed | Plugin added, not yet implemented |

### ⚠️ Not Yet Implemented
| Feature | Priority | Notes |
|---------|----------|-------|
| Supabase Integration | Medium | Currently all localStorage |
| Push Notifications | High | Plugin installed, need to schedule Dawn/Noon/Dusk reminders |
| Custom App Icon | Medium | Using default icon currently |
| Spirit Guide Animations | Medium | Emoji placeholders, need real artwork |
| Sound Effects | Low | Silent currently |

---

## 📱 Android Development Setup

**Build & Run:**
```bash
cd /Users/nathanielcastor/Documents/REPOS/fighting-demons-POC

# After making code changes:
npm run build           # Build React app
npx cap sync android    # Sync to Android
npx cap open android    # Open in Android Studio
# Then click Run ▶️ in Android Studio
```

**Build APK for sharing:**
```bash
# In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
# APK location: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 Immediate TODOs

### High Priority
- [ ] **Implement notifications** — Schedule reminders for Dawn (6am), Noon (12pm), Dusk (6pm)
- [ ] **Fix intro flow** — Ensure first-time users see full intro on mobile
- [ ] **Add custom app icon** — Replace default Android icon
- [ ] **Add splash screen** — Branded loading screen

### Medium Priority
- [ ] **Connect Supabase** — Real data persistence across devices
- [ ] **Spirit Guide artwork** — Commission or create SVG/Lottie animations
- [ ] **Haptic feedback** — Vibrate on completions and demon encounters
- [ ] **Offline sync** — Queue actions when offline, sync when online

### Low Priority (Polish)
- [ ] Sound effects for interactions
- [ ] Particle effects (embers, glow)
- [ ] Streak tracking and celebrations
- [ ] Share progress feature

---

## 🎨 Animation & Visual Roadmap

### Spirit Guide Evolution Stages
| Stage | Points | Current | Target |
|-------|--------|---------|--------|
| Ember | 0-199 | 🕯️ | Flickering flame SVG with particle embers |
| Shade | 200-499 | 👻 | Ethereal figure with wispy edges |
| Specter | 500-999 | ✨ | Glowing entity with subtle aura |
| Guardian | 1000-1999 | 🛡️ | Armored spirit with protective stance |
| Seraph | 2000+ | 🌟 | Radiant winged being |

### Animation Technologies
- **Lottie** — For complex character animations (exported from After Effects)
- **Framer Motion** — UI transitions and micro-interactions (already using)
- **CSS Animations** — Subtle effects (glow, pulse, float)
- **SVG Animation** — Spirit Guide artwork with animated elements

### Interaction Ideas
- Spirit Guide "breathes" (subtle scale pulse) when idle
- Lore text types out character by character (already implemented!)
- Meditation timer has breathing circle animation
- PR achieved triggers celebration particles
- Demon encounters have ominous visual effects

---

## 🗄️ Data Architecture

### Current: localStorage Only
```
fighting-demons-user        → User profile, PRs, points
fighting-demons-daily-records → Daily completions
fighting-demons-version     → Cache versioning
fighting-demons-seen-intro  → Intro flag
```

### Future: Supabase Schema
```sql
-- Already designed in supabase-schema.sql
-- profiles, daily_records, activities, face_offs tables
```

### Sync Strategy (When Implemented)
1. Always write to localStorage first (instant)
2. Queue changes for Supabase sync
3. Sync when online
4. Resolve conflicts by "last write wins" or merge

---

## 📂 File Structure

```
src/
├── components/
│   ├── ActivityTracker/    ← Legacy, may deprecate
│   ├── Dashboard/          ← Main hub with 3 Face-Off cards
│   ├── FaceOff/            ← Core interaction (greeting → activity → meditation → lore → summary)
│   │   ├── FaceOff.js
│   │   ├── FaceOff.css
│   │   └── loreData.js     ← 45+ wisdom fragments
│   ├── IntroAnimation/     ← First-time user experience
│   ├── MorningStandOff/    ← Legacy, replaced by FaceOff
│   └── UserAuth/           ← Name registration
├── services/
│   ├── LocalStorageService.js  ← All data operations
│   └── SupabaseService.js      ← Created but not actively used
├── hooks/
│   └── useAuth.js              ← Empty (auth simplified to localStorage)
└── styles/
    └── colors.css              ← CSS variables for theming

android/                        ← Capacitor Android project
capacitor.config.ts            ← Capacitor configuration
```

---

## 🔧 Development Commands

**Web Development:**
```bash
npm start                    # Start dev server (localhost:3000)
```

**Android Development:**
```bash
npm run build               # Build production React
npx cap sync android        # Sync to Android project
npx cap open android        # Open Android Studio
```

**Debug on Phone:**
1. Enable Developer Options on phone
2. Enable USB Debugging (disable Auto Blocker first on Samsung)
3. Connect via USB
4. Run from Android Studio

**Reset Local Data (browser console):**
```javascript
localStorage.clear();
location.reload();
```

---

## 📝 Session Log

### Jan 27, 2026 (Cursor AI)
- ✅ Set up Capacitor for Android
- ✅ Built and ran app on Samsung Galaxy S25 Ultra
- ✅ Added @capacitor/local-notifications plugin
- ⏳ Next: Implement notification scheduling, custom app icon

### Jan 11, 2026 (Previous Session)
- Created MorningStandOff component
- Fixed routing for intro → register → dashboard flow
- Simplified UserAuth to name-only

---

## 🐛 Known Issues

- [ ] Intro may be skipped on fresh mobile install (version check race condition?)
- [ ] useAuth.js hook is empty (auth handled directly in App.js)
- [ ] No real authentication (anyone can enter any name)
- [ ] Data lost if user clears app storage
- [ ] MorningStandOff component exists but unused (replaced by FaceOff)

---

## 💡 Feature Ideas (Brainstorm)

- **Daily Demon Encounters** — Random temptation scenarios with choices
- **Wisdom Journal** — Save favorite lore fragments
- **Progress Photos** — Optional visual progress tracking
- **Accountability Partner** — Share streaks with a friend
- **Leaderboard** — Compare with other users (requires Supabase)
- **Custom Meditation Audio** — Ambient sounds during timer
- **Widget** — Android home screen widget showing today's status

---

## ⚙️ Settings & Debug (In-App)

Dashboard has a Settings (⚙️) button with:
- Replay Intro Animation
- Full Reset (clear all data)
- Debug info (user ID, profile status)

---

*Remember to turn Auto Blocker back on after development!* 🔒
