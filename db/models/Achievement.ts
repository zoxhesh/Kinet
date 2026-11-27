/**
 * Achievement Model
 * Static achievement definitions
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, json, children } from '@nozbe/watermelondb/decorators';
import { UserAchievement } from './UserAchievement';

export class Achievement extends Model {
  static table = 'achievements';

  static associations = {
    user_achievements: { type: 'has_many', foreignKey: 'achievement_id' },
  } as const;

  @text('code') code!: string;
  @text('name') name!: string;
  @text('description') description!: string;
  @text('icon') icon!: string;
  @field('xp_reward') xpReward!: number;
  @json('criteria_json') criteria!: {
    type: 'workout_count' | 'streak_days' | 'pr_count' | 'total_volume_kg' | 'bodyweight_exercise' | 'level_reached';
    value: number;
    muscle_group?: string;
  };
  @field('is_hidden') isHidden!: boolean;
  @date('created_at') createdAt!: Date;

  @children('user_achievements') userAchievements!: any;

  // Criteria types
  static CRITERIA_TYPES = [
    'workout_count',
    'streak_days',
    'pr_count',
    'total_volume_kg',
    'bodyweight_exercise',
    'level_reached',
  ] as const;

  get isSecret(): boolean {
    return this.isHidden;
  }

  get displayName(): string {
    return this.isHidden ? '???' : this.name;
  }

  get displayDescription(): string {
    return this.isHidden ? 'Keep training to discover this achievement!' : this.description;
  }
}