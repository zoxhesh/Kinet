/**
 * Setting Model
 * Key-value user settings
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, json } from '@nozbe/watermelondb/decorators';

export class Setting extends Model {
  static table = 'settings';

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  } as const;

  @text('user_id') userId!: string;
  @text('key') key!: string;
  @text('value') value!: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Setting keys
  static KEYS = {
    UNITS: 'units', // 'metric' | 'imperial'
    THEME: 'theme', // 'light' | 'dark' | 'system'
    NOTIFICATIONS_ENABLED: 'notifications_enabled',
    WORKOUT_REMINDER_TIME: 'workout_reminder_time', // 'HH:mm'
    STREAK_REMINDER: 'streak_reminder',
    AUTO_REST_TIMER: 'auto_rest_timer',
    HAPTICS_ENABLED: 'haptics_enabled',
    SOUND_ENABLED: 'sound_enabled',
    LANGUAGE: 'language',
    DATE_FORMAT: 'date_format',
    TIME_FORMAT: 'time_format', // '12h' | '24h'
    DEFAULT_REST_SECONDS: 'default_rest_seconds',
    PLATE_CALCULATOR_BAR_WEIGHT: 'plate_calculator_bar_weight',
  } as const;

  static DEFAULTS: Record<string, string> = {
    [Setting.KEYS.UNITS]: 'metric',
    [Setting.KEYS.THEME]: 'system',
    [Setting.KEYS.NOTIFICATIONS_ENABLED]: 'true',
    [Setting.KEYS.WORKOUT_REMINDER_TIME]: '18:00',
    [Setting.KEYS.STREAK_REMINDER]: 'true',
    [Setting.KEYS.AUTO_REST_TIMER]: 'true',
    [Setting.KEYS.HAPTICS_ENABLED]: 'true',
    [Setting.KEYS.SOUND_ENABLED]: 'true',
    [Setting.KEYS.LANGUAGE]: 'en',
    [Setting.KEYS.DATE_FORMAT]: 'MM/dd/yyyy',
    [Setting.KEYS.TIME_FORMAT]: '24h',
    [Setting.KEYS.DEFAULT_REST_SECONDS]: '90',
    [Setting.KEYS.PLATE_CALCULATOR_BAR_WEIGHT]: '20',
  };

  getTypedValue<T = string>(): T {
    try {
      return JSON.parse(this.value);
    } catch {
      return this.value as unknown as T;
    }
  }

  async setTypedValue<T>(value: T): Promise<void> {
    await this.update(s => {
      s.value = typeof value === 'string' ? value : JSON.stringify(value);
    });
  }
}