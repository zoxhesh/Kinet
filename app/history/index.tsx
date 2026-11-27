/**
 * Workout History Screen (S07)
 * Calendar heatmap, list, charts, filters
 */

import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useWorkouts, useCurrentUser } from '@/hooks/useDatabase';
import {
  Box, Text, Button, Card, Badge, Divider, Icon, Chip,
} from '@/components/primitives';
import { colors, spacing, typography, radius, shadows } from '@/design/tokens';

export default function HistoryScreen() {
  const { user } = useCurrentUser();
  const { workouts } = useWorkouts({ userId: user?.id, isCompleted: true, order: 'desc' });

  const [filter, setFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filteredWorkouts = useMemo(() => {
    const now = new Date();
    let cutoff: Date;

    switch (filter) {
      case 'week':
        cutoff = new Date(now.getTime() - 7 * 86400000);
        break;
      case 'month':
        cutoff = new Date(now.getTime() - 30 * 86400000);
        break;
      case 'year':
        cutoff = new Date(now.getTime() - 365 * 86400000);
        break;
      default:
        return workouts;
    }
    return workouts.filter(w => new Date(w.startedAt) >= cutoff);
  }, [workouts, filter]);

  const renderWorkoutItem = ({ item }: { item: any }) => (
    <Card variant="interactive" style={styles.workoutCard} onPress={() => {}}>
      <Box row justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Box row alignItems="center" gap="sm" mb="xs">
            <Text variant="base" weight="semibold" color="text">
              {item.startedAt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
            <Text variant="xs" color="textMuted">
              {item.startedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </Box>
          <Text variant="sm" color="textMuted" mb="sm">
            {item.durationSec ? `${Math.floor(item.durationSec / 60)} min` : '—'}
          </Text>
          <Box row gap="sm" flexWrap="wrap" mb="sm">
            <Badge size="xs" color="accent">{item.totalSets} sets</Badge>
            <Badge size="xs" color="xpGold">{item.totalVolumeKg.toFixed(0)} kg</Badge>
            <Badge size="xs" color="success">{item.durationSec ? Math.floor(item.durationSec / 60) : 0} min</Badge>
          </Box>
          {item.notes && (
            <Text variant="xs" color="textMuted" numberOfLines={2}>
              {item.notes}
            </Text>
          )}
        </Box>
        <Box>
          <Icon name="chevron-right" size="md" color="textMuted" />
        </Box>
      </Box>
    </Card>
  );

  // Calendar heatmap data
  const heatmapData = useMemo(() => {
    const data: Record<string, number> = {};
    workouts.forEach(w => {
      const dateKey = w.startedAt.toISOString().split('T')[0];
      data[dateKey] = (data[dateKey] || 0) + 1;
    });
    return data;
  }, [workouts]);

  const getHeatmapColor = (count: number) => {
    if (count === 0) return colors.light.border;
    if (count === 1) return colors.light.accent + '33';
    if (count === 2) return colors.light.accent + '66';
    if (count === 3) return colors.light.accent + '99';
    return colors.light.accent;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Box px="screenPadding" py="md" style={styles.header}>
        <Text variant="display" weight="extrabold" color="text">
          History
        </Text>
        <Text variant="sm" color="textMuted">
          {workouts.length} workouts
        </Text>
      </Box>

      {/* Filters */}
      <Box px="screenPadding" pb="sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <Box row gap="sm">
            {['all', 'week', 'month', 'year'].map(f => (
              <FilterChip
                key={f}
                label={f.charAt(0).toUpperCase() + f.slice(1)}
                selected={filter === f}
                onPress={() => setFilter(f as any)}
              />
            ))}
          </Box>
        </ScrollView>
      </Box>

      <Box px="screenPadding" pb="sm" row justifyContent="space-between" alignItems="center">
        <Box row gap="sm">
          {['list', 'calendar'].map(v => (
            <ViewToggle
              key={v}
              label={v.charAt(0).toUpperCase() + v.slice(1)}
              selected={viewMode === v}
              onPress={() => setViewMode(v as any)}
            />
          ))}
        </Box>
        <Text variant="sm" color="textMuted">
          {filteredWorkouts.length} workouts
        </Text>
      </Box>

      <Divider orientation="horizontal" inset="screenPadding" mb="sm" />

      {/* Content */}
      <Box px="screenPadding" pb="xl">
        {viewMode === 'calendar' ? (
          <CalendarHeatmap data={heatmapData} getColor={getHeatmapColor} />
        ) : (
          filteredWorkouts.length === 0 ? (
            <Box center py="xl" px="lg">
              <Icon name="calendar" size="xl" color="textMuted" mb="md" />
              <Text variant="lg" weight="semibold" color="text" textAlign="center">
                No workouts found
              </Text>
              <Text variant="sm" color="textMuted" textAlign="center" mt="sm">
                {filter === 'all' ? 'Start your first workout!' : `Try a different time filter`}
              </Text>
            </Box>
          ) : (
            <FlatList
              data={filteredWorkouts}
              renderItem={renderWorkoutItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={() => (
                <Box center py="xl">
                  <Text variant="sm" color="textMuted">No workouts match your filter</Text>
                </Box>
              )}
            />
          )}
        )}
      </Box>
    </View>
  );
}

// Filter Chip
const FilterChip: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => (
  <Box
    onPress={onPress}
    paddingHorizontal="md"
    paddingVertical="xs"
    borderRadius="badge"
    backgroundColor={selected ? colors.light.accent : colors.light.surface}
    borderWidth={1}
    borderColor={selected ? colors.light.accent : colors.light.border}
  >
    <Text variant="sm" weight="semibold" color={selected ? colors.light.onAccent : colors.light.text}>
      {label}
    </Text>
  </Box>
);

// View Toggle
const ViewToggle: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, selected, onPress }) => (
  <Box
    onPress={onPress}
    paddingHorizontal="md"
    paddingVertical="xs"
    borderRadius="badge"
    backgroundColor={selected ? colors.light.accent : colors.light.surface}
    borderWidth={1}
    borderColor={selected ? colors.light.accent : colors.light.border}
  >
    <Text variant="sm" weight="semibold" color={selected ? colors.light.onAccent : colors.light.text}>
      {label}
    </Text>
  </Box>
);

// Calendar Heatmap
const CalendarHeatmap: React.FC<{
  data: Record<string, number>;
  getColor: (count: number) => string;
}> = ({ data, getColor }) => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);
  const daysInYear = new Date(today.getFullYear() + 1, 0, 1).getTime() - startDate.getTime();
  const totalDays = Math.floor(daysInYear / 86400000);

  const weeks: Array<Array<{ date: Date; count: number }>> = [];
  let currentWeek: Array<{ date: Date; count: number }> = [];

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate.getTime() + i * 86400000);
    const dateKey = date.toISOString().split('T')[0];
    const count = data[dateKey] || 0;

    currentWeek.push({ date, count });

    if (date.getDay() === 0 || i === totalDays - 1) {
      // Pad start of week
      while (currentWeek.length < 7) {
        currentWeek.unshift({ date: new Date(date.getTime() - (7 - currentWeek.length) * 86400000), count: -1 });
      }
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return (
    <Box style={styles.heatmap}>
      <Box row gap="xs" mb="sm" style={styles.heatmapLegend}>
        <Text variant="xs" color="textMuted" style={{ width: 30 }}>Less</Text>
        {[0, 1, 2, 3, 4].map((level) => (
          <Box
            key={level}
            width={12}
            height={12}
            borderRadius={2}
            backgroundColor={getColor(level)}
            style={{ marginHorizontal: 2 }}
          />
        ))}
        <Text variant="xs" color="textMuted">More</Text>
      </Box>
      <Box row gap={4} flexWrap="wrap" justifyContent="center">
        {weeks.map((week, w) => (
          <Box key={w} style={styles.heatmapWeek} flexDirection="column" gap={4}>
            {week.map((day, d) => (
              <Box
                key={d}
                width={12}
                height={12}
                borderRadius={2}
                backgroundColor={day.count === -1 ? 'transparent' : getColor(day.count)}
                style={day.date.toDateString() === new Date().toDateString() ? styles.heatmapToday : {}}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.bg },
  header: { paddingBottom: spacing.semantic.xs },
  filterScroll: { paddingHorizontal: spacing.semantic.screenPadding },
  listContent: { paddingBottom: spacing.layout.tabBarHeight + spacing.semantic.lg },
  workoutCard: { marginBottom: spacing.semantic.md },
  heatmap: { flex: 1 },
  heatmapLegend: { alignItems: 'center' },
  heatmapWeek: { flexDirection: 'column', gap: 4 },
  heatmapToday: { borderWidth: 2, borderColor: colors.light.accent },
});