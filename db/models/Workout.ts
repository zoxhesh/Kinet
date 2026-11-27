/**
 * Workout Model
 * A workout session with exercises and sets
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators';
import { WorkoutExercise } from './WorkoutExercise';

export class Workout extends Model {
  static table = 'workouts';

  static associations = {
    workout_exercises: { type: 'has_many', foreignKey: 'workout_id' },
  } as const;

  @text('user_id') userId!: string;
  @date('started_at') startedAt!: Date;
  @date('completed_at') completedAt!: Date | null;
  @field('duration_sec') durationSec!: number | null;
  @field('total_sets') totalSets!: number;
  @field('total_volume_kg') totalVolumeKg!: number;
  @text('notes') notes!: string | null;
  @field('is_completed') isCompleted!: boolean;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @children('workout_exercises') workoutExercises!: any;

  get isInProgress(): boolean {
    return !this.isCompleted && this.completedAt === null;
  }

  get formattedDuration(): string {
    if (!this.durationSec) return '0:00';
    const mins = Math.floor(this.durationSec / 60);
    const secs = this.durationSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  get dateLabel(): string {
    return this.startedAt.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  async getExercisesWithSets(): Promise<any[]> {
    const exercises = await this.workoutExercises
      .query()
      .extend(we => we.children('sets'))
      .fetch();

    return exercises.map(we => ({
      ...we,
      sets: we.sets.sort((a, b) => a.setNumber - b.setNumber),
    }));
  }

  async calculateVolume(): Promise<number> {
    const exercises = await this.getExercisesWithSets();
    let volume = 0;
    for (const ex of exercises) {
      for (const set of ex.sets) {
        if (!set.isWarmup) {
          volume += set.reps * set.weightKg;
        }
      }
    }
    return volume;
  }
}