/**
 * WatermelonDB Schema
 * Matches the SQL schema from architecture.md
 */

import { tableSchema } from '@nozbe/watermelondb';

export const schema = [
  tableSchema({
    name: 'users',
    columns: [
      { name: 'email', type: 'string', isOptional: false },
      { name: 'username', type: 'string', isOptional: true },
      { name: 'avatar_url', type: 'string', isOptional: true },
      { name: 'level', type: 'number', isOptional: false, default: 1 },
      { name: 'xp', type: 'number', isOptional: false, default: 0 },
      { name: 'total_workouts', type: 'number', isOptional: false, default: 0 },
      { name: 'current_streak', type: 'number', isOptional: false, default: 0 },
      { name: 'longest_streak', type: 'number', isOptional: false, default: 0 },
      { name: 'settings_json', type: 'string', isOptional: false, default: '{}' },
      { name: 'created_at', type: 'number', isOptional: false },
      { name: 'updated_at', type: 'number', isOptional: false },
      { name: 'last_synced_at', type: 'number', isOptional: true },
    ],
  }),

  tableSchema({
    name: 'exercises',
    columns: [
      { name: 'name', type: 'string', isOptional: false },
      { name: 'muscle_group', type: 'string', isOptional: false },
      { name: 'equipment', type: 'string', isOptional: false },
      { name: 'difficulty', type: 'string', isOptional: false },
      { name: 'instructions_md', type: 'string', isOptional: true },
      { name: 'video_url', type: 'string', isOptional: true },
      { name: 'gif_url', type: 'string', isOptional: true },
      { name: 'is_custom', type: 'number', isOptional: false, default: 0 },
      { name: 'created_by', type: 'string', isOptional: true },
      { name: 'created_at', type: 'number', isOptional: false },
      { name: 'updated_at', type: 'number', isOptional: false },
    ],
  }),

  tableSchema({
    name: 'workouts',
    columns: [
      { name: 'user_id', type: 'string', isOptional: false, isIndexed: true },
      { name: 'started_at', type: 'number', isOptional: false },
      { name: 'completed_at', type: 'number', isOptional: true },
      { name: 'duration_sec', type: 'number', isOptional: true },
      { name: 'total_sets', type: 'number', isOptional: false, default: 0 },
      { name: 'total_volume_kg', type: 'number', isOptional: false, default: 0 },
      { name: 'notes', type: 'string', isOptional: true },
      { name: 'is_completed', type: 'number', isOptional: false, default: 0 },
      { name: 'created_at', type: 'number', isOptional: false },
      { name: 'updated_at', type: 'number', isOptional: false },
    ],
  }),

  tableSchema({
    name: 'workout_exercises',
    columns: [
      { name: 'workout_id', type: 'string', isOptional: false, isIndexed: true },
      { name: 'exercise_id', type: 'string', isOptional: false, isIndexed: true },
      { name: 'order_index', type: 'number', isOptional: false },
      { name: 'superset_group', type: 'number', isOptional: true },
      { name: 'notes', type: 'string', isOptional: true },
      { name: 'created_at', type: 'number', isOptional: false },
      { name: 'updated_at', type: 'number', isOptional: false },
    ],
  }),

  tableSchema({
    name: 'sets',
    columns: [
      { name: 'workout_exercise_id', type: 'string', isOptional: false, isIndexed: true },
      { name: 'set_number', type: 'number', isOptional: false },
      { name: 'reps', type: 'number', isOptional: false },
      { name: 'weight_kg', type: 'number', isOptional: false, default: 0 },
      { name: 'rpe', type: 'number', isOptional: true },
      { name: 'is_warmup', type: 'number', isOptional: false, default: 0 },
      { name: 'completed_at', type: 'number', isOptional: false },
      { name: 'created_at', type: 'number', isOptional: false },
      { name: 'updated_at', type: 'number', isOptional: false },
    ],
  }),

  tableSchema({
    name: 'body_stats',
    columns: [
      { name: 'user_id', type: 'string', isOptional: false, isIndexed: true },
      { name: 'date', type: 'number', isOptional: false },
      { name: 'weight_kg', type: 'number', isOptional: true },
      { name: 'body_fat_pct', type: 'number', isOptional: true },
      { name: 'measurements_json', type: 'string', isOptional: false, default: '{}' },
      { name: 'created_at', type: 'number', isOptional: false },
      { name: 'updated_at', type: 'number', isOptional: false },
    ],
  }),

  tableSchema({
    name: 'achievements',
    columns: [
      { name: 'code', type: 'string', isOptional: false, isIndexed: true },
      { name: 'name', type: 'string', isOptional: false },
      { name: 'description', type: 'string', isOptional: false },
      { name: 'icon', type: 'string', isOptional: false },
      { name: 'xp_reward', type: 'number', isOptional: false, default: 0 },
      { name: 'criteria_json', type: 'string', isOptional: false },
      { name: 'is_hidden', type: 'number', isOptional: false, default: 0 },
      { name: 'created_at', type: 'number', isOptional: false },
    ],
  }),

  tableSchema({
    name: 'user_achievements',
    columns: [
      { name: 'user_id', type: 'string', isOptional: false, isIndexed: true },
      { name: 'achievement_id', type: 'string', isOptional: false, isIndexed: true },
      { name: 'unlocked_at', type: 'number', isOptional: true },
      { name: 'progress', type: 'number', isOptional: false, default: 0 },
      { name: 'created_at', type: 'number', isOptional: false },
      { name: 'updated_at', type: 'number', isOptional: false },
    ],
  }),

  tableSchema({
    name: 'notifications',
    columns: [
      { name: 'user_id', type: 'string', isOptional: false, isIndexed: true },
      { name: 'type', type: 'string', isOptional: false },
      { name: 'title', type: 'string', isOptional: false },
      { name: 'body', type: 'string', isOptional: false },
      { name: 'data_json', type: 'string', isOptional: false, default: '{}' },
      { name: 'read_at', type: 'number', isOptional: true },
      { name: 'created_at', type: 'number', isOptional: false },
    ],
  }),

  tableSchema({
    name: 'settings',
    columns: [
      { name: 'user_id', type: 'string', isOptional: false, isIndexed: true },
      { name: 'key', type: 'string', isOptional: false, isIndexed: true },
      { name: 'value', type: 'string', isOptional: false },
    ],
  }),
] as const;

export const migrations = [
  // Future migrations will go here
];