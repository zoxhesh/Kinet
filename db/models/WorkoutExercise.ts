/**
 * WorkoutExercise Model
 * Links workouts to exercises with ordering and superset support
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators';
import { Exercise } from './Exercise';
import { Set } from './Set';

export class WorkoutExercise extends Model {
  static table = 'workout_exercises';

  static associations = {
    exercises: { type: 'belongs_to', key: 'exercise_id' },
    sets: { type: 'has_many', foreignKey: 'workout_exercise_id' },
  } as const;

  @text('workout_id') workoutId!: string;
  @text('exercise_id') exerciseId!: string;
  @field('order_index') orderIndex!: number;
  @field('superset_group') supersetGroup!: number | null;
  @text('notes') notes!: string | null;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @children('sets') sets!: any;
  @children('exercises') exercise!: any;

  get isInSuperset(): boolean {
    return this.supersetGroup !== null;
  }

  async getPreviousSets(limit = 3): Promise<any[]> {
    const prevWorkouts = await this.collections.get('workouts')
      .query()
      .where('is_completed', true)
      .where('user_id', (await this.workout).userId)
      .where('started_at', '<', (await this.workout).startedAt.getTime())
      .take(limit)
      .fetch();

    const prevExercises = [];
    for (const w of prevWorkouts) {
      const we = await w.workoutExercises
        .query()
        .where('exercise_id', this.exerciseId)
        .extend(we => we.children('sets'))
        .fetch();
      if (we.length > 0) {
        prevExercises.push({
          workout: w,
          sets: we[0].sets.sort((a, b) => a.setNumber - b.setNumber),
        });
      }
    }
    return prevExercises;
  }

  async getSuggestedWeight(): Promise<number | null> {
    const prev = await this.getPreviousSets(1);
    if (prev.length === 0) return null;

    const lastSets = prev[0].sets.filter(s => !s.isWarmup);
    if (lastSets.length === 0) return null;

    // Average of last workout's working sets
    const avgWeight = lastSets.reduce((sum, s) => sum + s.weightKg, 0) / lastSets.length;
    return Math.round(avgWeight * 10) / 10;
  }
}