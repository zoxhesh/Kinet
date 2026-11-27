/**
 * UserAchievement Model
 * User's progress and unlocks for achievements
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, children } from '@nozbe/watermelondb/decorators';
import { Achievement } from './Achievement';

export class UserAchievement extends Model {
  static table = 'user_achievements';

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
    achievements: { type: 'belongs_to', key: 'achievement_id' },
  } as const;

  @text('user_id') userId!: string;
  @text('achievement_id') achievementId!: string;
  @date('unlocked_at') unlockedAt!: Date | null;
  @field('progress') progress!: number; // 0.0 to 1.0
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @children('achievements') achievement!: any;

  get isUnlocked(): boolean {
    return this.unlockedAt !== null;
  }

  get displayProgress(): string {
    if (this.isUnlocked) return '100%';
    return `${Math.round(this.progress * 100)}%`;
  }

  async updateProgress(newProgress: number): Promise<void> {
    const clamped = Math.max(0, Math.min(1, newProgress));
    await this.update(ua => {
      ua.progress = clamped;
      if (clamped >= 1 && !this.isUnlocked) {
        ua.unlockedAt = new Date();
        // Award XP
        const user = await this.collections.get('users').find(this.userId);
        const achievement = await this.achievement;
        await user.update(u => {
          u.xp += achievement.xpReward;
          // Check level up
          while (u.xp >= u.level * 1000) {
            u.level += 1;
          }
        });
      }
    });
  }
}