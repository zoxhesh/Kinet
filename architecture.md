# Architecture: Kinet (Free, Offline-First)

**Stack**: Expo (React Native) + TypeScript + Supabase Auth + WatermelonDB (SQLite) + Tamagui (styling) + Expo Router

---

## Step 1: Stack Choices

| Layer | Choice | Why |
|-------|--------|-----|
| **Mobile Framework** | Expo (React Native) + Expo Router | Original is RN/Expo; same paradigm, file-based routing, OTA updates via EAS |
| **Language** | TypeScript (strict) | Type safety for workout data, exercises, achievements |
| **Styling** | Tamagui + Design Tokens (from `/replica-design`) | Compile-time optimization, theming, universal (web/native), tokens from design system |
| **Local Database** | WatermelonDB (SQLite via Expo SQLite) | Reactive, offline-first, lazy loading, sync-ready for v2 |
| **Auth** | Supabase Auth (email/password + OAuth) | Managed, free tier generous, row-level security, works offline with cached session |
| **Cloud Sync (v2)** | Supabase Postgres + WatermelonDB sync | Same DB schema local + remote, conflict resolution built-in |
| **File Storage** | Supabase Storage (exercise GIFs/videos) | CDN, signed URLs, free tier |
| **Notifications** | Expo Notifications (local) + Supabase Functions (push v2) | No extra service; local works fully offline |
| **Analytics** | None (privacy-first) | Personal use — no tracking needed |
| **Error Tracking** | Sentry (free tier) | Same as original, optional |
| **Hosting (web companion)** | Vercel (Expo web export) | Free, zero-config for Expo web |
| **CI/CD** | EAS Build + GitHub Actions | Native Expo workflow, preview builds |

**One database**: SQLite locally (WatermelonDB), Postgres on Supabase for auth + future sync. No microservices.

---

## Step 2: Schema (SQLite / WatermelonDB Models)

### Users & Auth
```sql
-- WatermelonDB model: User
create table users (
  id text primary key,              -- UUID from Supabase Auth
  email text unique not null,
  username text unique,
  avatar_url text,
  level integer not null default 1,
  xp integer not null default 0,
  total_workouts integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  settings_json text not null default '{}',  -- JSON: units, theme, notifications, etc.
  created_at integer not null,      -- Unix ms
  updated_at integer not null,
  last_synced_at integer            -- For future cloud sync
);
create index on users (email);
```

### Exercises (Static + User-Created)
```sql
-- WatermelonDB model: Exercise
create table exercises (
  id text primary key,              -- UUID or stable ID for built-ins
  name text not null,
  muscle_group text not null,       -- chest, back, legs, shoulders, arms, core, cardio
  equipment text not null,          -- barbell, dumbbell, machine, bodyweight, cable, band, other
  difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
  instructions_md text,             -- Markdown instructions
  video_url text,                   -- Remote URL (Supabase Storage)
  gif_url text,                     -- Local asset or remote
  is_custom integer not null default 0,  -- Boolean: user-created
  created_by text references users(id) on delete set null,
  created_at integer not null,
  updated_at integer not null
);
create index on exercises (muscle_group);
create index on exercises (equipment);
create index on exercises (is_custom);
create index on exercises (created_by);
```

### Workouts
```sql
-- WatermelonDB model: Workout
create table workouts (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  started_at integer not null,      -- Unix ms
  completed_at integer,             -- Null if in progress
  duration_sec integer,             -- Null if in progress
  total_sets integer not null default 0,
  total_volume_kg real not null default 0,
  notes text,
  is_completed integer not null default 0,  -- Boolean
  created_at integer not null,
  updated_at integer not null
);
create index on workouts (user_id, started_at desc);
create index on workouts (user_id, is_completed);
```

### Workout Exercises (Join + Order)
```sql
-- WatermelonDB model: WorkoutExercise
create table workout_exercises (
  id text primary key,
  workout_id text not null references workouts(id) on delete cascade,
  exercise_id text not null references exercises(id) on delete restrict,
  order_index integer not null,
  superset_group integer,           -- Null = not in superset; same number = same superset
  notes text,
  created_at integer not null,
  updated_at integer not null
);
create index on workout_exercises (workout_id, order_index);
create index on workout_exercises (exercise_id);
```

### Sets (The Core Data)
```sql
-- WatermelonDB model: Set
create table sets (
  id text primary key,
  workout_exercise_id text not null references workout_exercises(id) on delete cascade,
  set_number integer not null,
  reps integer not null,
  weight_kg real not null default 0,
  rpe real,                         -- Rate of Perceived Exertion (1-10)
  is_warmup integer not null default 0,
  completed_at integer not null,    -- Unix ms
  created_at integer not null,
  updated_at integer not null
);
create index on sets (workout_exercise_id, set_number);
```

### Body Stats
```sql
-- WatermelonDB model: BodyStat
create table body_stats (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  date integer not null,            -- Unix ms (day precision)
  weight_kg real,
  body_fat_pct real,
  measurements_json text not null default '{}',  -- {chest: 100, waist: 85, ...}
  created_at integer not null,
  updated_at integer not null,
  unique (user_id, date)
);
create index on body_stats (user_id, date desc);
```

### Achievements (Static Definitions)
```sql
-- WatermelonDB model: Achievement
create table achievements (
  id text primary key,              -- Stable code: 'first_workout', 'streak_7', etc.
  code text unique not null,
  name text not null,
  description text not null,
  icon text not null,               -- Icon name from design system
  xp_reward integer not null default 0,
  criteria_json text not null,      -- JSON: {type: 'workout_count', value: 1}
  is_hidden integer not null default 0,  -- Secret achievements
  created_at integer not null
);
```

### User Achievements (Progress + Unlocks)
```sql
-- WatermelonDB model: UserAchievement
create table user_achievements (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  achievement_id text not null references achievements(id) on delete cascade,
  unlocked_at integer,              -- Null = not yet unlocked
  progress real not null default 0, -- 0.0 to 1.0
  created_at integer not null,
  updated_at integer not null,
  unique (user_id, achievement_id)
);
create index on user_achievements (user_id, unlocked_at desc);
```

### Notifications (Local)
```sql
-- WatermelonDB model: Notification
create table notifications (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  type text not null,               -- 'workout_reminder', 'streak_risk', 'achievement_unlocked'
  title text not null,
  body text not null,
  data_json text not null default '{}',
  read_at integer,
  created_at integer not null
);
create index on notifications (user_id, read_at, created_at desc);
```

### Settings (Key-Value, Extensible)
```sql
-- WatermelonDB model: Setting
create table settings (
  user_id text not null references users(id) on delete cascade,
  key text not null,
  value text not null,              -- JSON string
  primary key (user_id, key)
);
```

---

## Step 3: API Routes (Expo Router + Server Actions)

Since this is **local-first**, most "API" is direct database access via WatermelonDB collections. Server actions only for:

| Method | Path | Purpose | Auth | Input | Output |
|--------|------|---------|------|-------|--------|
| `POST` | `/api/auth/signup` | Create Supabase user + local user row | Public | `{email, password, username}` | `{user, session}` |
| `POST` | `/api/auth/login` | Supabase login + local sync | Public | `{email, password}` | `{user, session}` |
| `POST` | `/api/auth/oauth` | OAuth callback (Google/Apple) | Public | `{provider, token}` | `{user, session}` |
| `POST` | `/api/exercises/seed` | Bulk insert built-in exercises | Admin (build-time) | `{exercises[]}` | `{count}` |
| `POST` | `/api/achievements/seed` | Bulk insert achievements | Admin (build-time) | `{achievements[]}` | `{count}` |
| `GET` | `/api/assets/exercise-media` | Signed URLs for exercise GIFs/videos | User | `{exercise_ids[]}` | `{urls[]}` |

**Webhooks**: None (no payments, no external sync in v1)

**Background Jobs (Expo BackgroundFetch + Supabase Functions v2)**:
| Job | Schedule | Purpose |
|-----|----------|---------|
| `checkStreakRisk` | Daily 18:00 local | Send local notification if streak about to break |
| `evaluateAchievements` | On workout complete | Check criteria, unlock achievements |
| `cleanupOldNotifications` | Weekly | Delete read notifications > 30 days |

---

## Step 4: The Parts That Bite

| Risk | Mitigation |
|------|------------|
| **Offline-first sync conflict (v2)** | WatermelonDB sync uses last-write-wins per field; user resolves conflicts manually for complex objects |
| **Background timer persistence** | Expo BackgroundFetch + AsyncStorage checkpoint every 30s; reconstruct on app resume |
| **Exercise media storage** | Bundle essential GIFs (~50 MB); lazy-load videos from Supabase Storage with cache |
| **Achievement evaluation performance** | Incremental: only check achievements related to the action (workout count → check workout_count achievements) |
| **Unit conversion (lb/kg, in/cm)** | Single source of truth: store all in metric (kg, cm); convert on display via settings |
| **Time zones / DST** | Store all timestamps as Unix ms (UTC); display in user's local TZ via `Intl.DateTimeFormat` |
| **Database migration (WatermelonDB)** | Use `wml` migrations; versioned schema; test on device before release |
| **GDPR / Data deletion** | `DELETE FROM users WHERE id = ?` cascades to all owned tables; export via JSON before delete |
| **Large exercise library search** | FTS5 virtual table on `exercises(name, muscle_group, equipment)` for instant search |

---

## Step 5: Build Order

### Milestone 1: Vertical Slice (Week 1-2)
**Goal**: Sign up → Browse exercises → Log one workout → See it in history
| Screens | Tables | Routes |
|---------|--------|--------|
| S01, S02, S03, S04, S05, S06, S07 | users, exercises, workouts, workout_exercises, sets | Auth, exercise CRUD, workout CRUD |

### Milestone 2: Must-Haves (Week 3-5)
| Area | Screens | Features |
|------|---------|----------|
| Workouts | S04, S05, S06, S07 | Superset support, rest timer, plate calculator, previous set suggestions |
| Progress | S03, S07, S08 | Charts (volume, PRs, frequency), body stats, calendar heatmap |
| Gamification | S08 | Level/XP, 50+ achievements, streak tracking, all cosmetics unlocked |
| Platform | S09 | Theme, units, data export, accessibility, haptics |

### Milestone 3: Should-Haves (Week 6-7)
| Area | Features |
|------|----------|
| Workouts | Custom exercise creation, exercise media (GIFs) |
| Engagement | Local push notifications (workout reminders, streak risk) |
| Data | CSV/JSON export, import helper |

### Milestone 4: Could-Haves (Week 8+)
| Area | Features |
|------|----------|
| Workouts | Advanced analytics (volume by muscle, fatigue index) |
| Platform | Full accessibility audit, widget (iOS/Android) |

### Milestone 5: Fixes from `/replica-entrepreneur` (Post-launch)
Run after v1 ships — apply user-review findings.

---

## Summary

| Metric | Value |
|--------|-------|
| **Stack** | Expo + TypeScript + WatermelonDB + Tamagui + Supabase Auth |
| **Tables** | 11 (users, exercises, workouts, workout_exercises, sets, body_stats, achievements, user_achievements, notifications, settings, schema_migrations) |
| **Server Routes** | 6 (auth ×3, seed ×2, assets) |
| **Riskiest Parts** | 1) Offline-first background timer persistence 2) WatermelonDB sync architecture (v2) 3) Achievement evaluation at scale |
| **Next Step** | `/replica-design` — Extract colors, spacing, typography, component specs from original app |