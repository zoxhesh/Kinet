/**
 * BodyStat Model
 * Body measurements tracking
 */

import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly, json } from '@nozbe/watermelondb/decorators';

export class BodyStat extends Model {
  static table = 'body_stats';

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
  } as const;

  @text('user_id') userId!: string;
  @date('date') date!: Date;
  @field('weight_kg') weightKg!: number | null;
  @field('body_fat_pct') bodyFatPct!: number | null;
  @json('measurements_json', { defaultValue: {} }) measurements!: Record<string, number>;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Standard measurement keys
  static MEASUREMENT_KEYS = [
    'chest', 'waist', 'hips', 'bicep_left', 'bicep_right',
    'forearm_left', 'forearm_right', 'thigh_left', 'thigh_right',
    'calf_left', 'calf_right', 'neck',
  ] as const;

  get formattedWeight(): string {
    if (this.weightKg === null) return '—';
    return `${this.weightKg.toFixed(1)} kg`;
  }

  get formattedBodyFat(): string {
    if (this.bodyFatPct === null) return '—';
    return `${this.bodyFatPct.toFixed(1)}%`;
  }

  getMeasurement(key: string): number | null {
    return this.measurements[key] ?? null;
  }

  setMeasurement(key: string, value: number): void {
    this.measurements = { ...this.measurements, [key]: value };
  }
}