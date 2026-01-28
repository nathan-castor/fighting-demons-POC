# Fighting Demons — Development Roadmap

> **Last Updated:** Jan 28, 2026
> **Purpose:** Track progress across Cursor AI, Browser Claude, and personal todos

---

## 🚀 Current State (Jan 28, 2026)

### ✅ What's Working
| Component | Status | Notes |
|-----------|--------|-------|
| IntroAnimation | ✅ Enhanced | 11-step lore intro with Spirit Guide showcase and evolution preview |
| UserAuth | ✅ Basic | Name-only registration (localStorage) |
| Dashboard | ✅ Enhanced | 3 Face-Off cards, Spirit Guide with evolution progress, user title, tabs for Records/Lifetime/Badges |
| FaceOff | ✅ Enhanced | Full flow with Spirit Guide display, evolution celebrations |
| EvolutionCelebration | ✅ NEW | Animated modal when Spirit Guide evolves |
| LocalStorageService | ✅ Enhanced | Handles data + achievements + lifetime stats |
| NotificationService | ✅ Working | Daily notifications at 6am/12pm/6pm, deferred reminders |
| gameConfig | ✅ NEW | Central config for all progression (stages, titles, badges) |
| **Android App** | ✅ Working | Capacitor setup complete, notifications working |
| **Achievements** | ✅ NEW | 25+ badges across 6 categories |
| **Lifetime Stats** | ✅ NEW | Total miles, pushups, pullups, meditation tracked |

### ⚠️ Not Yet Implemented
| Feature | Priority | Notes |
|---------|----------|-------|
| Supabase Integration | Medium | Currently all localStorage |
| User Avatar | Medium | Profile picture/emoji picker |
| Lore Unlocks | Medium | Wisdom entries unlock at milestones |
| Custom App Icon | Medium | Using default icon currently |
| Spirit Guide Artwork | Medium | Emoji placeholders, need real artwork |
| Sound Effects | Low | Silent currently |
| Stagnation Penalties | Medium | Life force drain on missed days |

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
- [x] ~~**Implement notifications**~~ ✅ Done! Reminders for Dawn (6am), Noon (12pm), Dusk (6pm)
- [x] ~~**Fix intro flow**~~ ✅ Enhanced to 11 steps with Spirit Guide showcase
- [ ] **Add custom app icon** — Replace default Android icon
- [ ] **Add splash screen** — Branded loading screen

### Medium Priority
- [ ] **User avatar** — Profile picture or emoji picker
- [ ] **Lore unlock system** — Wisdom entries unlock at milestones (config exists, UI needed)
- [ ] **Connect Supabase** — Real data persistence across devices
- [ ] **Spirit Guide artwork** — Commission or create SVG/Lottie animations
- [ ] **Haptic feedback** — Vibrate on completions and demon encounters

### Low Priority (Polish)
- [ ] Sound effects for interactions
- [ ] Particle effects (embers, glow)
- [ ] Weekly/monthly progress summaries
- [ ] Share progress feature

---

## 🎨 Animation & Visual Roadmap

### Spirit Guide Evolution Stages (Updated)
| Stage | Points | Current | Target |
|-------|--------|---------|--------|
| Ember | 0 | 🕯️ | Flickering flame SVG with particle embers |
| Shade | 44 | 👻 | Ethereal figure with wispy edges |
| Specter | 100 | ✨ | Glowing entity with subtle aura |
| Wraith | 200 | 🌟 | Ethereal force with trailing effects |
| Guardian | 400 | 🛡️ | Armored spirit with protective stance |
| Sentinel | 700 | ⚔️ | Warrior spirit with blade |
| Seraph | 1,200 | 👼 | Radiant winged being |
| Radiant | 2,000 | ☀️ | Blazing sun entity |
| Ascendant | 3,500 | 🔱 | Transcendent being with sacred geometry |

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
fighting-demons-user        → User profile, PRs, points, lifetime stats
fighting-demons-daily-records → Daily completions
fighting-demons-achievements  → Unlocked achievement IDs with timestamps
fighting-demons-lore-unlocks  → Unlocked lore entry IDs
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
│   ├── Dashboard/          ← Main hub: Face-Off cards, stats tabs, badges
│   ├── EvolutionCelebration/ ← NEW: Animated evolution modal
│   ├── FaceOff/            ← Core interaction with Spirit Guide
│   │   ├── FaceOff.js
│   │   ├── FaceOff.css
│   │   └── loreData.js     ← 60+ wisdom fragments
│   ├── IntroAnimation/     ← 11-step onboarding with Spirit Guide showcase
│   ├── MorningStandOff/    ← Legacy, replaced by FaceOff
│   └── UserAuth/           ← Name registration
├── config/
│   └── gameConfig.js       ← NEW: Central config for stages, titles, badges, lore
├── services/
│   ├── LocalStorageService.js  ← Data + achievements + stats calculator
│   ├── NotificationService.js  ← Push notification scheduling
│   └── SupabaseService.js      ← Created but not actively used
├── hooks/
│   └── useAuth.js              ← Empty (auth simplified to localStorage)
└── styles/
    └── colors.css              ← CSS variables for theming

android/                        ← Capacitor Android project
capacitor.config.ts            ← Capacitor configuration
documentation/                  ← Game design docs
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

### Jan 28, 2026 (Cursor AI) — MAJOR UPDATE
- ✅ Fixed Android notifications (permissions, scheduling, test button)
- ✅ Enhanced intro to 11 steps with Spirit Guide and world lore
- ✅ Created central gameConfig.js with 9 Spirit Guide stages
- ✅ Added User Titles system (Initiate → Ascended)
- ✅ Built 25+ achievement badges across 6 categories
- ✅ Added lifetime stats tracking (miles, pushups, pullups, meditation)
- ✅ Created EvolutionCelebration component with animated modal
- ✅ Updated Dashboard with tabs (Records/Lifetime/Badges)
- ✅ Added evolution progress ring and next evolution hint

### Jan 27, 2026 (Cursor AI)
- ✅ Set up Capacitor for Android
- ✅ Built and ran app on Samsung Galaxy S25 Ultra
- ✅ Added @capacitor/local-notifications plugin

### Jan 11, 2026 (Previous Session)
- Created MorningStandOff component
- Fixed routing for intro → register → dashboard flow
- Simplified UserAuth to name-only

---

## 🐛 Known Issues

- [ ] useAuth.js hook is empty (auth handled directly in App.js)
- [ ] No real authentication (anyone can enter any name)
- [ ] Data lost if user clears app storage
- [ ] MorningStandOff component exists but unused (replaced by FaceOff)
- [ ] ActivityTracker component is legacy and unused

---

## 💡 Feature Ideas (Brainstorm)

- **Voice Interaction** — Talk to Spirit Guide (long-term goal)
- **Wisdom Journal** — Save favorite lore fragments
- **Progress Photos** — Optional visual progress tracking
- **Accountability Partner** — Share streaks with a friend
- **Leaderboard** — Compare with other users (requires Supabase)
- **Custom Meditation Audio** — Ambient sounds during timer
- **Widget** — Android home screen widget showing today's status
- **Weekly Summaries** — End-of-week progress recap with Spirit Guide commentary

---

## ⚙️ Settings & Debug (In-App)

Dashboard has a Settings (⚙️) button with three tabs:

**Account Tab:**
- View profile info and Spirit Guide stage
- Replay Intro Animation

**Notifications Tab:**
- Enable/disable push notifications
- Send test notification (for debugging)
- Check pending notifications

**Dev Tools Tab:**
- Export/import data (JSON backup)
- Data summary (days tracked, points)
- New profile / Fresh start / Full reset options
- Debug info (user ID, platform, version)

---

*Remember to turn Auto Blocker back on after development!* 🔒
