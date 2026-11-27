/**
 * Set Model
 * Individual set within a workout exercise
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export class Set extends Model {
  static table = 'sets';

  static associations = {
    workout_exercises: { type: 'belongs_to', key: 'workout_exercise_id' },
  } as const;

  @text('workout_exercise_id') workoutExerciseId!: string;
  @field('set_number') setNumber!: number;
  @field('reps') reps!: number;
  @field('weight_kg') weightKg!: number;
  @field('rpe') rpe!: number | null;
  @field('is_warmup') isWarmup!: boolean;
  @date('completed_at') completedAt!: Date;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  get volume(): number {
    return this.reps * this.weightKg;
  }

  get displayWeight(): string {
    if (this.weightKg === 0) return 'Bodyweight';
    return `${this.weightKg} kg`;
  }

  get displayRpe(): string {
    if (this.rpe === null) return '—';
    return `RPE ${this.rpe}`;
  }
}