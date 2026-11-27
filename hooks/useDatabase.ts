/**
 * Database Hooks
 * React hooks for WatermelonDB queries
 */

import { useState, useEffect, useCallback } from 'react';
import { useDatabase as useWMDB } from '@nozbe/watermelondb/hooks';
import { database, collections, seedAll } from '@/db';
import { User, Exercise, Workout, WorkoutExercise, Set, BodyStat, Achievement, UserAchievement, Notification, Setting } from '@/db/models';

// Re-export Setting for direct access to KEYS
export { Setting };

// Initialize database on first use
export const useDatabase = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        await database.collections.get('users').query().fetch(); // Test connection
        await seedAll();
        if (mounted) setIsReady(true);
      } catch (e) {
        if (mounted) setError(e as Error);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  return { database, isReady, error };
};

// User hooks
export const useCurrentUser = () => {
  const { isReady } = useDatabase();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isReady) return;
    const sub = collections.users
      .query()
      .observe()
      .subscribe(users => {
        setUser(users[0] || null);
      });
    return () => sub.unsubscribe();
  }, [isReady]);

  return { user, isReady };
};

export const useUser = (userId: string) => {
  const { isReady } = useDatabase();
  const user = collections.users.find(userId).observe();
  return { user, isReady };
};

// Exercise hooks
export const useExercises = (filters?: {
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
  isCustom?: boolean;
  search?: string;
}) => {
  const { isReady } = useDatabase();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!isReady) return;
    let query = collections.exercises.query();

    if (filters?.muscleGroup) {
      query = query.where('muscle_group', filters.muscleGroup);
    }
    if (filters?.equipment) {
      query = query.where('equipment', filters.equipment);
    }
    if (filters?.difficulty) {
      query = query.where('difficulty', filters.difficulty);
    }
    if (filters?.isCustom !== undefined) {
      query = query.where('is_custom', filters.isCustom);
    }

    // Sort by name
    query = query.extend(q => q.sortBy('name', 'asc'));

    const sub = query.observe().subscribe(setExercises);
    return () => sub.unsubscribe();
  }, [isReady, filters?.muscleGroup, filters?.equipment, filters?.difficulty, filters?.isCustom]);

  return { exercises, isReady };
};

export const useExercise = (exerciseId: string) => {
  const { isReady } = useDatabase();
  return collections.exercises.find(exerciseId).observe();
};

export const useExerciseSearch = (searchTerm: string) => {
  const { isReady } = useDatabase();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (!isReady || !searchTerm.trim()) {
      setExercises([]);
      return;
    }
    const sub = collections.exercises
      .query()
      .where('name', 'like', `%${searchTerm}%`)
      .extend(q => q.sortBy('name', 'asc'))
      .observe()
      .subscribe(setExercises);
    return () => sub.unsubscribe();
  }, [isReady, searchTerm]);

  return { exercises, isReady };
};

// Workout hooks
export const useWorkouts = (filters?: {
  userId?: string;
  isCompleted?: boolean;
  limit?: number;
  order?: 'desc' | 'asc';
}) => {
  const { isReady } = useDatabase();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    if (!isReady) return;
    let query = collections.workouts.query();

    if (filters?.userId) {
      query = query.where('user_id', filters.userId);
    }
    if (filters?.isCompleted !== undefined) {
      query = query.where('is_completed', filters.isCompleted);
    }
    query = query.extend(q => q.sortBy('started_at', filters?.order || 'desc'));
    if (filters?.limit) {
      query = query.take(filters.limit);
    }

    const sub = query.observe().subscribe(setWorkouts);
    return () => sub.unsubscribe();
  }, [isReady, filters?.userId, filters?.isCompleted, filters?.limit, filters?.order]);

  return { workouts, isReady };
};

export const useWorkout = (workoutId: string) => {
  const { isReady } = useDatabase();
  return collections.workouts.find(workoutId).observe();
};

export const useActiveWorkout = (userId: string) => {
  const { isReady } = useDatabase();
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (!isReady) return;
    const sub = collections.workouts
      .query()
      .where('user_id', userId)
      .where('is_completed', false)
      .extend(q => q.sortBy('started_at', 'desc'))
      .observe()
      .subscribe(workouts => setWorkout(workouts[0] || null));
    return () => sub.unsubscribe();
  }, [isReady, userId]);

  return { workout, isReady };
};

// Workout Exercise hooks
export const useWorkoutExercises = (workoutId: string) => {
  const { isReady } = useDatabase();
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  useEffect(() => {
    if (!isReady) return;
    const sub = collections.workoutExercises
      .query()
      .where('workout_id', workoutId)
      .extend(q => q.sortBy('order_index', 'asc'))
      .extend(q => q.children('sets'))
      .observe()
      .subscribe(setExercises);
    return () => sub.unsubscribe();
  }, [isReady, workoutId]);

  return { exercises, isReady };
};

// Set hooks
export const useSets = (workoutExerciseId: string) => {
  const { isReady } = useDatabase();
  const [sets, setSets] = useState<Set[]>([]);

  useEffect(() => {
    if (!isReady) return;
    const sub = collections.sets
      .query()
      .where('workout_exercise_id', workoutExerciseId)
      .extend(q => q.sortBy('set_number', 'asc'))
      .observe()
      .subscribe(setSets);
    return () => sub.unsubscribe();
  }, [isReady, workoutExerciseId]);

  return { sets, isReady };
};

// Body Stat hooks
export const useBodyStats = (userId: string, limit?: number) => {
  const { isReady } = useDatabase();
  const [stats, setStats] = useState<BodyStat[]>([]);

  useEffect(() => {
    if (!isReady) return;
    let query = collections.bodyStats
      .query()
      .where('user_id', userId)
      .extend(q => q.sortBy('date', 'desc'));
    if (limit) query = query.take(limit);

    const sub = query.observe().subscribe(setStats);
    return () => sub.unsubscribe();
  }, [isReady, userId, limit]);

  return { stats, isReady };
};

// Achievement hooks
export const useAchievements = (includeHidden = false) => {
  const { isReady } = useDatabase();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!isReady) return;
    let query = collections.achievements.query().extend(q => q.sortBy('created_at', 'asc'));
    if (!includeHidden) {
      query = query.where('is_hidden', false);
    }
    const sub = query.observe().subscribe(setAchievements);
    return () => sub.unsubscribe();
  }, [isReady, includeHidden]);

  return { achievements, isReady };
};

export const useUserAchievements = (userId: string) => {
  const { isReady } = useDatabase();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    if (!isReady) return;
    const sub = collections.userAchievements
      .query()
      .where('user_id', userId)
      .extend(q => q.children('achievements'))
      .observe()
      .subscribe(setUserAchievements);
    return () => sub.unsubscribe();
  }, [isReady, userId]);

  return { userAchievements, isReady };
};

// Notification hooks
export const useNotifications = (userId: string, unreadOnly = false) => {
  const { isReady } = useDatabase();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isReady) return;
    let query = collections.notifications
      .query()
      .where('user_id', userId)
      .extend(q => q.sortBy('created_at', 'desc'));
    if (unreadOnly) {
      query = query.where('read_at', null);
    }
    const sub = query.observe().subscribe(setNotifications);
    return () => sub.unsubscribe();
  }, [isReady, userId, unreadOnly]);

  return { notifications, isReady };
};

export const useUnreadNotificationCount = (userId: string) => {
  const { isReady } = useDatabase();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isReady) return;
    const sub = collections.notifications
      .query()
      .where('user_id', userId)
      .where('read_at', null)
      .observeCount()
      .subscribe(setCount);
    return () => sub.unsubscribe();
  }, [isReady, userId]);

  return { count, isReady };
};

// Setting hooks
export const useSetting = (userId: string, key: string) => {
  const { isReady } = useDatabase();
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    const sub = collections.settings
      .query()
      .where('user_id', userId)
      .where('key', key)
      .observe()
      .subscribe(settings => setValue(settings[0]?.value ?? null));
    return () => sub.unsubscribe();
  }, [isReady, userId, key]);

  const updateSetting = useCallback(async (newValue: string) => {
    const existing = await collections.settings
      .query()
      .where('user_id', userId)
      .where('key', key)
      .fetch();
    if (existing.length > 0) {
      await existing[0].update(s => { s.value = newValue; });
    } else {
      await collections.settings.create(s => {
        s.userId = userId;
        s.key = key;
        s.value = newValue;
      });
    }
  }, [userId, key]);

  return { value, updateSetting, isReady };
};

export const useAllSettings = (userId: string) => {
  const { isReady } = useDatabase();
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isReady) return;
    const sub = collections.settings
      .query()
      .where('user_id', userId)
      .observe()
      .subscribe(s => setSettings(s.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {})));
    return () => sub.unsubscribe();
  }, [isReady, userId]);

  return { settings, isReady };
};

// Helper hook for creating records
export const useCreateRecord = <T extends { table: string }>(
  collection: ReturnType<typeof collections.users>,
  prepare: (record: T) => void
) => {
  const { isReady } = useDatabase();

  const create = useCallback(async (data: Partial<T>) => {
    if (!isReady) throw new Error('Database not ready');
    return await database.write(async () => {
      return await collection.create(prepare as any);
    });
  }, [collection, isReady]);

  return { create, isReady };
};

// Helper hook for batch operations
export const useBatchWrite = () => {
  const { isReady } = useDatabase();

  const batch = useCallback(async (operations: (() => Promise<void>)[]) => {
    if (!isReady) throw new Error('Database not ready');
    await database.batch(...operations);
  }, [isReady]);

  return { batch, isReady };
};