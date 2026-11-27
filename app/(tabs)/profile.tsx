/**
 * Profile Screen (S08)
 * Level/XP, stats, achievements, settings
 */

import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useAuth, useCurrentUser, useBodyStats, useUserAchievements, useNotifications, useAllSettings, useWorkouts } from '@/hooks/useDatabase';
import {
  Box, Text, Button, Card, ProgressRing, StatCard, Badge, Divider, Avatar, Icon,
} from '@/components/primitives';
import { colors, spacing, typography, radius, shadows, motion } from '@/design/tokens';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function ProfileScreen() {
  const { user, isReady } = useCurrentUser();
  const { stats } = useBodyStats(user?.id || '');
  const { userAchievements } = useUserAchievements(user?.id || '');
  const { notifications, count: unreadCount } = useNotifications(user?.id || '', false);
  const { settings } = useAllSettings(user?.id || '');
  const { logout, refreshUser } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const units = settings[Setting.KEYS.UNITS] || 'metric';
  const theme = settings[Setting.KEYS.THEME] || 'system';
  const notificationsEnabled = settings[Setting.KEYS.NOTIFICATIONS_ENABLED] !== 'false';
  const hapticsEnabled = settings[Setting.KEYS.HAPTICS_ENABLED] !== 'false';

  if (!isReady || !user) {
    return (
      <View style={styles.container}>
        <Box center flex={1}>
          <Text variant="lg" color="textMuted">Loading...</Text>
        </Box>
      </View>
    );
  }

  const recentStats = stats.slice(0, 5);
  const unlockedAchievements = userAchievements.filter(a => a.isUnlocked).slice(0, 6);
  const lockedAchievements = userAchievements.filter(a => !a.isUnlocked).slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshUser} />
        }
      >
        {/* Profile Header */}
        <Box px="screenPadding" py="xl" style={styles.header}>
          <Box row alignItems="center" gap="md">
            <Avatar
              name={user.displayName}
              size="xl"
              source={user.avatar_url ? { uri: user.avatar_url } : undefined}
            />
            <Box flex={1}>
              <Text variant="2xl" weight="extrabold" color="text">
                {user.displayName}
              </Text>
              <Text variant="sm" color="textMuted">
                @{user.username}
              </Text>
            </Box>
            <Box row gap="sm">
              <Button variant="ghost" size="sm" onPress={() => setShowSettings(true)}>
                <Icon name="settings" size="md" />
              </Button>
            </Box>
          </Box>

          {/* Level & XP */}
          <Box mt="lg" row justifyContent="space-between" alignItems="center">
            <Box row alignItems="center" gap="sm">
              <Box
                width={48}
                height={48}
                borderRadius="full"
                backgroundColor={colors.light.xpGoldMuted}
                center
              >
                <Text variant="xl" weight="extrabold" color="xpGold">
                  {user.level}
                </Text>
              </Box>
              <Box>
                <Text variant="xl" weight="extrabold" color="text">
                  Level {user.level}
                </Text>
                <Text variant="sm" color="textMuted">
                  {user.xp.toLocaleString()} / {user.xpForNextLevel.toLocaleString()} XP
                </Text>
              </Box>
            </Box>
            <ProgressRing
              progress={user.xpProgress}
              size="small"
              color="xpGold"
              showLabel={false}
            />
          </Box>

          {/* Streak */}
          <Box mt="md" row justifyContent="space-between" alignItems="center">
            <Box row alignItems="center" gap="sm">
              <Box
                width={40}
                height={40}
                borderRadius="full"
                backgroundColor={colors.light.streakFire + '20'}
                center
              >
                <Icon name="flame" size="lg" color="streakFire" />
              </Box>
              <Box>
                <Text variant="lg" weight="semibold" color="text">
                  {user.currentStreak} Day Streak
                </Text>
                <Text variant="xs" color="textMuted">
                  Best: {user.longestStreak} days
                </Text>
              </Box>
            </Box>
            <Badge color="streakFire" size="md">
              🔥 {user.currentStreak}
            </Badge>
          </Box>
        </Box>

        {/* Stats Grid */}
        <Box px="screenPadding" pb="md">
          <Text variant="xl" weight="semibold" color="text" mb="sm">
            Lifetime Stats
          </Text>
          <Box row gap="sm" flexWrap="wrap">
            <StatCard
              icon="dumbbell"
              value={user.totalWorkouts.toString()}
              label="Workouts"
              trend="+12%"
              trendPositive={true}
            />
            <StatCard
              icon="flame"
              value={user.currentStreak.toString()}
              label="Current Streak"
              trend={user.longestStreak > user.currentStreak ? `Best: ${user.longestStreak}` : undefined}
            />
            <StatCard
              icon="award"
              value={unlockedAchievements.length.toString()}
              label="Achievements"
              trend={`${userAchievements.length} total`}
            />
            <StatCard
              icon="star"
              value={user.level.toString()}
              label="Level"
              trend={`${Math.round(user.xpProgress * 100)}% to next`}
            />
          </Box>
        </Box>

        {/* Progress Charts */}
        <Box px="screenPadding" pb="md">
          <ProgressCharts workouts={workouts} bodyStats={stats} />
        </Box>

        {/* Body Stats */}
        <Box px="screenPadding" pb="md">
          <Box row justifyContent="space-between" alignItems="center" mb="sm">
            <Text variant="xl" weight="semibold" color="text">
              Body Stats
            </Text>
            <Button variant="ghost" size="sm" onPress={() => Alert.alert('Add measurement')}>
              <Icon name="plus" size="sm" /> Add
            </Button>
          </Box>
          {recentStats.length > 0 ? (
            <Box row gap="sm" flexWrap="wrap">
              {recentStats.map((stat, i) => (
                <Card key={i} variant="default" padding="md" flex={1} minWidth={150} center>
                  <Text variant="xs" color="textMuted" mb="xs">
                    {stat.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  <Text variant="lg" weight="semibold" color="text">
                    {stat.formattedWeight}
                  </Text>
                  {stat.bodyFatPct && (
                    <Text variant="xs" color="textMuted">
                      {stat.formattedBodyFat} body fat
                    </Text>
                  )}
                </Card>
              ))}
            </Box>
          ) : (
            <Card variant="default" padding="lg" center>
              <Icon name="scale" size="xl" color="textMuted" mb="md" />
              <Text variant="base" weight="semibold" color="text" textAlign="center">
                No measurements yet
              </Text>
              <Text variant="sm" color="textMuted" textAlign="center" mt="sm">
                Tap "Add" to log your first measurement
              </Text>
              <Button variant="primary" size="sm" mt="md" onPress={() => Alert.alert('Add measurement')}>
                Add Measurement
              </Button>
            </Card>
          )}
        </Box>

        {/* Achievements */}
        <Box px="screenPadding" pb="md">
          <Box row justifyContent="space-between" alignItems="center" mb="sm">
            <Text variant="xl" weight="semibold" color="text">
              Achievements
            </Text>
            <Text variant="sm" color="accent">View All ({unlockedAchievements.length}/{userAchievements.length})</Text>
          </Box>
          <Box row gap="sm" pb="sm">
            {unlockedAchievements.length > 0 ? (
              unlockedAchievements.map((ua, i) => {
                const ach = ua.achievement;
                return (
                  <Card key={i} variant="elevated" padding="md" center minWidth={80}>
                    <Box
                      width={56}
                      height={56}
                      borderRadius="full"
                      backgroundColor={colors.light.xpGoldMuted}
                      center
                      mb="sm"
                    >
                      <Icon name={ach.icon} size="xl" color="xpGold" />
                    </Box>
                    <Text variant="xs" weight="semibold" color="text" textAlign="center" numberOfLines={2}>
                      {ach.name}
                    </Text>
                    <Text variant="xs" color="xpGold" weight="semibold">
                      +{ach.xpReward} XP
                    </Text>
                  </Card>
                );
              })
            ) : (
              <Card variant="default" padding="lg" center flex={1}>
                <Icon name="trophy" size="xl" color="textMuted" mb="md" />
                <Text variant="base" weight="semibold" color="text" textAlign="center">
                  No achievements yet
                </Text>
                <Text variant="sm" color="textMuted" textAlign="center">
                  Complete workouts to unlock achievements!
                </Text>
              </Card>
            )}
          </Box>
        </Box>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <Box px="screenPadding" pb="xl">
            <Box row justifyContent="space-between" alignItems="center" mb="sm">
              <Text variant="xl" weight="semibold" color="text">
                Recent Activity
              </Text>
              {unreadCount > 0 && (
                <Badge color="accent" size="sm">{unreadCount} unread</Badge>
              )}
            </Box>
            <Box gap="xs">
              {notifications.slice(0, 5).map((n, i) => (
                <Card key={i} variant="default" padding="md" style={!n.isRead && styles.notificationUnread}>
                  <Box row justifyContent="space-between" alignItems="flex-start" gap="sm">
                    <Box flex={1}>
                      <Text variant="sm" weight={n.isRead ? 'normal' : 'semibold'} color="text">
                        {n.title}
                      </Text>
                      <Text variant="xs" color="textMuted" mt="xs">
                        {n.body}
                      </Text>
                      <Text variant="xs" color="textMuted" mt="xs">
                        {n.createdAt.toLocaleDateString()}
                      </Text>
                    </Box>
                    {!n.isRead && (
                      <Box
                        width={8}
                        height={8}
                        borderRadius="full"
                        backgroundColor={colors.light.accent}
                        mt={2}
                      />
                    )}
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Settings Modal Trigger */}
        {showSettings && (
          <SettingsModal
            user={user}
            units={units}
            theme={theme}
            notificationsEnabled={notificationsEnabled}
            hapticsEnabled={hapticsEnabled}
            onClose={() => setShowSettings(false)}
            onLogout={logout}
            onSettingsChange={async (key, value) => {
              // Settings are updated via the hook in SettingsModal
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}

// Settings Modal
interface SettingsModalProps {
  user: any;
  units: string;
  theme: string;
  notificationsEnabled: boolean;
  hapticsEnabled: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSettingsChange: (key: string, value: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  units,
  theme,
  notificationsEnabled,
  hapticsEnabled,
  onClose,
  onLogout,
}) => {
  const [localUnits, setLocalUnits] = useState(units);
  const [localTheme, setLocalTheme] = useState(theme);
  const [localNotifications, setLocalNotifications] = useState(notificationsEnabled);
  const [localHaptics, setLocalHaptics] = useState(hapticsEnabled);

  return (
    <View style={styles.modalOverlay} onTouchStart={onClose}>
      <Box
        style={styles.modalContent}
        onTouchStart={e => e.stopPropagation()}
      >
        <Box px="modalPadding" py="lg" borderBottomWidth={1} borderColor={colors.light.border}>
          <Box row justifyContent="space-between" alignItems="center">
            <Text variant="xl" weight="semibold" color="text">Settings</Text>
            <Button variant="ghost" size="sm" onPress={onClose}>
              <Icon name="x" size="md" />
            </Button>
          </Box>
        </Box>

        <ScrollView contentContainerStyle={styles.modalScroll}>
          {/* Account */}
          <Box px="modalPadding" py="md">
            <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">Account</Text>
            <Card variant="default" padding="md">
              <Box row alignItems="center" gap="md">
                <Avatar name={user.displayName} size="md" />
                <Box flex={1}>
                  <Text variant="base" weight="semibold" color="text">{user.displayName}</Text>
                  <Text variant="sm" color="textMuted">{user.email}</Text>
                </Box>
              </Box>
            </Card>
          </Box>

          {/* Preferences */}
          <Box px="modalPadding" py="md">
            <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">Preferences</Text>
            <Card variant="default" padding="sm" gap="md">
              <Box row justifyContent="space-between" alignItems="center">
                <Box>
                  <Text variant="base" color="text">Units</Text>
                  <Text variant="xs" color="textMuted">Measurement system</Text>
                </Box>
                <Box row gap="xs">
                  {['metric', 'imperial'].map(u => (
                    <Box
                      key={u}
                      onPress={() => setLocalUnits(u)}
                      paddingHorizontal="md"
                      paddingVertical="xs"
                      borderRadius="badge"
                      backgroundColor={localUnits === u ? colors.light.accent : colors.light.surface}
                      borderWidth={1}
                      borderColor={localUnits === u ? colors.light.accent : colors.light.border}
                    >
                      <Text variant="sm" weight="semibold" color={localUnits === u ? colors.light.onAccent : colors.light.text}>
                        {u.charAt(0).toUpperCase() + u.slice(1)}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Divider orientation="horizontal" />
              <Box row justifyContent="space-between" alignItems="center">
                <Box>
                  <Text variant="base" color="text">Theme</Text>
                  <Text variant="xs" color="textMuted">App appearance</Text>
                </Box>
                <Box row gap="xs">
                  {['light', 'dark', 'system'].map(t => (
                    <Box
                      key={t}
                      onPress={() => setLocalTheme(t)}
                      paddingHorizontal="md"
                      paddingVertical="xs"
                      borderRadius="badge"
                      backgroundColor={localTheme === t ? colors.light.accent : colors.light.surface}
                      borderWidth={1}
                      borderColor={localTheme === t ? colors.light.accent : colors.light.border}
                    >
                      <Text variant="sm" weight="semibold" color={localTheme === t ? colors.light.onAccent : colors.light.text}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Divider orientation="horizontal" />
              <Box row justifyContent="space-between" alignItems="center">
                <Box>
                  <Text variant="base" color="text">Notifications</Text>
                  <Text variant="xs" color="textMuted">Workout reminders & streak alerts</Text>
                </Box>
                <Box
                  onPress={() => setLocalNotifications(!localNotifications)}
                  width={52}
                  height={28}
                  borderRadius={14}
                  backgroundColor={localNotifications ? colors.light.accent : colors.light.border}
                  justifyContent="center"
                  paddingHorizontal={4}
                >
                  <Box
                    width={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor={colors.light.onAccent}
                    style={{ marginLeft: localNotifications ? 28 : 4 }}
                  />
                </Box>
              </Box>
              <Divider orientation="horizontal" />
              <Box row justifyContent="space-between" alignItems="center">
                <Box>
                  <Text variant="base" color="text">Haptic Feedback</Text>
                  <Text variant="xs" color="textMuted">Vibration on interactions</Text>
                </Box>
                <Box
                  onPress={() => setLocalHaptics(!localHaptics)}
                  width={52}
                  height={28}
                  borderRadius={14}
                  backgroundColor={localHaptics ? colors.light.accent : colors.light.border}
                  justifyContent="center"
                  paddingHorizontal={4}
                >
                  <Box
                    width={20}
                    height={20}
                    borderRadius={10}
                    backgroundColor={colors.light.onAccent}
                    style={{ marginLeft: localHaptics ? 28 : 4 }}
                  />
                </Box>
              </Box>
            </Card>
          </Box>

          {/* Danger Zone */}
          <Box px="modalPadding" py="md">
            <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">Danger Zone</Text>
            <Card variant="default" padding="sm" gap="md">
              <Button variant="danger" fullWidth onPress={() => { onClose(); onLogout(); }}>
                <Icon name="log-out" size="sm" mr="sm" />
                Log Out
              </Button>
              <Button variant="ghost" fullWidth onPress={() => Alert.alert('Delete account?', 'This cannot be undone.', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }])}>
                <Icon name="trash" size="sm" mr="sm" />
                Delete Account
              </Button>
            </Card>
          </Box>
        </ScrollView>
      </Box>
    </View>
  );
}

// ProgressCharts component
function ProgressCharts({ workouts, bodyStats }: { workouts: any[]; bodyStats: any[] }) {
  const { width } = Dimensions.get('window');
  const chartWidth = width - 32; // screenPadding * 2

  // Prepare volume data (last 8 weeks)
  const weeklyVolume = useMemo(() => {
    const weeks = new Map<string, number>();
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() - i * 7);
      const key = weekStart.toISOString().split('T')[0];
      weeks.set(key, 0);
    }

    workouts.forEach(w => {
      if (w.isCompleted && w.completedAt) {
        const date = new Date(w.completedAt);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const key = weekStart.toISOString().split('T')[0];
        if (weeks.has(key)) {
          weeks.set(key, (weeks.get(key) || 0) + (w.totalVolumeKg || 0));
        }
      }
    });

    return Array.from(weeks.entries()).map(([week, volume]) => ({
      week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      volume: Math.round(volume),
    }));
  }, [workouts]);

  // Prepare PR data (top exercises by max weight)
  const prData = useMemo(() => {
    const prMap = new Map<string, { weight: number; reps: number; date: Date }>();
    workouts.forEach(w => {
      if (w.isCompleted) {
        w.workoutExercises?.forEach((we: any) => {
          we.sets?.forEach((s: any) => {
            if (!s.isWarmup && s.weightKg > 0) {
              const exerciseName = we.exercise?.name || 'Unknown';
              const current = prMap.get(exerciseName);
              if (!current || s.weightKg > current.weight) {
                prMap.set(exerciseName, { weight: s.weightKg, reps: s.reps, date: new Date(w.completedAt || w.startedAt) });
              }
            }
          });
        });
    });

    return Array.from(prMap.entries())
      .sort((a, b) => b[1].weight - a[1].weight)
      .slice(0, 6)
      .map(([name, data]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        weight: data.weight,
      }));
  }, [workouts]);

  // Muscle group distribution
  const muscleDistribution = useMemo(() => {
    const dist = new Map<string, number>();
    workouts.forEach(w => {
      if (w.isCompleted) {
        w.workoutExercises?.forEach((we: any) => {
          const muscle = we.exercise?.muscleGroup || 'other';
          dist.set(muscle, (dist.get(muscle) || 0) + 1);
        });
      }
    });
    return Array.from(dist.entries()).map(([muscle, count]) => ({
      muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1),
      count,
    }));
  }, [workouts]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`, // xpGold
    labelColor: colors.light.textMuted,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: 6,
      strokeWidth: 2,
      stroke: '#f97316',
    },
  };

  if (workouts.length === 0) {
    return (
      <Card variant="default" padding="lg" center>
        <Icon name="bar-chart-2" size="xl" color="textMuted" mb="md" />
        <Text variant="base" weight="semibold" color="text" textAlign="center">
          No workout data yet
        </Text>
        <Text variant="sm" color="textMuted" textAlign="center" mt="sm">
          Complete workouts to see your progress charts
        </Text>
      </Card>
    );
  }

  return (
    <Box gap="lg">
      {/* Weekly Volume Chart */}
      <Card variant="default" padding="md">
        <Text variant="xl" weight="semibold" color="text" mb="md">
          Weekly Volume
        </Text>
        <Text variant="sm" color="textMuted" mb="md">
          Total kg lifted per week (last 8 weeks)
        </Text>
        <LineChart
          data={{
            labels: weeklyVolume.map(d => d.week),
            datasets: [{
              data: weeklyVolume.map(d => d.volume),
              ...chartConfig,
            }],
          }}
          width={Math.min(chartWidth, 400)}
          height={220}
          chartConfig={chartConfig}
          style={{ borderRadius: 16 }}
        />
      </Card>

      {/* PR Chart & Muscle Distribution */}
      <Box row gap="md" flexWrap="wrap">
        {/* Top PRs */}
        <Card variant="default" padding="md" flex={1} minWidth={280}>
          <Text variant="xl" weight="semibold" color="text" mb="md">
            Personal Records
          </Text>
          <BarChart
            data={{
              labels: prData.map(d => d.name),
              datasets: [{
                data: prData.map(d => d.weight),
                ...chartConfig,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // success green
              }],
            }}
            width={Math.max(280, 350)}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            }}
            style={{ borderRadius: 16 }}
          />
        </Card>

        {/* Muscle Group Distribution */}
        <Card variant="default" padding="md" flex={1} minWidth={280}>
          <Text variant="xl" weight="semibold" color="text" mb="md">
            Muscle Focus
          </Text>
          <PieChart
            data={{
              labels: muscleDistribution.map(d => d.muscle),
              datasets: [{
                data: muscleDistribution.map(d => d.count),
              }],
            }}
            width={Math.max(280, 350)}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.bg },
  scrollContent: { paddingBottom: spacing.layout.tabBarHeight + spacing.semantic.lg },
  header: { paddingBottom: spacing.semantic.xs },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 400,
  },
  modalContent: {
    backgroundColor: colors.light.surface,
    borderTopLeftRadius: radius.semantic.modal,
    borderTopRightRadius: radius.semantic.modal,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalScroll: { paddingBottom: spacing.semantic.xl },
  notificationUnread: { borderLeftWidth: 3, borderLeftColor: colors.light.accent },
});