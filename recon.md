# Recon Map: Arise - Workout & Fitness RPG

**App**: Arise - Workout & Fitness RPG (v1.4.10)
**Package**: `llc.sololeveling.Arise`
**Platform**: Android (React Native / Expo)
**Source**: Local APK analysis via REA

---

## Sources

| Source | What it gives |
|--------|---------------|
| Local APK (APKPure) | Full binary, manifest, resources, React Native bundle |
| REA artifact inspection | Inventory of all APK entries (1,504 occurrences) |
| APK manifest decode (partial) | Package name, permissions, components |

---

## Screen Inventory (Inferred from React Native bundle structure)

| ID | Screen | Route / Access | Purpose | Key Components | States |
|----|--------|----------------|---------|----------------|--------|
| S01 | Onboarding / Welcome | App entry | Intro, permissions, account creation | Carousel, CTA buttons, progress indicator | First launch, returning user |
| S02 | Authentication | `/auth` | Email/password, social login (Google, Apple) | Form inputs, OAuth buttons, error toasts | Loading, error, success |
| S03 | Home / Dashboard | `/` | Daily workout, streak, progress rings | Progress rings, workout card, quick actions | Empty (new user), loaded, loading |
| S04 | Workout Library | `/library` | Browse exercises by muscle/equipment | Search, filter chips, exercise cards, grid/list toggle | Empty, loaded, filtering |
| S05 | Exercise Detail | `/exercise/:id` | Instructions, video, sets/reps logging | Video player, stepper, timer, previous logs | Loading, playing, logging |
| S06 | Active Workout | `/workout/active` | Live session with timer, rest, logging | Circular timer, rest countdown, set logger, superset view | In progress, paused, rest, completed |
| S07 | Workout History | `/history` | Past sessions, charts, PRs | Calendar heatmap, list, charts, filters | Empty, loaded, date range |
| S08 | Profile / Stats | `/profile` | Level, XP, achievements, body stats | Avatar, level bar, stat cards, achievement grid | Loaded, editing |
| S09 | Settings | `/settings` | Notifications, units, theme, data export | Toggles, pickers, danger zone (delete account) | Loaded, saving |
| S10 | Social / Friends | `/social` | Feed, leaderboards, challenges | Feed list, leaderboard table, challenge cards | Empty, loaded |
| S11 | Shop / Store (PAYWALL) | `/shop` | **REMOVED IN CLONE** — was: cosmetics, pro features | ~~Product grid, purchase buttons, restore~~ | N/A |
| S12 | Paywall Screen (PAYWALL) | Triggered by Superwall | **REMOVED IN CLONE** — was: subscription upsell | ~~Modal, feature list, price, CTA~~ | N/A |

---

## User Flows

| ID | Flow | Screens | Edge Cases |
|----|------|---------|------------|
| F01 | New user onboarding | S01 → S02 → S03 | Skip onboarding, auth failure, permission denied |
| F02 | Log a workout | S03 → S04 → S05 → S06 → S07 | No exercise selected, timer backgrounded, crash mid-workout |
| F03 | View progress | S03 → S07 / S08 | No history, data sync delay |
| F04 | Social interaction | S10 → S03 (friend's workout) | Empty feed, privacy settings |
| F05 | Settings management | S09 | Unit conversion, data export format |

---

## Components (Repeated UI Parts)

| Name | Variants | States | Used In |
|------|----------|--------|---------|
| Button | Primary, secondary, ghost, danger | Default, loading, disabled, pressed | All screens |
| ExerciseCard | Compact, detailed | Default, selected, loading | S04, S05 |
| ProgressRing | Small, large | Animating, static, incomplete | S03, S08 |
| SetLogger | Standard, superset, timed | Editing, saved, validation error | S06 |
| Timer | Circular, linear | Running, paused, rest, overtime | S06 |
| StatCard | Icon + value, trend | Default, loading | S03, S07, S08 |
| AchievementBadge | Locked, unlocked, progress | Default, animating unlock | S08 |
| Modal / BottomSheet | Full, half, confirmation | Open, closing, closed | S02, S05, S06, S09 |
| Toast / Snackbar | Success, error, info, warning | Visible, dismissing | All screens |
| TabBar / NavBar | 4-5 tabs | Active, inactive, badge | S03, S07, S08, S10 |
| Input / Picker | Text, number, date, select | Default, focused, error, disabled | S02, S05, S06, S09 |

---

## Inferred Data Model

| Entity | Fields | Evidence | Confidence |
|--------|--------|----------|------------|
| **User** | `id`, `email`, `username`, `avatar_url`, `level`, `xp`, `total_workouts`, `current_streak`, `longest_streak`, `created_at`, `settings_json` | Firebase Auth + Firestore user docs, profile screen | High |
| **Workout** | `id`, `user_id`, `started_at`, `completed_at`, `duration_sec`, `total_sets`, `total_volume_kg`, `notes`, `is_completed` | Workout history, active workout logging | High |
| **WorkoutExercise** | `id`, `workout_id`, `exercise_id`, `order_index`, `superset_group`, `notes` | Active workout structure | High |
| **Set** | `id`, `workout_exercise_id`, `set_number`, `reps`, `weight_kg`, `rpe`, `is_warmup`, `completed_at` | Set logging in active workout | High |
| **Exercise** | `id`, `name`, `muscle_group`, `equipment`, `difficulty`, `instructions_md`, `video_url`, `gif_url`, `is_custom` | Exercise library, detail screen | High |
| **BodyStat** | `id`, `user_id`, `date`, `weight_kg`, `body_fat_pct`, `measurements_json` | Profile stats, progress charts | Medium |
| **Achievement** | `id`, `code`, `name`, `description`, `icon`, `xp_reward`, `criteria_json` | Achievement grid, unlock logic | High |
| **UserAchievement** | `id`, `user_id`, `achievement_id`, `unlocked_at`, `progress` | Profile achievements | High |
| **Friendship** | `id`, `user_id`, `friend_id`, `status`, `created_at` | Social feed, leaderboards | Medium |
| **Challenge** | `id`, `code`, `name`, `description`, `start_date`, `end_date`, `reward_json` | Challenges screen | Medium |
| **UserChallenge** | `id`, `user_id`, `challenge_id`, `progress`, `completed_at`, `claimed_at` | Challenge participation | Medium |
| **Notification** | `id`, `user_id`, `type`, `title`, `body`, `data_json`, `read_at`, `created_at` | Push notifications, in-app | Medium |

---

## Feature Matrix (Priority: must / should / could)

| Feature | Area | Priority | Original | Clone | Notes |
|---------|------|----------|----------|-------|-------|
| User authentication (email/social) | Auth | must | ✅ | ✅ | Supabase Auth |
| Guest mode (no auth) | Auth | should | ❌ | ✅ | Local-only fallback |
| Workout library (browse/search/filter) | Workouts | must | ✅ | ✅ | Offline-capable |
| Exercise detail with video/gif | Workouts | must | ✅ | ✅ | Local assets or CDN |
| Active workout session (timer, rest, logging) | Workouts | must | ✅ | ✅ | Background timer |
| Workout history + calendar heatmap | Workouts | must | ✅ | ✅ | Local DB |
| Progress charts (volume, PRs, frequency) | Workouts | must | ✅ | ✅ | Recharts / Victory Native |
| Body stats tracking | Workouts | should | ✅ | ✅ | Weight, measurements |
| Custom exercise creation | Workouts | should | ✅ | ✅ | User-generated content |
| Superset / circuit support | Workouts | should | ✅ | ✅ | UI complexity |
| Rest timer with audio/vibration | Workouts | should | ✅ | ✅ | Background execution |
| Previous set suggestions (smart defaults) | Workouts | could | ✅ | ✅ | ML-like heuristic |
| Plate calculator | Workouts | could | ✅ | ✅ | Utility tool |
| Level / XP system | Gamification | must | ✅ | ✅ | Local calculation |
| Achievements / badges | Gamification | must | ✅ | ✅ | 50+ achievements |
| Streak tracking (daily/weekly) | Gamification | must | ✅ | ✅ | Local logic |
| Cosmetic unlocks (themes, icons) | Gamification | should | 🔒 PAYWALL | ✅ FREE | All unlocked |
| Pro statistics / advanced analytics | Gamification | could | 🔒 PAYWALL | ✅ FREE | All unlocked |
| Social feed (friends' workouts) | Social | should | ✅ | ❌ | Requires backend — defer |
| Leaderboards (weekly/monthly) | Social | could | ✅ | ❌ | Requires backend — defer |
| Challenges (community/events) | Social | could | ✅ | ❌ | Requires backend — defer |
| Friend system (add, remove, privacy) | Social | could | ✅ | ❌ | Requires backend — defer |
| Push notifications (workout reminders) | Engagement | should | ✅ | ✅ | Local notifications |
| Email notifications | Engagement | could | ✅ | ❌ | Requires email service |
| Data export (CSV/JSON) | Data | should | ✅ | ✅ | Local file generation |
| Data import | Data | could | ❌ | ✅ | Migration helper |
| Cloud backup / sync | Data | could | ✅ | ❌ | Requires backend — defer |
| Offline-first (full functionality) | Platform | must | ❌ | ✅ | Core principle |
| Dark/light/system theme | Platform | must | ✅ | ✅ | System + manual |
| Unit system (metric/imperial) | Platform | must | ✅ | ✅ | All calculations |
| Accessibility (VoiceOver/TalkBack) | Platform | should | Partial | ✅ | Full compliance |
| Haptic feedback | Platform | should | ✅ | ✅ | Expo Haptics |

---

## What Cannot Be Cloned (Skip Rows)

| Feature | Reason |
|---------|--------|
| Superwall paywall system | **Intentionally removed** — all features free |
| Google Play Billing / subscriptions | **Intentionally removed** — no monetization |
| AppsFlyer attribution | Third-party analytics, not needed |
| Firebase Remote Config (paywall rules) | Tied to paywall system |
| Social features (friends, feed, leaderboards) | Requires backend + other users — out of scope for personal clone |
| Cloud sync / backup | Requires backend — defer to v2 |
| Exercise video streaming (hosted) | Licensed content — use local GIFs or placeholder |
| ML Kit barcode scanning | Not core to workout logging — optional |

---

## Size Estimate

| Metric | Count |
|--------|-------|
| Screens | 10 (excluding 2 paywall screens) |
| User Flows | 5 core |
| Entities | 12 |
| Components | 12 reusable |
| Hard parts | Offline-first sync, background timer, exercise video/GIF storage, achievement logic |

**Size: M (a few weeks)** — React Native/Expo with local-first SQLite (WatermelonDB or Expo SQLite) + Supabase for auth only. No custom backend needed for v1.

---

## Next Step

`/replica-design` — Build the design system (colors, tokens, components) from the original app's look, then `/replica-build` for the vertical slice.