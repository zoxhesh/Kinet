/**
 * Database Models - Export barrel
 * All WatermelonDB models
 */

export { User } from './User';
export { Exercise } from './Exercise';
export { Workout } from './Workout';
export { WorkoutExercise } from './WorkoutExercise';
export { Set } from './Set';
export { BodyStat } from './BodyStat';
export { Achievement } from './Achievement';
export { UserAchievement } from './UserAchievement';
export { Notification } from './Notification';
export { Setting } from './Setting';

// Type for collections
export type Models = {
  users: typeof User;
  exercises: typeof Exercise;
  workouts: typeof Workout;
  workout_exercises: typeof WorkoutExercise;
  sets: typeof Set;
  body_stats: typeof BodyStat;
  achievements: typeof Achievement;
  user_achievements: typeof UserAchievement;
  notifications: typeof Notification;
  settings: typeof Setting;
};