# Fighting Demons

> A gamified self-improvement app where users wage spiritual warfare against inner demons through daily rituals, guided by an evolving Spirit companion.

## Overview

Fighting Demons is a React-based mobile app (via Capacitor) that transforms daily exercise and meditation into epic spiritual battles. Complete three daily "Face-Offs" at Dawn, Noon, and Dusk to earn Life Force, evolve your Spirit Guide, and unlock achievements.

## Features

### Core Gameplay
- **Three Daily Face-Offs**: Dawn (1 mile walk/run), Noon (max pushups), Dusk (max pullups)
- **10-minute meditation** after each physical activity
- **Spirit Guide** that evolves as you progress (9 stages from Ember to Ascendant)
- **User Titles** that increase with experience (Initiate → Knight of Light → Ascended)
- **25+ Achievement Badges** across 6 categories

### Progression System
- **Fast early progression**: First evolution on Day 2 to hook you on results
- **Evolution celebrations**: Beautiful animated modal when Spirit Guide evolves
- **Lifetime stats**: Track total miles, pushups, pullups, meditation minutes
- **Dashboard tabs**: Records / Lifetime Stats / Badges

### Notifications
- Daily reminders for Dawn (6am), Noon (12pm), and Dusk (6pm) Face-Offs
- Deferred notification when you postpone a Face-Off

## Tech Stack

- **Frontend**: React 19, Framer Motion
- **Mobile**: Capacitor 8 (Android)
- **Storage**: localStorage (Supabase ready)
- **Notifications**: @capacitor/local-notifications

## Development

### Web Development
```bash
npm start                    # Start dev server (localhost:3000)
```

### Android Development
```bash
npm run build               # Build production React
npx cap sync android        # Sync to Android project
npx cap open android        # Open Android Studio
# Then click Run ▶️ in Android Studio
```

### After Code Changes
```bash
npm run build && npx cap sync android
# Then run from Android Studio
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard/          ← Main hub with Face-Off cards, stats, badges
│   ├── FaceOff/            ← Core interaction flow
│   ├── EvolutionCelebration/ ← Spirit Guide evolution animation
│   ├── IntroAnimation/     ← 11-step onboarding experience
│   └── UserAuth/           ← Name registration
├── config/
│   └── gameConfig.js       ← Central progression config (stages, titles, badges)
├── services/
│   ├── LocalStorageService.js  ← Data persistence + stats calculator
│   └── NotificationService.js  ← Push notification scheduling
└── styles/
    └── colors.css          ← CSS variables for theming

android/                    ← Capacitor Android project
capacitor.config.ts         ← Capacitor configuration
documentation/              ← Game design docs
```

## Documentation

- [Game Design Document](documentation/game-design.md) - Full game design and lore
- [Development Roadmap](documentation/development-roadmap.md) - Current status and todos

## License

Private project - All rights reserved
