# Fighting Demons — Game Design Document

> A gamified self-improvement app where users wage spiritual warfare against inner demons through daily rituals, guided by an evolving Spirit companion.

---

## Core Concept

You are reborn into a spiritual realm — not as a helpless infant, but aware and capable, like a fawn that can walk from birth. You have no parents here. Instead, you are bonded to a **Spirit Guide**: a faint, flickering presence that senses the darkness in this world and seeks to protect you.

This world is occupied by **demons** — not external monsters, but archetypal forces of entropy, lethargy, and self-destruction. They do not attack you directly. They *influence* you. They whisper that nothing matters, that rest is easier than effort, that one drink won't hurt, that you can skip today and start tomorrow.

Your survival depends on **resistance**. The bare minimum: move your body one mile each day, and still your mind for ten minutes. These are not optional goals — they are *survival requirements*. Fall into stagnation, and the demons grow stronger within you. Your Spirit Guide grows dim. Eventually, you die — and must be reborn, starting again.

But if you persist, you grow. Your Spirit Guide evolves from a flickering ember into a radiant guardian. You unlock ancient wisdom. You build resilience that lets you weather difficult days. You become someone the demons cannot easily touch.

---

## Philosophical & Esoteric Foundations

The app draws inspiration from genuine spiritual traditions that speak of inner warfare against destructive forces:

### Gnosticism

- **Archons**: Rulers/demons that keep souls trapped in ignorance and material obsession
- **The Divine Spark**: The belief that each person carries a fragment of divine light within, which must be protected and cultivated
- **Gnosis**: Salvific knowledge — not just information, but transformative understanding

### Hermeticism

- **"As above, so below"**: Your inner state reflects and affects your outer reality
- **Mental Transmutation**: The ability to change one's mental state through will and practice
- **The Principle of Polarity**: Demons and divine light are two poles of the same spectrum

### Desert Fathers / Early Christian Monasticism

- **Acedia**: The "noonday demon" — spiritual sloth, apathy, the inability to care
- **Logismoi**: Intrusive thoughts sent by demons to derail the seeker
- **Watchfulness (Nepsis)**: Constant vigilance over one's thoughts and impulses

### Stoicism (Complementary)

- **Prohairesis**: The ruling faculty of choice — the one thing truly under your control
- **Memento Mori**: Remember death — urgency as antidote to complacency

These traditions are **not presented as religious doctrine** but as **narrative flavor and wisdom teachings** that give depth to the game mechanics.

---

## The Spirit Guide

Your Spirit Guide is your companion, mentor, and mirror. It reflects your spiritual state.

### Evolution Stages

| Stage | Name | Appearance | Points Required |
|-------|------|------------|-----------------|
| 1 | **Ember** | Faint flickering wisp, barely visible, like a candle about to go out | 0 (starting) |
| 2 | **Shade** | Translucent humanoid form, features unclear, voice a whisper | 200 |
| 3 | **Specter** | Solid ghostly form, glowing eyes, gentle luminous aura | 500 |
| 4 | **Guardian** | Full radiant humanoid figure, hints of wings or halo, warm presence | 1,000 |
| 5 | **Seraph** | Brilliant, powerful, intricate sacred geometry patterns, commanding voice | 2,000 |

### Regression

- If you die (Life Force hits 0), your Spirit Guide drops **one full stage**
- Within a stage, consecutive stagnant days cause visible dimming/flickering
- This creates emotional stakes: you're not just hurting yourself, you're starving your companion

### Personalization (Future Feature)

- Name your Spirit Guide
- Choose masculine/feminine/neutral presentation
- Unlock cosmetic variations through achievements

---

## Life Force & Scoring System

### Core Resource: Life Force

You begin with **100 Life Force**. This is your health, your spiritual vitality, your connection to the light.

| Event | Life Force Change |
|-------|-------------------|
| Complete daily essentials (mile + meditation) | +15 |
| Complete only one essential | +5 |
| Stagnant Day 1 (no essentials) | -10 |
| Stagnant Day 2 (consecutive) | -25 |
| Stagnant Day 3 (consecutive) | -50 |
| Stagnant Day 4+ | **Death** (reset) |
| Win a Face-Off (positive choice) | +5 to +15 (varies) |
| Lose a Face-Off (destructive choice) | -5 to -20 (varies) |

### Death & Rebirth

When Life Force reaches 0:

- Your character dies
- Spirit Guide drops one evolution stage
- You are "reborn" with 100 Life Force
- **Retained**: Unlocked wisdom teachings, Spirit Guide stage (minus one), lifetime statistics
- **Lost**: Current streak, any "Resistance" buffer built up

### Resistance (Veteran Buffer)

As you accumulate **total lifetime points** (not current Life Force), you build **Resistance** — a buffer that softens stagnation penalties.

| Lifetime Points | Resistance Level | Stagnation Modifier |
|-----------------|------------------|---------------------|
| 0–199 | None | Full penalties |
| 200–499 | Novice | -20% penalty reduction |
| 500–999 | Adept | -35% penalty reduction |
| 1,000–1,999 | Warrior | -50% penalty reduction |
| 2,000+ | Master | -60% penalty reduction, extra grace day |

This means veterans can survive a bad week, but they're never immune. The demons always threaten.

---

## Activity Tiers

Activities are organized into three tiers based on survival importance.

### Overview

| Tier | Name | Activities | Requirement | Consequence |
|------|------|------------|-------------|-------------|
| 1 | **Essentials** | 1 mile run/walk, 10 min meditation | Daily, non-negotiable | Stagnation penalties → death spiral |
| 2 | **Strength Tests** | Max pushups, Max pullups | Daily attempt required | Light penalty if missed (-5 each) |
| 3 | **Recommended** | Sprints, plank, stretching | Spirit Guide suggests | Bonus if done, no penalty if skipped |

---

### Tier 1: Essentials (Survival Requirements)

These are non-negotiable. Miss these, and the demons gain ground.

**1. Movement (1 Mile Walk/Run)**

- **Why**: Physical stagnation is the primary vector for demonic influence. Moving the body moves energy, clears the mind, proves agency.
- **Points**: +10 Life Force
- **Deadline**: Before midnight local time
- **Spirit Guide Note**: "Include bursts of speed when you can. Brief sprints forge a different kind of strength."

**2. Meditation (10 Minutes)**

- **Why**: Stillness of mind creates space between impulse and action. This is where you learn to observe the demons rather than obey them.
- **Points**: +5 Life Force
- **Deadline**: Before midnight local time

**Combined Essentials Bonus**

- Both completed: +15 Life Force total
- Only one completed: +5 Life Force (partial credit, but you're slipping)
- Neither completed: Stagnation day triggered (see penalties above)

---

### Tier 2: Strength Tests (Daily Maxes)

You are not required to hit a number — you are required to **attempt your maximum**. Even 1 pushup counts if it was your true effort. The app tracks your progress over time.

**1. Max Pushups**

- Perform pushups to failure, log the count
- **Points**: +3 Life Force
- **Missed Penalty**: -5 Life Force
- **PR Bonus**: +5 extra when you beat your all-time max

**2. Max Pullups**

- Perform pullups to failure, log the count
- **Points**: +3 Life Force
- **Missed Penalty**: -5 Life Force
- **PR Bonus**: +5 extra when you beat your all-time max
- **Note**: If you cannot do pullups yet, log "0" — the attempt counts. Spirit Guide will encourage dead hangs as progression.

**Tracking Features**

- All-time personal record (PR)
- 7-day average
- Trend indicator (improving / maintaining / declining)
- PR celebration from Spirit Guide:
  > "You have surpassed yourself. 23 pushups — a new peak. The demons cannot ignore your growing strength."

---

### Tier 3: Recommended (Spirit Guide Suggestions)

These rotate as daily suggestions during the morning stand-off. No penalty for skipping, but bonus points for completing.

| Activity | Description | Bonus |
|----------|-------------|-------|
| **Sprints** | 3 short bursts during your mile | +3 Life Force |
| **Plank** | Hold as long as possible, log time | +2 Life Force |
| **Stretching** | 5+ minutes of flexibility work | +2 Life Force |
| **Cold Exposure** | Cold shower or ice bath | +3 Life Force |
| **Journaling** | Write freely for 5+ minutes | +2 Life Force |

**Example Spirit Guide Suggestions**

> "Today, I challenge you: include three short sprints within your mile. Brief explosions of effort forge a different kind of strength."

> "After your pushups, hold your body in plank. Count your breaths. See how many you can endure."

> "Your body has been still for hours. Before you sit again, stretch your hips and shoulders. Thirty seconds. The demons hate a supple vessel."

> "Cold water awaits. It will shock you awake. The demons prefer you comfortable — deny them this."

---

### Daily Maximum Points

| Source | Points |
|--------|--------|
| Essentials (mile + meditation) | +15 |
| Strength Tests (pushups + pullups) | +6 |
| Strength Test PRs (if achieved) | +5 each |
| Recommended activities | +2 to +3 each |
| **Theoretical daily max** | ~30+ Life Force |

A perfect day builds you rapidly. A bare-minimum survival day (+15 from essentials) keeps you alive but growing slowly. The system rewards effort without punishing imperfection.

---

## The Morning Stand-Off (Daily Ritual)

Each morning, the app initiates contact. This is the core interaction loop.

### Flow

**1. Spirit Guide Greeting**
> "Good morning. The demons have sensed your presence. Through the night, they whispered to your sleeping mind. They want you to feel heavy today. To believe that nothing matters. That you can rest — just today. Do not listen. Will you move your body now?"

**2. User Response: Movement**

- **[Yes, I will move now]** → Log activity immediately or set "in progress" timer
- **[Not yet]** → Prompt: "When is the earliest you can move today?" → User enters time → Reminder scheduled

**3. If "Not Yet" — Reason Capture (Optional)**
> "I understand. Life has demands. Briefly, what prevents you?"

- Free text input (stored for self-reflection, patterns)
- Spirit Guide responds with understanding but firmness

**4. Meditation Prompt**
> "Movement awakens the body. Now, will you still the mind? Ten minutes of silence builds the wall the demons cannot cross."

- **[Yes, I will meditate now]** → Start guided timer or log completion
- **[Not yet]** → Schedule reminder

**5. Daily Wisdom**
After the stand-off, Spirit Guide shares one piece of wisdom:
> "Today's teaching: *'The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.'* — Consider this as you move through the day."

Wisdom is drawn from the esoteric traditions outlined above, rotating daily, with no repeats until the full library cycles.

---

## Face-Off System

Face-Offs are interactive decision moments logged throughout the day — not just the morning essentials, but any moment of temptation or choice.

### Categories

| Category | Description | Example Triggers |
|----------|-------------|------------------|
| **Movement** | Choices about physical activity | Skipping a walk, taking stairs vs elevator |
| **Stillness** | Choices about meditation/mindfulness | Skipping meditation, choosing distraction |
| **Substance** | Alcohol, drugs, excessive caffeine | Offered a drink, craving hits |
| **Consumption** | Food choices, overeating, junk food | Late-night snacking, emotional eating |
| **Communication** | Emotional texts, reactive messages | Urge to send angry/needy message |
| **Sexuality** | Excessive porn, compulsive behavior | Urge arises, seeking numbing |
| **Productivity** | Procrastination, avoidance | Task looming, choosing distraction |

### Face-Off Flow

1. **User selects category** (or app prompts based on time/pattern)
2. **Spirit Guide frames the situation**:
   > "You feel the pull toward [category]. The demons present it as relief, as deserved, as harmless. But you know where this path leads. What is the truth of this moment?"
3. **Decision tree with 2-3 choices**, each with consequences explained
4. **User commits to choice**
5. **Outcome logged**: Points awarded or deducted, streak affected
6. **Optional**: User writes a note to future self about this moment

### Example Face-Off: Alcohol

> **Spirit Guide**: "The drink is offered. The demons whisper that you've earned it. That one won't hurt. That you'll feel better. But will you? What is the truth?"

**Choice A**: "I don't need it. I choose clarity."
→ +10 Life Force, streak continues

**Choice B**: "Just one. I can control it."
→ 0 points (neutral, but Spirit Guide notes the pattern)

**Choice C**: "I don't care right now."
→ -15 Life Force, demons gain strength, Spirit Guide dims

---

## Notifications & Engagement

### Push Notifications (Mobile)

- **Morning Stand-Off**: Configurable time (default 7am)
- **Scheduled Reminders**: If user deferred essentials
- **Evening Check-In**: "The day ends soon. Have you moved? Have you stilled?"
- **Streak Warnings**: "Two days of stillness. The demons grow bold."

### Tone

All notifications come from the Spirit Guide's voice — never corporate app-speak. They should feel like a concerned mentor, not a productivity app.

---

## Data Persistence

### What Gets Saved

- User profile (name, creation date, Spirit Guide name)
- Lifetime statistics (total points, total days, deaths, rebirths)
- Current state (Life Force, streak, Resistance level, Spirit Guide stage)
- Daily records (essentials completed, face-offs logged, notes)
- Deferred reasons (for pattern analysis)
- Unlocked wisdom teachings

### Storage Strategy (Current: LocalStorage)

For prototype/MVP, all data persists in browser LocalStorage. This works on mobile browsers added to home screen.

### Future: Cloud Sync

- Account system with authentication
- Cross-device sync
- Data export for user ownership

---

## Mobile Deployment (PWA)

The app is a **Progressive Web App** that can be installed on phones:

### iOS

1. Open app URL in Safari
2. Tap Share → "Add to Home Screen"
3. App launches full-screen, feels native

### Android

1. Open app URL in Chrome
2. Tap menu → "Add to Home Screen" (or accept install prompt)
3. App installs with icon

### Required for PWA

- `manifest.json` with app metadata
- Service worker for offline capability (future)
- HTTPS hosting

---

## Roadmap

### Phase 1: Core Loop (Current)

- [x] User creation/authentication (local)
- [x] Basic point tracking
- [x] Face-off system skeleton
- [ ] Morning Stand-Off interaction flow
- [ ] Life Force scoring system
- [ ] Stagnation penalties
- [ ] Death/rebirth mechanic
- [ ] Spirit Guide visual stages (placeholder art)
- [ ] PWA manifest for mobile install

### Phase 2: Polish & Depth

- [ ] Full wisdom teaching library (50+ entries)
- [ ] Meditation timer integration
- [ ] All Face-Off category flows
- [ ] User notes/journal system
- [ ] Streak visualization
- [ ] Spirit Guide evolution animations

### Phase 3: Expansion

- [ ] Custom goals (user-defined essentials)
- [ ] Cloud sync/accounts
- [ ] Social features (accountability partners)
- [ ] Advanced analytics (pattern recognition)
- [ ] Audio: Spirit Guide voice lines
- [ ] Art: Full Spirit Guide evolution illustrations

---

## Design Notes

### Tone

- **Serious but not preachy**: The stakes are real, but there's no moralizing
- **Mythic, not religious**: Drawing from traditions without requiring belief
- **Warm, not cold**: The Spirit Guide cares, even when firm

### Visual Style

- Dark backgrounds with luminous accents
- Spirit Guide as central visual focus
- Colors: Deep purples, golds, soft whites against shadow
- UI: Minimal, mystical, not "gamified" in a childish way

### Competitor Differentiation

Unlike Habitica (gamification without soul), Headspace (meditation without stakes), or generic habit trackers (no narrative), this app offers:

- **Real consequences** (death/reset)
- **Emotional companion** (Spirit Guide you nurture)
- **Philosophical depth** (genuine wisdom tradition)
- **Interactive narrative** (not just checking boxes)

---

## Appendix: Sample Wisdom Teachings

> "The archons cannot create — they can only distort. Every destructive urge is a twisted echo of something sacred."

> "You are not your thoughts. You are the silence that witnesses them."

> "What you do today writes the story your soul will read tomorrow."

> "The demons do not want your destruction. They want your sleep. Wake."

> "As above, so below. Your body is a temple. Your mind is an altar. What do you place upon it?"

> "Acedia — the noonday demon — makes all things feel meaningless. It lies. Meaning is not found, it is made."

> "The untrained mind is a open gate. Meditation is learning to guard it."

---

*Last updated: [Date]*
*Version: 0.2 — Expanded design with Spirit Guide evolution, Life Force system, Morning Stand-Off flow*
