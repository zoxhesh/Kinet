/**
 * User Model
 * Core user profile with gamification stats
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, date, json, readonly, children } from '@nozbe/watermelondb/decorators';
import { Workout } from './Workout';
import { BodyStat } from './BodyStat';
import { UserAchievement } from './UserAchievement';
import { Notification } from './Notification';
import { Setting } from './Setting';

export class User extends Model {
  static table = 'users';

  static associations = {
    workouts: { type: 'has_many', foreignKey: 'user_id' },
    body_stats: { type: 'has_many', foreignKey: 'user_id' },
    user_achievements: { type: 'has_many', foreignKey: 'user_id' },
    notifications: { type: 'has_many', foreignKey: 'user_id' },
    settings: { type: 'has_many', foreignKey: 'user_id' },
  } as const;

  @text('email') email!: string;
  @text('username') username!: string | null;
  @text('avatar_url') avatarUrl!: string | null;
  @field('level') level!: number;
  @field('xp') xp!: number;
  @field('total_workouts') totalWorkouts!: number;
  @field('current_streak') currentStreak!: number;
  @field('longest_streak') longestStreak!: number;
  @json('settings_json', { defaultValue: {} }) settings!: Record<string, any>;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @date('last_synced_at') lastSyncedAt!: Date | null;

  @children('workouts') workouts!: any;
  @children('body_stats') bodyStats!: any;
  @children('user_achievements') userAchievements!: any;
  @children('notifications') notifications!: any;
  @children('settings') settingsList!: any;

  // Computed properties
  get displayName(): string {
    return this.username || this.email.split('@')[0];
  }

  get xpForNextLevel(): number {
    // Simple formula: level * 1000 XP
    return this.level * 1000;
  }

  get xpProgress(): number {
    const currentLevelXp = (this.level - 1) * 1000;
    const nextLevelXp = this.level * 1000;
    return (this.xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
  }

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.settingsList.query().where('key', key).fetch();
    return setting[0]?.value ?? null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const existing = await this.settingsList.query().where('key', key).fetch();
    if (existing.length > 0) {
      await existing[0].update(s => { s.value = value; });
    } else {
      await this.collections.get('settings').create(s => {
        s.userId = this.id;
        s.key = key;
        s.value = value;
      });
    }
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.settingsList.query().fetch();
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }
}