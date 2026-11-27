/**
 * Notification Model
 * Local notifications and in-app messages
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, json } from '@nozbe/watermelondb/decorators';

export class Notification extends Model {
  static table = 'notifications';

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  } as const;

  @text('user_id') userId!: string;
  @text('type') type!: string; // 'workout_reminder', 'streak_risk', 'achievement_unlocked', 'level_up', 'pr_set'
  @text('title') title!: string;
  @text('body') body!: string;
  @json('data_json', { defaultValue: {} }) data!: Record<string, any>;
  @date('read_at') readAt!: Date | null;
  @date('created_at') createdAt!: Date;

  get isRead(): boolean {
    return this.readAt !== null;
  }

  async markAsRead(): Promise<void> {
    if (!this.isRead) {
      await this.update(n => { n.readAt = new Date(); });
    }
  }

  async markAsUnread(): Promise<void> {
    if (this.isRead) {
      await this.update(n => { n.readAt = null as any; });
    }
  }
}