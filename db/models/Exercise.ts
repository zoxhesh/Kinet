/**
 * Exercise Model
 * Exercise library with muscle groups, equipment, difficulty
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators';
import { WorkoutExercise } from './WorkoutExercise';

export class Exercise extends Model {
  static table = 'exercises';

  static associations = {
    workout_exercises: { type: 'has_many', foreignKey: 'exercise_id' },
  } as const;

  @text('name') name!: string;
  @text('muscle_group') muscleGroup!: string;
  @text('equipment') equipment!: string;
  @text('difficulty') difficulty!: 'beginner' | 'intermediate' | 'advanced';
  @text('instructions_md') instructionsMd!: string | null;
  @text('video_url') videoUrl!: string | null;
  @text('gif_url') gifUrl!: string | null;
  @field('is_custom') isCustom!: boolean;
  @text('created_by') createdBy!: string | null;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @children('workout_exercises') workoutExercises!: any;

  // Muscle group constants
  static MUSCLE_GROUPS = [
    'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio',
  ] as const;

  static EQUIPMENT = [
    'barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'band', 'other',
  ] as const;

  static DIFFICULTIES = [
    'beginner', 'intermediate', 'advanced',
  ] as const;

  get displayDifficulty(): string {
    return this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
  }

  get muscleGroupLabel(): string {
    const labels: Record<string, string> = {
      chest: 'Chest',
      back: 'Back',
      legs: 'Legs',
      shoulders: 'Shoulders',
      arms: 'Arms',
      core: 'Core',
      cardio: 'Cardio',
    };
    return labels[this.muscle_group] || this.muscle_group;
  }

  get equipmentLabel(): string {
    const labels: Record<string, string> = {
      barbell: 'Barbell',
      dumbbell: 'Dumbbell',
      machine: 'Machine',
      bodyweight: 'Bodyweight',
      cable: 'Cable',
      band: 'Resistance Band',
      other: 'Other',
    };
    return labels[this.equipment] || this.equipment;
  }
}