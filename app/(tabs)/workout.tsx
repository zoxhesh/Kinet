/**
 * Workout Screen (S05, S06)
 * Exercise detail, active workout session, set logging
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { useAuth, useCurrentUser, useExercises, useActiveWorkout, useWorkoutExercises, useSets } from '@/hooks/useDatabase';
import {
  Box, Text, Button, Card, ProgressRing, Timer, Badge, Divider, Icon, Chip,
} from '@/components/primitives';
import { colors, spacing, typography, radius, shadows, motion } from '@/design/tokens';

type WorkoutPhase = 'select' | 'active' | 'rest' | 'complete';

export default function WorkoutScreen() {
  const { user } = useCurrentUser();
  const { exercises } = useExercises();
  const { workout: activeWorkout } = useActiveWorkout(user?.id || '');
  const [phase, setPhase] = useState<WorkoutPhase>('select');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restTime, setRestTime] = useState(90);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);

  const currentExercise = selectedExercises[currentExerciseIndex];
  const exerciseData = exercises.find(e => e.id === currentExercise);

  // Rest timer effect
  useEffect(() => {
    if (!isRestTimerRunning || restTime <= 0) return;
    const interval = setInterval(() => {
      setRestTime(t => {
        if (t <= 1) {
          setIsRestTimerRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRestTimerRunning, restTime]);

  const handleStartWorkout = () => {
    if (selectedExercises.length === 0) {
      Alert.alert('No Exercises', 'Please select at least one exercise');
      return;
    }
    setPhase('active');
    setCurrentExerciseIndex(0);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < selectedExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setPhase('complete');
    }
  };

  const handleLogSet = async (reps: number, weight: number, rpe?: number) => {
    // TODO: Save to database
    console.log('Log set:', { reps, weight, rpe });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (phase === 'select') {
    return (
      <View style={styles.container}>
        <Box px="screenPadding" py="md" style={styles.header}>
          <Text variant="display" weight="extrabold" color="text">
            New Workout
          </Text>
          <Text variant="sm" color="textMuted">
            Select exercises for your session
          </Text>
        </Box>

        <Box px="screenPadding" pb="md">
          <TextInput
            placeholder="Search exercises..."
            style={styles.searchInput}
            placeholderTextColor={colors.light.textMuted}
          />
        </Box>

        <Box px="screenPadding" pb="sm">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <Box row gap="sm">
              {['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core'].map(m => (
                <Box
                  key={m}
                  onPress={() => {}}
                  paddingHorizontal="md"
                  paddingVertical="xs"
                  borderRadius="badge"
                  backgroundColor={colors.light.surface}
                  borderWidth={1}
                  borderColor={colors.light.border}
                >
                  <Text variant="sm" weight="semibold" color="text">
                    {m === 'all' ? 'All' : m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </Box>
              ))}
            </Box>
          </ScrollView>
        </Box>

        <Divider orientation="horizontal" inset="screenPadding" mb="sm" />

        <Box px="screenPadding" pb="xl">
          <FlatList
            data={exercises}
            renderItem={({ item }) => (
              <Box
                onPress={() => {
                  setSelectedExercises(prev =>
                    prev.includes(item.id)
                      ? prev.filter(id => id !== item.id)
                      : [...prev, item.id]
                  );
                }}
                style={[
                  styles.exerciseSelectCard,
                  selectedExercises.includes(item.id) && styles.exerciseSelectCardSelected,
                ]}
              >
                <Box row alignItems="center" gap="md">
                  <Box
                    width={24}
                    height={24}
                    borderRadius={radius.semantic.button}
                    borderWidth={2}
                    borderColor={selectedExercises.includes(item.id) ? colors.light.accent : colors.light.border}
                    backgroundColor={selectedExercises.includes(item.id) ? colors.light.accent : 'transparent'}
                    center
                  >
                    {selectedExercises.includes(item.id) && (
                      <Icon name="check" size="xs" color={colors.light.onAccent} />
                    )}
                  </Box>
                  <Box flex={1}>
                    <Text variant="base" weight="semibold" color="text">
                      {item.name}
                    </Text>
                    <Box row gap="sm" mt="xs">
                      <Badge size="xs" color={getMuscleColor(item.muscleGroup)}>
                        {item.muscleGroupLabel}
                      </Badge>
                      <Text variant="xs" color="textMuted">•</Text>
                      <Text variant="xs" color="textMuted">
                        {item.equipmentLabel}
                      </Text>
                      <Badge size="xs" color={getDifficultyColor(item.difficulty)}>
                        {item.difficulty}
                      </Badge>
                    </Box>
                  </Box>
                  <Text variant="sm" color="textMuted">
                    {selectedExercises.indexOf(item.id) + 1}
                  </Text>
                </Box>
              </Box>
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Box center py="xl">
                <Icon name="search" size="xl" color="textMuted" mb="md" />
                <Text variant="lg" weight="semibold" color="text">No exercises</Text>
                <Text variant="sm" color="textMuted">Add exercises to get started</Text>
              </Box>
            }
          />
        </Box>

        {/* Start Button */}
        <Box px="screenPadding" style={styles.bottomBar}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleStartWorkout}
            disabled={selectedExercises.length === 0}
          >
            Start Workout ({selectedExercises.length})
          </Button>
        </Box>
      </View>
    );
  }

  if (phase === 'active') {
    if (!exerciseData) return null;

    return (
      <View style={styles.container}>
        {/* Exercise Header */}
        <Box px="screenPadding" py="md" style={styles.header}>
          <Box row justifyContent="space-between" alignItems="center">
            <Box>
              <Text variant="sm" color="textMuted">
                Exercise {currentExerciseIndex + 1} of {selectedExercises.length}
              </Text>
              <Text variant="xl" weight="semibold" color="text">
                {exerciseData.name}
              </Text>
            </Box>
            <Button variant="ghost" size="sm" onPress={() => setPhase('select')}>
              <Icon name="x" size="sm" />
            </Button>
          </Box>
        </Box>

        {/* Exercise Info */}
        <Box px="screenPadding" pb="md">
          <Box row gap="sm" flexWrap="wrap">
            <Badge color={getMuscleColor(exerciseData.muscleGroup)}>
              {exerciseData.muscleGroupLabel}
            </Badge>
            <Badge color="neutral">
              {exerciseData.equipmentLabel}
            </Badge>
            <Badge size="sm" color={getDifficultyColor(exerciseData.difficulty)}>
              {exerciseData.difficulty}
            </Badge>
          </Box>
        </Box>

        {/* Set Logger */}
        <Box px="screenPadding" pb="md">
          <Text variant="lg" weight="semibold" color="text" mb="sm">
            Sets
          </Text>
          <SetLogger
            exerciseId={exerciseData.id}
            onLogSet={handleLogSet}
          />
        </Box>

        {/* Rest Timer */}
        <Box px="screenPadding" pb="md">
          <Divider orientation="horizontal" mb="sm" />
          <Box row justifyContent="space-between" alignItems="center" mb="sm">
            <Text variant="lg" weight="semibold" color="text">
              Rest Timer
            </Text>
            <Badge color="success">{formatTime(restTime)}</Badge>
          </Box>
          <Box row gap="sm">
            <Button
              variant={isRestTimerRunning ? 'secondary' : 'primary'}
              size="md"
              fullWidth
              onPress={() => setIsRestTimerRunning(!isRestTimerRunning)}
            >
              {isRestTimerRunning ? 'Pause' : 'Start Rest'}
            </Button>
            <Button variant="ghost" size="md" onPress={() => setRestTime(90)}>
              Reset
            </Button>
          </Box>
          <Box row gap="sm" mt="sm">
            {[60, 90, 120, 180].map(t => (
              <Button
                key={t}
                variant="ghost"
                size="sm"
                onPress={() => setRestTime(t)}
              >
                {t}s
              </Button>
            ))}
          </Box>
        </Box>

        {/* Navigation */}
        <Box px="screenPadding" style={styles.bottomBar}>
          <Box row gap="sm">
            <Button variant="secondary" size="lg" flex={1} onPress={() => handleNextExercise()}>
              Next Exercise
            </Button>
            <Button variant="danger" size="lg" onPress={() => setPhase('complete')}>
              Finish
            </Button>
          </Box>
        </Box>
      </View>
    );
  }

  if (phase === 'complete') {
    return (
      <View style={styles.container}>
        <Box center flex={1} px="screenPadding" gap="lg">
          <Icon name="trophy" size="xl" color="xpGold" />
          <Text variant="display" weight="extrabold" color="text" textAlign="center">
            Workout Complete! 🎉
          </Text>
          <Text variant="lg" color="textMuted" textAlign="center">
            Great job! You crushed {selectedExercises.length} exercises.
          </Text>
          <Box row gap="sm">
            <Button variant="primary" size="lg" onPress={() => { setPhase('select'); setSelectedExercises([]); }}>
              New Workout
            </Button>
            <Button variant="secondary" size="lg" onPress={() => { setPhase('select'); setSelectedExercises([]); }}>
              Done
            </Button>
          </Box>
        </Box>
      </View>
    );
  }

  return null;
}

// Set Logger Component
const SetLogger: React.FC<{
  exerciseId: string;
  onLogSet: (reps: number, weight: number, rpe?: number) => void;
}> = ({ exerciseId, onLogSet }) => {
  const [sets, setSets] = useState<Array<{ reps: string; weight: string; rpe: string; isWarmup: boolean }>>([
    { reps: '', weight: '', rpe: '', isWarmup: false },
  ]);

  const addSet = () => setSets(prev => [...prev, { reps: '', weight: '', rpe: '', isWarmup: false }]);
  const removeSet = (index: number) => setSets(prev => prev.filter((_, i) => i !== index));

  return (
    <Box gap="sm">
      {sets.map((set, index) => (
        <Card key={index} variant="default" padding="sm" style={styles.setCard}>
          <Box row gap="sm" alignItems="flex-end" flexWrap="wrap">
            <Box flex={1} minWidth={80}>
              <Text variant="xs" color="textMuted" mb="xs">Set {index + 1}</Text>
              <TextInput
                placeholder="Reps"
                value={set.reps}
                onChangeText={v => setSets(prev => prev.map((s, i) => i === index ? { ...s, reps: v } : s))}
                style={[styles.setInput, { textAlign: 'center' }]}
                keyboardType="numeric"
              />
            </Box>
            <Box flex={1} minWidth={80}>
              <Text variant="xs" color="textMuted" mb="xs">Weight (kg)</Text>
              <TextInput
                placeholder="0"
                value={set.weight}
                onChangeText={v => setSets(prev => prev.map((s, i) => i === index ? { ...s, weight: v } : s))}
                style={[styles.setInput, { textAlign: 'center' }]}
                keyboardType="decimal-pad"
              />
            </Box>
            <Box minWidth={70}>
              <Text variant="xs" color="textMuted" mb="xs">RPE</Text>
              <TextInput
                placeholder="—"
                value={set.rpe}
                onChangeText={v => setSets(prev => prev.map((s, i) => i === index ? { ...s, rpe: v } : s))}
                style={[styles.setInput, { textAlign: 'center' }]}
                keyboardType="numeric"
              />
            </Box>
            <Box>
              <Box row alignItems="center" gap="xs">
                <Text variant="xs" color="textMuted">Warmup</Text>
                <Box
                  onPress={() => setSets(prev => prev.map((s, i) => i === index ? { ...s, isWarmup: !s.isWarmup } : s))}
                  width={24}
                  height={24}
                  borderRadius={radius.semantic.button}
                  borderWidth={2}
                  borderColor={set.isWarmup ? colors.light.xpGold : colors.light.border}
                  backgroundColor={set.isWarmup ? colors.light.xpGold : 'transparent'}
                  center
                >
                  {set.isWarmup && <Icon name="check" size="xs" color={colors.light.onAccent} />}
                </Box>
              </Box>
            </Box>
            {sets.length > 1 && (
              <Box onPress={() => removeSet(index)} padding="xs" borderRadius="full" backgroundColor={colors.light.dangerMuted}>
                <Icon name="trash" size="xs" color="danger" />
              </Box>
            )}
          </Box>
        </Card>
      ))}
      {sets.length < 10 && (
        <Button variant="ghost" size="sm" leftIcon={<Icon name="plus" size="sm" />} onPress={addSet}>
          Add Set
        </Button>
      )}
    </Box>
  );
};

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
  exerciseSelectCard: {
    padding: spacing.semantic.md,
    backgroundColor: colors.light.surface,
    borderRadius: radius.semantic.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: spacing.semantic.sm,
  },
  exerciseSelectCardSelected: {
    borderColor: colors.light.accent,
    borderWidth: 2,
    backgroundColor: colors.light.accentMuted,
  },
  setCard: { padding: spacing.semantic.md },
  setInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.light.borderInput,
    borderRadius: radius.semantic.input,
    backgroundColor: colors.light.surface,
    fontSize: 16,
    fontFamily: typography.fontFamilies.sans,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.semantic.md,
    paddingBottom: spacing.semantic.lg + spacing.layout.tabBarHeight,
    backgroundColor: colors.light.bg,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
});