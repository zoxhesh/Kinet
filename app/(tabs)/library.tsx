/**
 * Exercise Library Screen (S04)
 * Browse, search, filter exercises
 */

import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TextInput, FlatList } from 'react-native';
import { useExercises, useExerciseSearch } from '@/hooks/useDatabase';
import {
  Box, Text, Button, Card, Badge, Divider, Icon, Chip,
} from '@/components/primitives';
import { colors, spacing, typography, radius, shadows } from '@/design/tokens';

const MUSCLE_GROUPS = [
  'all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio',
];

const EQUIPMENT_TYPES = [
  'all', 'barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'band', 'other',
];

const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'];

export default function LibraryScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { exercises: allExercises } = useExercises();
  const { exercises: searchResults } = useExerciseSearch(searchTerm);

  const filteredExercises = useMemo(() => {
    let exercises = searchTerm ? searchResults : allExercises;

    if (selectedMuscle !== 'all') {
      exercises = exercises.filter(e => e.muscleGroup === selectedMuscle);
    }
    if (selectedEquipment !== 'all') {
      exercises = exercises.filter(e => e.equipment === selectedEquipment);
    }
    if (selectedDifficulty !== 'all') {
      exercises = exercises.filter(e => e.difficulty === selectedDifficulty);
    }

    return exercises;
  }, [allExercises, searchResults, searchTerm, selectedMuscle, selectedEquipment, selectedDifficulty]);

  const renderExerciseCard = ({ item }: { item: any }) => (
    <Card variant="interactive" style={styles.exerciseCard} onPress={() => {}}>
      {viewMode === 'grid' ? (
        <Box>
          <Box
            aspectRatio={1}
            backgroundColor={colors.light.accentMuted}
            borderRadius={radius.semantic.card}
            center
            mb="sm"
            overflow="hidden"
          >
            <Icon name="dumbbell" size="xl" color="accent" />
          </Box>
          <Text variant="sm" weight="semibold" color="text" numberOfLines={1}>
            {item.name}
          </Text>
          <Box row gap="xs" mt="xs" flexWrap="wrap">
            <Badge variant="dot" color={getMuscleColor(item.muscleGroup)} />
            <Text variant="xs" color="textMuted">
              {item.muscleGroupLabel}
            </Text>
            <Badge variant="dot" color="neutral" />
            <Text variant="xs" color="textMuted">
              {item.equipmentLabel}
            </Text>
            <Badge
              size="sm"
              color={getDifficultyColor(item.difficulty)}
            >
              {item.difficulty}
            </Badge>
          </Box>
        </Box>
      ) : (
        <Box row gap="md">
          <Box
            width={60}
            height={60}
            borderRadius={radius.semantic.card}
            backgroundColor={colors.light.accentMuted}
            center
          >
            <Icon name="dumbbell" size="lg" color="accent" />
          </Box>
          <Box flex={1}>
            <Text variant="base" weight="semibold" color="text">
              {item.name}
            </Text>
            <Box row gap="sm" mt="xs" flexWrap="wrap">
              <Text variant="xs" color="textMuted">
                {item.muscleGroupLabel} • {item.equipmentLabel}
              </Text>
              <Badge size="sm" color={getDifficultyColor(item.difficulty)}>
                {item.difficulty}
              </Badge>
            </Box>
          </Box>
          <Icon name="chevron-right" size="md" color="textMuted" />
        </Box>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Box px="screenPadding" py="md" style={styles.header}>
        <Text variant="display" weight="extrabold" color="text">
          Exercise Library
        </Text>
        <Text variant="sm" color="textMuted">
          {filteredExercises.length} exercises
        </Text>
      </Box>

      {/* Search */}
      <Box px="screenPadding" pb="md">
        <Box
          row
          alignItems="center"
          paddingHorizontal="md"
          paddingVertical="sm"
          backgroundColor={colors.light.surface}
          borderRadius={radius.semantic.input}
          borderWidth={1}
          borderColor={colors.light.borderInput}
        >
          <Icon name="search" size="md" color="textMuted" mr="sm" />
          <TextInput
            placeholder="Search exercises..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
            placeholderTextColor={colors.light.textMuted}
          />
          {searchTerm && (
            <IconButton
              name="x"
              onPress={() => setSearchTerm('')}
              size="sm"
              color="textMuted"
              accessibilityLabel="Clear search"
            />
          )}
        </Box>
      </Box>

      {/* Filters */}
      <Box px="screenPadding" pb="sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <Box row gap="sm">
            {MUSCLE_GROUPS.map(m => (
              <FilterChip
                key={m}
                label={m === 'all' ? 'All' : m.charAt(0).toUpperCase() + m.slice(1)}
                selected={selectedMuscle === m}
                onPress={() => setSelectedMuscle(m)}
              />
            ))}
          </Box>
        </ScrollView>
      </Box>

      <Box px="screenPadding" pb="sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <Box row gap="sm">
            {EQUIPMENT_TYPES.map(e => (
              <FilterChip
                key={e}
                label={e === 'all' ? 'All' : e.charAt(0).toUpperCase() + e.slice(1)}
                selected={selectedEquipment === e}
                onPress={() => setSelectedEquipment(e)}
              />
            ))}
          </Box>
        </ScrollView>
      </Box>

      <Divider orientation="horizontal" inset="screenPadding" mb="sm" />

      {/* View Mode Toggle */}
      <Box px="screenPadding" row justifyContent="space-between" alignItems="center" mb="sm">
        <Text variant="xl" weight="semibold" color="text">
          Exercises
        </Text>
        <Box row gap="xs">
          <IconButton
            name={viewMode === 'grid' ? 'grid-filled' : 'grid'}
            onPress={() => setViewMode('grid')}
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            accessibilityLabel="Grid view"
          />
          <IconButton
            name={viewMode === 'list' ? 'list-filled' : 'list'}
            onPress={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            accessibilityLabel="List view"
          />
        </Box>
      </Box>

      {/* Exercise List */}
      <Box px="screenPadding" pb="xl">
        {filteredExercises.length === 0 ? (
          <Box center py="xl" px="lg">
            <Icon name="search" size="xl" color="textMuted" mb="md" />
            <Text variant="lg" weight="semibold" color="text" textAlign="center">
              No exercises found
            </Text>
            <Text variant="sm" color="textMuted" textAlign="center" mt="sm">
              Try adjusting your filters or search term
            </Text>
          </Box>
        ) : (
          <FlatList
            data={filteredExercises}
            renderItem={renderExerciseCard}
            keyExtractor={item => item.id}
            numColumns={viewMode === 'grid' ? 2 : 1}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <Box center py="xl">
                <Text variant="sm" color="textMuted">No exercises match your filters</Text>
              </Box>
            )}
          />
        )}
      </Box>
    </View>
  );
}

// Filter Chip Component
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
    <Text
      variant="sm"
      weight="semibold"
      color={selected ? colors.light.onAccent : colors.light.text}
    >
      {label}
    </Text>
  </Box>
);

// Icon Button Component
const IconButton: React.FC<{
  name: string;
  onPress: () => void;
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md';
  accessibilityLabel: string;
}> = ({ name, onPress, variant = 'default', size = 'md', accessibilityLabel }) => (
  <Box
    onPress={onPress}
    padding={size === 'sm' ? 'xs' : 'sm'}
    borderRadius="full"
    backgroundColor={variant === 'default' ? colors.light.accent : 'transparent'}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
  >
    <Icon
      name={name}
      size={size}
      color={variant === 'default' ? colors.light.onAccent : colors.light.text}
    />
  </Box>
);

function getMuscleColor(muscle: string): keyof typeof colors.light {
  const map: Record<string, keyof typeof colors.light> = {
    chest: 'accent', back: 'success', legs: 'warning',
    shoulders: 'xpGold', arms: 'danger', core: 'accent', cardio: 'success',
  };
  return map[muscle] || 'accent';
}

function getDifficultyColor(difficulty: string): keyof typeof colors.light {
  const map: Record<string, keyof typeof colors.light> = {
    beginner: 'success', intermediate: 'warning', advanced: 'danger',
  };
  return map[difficulty] || 'accent';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.bg },
  header: { paddingBottom: spacing.semantic.xs },
  searchInput: { flex: 1, fontSize: 16, fontFamily: typography.fontFamilies.sans },
  filterScroll: { paddingHorizontal: spacing.semantic.screenPadding },
  columnWrapper: { justifyContent: 'space-between' },
  listContent: { paddingBottom: spacing.layout.tabBarHeight + spacing.semantic.lg },
  exerciseCard: { marginBottom: spacing.semantic.md },
});