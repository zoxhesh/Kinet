/**
 * Seed Data
 * Built-in exercises and achievements
 */

import { collections } from './database';
import { Exercise } from './models/Exercise';
import { Achievement } from './models/Achievement';

const now = Date.now();

// Built-in exercises (50+ exercises)
export const BUILTIN_EXERCISES = [
  // Chest
  { name: 'Bench Press', muscle_group: 'chest', equipment: 'barbell', difficulty: 'intermediate', instructions_md: 'Lie on bench, grip bar slightly wider than shoulders. Lower to chest, press up.' },
  { name: 'Incline Bench Press', muscle_group: 'chest', equipment: 'barbell', difficulty: 'intermediate', instructions_md: 'Set bench to 30-45° incline. Same form as flat bench.' },
  { name: 'Dumbbell Bench Press', muscle_group: 'chest', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Lie on bench, dumbbells at chest level. Press up and slightly together.' },
  { name: 'Incline Dumbbell Press', muscle_group: 'chest', equipment: 'dumbbell', difficulty: 'intermediate', instructions_md: '30-45° incline bench. Press dumbbells up and together.' },
  { name: 'Chest Fly', muscle_group: 'chest', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Lie flat, slight elbow bend. Open arms wide, squeeze chest to bring together.' },
  { name: 'Cable Crossover', muscle_group: 'chest', equipment: 'cable', difficulty: 'intermediate', instructions_md: 'High to low or low to high. Cross hands at center for peak contraction.' },
  { name: 'Push-Up', muscle_group: 'chest', equipment: 'bodyweight', difficulty: 'beginner', instructions_md: 'Hands slightly wider than shoulders. Body straight. Lower chest to floor.' },
  { name: 'Dip', muscle_group: 'chest', equipment: 'bodyweight', difficulty: 'intermediate', instructions_md: 'Lean forward to target chest. Lower until shoulders below elbows.' },

  // Back
  { name: 'Pull-Up', muscle_group: 'back', equipment: 'bodyweight', difficulty: 'advanced', instructions_md: 'Grip bar wider than shoulders. Pull chest to bar. Full hang at bottom.' },
  { name: 'Chin-Up', muscle_group: 'back', equipment: 'bodyweight', difficulty: 'intermediate', instructions_md: 'Underhand grip, shoulder-width. Pull chin over bar.' },
  { name: 'Lat Pulldown', muscle_group: 'back', equipment: 'machine', difficulty: 'beginner', instructions_md: 'Wide grip, lean back slightly. Pull bar to upper chest.' },
  { name: 'Barbell Row', muscle_group: 'back', equipment: 'barbell', difficulty: 'intermediate', instructions_md: 'Hinge at hips, back flat. Pull bar to lower ribs.' },
  { name: 'Dumbbell Row', muscle_group: 'back', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'One knee on bench. Pull dumbbell to hip, elbow close.' },
  { name: 'Seated Cable Row', muscle_group: 'back', equipment: 'cable', difficulty: 'beginner', instructions_md: 'Sit upright, pull handle to lower abs. Squeeze shoulder blades.' },
  { name: 'Face Pull', muscle_group: 'back', equipment: 'cable', difficulty: 'beginner', instructions_md: 'Rope attachment at face height. Pull to face, external rotate.' },
  { name: 'Deadlift', muscle_group: 'back', equipment: 'barbell', difficulty: 'advanced', instructions_md: 'Feet hip-width, grip outside legs. Drive through heels, keep bar close.' },

  // Legs
  { name: 'Back Squat', muscle_group: 'legs', equipment: 'barbell', difficulty: 'intermediate', instructions_md: 'Bar on upper traps. Sit back, knees track toes. Depth: hip crease below knee.' },
  { name: 'Front Squat', muscle_group: 'legs', equipment: 'barbell', difficulty: 'advanced', instructions_md: 'Bar on front delts, elbows up. More upright torso.' },
  { name: 'Goblet Squat', muscle_group: 'legs', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Hold dumbbell at chest. Squat deep, elbows inside knees.' },
  { name: 'Romanian Deadlift', muscle_group: 'legs', equipment: 'barbell', difficulty: 'intermediate', instructions_md: 'Hinge at hips, slight knee bend. Feel stretch in hamstrings.' },
  { name: 'Leg Press', muscle_group: 'legs', equipment: 'machine', difficulty: 'beginner', instructions_md: 'Feet shoulder-width. Lower until 90°, don\'t lock out.' },
  { name: 'Walking Lunge', muscle_group: 'legs', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Step forward, drop back knee. Alternate legs.' },
  { name: 'Bulgarian Split Squat', muscle_group: 'legs', equipment: 'dumbbell', difficulty: 'intermediate', instructions_md: 'Rear foot elevated. Front knee tracks toes.' },
  { name: 'Leg Extension', muscle_group: 'legs', equipment: 'machine', difficulty: 'beginner', instructions_md: 'Extend legs fully. Squeeze quads at top.' },
  { name: 'Leg Curl', muscle_group: 'legs', equipment: 'machine', difficulty: 'beginner', instructions_md: 'Curl heels to glutes. Control eccentric.' },
  { name: 'Calf Raise', muscle_group: 'legs', equipment: 'machine', difficulty: 'beginner', instructions_md: 'Full stretch at bottom, full contraction at top.' },
  { name: 'Hip Thrust', muscle_group: 'legs', equipment: 'barbell', difficulty: 'intermediate', instructions_md: 'Upper back on bench. Drive through heels, squeeze glutes.' },

  // Shoulders
  { name: 'Overhead Press', muscle_group: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', instructions_md: 'Bar at collarbone. Press straight up, head through at top.' },
  { name: 'Dumbbell Shoulder Press', muscle_group: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Seated or standing. Press up, slight arc forward.' },
  { name: 'Lateral Raise', muscle_group: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Slight elbow bend. Raise to shoulder height, pinky up.' },
  { name: 'Front Raise', muscle_group: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Raise straight front to shoulder height. Control down.' },
  { name: 'Rear Delt Fly', muscle_group: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Hinge at hips. Fly arms back, squeeze rear delts.' },
  { name: 'Arnold Press', muscle_group: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate', instructions_md: 'Start palms facing you. Rotate as you press up.' },

  // Arms
  { name: 'Barbell Curl', muscle_group: 'arms', equipment: 'barbell', difficulty: 'beginner', instructions_md: 'Shoulder-width grip. Curl up, elbows pinned. No swinging.' },
  { name: 'Dumbbell Curl', muscle_group: 'arms', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Supinate at top. Control eccentric.' },
  { name: 'Hammer Curl', muscle_group: 'arms', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Neutral grip. Targets brachialis.' },
  { name: 'Tricep Pushdown', muscle_group: 'arms', equipment: 'cable', difficulty: 'beginner', instructions_md: 'Elbows pinned. Push down, flare rope at bottom.' },
  { name: 'Overhead Tricep Extension', muscle_group: 'arms', equipment: 'dumbbell', difficulty: 'intermediate', instructions_md: 'Single dumbbell overhead. Lower behind head.' },
  { name: 'Skull Crusher', muscle_group: 'arms', equipment: 'barbell', difficulty: 'intermediate', instructions_md: 'EZ bar. Lower to forehead, extend up.' },

  // Core
  { name: 'Plank', muscle_group: 'core', equipment: 'bodyweight', difficulty: 'beginner', instructions_md: 'Forearms on ground. Body straight. Engage core.' },
  { name: 'Hanging Leg Raise', muscle_group: 'core', equipment: 'bodyweight', difficulty: 'advanced', instructions_md: 'Hang from bar. Raise legs to parallel or higher.' },
  { name: 'Russian Twist', muscle_group: 'core', equipment: 'dumbbell', difficulty: 'beginner', instructions_md: 'Sit, lean back. Rotate side to side with weight.' },
  { name: 'Ab Wheel Rollout', muscle_group: 'core', equipment: 'other', difficulty: 'advanced', instructions_md: 'Knees on pad. Roll out, keep core tight.' },

  // Cardio
  { name: 'Running', muscle_group: 'cardio', equipment: 'bodyweight', difficulty: 'beginner', instructions_md: 'Easy pace, conversational.' },
  { name: 'Cycling', muscle_group: 'cardio', equipment: 'machine', difficulty: 'beginner', instructions_md: 'Moderate resistance, steady cadence.' },
  { name: 'Rowing', muscle_group: 'cardio', equipment: 'machine', difficulty: 'intermediate', instructions_md: 'Legs, body, arms. Reverse to recover.' },
];

// Built-in achievements (50+)
export const BUILTIN_ACHIEVEMENTS = [
  // Workout count
  { code: 'first_workout', name: 'First Steps', description: 'Complete your first workout', icon: 'trophy', xp_reward: 100, criteria: { type: 'workout_count', value: 1 } },
  { code: 'workout_5', name: 'Getting Started', description: 'Complete 5 workouts', icon: 'trophy', xp_reward: 150, criteria: { type: 'workout_count', value: 5 } },
  { code: 'workout_10', name: 'Dedicated', description: 'Complete 10 workouts', icon: 'trophy', xp_reward: 250, criteria: { type: 'workout_count', value: 10 } },
  { code: 'workout_25', name: 'Consistent', description: 'Complete 25 workouts', icon: 'award', xp_reward: 500, criteria: { type: 'workout_count', value: 25 } },
  { code: 'workout_50', name: 'Half Century', description: 'Complete 50 workouts', icon: 'award', xp_reward: 750, criteria: { type: 'workout_count', value: 50 } },
  { code: 'workout_100', name: 'Centurion', description: 'Complete 100 workouts', icon: 'medal', xp_reward: 1500, criteria: { type: 'workout_count', value: 100 } },
  { code: 'workout_250', name: 'Iron Will', description: 'Complete 250 workouts', icon: 'medal', xp_reward: 3000, criteria: { type: 'workout_count', value: 250 } },
  { code: 'workout_500', name: 'Legend', description: 'Complete 500 workouts', icon: 'crown', xp_reward: 5000, criteria: { type: 'workout_count', value: 500 }, is_hidden: true },

  // Streaks
  { code: 'streak_3', name: 'On Fire', description: '3 day workout streak', icon: 'flame', xp_reward: 150, criteria: { type: 'streak_days', value: 3 } },
  { code: 'streak_7', name: 'Week Warrior', description: '7 day workout streak', icon: 'flame', xp_reward: 300, criteria: { type: 'streak_days', value: 7 } },
  { code: 'streak_14', name: 'Fortnight Fighter', description: '14 day workout streak', icon: 'flame', xp_reward: 600, criteria: { type: 'streak_days', value: 14 } },
  { code: 'streak_30', name: 'Iron Will', description: '30 day workout streak', icon: 'zap', xp_reward: 1500, criteria: { type: 'streak_days', value: 30 } },
  { code: 'streak_60', name: 'Unstoppable', description: '60 day workout streak', icon: 'zap', xp_reward: 3000, criteria: { type: 'streak_days', value: 60 } },
  { code: 'streak_100', name: 'Century Streak', description: '100 day workout streak', icon: 'crown', xp_reward: 10000, criteria: { type: 'streak_days', value: 100 }, is_hidden: true },

  // Personal Records
  { code: 'pr_first', name: 'New Record', description: 'Set your first personal record', icon: 'star', xp_reward: 200, criteria: { type: 'pr_count', value: 1 } },
  { code: 'pr_5', name: 'Record Breaker', description: 'Set 5 personal records', icon: 'star', xp_reward: 500, criteria: { type: 'pr_count', value: 5 } },
  { code: 'pr_10', name: 'Record Hunter', description: 'Set 10 personal records', icon: 'award', xp_reward: 1000, criteria: { type: 'pr_count', value: 10 } },
  { code: 'pr_25', name: 'PR Machine', description: 'Set 25 personal records', icon: 'medal', xp_reward: 2500, criteria: { type: 'pr_count', value: 25 } },

  // Volume
  { code: 'volume_1000', name: 'Heavy Lifter', description: 'Lift 1,000 kg total volume in one workout', icon: 'dumbbell', xp_reward: 300, criteria: { type: 'total_volume_kg', value: 1000 } },
  { code: 'volume_5000', name: 'Volume King', description: 'Lift 5,000 kg total volume in one workout', icon: 'dumbbell', xp_reward: 1000, criteria: { type: 'total_volume_kg', value: 5000 } },
  { code: 'volume_10000', name: 'Tonnage Master', description: 'Lift 10,000 kg total volume in one workout', icon: 'dumbbell', xp_reward: 2500, criteria: { type: 'total_volume_kg', value: 10000 } },
  { code: 'volume_lifetime_100k', name: 'Century Tonnage', description: 'Lift 100,000 kg lifetime volume', icon: 'trophy', xp_reward: 5000, criteria: { type: 'total_volume_kg', value: 100000 } },

  // Bodyweight
  { code: 'bodyweight_50_pushups', name: 'Push-Up Pro', description: 'Do 50 push-ups in a single set', icon: 'target', xp_reward: 500, criteria: { type: 'bodyweight_exercise', value: 50, muscle_group: 'chest' } },
  { code: 'bodyweight_20_pullups', name: 'Pull-Up Master', description: 'Do 20 pull-ups in a single set', icon: 'target', xp_reward: 1000, criteria: { type: 'bodyweight_exercise', value: 20, muscle_group: 'back' } },
  { code: 'bodyweight_100_squats', name: 'Squat Century', description: 'Do 100 bodyweight squats in a single set', icon: 'target', xp_reward: 500, criteria: { type: 'bodyweight_exercise', value: 100, muscle_group: 'legs' } },

  // Level
  { code: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: 'star', xp_reward: 500, criteria: { type: 'level_reached', value: 5 } },
  { code: 'level_10', name: 'Veteran', description: 'Reach level 10', icon: 'star', xp_reward: 1000, criteria: { type: 'level_reached', value: 10 } },
  { code: 'level_25', name: 'Elite', description: 'Reach level 25', icon: 'award', xp_reward: 5000, criteria: { type: 'level_reached', value: 25 } },
  { code: 'level_50', name: 'Grandmaster', description: 'Reach level 50', icon: 'crown', xp_reward: 25000, criteria: { type: 'level_reached', value: 50 }, is_hidden: true },

  // Muscle group specialists
  { code: 'chest_20', name: 'Chest Day', description: 'Complete 20 chest workouts', icon: 'dumbbell', xp_reward: 500, criteria: { type: 'workout_count', value: 20, muscle_group: 'chest' } },
  { code: 'back_20', name: 'Back Day', description: 'Complete 20 back workouts', icon: 'dumbbell', xp_reward: 500, criteria: { type: 'workout_count', value: 20, muscle_group: 'back' } },
  { code: 'legs_20', name: 'Leg Day', description: 'Complete 20 leg workouts', icon: 'dumbbell', xp_reward: 500, criteria: { type: 'workout_count', value: 20, muscle_group: 'legs' } },
  { code: 'shoulders_20', name: 'Shoulder Day', description: 'Complete 20 shoulder workouts', icon: 'dumbbell', xp_reward: 500, criteria: { type: 'workout_count', value: 20, muscle_group: 'shoulders' } },
  { code: 'arms_20', name: 'Arm Day', description: 'Complete 20 arm workouts', icon: 'dumbbell', xp_reward: 500, criteria: { type: 'workout_count', value: 20, muscle_group: 'arms' } },
  { code: 'core_20', name: 'Core Day', description: 'Complete 20 core workouts', icon: 'dumbbell', xp_reward: 500, criteria: { type: 'workout_count', value: 20, muscle_group: 'core' } },

  // Equipment specialists
  { code: 'barbell_50', name: 'Barbell Specialist', description: 'Complete 50 barbell workouts', icon: 'dumbbell', xp_reward: 1000, criteria: { type: 'workout_count', value: 50 } },
  { code: 'dumbbell_50', name: 'Dumbbell Specialist', description: 'Complete 50 dumbbell workouts', icon: 'dumbbell', xp_reward: 1000, criteria: { type: 'workout_count', value: 50 } },
  { code: 'bodyweight_50', name: 'Calisthenics Master', description: 'Complete 50 bodyweight workouts', icon: 'user', xp_reward: 1000, criteria: { type: 'workout_count', value: 50 } },

  // Secret achievements
  { code: 'perfect_week', name: 'Perfect Week', description: 'Workout every day for a week with no rest days', icon: 'check-circle', xp_reward: 2000, criteria: { type: 'streak_days', value: 7 }, is_hidden: true },
  { code: 'early_bird', name: 'Early Bird', description: 'Complete 10 workouts before 7 AM', icon: 'sun', xp_reward: 500, criteria: { type: 'workout_count', value: 10 }, is_hidden: true },
  { code: 'night_owl', name: 'Night Owl', description: 'Complete 10 workouts after 10 PM', icon: 'moon', xp_reward: 500, criteria: { type: 'workout_count', value: 10 }, is_hidden: true },
];

export async function seedExercises(): Promise<void> {
  const existing = await collections.exercises.query().fetch();
  if (existing.length > 0) return;

  await database.write(async () => {
    for (let i = 0; i < BUILTIN_EXERCISES.length; i++) {
      const ex = BUILTIN_EXERCISES[i];
      await collections.exercises.create(e => {
        e.id = `ex_${String(i + 1).padStart(3, '0')}`;
        e.name = ex.name;
        e.muscleGroup = ex.muscle_group;
        e.equipment = ex.equipment;
        e.difficulty = ex.difficulty;
        e.instructionsMd = ex.instructions_md;
        e.isCustom = false;
        e.createdAt = now + i;
        e.updatedAt = now + i;
      });
    }
  });
}

export async function seedAchievements(): Promise<void> {
  const existing = await collections.achievements.query().fetch();
  if (existing.length > 0) return;

  await database.write(async () => {
    for (let i = 0; i < BUILTIN_ACHIEVEMENTS.length; i++) {
      const ach = BUILTIN_ACHIEVEMENTS[i];
      await collections.achievements.create(a => {
        a.id = `ach_${String(i + 1).padStart(3, '0')}`;
        a.code = ach.code;
        a.name = ach.name;
        a.description = ach.description;
        a.icon = ach.icon;
        a.xpReward = ach.xp_reward;
        a.criteria = ach.criteria;
        a.isHidden = ach.is_hidden ?? false;
        a.createdAt = now + i;
      });
    }
  });
}

export async function seedAll(): Promise<void> {
  await seedExercises();
  await seedAchievements();
}