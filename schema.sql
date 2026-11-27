-- Arise Clone Schema (SQLite / WatermelonDB)
-- Run via WatermelonDB migrations (wml)

-- ============================================================
-- USERS & AUTH
-- ============================================================
create table users (
  id text primary key,
  email text unique not null,
  username text unique,
  avatar_url text,
  level integer not null default 1,
  xp integer not null default 0,
  total_workouts integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  settings_json text not null default '{}',
  created_at integer not null,
  updated_at integer not null,
  last_synced_at integer
);
create index idx_users_email on users (email);

-- ============================================================
-- EXERCISES (Static + User-Created)
-- ============================================================
create table exercises (
  id text primary key,
  name text not null,
  muscle_group text not null,
  equipment text not null,
  difficulty text not null check (difficulty in ('beginner','intermediate','advanced')),
  instructions_md text,
  video_url text,
  gif_url text,
  is_custom integer not null default 0,
  created_by text references users(id) on delete set null,
  created_at integer not null,
  updated_at integer not null
);
create index idx_exercises_muscle_group on exercises (muscle_group);
create index idx_exercises_equipment on exercises (equipment);
create index idx_exercises_is_custom on exercises (is_custom);
create index idx_exercises_created_by on exercises (created_by);

-- FTS5 for instant search
create virtual table exercises_fts using fts5(
  name, muscle_group, equipment,
  content=exercises, content_rowid=rowid
);
create trigger exercises_ai after insert on exercises begin
  insert into exercises_fts(rowid, name, muscle_group, equipment)
  values (new.rowid, new.name, new.muscle_group, new.equipment);
end;
create trigger exercises_ad after delete on exercises begin
  insert into exercises_fts(exercises_fts, rowid, name, muscle_group, equipment)
  values ('delete', old.rowid, old.name, old.muscle_group, old.equipment);
end;
create trigger exercises_au after update on exercises begin
  insert into exercises_fts(exercises_fts, rowid, name, muscle_group, equipment)
  values ('delete', old.rowid, old.name, old.muscle_group, old.equipment);
  insert into exercises_fts(rowid, name, muscle_group, equipment)
  values (new.rowid, new.name, new.muscle_group, new.equipment);
end;

-- ============================================================
-- WORKOUTS
-- ============================================================
create table workouts (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  started_at integer not null,
  completed_at integer,
  duration_sec integer,
  total_sets integer not null default 0,
  total_volume_kg real not null default 0,
  notes text,
  is_completed integer not null default 0,
  created_at integer not null,
  updated_at integer not null
);
create index idx_workouts_user_started on workouts (user_id, started_at desc);
create index idx_workouts_user_completed on workouts (user_id, is_completed);

-- ============================================================
-- WORKOUT_EXERCISES
-- ============================================================
create table workout_exercises (
  id text primary key,
  workout_id text not null references workouts(id) on delete cascade,
  exercise_id text not null references exercises(id) on delete restrict,
  order_index integer not null,
  superset_group integer,
  notes text,
  created_at integer not null,
  updated_at integer not null
);
create index idx_workout_exercises_workout_order on workout_exercises (workout_id, order_index);
create index idx_workout_exercises_exercise on workout_exercises (exercise_id);

-- ============================================================
-- SETS
-- ============================================================
create table sets (
  id text primary key,
  workout_exercise_id text not null references workout_exercises(id) on delete cascade,
  set_number integer not null,
  reps integer not null,
  weight_kg real not null default 0,
  rpe real,
  is_warmup integer not null default 0,
  completed_at integer not null,
  created_at integer not null,
  updated_at integer not null
);
create index idx_sets_workout_exercise on sets (workout_exercise_id, set_number);

-- ============================================================
-- BODY_STATS
-- ============================================================
create table body_stats (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  date integer not null,
  weight_kg real,
  body_fat_pct real,
  measurements_json text not null default '{}',
  created_at integer not null,
  updated_at integer not null,
  unique (user_id, date)
);
create index idx_body_stats_user_date on body_stats (user_id, date desc);

-- ============================================================
-- ACHIEVEMENTS (Static Definitions)
-- ============================================================
create table achievements (
  id text primary key,
  code text unique not null,
  name text not null,
  description text not null,
  icon text not null,
  xp_reward integer not null default 0,
  criteria_json text not null,
  is_hidden integer not null default 0,
  created_at integer not null
);

-- ============================================================
-- USER_ACHIEVEMENTS
-- ============================================================
create table user_achievements (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  achievement_id text not null references achievements(id) on delete cascade,
  unlocked_at integer,
  progress real not null default 0,
  created_at integer not null,
  updated_at integer not null,
  unique (user_id, achievement_id)
);
create index idx_user_achievements_user_unlocked on user_achievements (user_id, unlocked_at desc);

-- ============================================================
-- NOTIFICATIONS (Local)
-- ============================================================
create table notifications (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data_json text not null default '{}',
  read_at integer,
  created_at integer not null
);
create index idx_notifications_user_read_created on notifications (user_id, read_at, created_at desc);

-- ============================================================
-- SETTINGS (Key-Value)
-- ============================================================
create table settings (
  user_id text not null references users(id) on delete cascade,
  key text not null,
  value text not null,
  primary key (user_id, key)
);

-- ============================================================
-- SCHEMA_MIGRATIONS (WatermelonDB)
-- ============================================================
create table schema_migrations (
  name text primary key,
  applied_at integer not null default (strftime('%s','now') * 1000)
);

-- ============================================================
-- INITIAL DATA: Built-in Achievements (Seed via migration)
-- ============================================================
-- Example achievements (50+ total in seed file)
insert into achievements (id, code, name, description, icon, xp_reward, criteria_json, is_hidden, created_at) values
  ('ach_001', 'first_workout', 'First Steps', 'Complete your first workout', 'trophy', 100, '{"type":"workout_count","value":1}', 0, 0),
  ('ach_002', 'workout_10', 'Getting Started', 'Complete 10 workouts', 'trophy', 250, '{"type":"workout_count","value":10}', 0, 0),
  ('ach_003', 'workout_50', 'Dedicated', 'Complete 50 workouts', 'trophy', 500, '{"type":"workout_count","value":50}', 0, 0),
  ('ach_004', 'workout_100', 'Centurion', 'Complete 100 workouts', 'trophy', 1000, '{"type":"workout_count","value":100}', 0, 0),
  ('ach_005', 'streak_3', 'On Fire', '3 day workout streak', 'flame', 150, '{"type":"streak_days","value":3}', 0, 0),
  ('ach_006', 'streak_7', 'Week Warrior', '7 day workout streak', 'flame', 300, '{"type":"streak_days","value":7}', 0, 0),
  ('ach_007', 'streak_30', 'Iron Will', '30 day workout streak', 'flame', 1000, '{"type":"streak_days","value":30}', 0, 0),
  ('ach_008', 'pr_first', 'New Record', 'Set your first personal record', 'star', 200, '{"type":"pr_count","value":1}', 0, 0),
  ('ach_009', 'pr_10', 'Record Breaker', 'Set 10 personal records', 'star', 500, '{"type":"pr_count","value":10}', 0, 0),
  ('ach_010', 'volume_10000', 'Heavy Lifter', 'Lift 10,000 kg total volume', 'dumbbell', 500, '{"type":"total_volume_kg","value":10000}', 0, 0);
-- ... 40+ more in actual seed migration