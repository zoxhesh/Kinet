/**
 * Home Screen (S03)
 * Dashboard with daily rings, quick actions, today's workout
 */

import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useAuth, useCurrentUser } from '@/hooks/useDatabase';
import {
  Box, Text, Button, Card, ProgressRing, StatCard, Divider,
} from '@/components/primitives';
import { colors, spacing, typography, radius, shadows, motion } from '@/design/tokens';
import { Icon } from '@/components/primitives';

export default function HomeScreen() {
  const { user } = useCurrentUser();
  const { refreshUser } = useAuth();

  const handleRefresh = async () => {
    await refreshUser();
  };

  // Mock data for now
  const todayWorkout = {
    name: 'Push Day',
    exercises: 5,
    estimatedTime: '45 min',
  };

  const weeklyStats = [
    { label: 'Workouts', value: '4', trend: '+1' },
    { label: 'Volume', value: '12,450 kg', trend: '+12%' },
    { label: 'Time', value: '3h 20m', trend: '+45m' },
    { label: 'PRs', value: '2', trend: '+2' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Box px="screenPadding" py="md" row justifyContent="space-between" alignItems="center">
          <Box>
            <Text variant="display" weight="extrabold" color="text">
              Good morning{user ? `, ${user.displayName}` : ''} ☀️
            </Text>
            <Text variant="sm" color="textMuted">
              Ready to crush it today?
            </Text>
          </Box>
          <Box
            onPress={() => {}}
            padding="sm"
            borderRadius="full"
            backgroundColor={colors.light.accentMuted}
          >
            <Icon name="bell" size="md" color="accent" />
          </Box>
        </Box>

        {/* Progress Rings */}
        <Box px="screenPadding" pb="md">
          <Text variant="xl" weight="semibold" color="text" mb="sm">
            Today's Progress
          </Text>
          <Box row justifyContent="space-around" py="md">
            <Box center gap="xs">
              <ProgressRing
                progress={0.65}
                size="large"
                color="accent"
                label="65%"
                showLabel
              />
              <Text variant="sm" weight="semibold" color="text">
                Workout
              </Text>
              <Text variant="xs" color="textMuted">
                3 of 5 sets
              </Text>
            </Box>
            <Box center gap="xs">
              <ProgressRing
                progress={0.8}
                size="large"
                color="success"
                label="80%"
                showLabel
              />
              <Text variant="sm" weight="semibold" color="text">
                Streak
              </Text>
              <Text variant="xs" color="textMuted">
                12 days
              </Text>
            </Box>
            <Box center gap="xs">
              <ProgressRing
                progress={0.45}
                size="large"
                color="xpGold"
                label="45%"
                showLabel
              />
              <Text variant="sm" weight="semibold" color="text">
                Level Up
              </Text>
              <Text variant="xs" color="textMuted">
                1,250 / 2,000 XP
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Today's Workout */}
        <Box px="screenPadding" pb="md">
          <Box row justifyContent="space-between" alignItems="center" mb="sm">
            <Text variant="xl" weight="semibold" color="text">
              Today's Workout
            </Text>
            <Text variant="sm" color="accent">View Plan →</Text>
          </Box>
          <Card variant="elevated" onPress={() => {}}>
            <Box row justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Text variant="lg" weight="semibold" color="text">
                  {todayWorkout.name}
                </Text>
                <Box row gap="md" mt="xs">
                  <Box row center gap="xs">
                    <Icon name="dumbbell" size="sm" color="textMuted" />
                    <Text variant="sm" color="textMuted">
                      {todayWorkout.exercises} exercises
                    </Text>
                  </Box>
                  <Box row center gap="xs">
                    <Icon name="clock" size="sm" color="textMuted" />
                    <Text variant="sm" color="textMuted">
                      {todayWorkout.estimatedTime}
                    </Text>
                  </Box>
                </Box>
              </Box>
              <Box
                px="md"
                py="sm"
                borderRadius="badge"
                backgroundColor={colors.light.accentMuted}
              >
                <Text variant="sm" weight="semibold" color="accent">
                  Start
                </Text>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Box px="screenPadding" pb="md">
          <Text variant="xl" weight="semibold" color="text" mb="sm">
            Quick Actions
          </Text>
          <Box row gap="sm" flexWrap="wrap">
            <Button variant="secondary" size="sm" leftIcon={<Icon name="plus" size="sm" />}>
              Log Workout
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Icon name="book-open" size="sm" />}>
              Exercise Library
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Icon name="timer" size="sm" />}>
              Rest Timer
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Icon name="calculator" size="sm" />}>
              Plate Calc
            </Button>
          </Box>
        </Box>

        {/* Weekly Stats */}
        <Box px="screenPadding" pb="md">
          <Text variant="xl" weight="semibold" color="text" mb="sm">
            This Week
          </Text>
          <Box row gap="sm" flex={1}>
            {weeklyStats.map((stat, i) => (
              <Card key={i} variant="default" flex={1} padding="md" center>
                <Text variant="2xl" weight="bold" color="accent">
                  {stat.value}
                </Text>
                <Text variant="xs" color="textMuted" mb="xs">
                  {stat.label}
                </Text>
                <Text variant="xs" color="success" weight="semibold">
                  {stat.trend}
                </Text>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Recent Achievements */}
        <Box px="screenPadding" pb="xl">
          <Box row justifyContent="space-between" alignItems="center" mb="sm">
            <Text variant="xl" weight="semibold" color="text">
              Recent Achievements
            </Text>
            <Text variant="sm" color="accent">View All →</Text>
          </Box>
          <Box row gap="sm" pb="sm">
            {[
              { icon: 'trophy', label: 'First Steps', color: 'xpGold', unlocked: true },
              { icon: 'flame', label: 'Week Warrior', color: 'streakFire', unlocked: true },
              { icon: 'star', label: 'New Record', color: 'accent', unlocked: false },
            ].map((ach, i) => (
              <Card key={i} variant={ach.unlocked ? 'elevated' : 'default'} padding="md" center minWidth={100} opacity={ach.unlocked ? 1 : 0.5}>
                <Box
                  width={48}
                  height={48}
                  borderRadius="full"
                  backgroundColor={colors.light[ach.color + 'Muted' as keyof typeof colors.light]}
                  center
                  mb="sm"
                >
                  <Icon name={ach.icon} size="lg" color={ach.color} />
                </Box>
                <Text variant="xs" weight="semibold" color={ach.unlocked ? 'text' : 'textMuted'} textAlign="center">
                  {ach.label}
                </Text>
              </Card>
            ))}
          </Box>
        </Box>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  scrollContent: {
    paddingBottom: spacing.layout.tabBarHeight + spacing.semantic.lg,
  },
});