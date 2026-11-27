/**
 * WatermelonDB Database Setup
 * Initializes the database with SQLite adapter
 */

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema, migrations } from '../schema';
import {
  User, Exercise, Workout, WorkoutExercise, Set,
  BodyStat, Achievement, UserAchievement, Notification, Setting
} from './models';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true, // Use JSI for better performance
  onCreate: (db) => {
    // Enable WAL mode for better concurrency
    db.execute('PRAGMA journal_mode = WAL;');
    db.execute('PRAGMA synchronous = NORMAL;');
    db.execute('PRAGMA temp_store = MEMORY;');
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    User, Exercise, Workout, WorkoutExercise, Set,
    BodyStat, Achievement, UserAchievement, Notification, Setting
  ],
});

// Collection getters for convenience
export const collections = {
  users: database.collections.get<User>('users'),
  exercises: database.collections.get<Exercise>('exercises'),
  workouts: database.collections.get<Workout>('workouts'),
  workoutExercises: database.collections.get<WorkoutExercise>('workout_exercises'),
  sets: database.collections.get<Set>('sets'),
  bodyStats: database.collections.get<BodyStat>('body_stats'),
  achievements: database.collections.get<Achievement>('achievements'),
  userAchievements: database.collections.get<UserAchievement>('user_achievements'),
  notifications: database.collections.get<Notification>('notifications'),
  settings: database.collections.get<Setting>('settings'),
};

// Database initialization
export async function initializeDatabase(): Promise<void> {
  // Database is ready when adapter is ready
  await adapter.database;
}

export { database as db };