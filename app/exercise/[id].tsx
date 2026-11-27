/**
 * Exercise Detail Screen (S05)
 * Instructions, video/GIF, sets/reps logging, previous logs
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { useExercises, useExercise, useWorkout, useWorkoutExercises, useSets } from '@/hooks/useDatabase';
import {
  Box, Text, Button, Card, Badge, ProgressRing, Divider, Icon, Chip,
} from '@/components/primitives';
import { colors, spacing, typography, radius, shadows, motion } from '@/design/tokens';
import { router } from 'expo-router';
import { Video } from 'expo-av';

interface ExerciseDetailProps {
  params: { id: string };
}

export default function ExerciseDetailScreen({ params }: ExerciseDetailProps) {
  const { id } = params;
  const { exercise } = useExercise(id);
  const { exercises } = useExercises();

  // Mock previous workout data
  const [previousSets, setPreviousSets] = useState<Array<{ reps: number; weight: number; rpe?: number; date: Date }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (exercise) {
      // TODO: Fetch actual previous sets from database
      // For now, mock data
      setPreviousSets([
        { reps: 10, weight: 60, rpe: 8, date: new Date(Date.now() - 86400000 * 3) },
        { reps: 8, weight: 65, rpe: 9, date: new Date(Date.now() - 86400000 * 10) },
        { reps: 12, weight: 55, rpe: 7, date: new Date(Date.now() - 86400000 * 17) },
      ]);
    }
  }, [exercise]);

  const handleAddToWorkout = () => {
    // Navigate to workout with this exercise pre-selected
    router.push('/(tabs)/workout?exercise=' + id);
  };

  const handleStartWorkout = () => {
    router.push('/(tabs)/workout?exercise=' + id);
  };

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Box center flex={1}>
          <Text variant="lg" color="textMuted">Loading...</Text>
        </Box>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Media - GIF/Video/Image */}
        <Box style={styles.hero}>
          {exercise.gif_url && (
            <Image
              source={{ uri: exercise.gif_url }}
              style={styles.heroMedia}
              resizeMode="cover"
            />
          )}
          {exercise.video_url && !exercise.gif_url && (
            <VideoPlayer videoUrl={exercise.video_url} style={styles.heroMedia} />
          )}
          {!exercise.gif_url && !exercise.video_url && (
            <Box style={[styles.heroMedia, { justifyContent: 'center', alignItems: 'center' }]}>
              <Icon name="dumbbell" size="xl" color="accent" />
            </Box>
          )}
        </Box>

        {/* Header Info */}
        <Box px="screenPadding" py="md">
          <Box row justifyContent="space-between" alignItems="flex-start" mb="sm">
            <Box>
              <Text variant="xs" weight="semibold" color="accent" textTransform="uppercase" letterSpacing={1} mb="xs">
                {exercise.muscleGroupLabel} • {exercise.equipmentLabel}
              </Text>
              <Text variant="3xl" weight="extrabold" color="text">
                {exercise.name}
              </Text>
            </Box>
            <Badge size="sm" color={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
          </Box>

          {/* Action Buttons */}
          <Box row gap="sm" mt="md">
            <Button variant="primary" size="md" flex={1} leftIcon={<Icon name="play" size="sm" />} onPress={handleStartWorkout}>
              Start Workout
            </Button>
            <Button variant="secondary" size="md" leftIcon={<Icon name="plus" size="sm" />} onPress={handleAddToWorkout}>
              Add to Workout
            </Button>
            <Button variant="ghost" size="md" onPress={() => Alert.alert('Replace exercise', 'Coming soon')}>
              <Icon name="rotate-ccw" size="sm" /> Replace
            </Button>
          </Box>
        </Box>

        {/* Video Player Card (if video but no GIF) */}
        {exercise.video_url && !exercise.gif_url && (
          <Box px="screenPadding" pb="md">
            <VideoPlayer videoUrl={exercise.video_url} style={styles.videoCard} />
          </Box>
        )}

        {/* Instructions */}
        <Box px="screenPadding" pb="md">
          <Text variant="xl" weight="semibold" color="text" mb="sm">
            Instructions
          </Text>
          <Card variant="default" padding="md">
            <Text variant="base" color="text" style={{ lineHeight: 24 }}>
              {exercise.instructions_md || 'No instructions available for this exercise.'}
            </Text>
          </Card>
        </Box>

        {/* Previous Sets */}
        {previousSets.length > 0 && (
          <Box px="screenPadding" pb="md">
            <Box row justifyContent="space-between" alignItems="center" mb="sm">
              <Text variant="xl" weight="semibold" color="text">
                Previous Sets
              </Text>
              <Text variant="sm" color="accent">View All →</Text>
            </Box>
            <Box gap="xs">
              {previousSets.slice(0, 5).map((set, i) => (
                <Card key={i} variant="default" padding="md" style={styles.setCard}>
                  <Box row justifyContent="space-between" alignItems="center">
                    <Box row gap="md" alignItems="center">
                      <Text variant="sm" weight="semibold" color="text">
                        Set {i + 1}
                      </Text>
                      <Text variant="base" weight="bold" color="text">
                        {set.reps} × {set.weight} kg
                      </Text>
                      {set.rpe && (
                        <Badge size="xs" color="xpGold">
                          RPE {set.rpe}
                        </Badge>
                      )}
                    </Box>
                    <Text variant="xs" color="textMuted">
                      {set.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Muscle Group Info */}
        <Box px="screenPadding" pb="xl">
          <Text variant="xl" weight="semibold" color="text" mb="sm">
            Target Muscles
          </Text>
          <Card variant="default" padding="md">
            <Box row gap="sm" flexWrap="wrap">
              <Badge color="accent">Primary: {exercise.muscleGroupLabel}</Badge>
              {exercise.muscle_group !== 'core' && (
                <Badge color="success">Secondary: Core stabilizers</Badge>
              )}
            </Box>
          </Card>
        </Box>
      </ScrollView>
    </View>
  );
}

// Video Player Component
function VideoPlayer({ videoUrl, style }: { videoUrl: string; style?: any }) {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const { status } = await Video.loadAsync(
          { uri: videoUrl },
          { shouldPlay: false, isLooping: false, progressUpdateIntervalMillis: 1000 }
        );
        setStatus(status);
      } catch (error) {
        console.error('Video load error:', error);
      }
    };
    loadVideo();

    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, [videoUrl]);

  const handlePlayPause = () => {
    if (!status) return;
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  if (!status) {
    return (
      <Box style={[styles.videoPlayer, style]} center>
        <Text variant="sm" color="textMuted">Loading video...</Text>
      </Box>
    );
  }

  const duration = status.durationMillis ? formatTime(status.durationMillis) : '--:--';
  const position = status.positionMillis ? formatTime(status.positionMillis) : '0:00';

  return (
    <Box style={[styles.videoPlayer, style]}>
      <Video
        ref={videoRef}
        style={styles.videoElement}
        useNativeControls={false}
        resizeMode="contain"
        shouldPlay={isPlaying}
        isLooping={false}
        onPlaybackStatusUpdate={setStatus}
        onError={(error) => console.error('Video error:', error)}
      />
      <Box style={styles.videoControls} row justifyContent="space-between" alignItems="center">
        <Box row alignItems="center" gap="sm">
          <Icon
            name={isPlaying ? 'pause' : 'play'}
            size="md"
            color="text"
            onPress={handlePlayPause}
          />
          <Text variant="sm" color="text">{position} / {duration}</Text>
        </Box>
        <Icon name="fullscreen" size="sm" color="textMuted" />
      </Box>
    </Box>
  );
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function ExerciseDetailScreen({ params }: ExerciseDetailProps) {
  const { id } = params;
  const { exercise } = useExercise(id);
  const { exercises } = useExercises();

  // Mock previous workout data
  const [previousSets, setPreviousSets] = useState<Array<{ reps: number; weight: number; rpe?: number; date: Date }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (exercise) {
      // TODO: Fetch actual previous sets from database
      // For now, mock data
      setPreviousSets([
        { reps: 10, weight: 60, rpe: 8, date: new Date(Date.now() - 86400000 * 3) },
        { reps: 8, weight: 65, rpe: 9, date: new Date(Date.now() - 86400000 * 10) },
        { reps: 12, weight: 55, rpe: 7, date: new Date(Date.now() - 86400000 * 17) },
      ]);
    }
  }, [exercise]);

  const handleAddToWorkout = () => {
    // Navigate to workout with this exercise pre-selected
    router.push('/(tabs)/workout?exercise=' + id);
  };

  const handleStartWorkout = () => {
    router.push('/(tabs)/workout?exercise=' + id);
  };

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Box center flex={1}>
          <Text variant="lg" color="textMuted">Loading...</Text>
        </Box>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Media - GIF/Video/Image */}
        <Box style={styles.hero}>
          {exercise.gif_url && (
            <Image
              source={{ uri: exercise.gif_url }}
              style={styles.heroMedia}
              resizeMode="cover"
            />
          )}
          {exercise.video_url && !exercise.gif_url && (
            <VideoPlayer videoUrl={exercise.video_url} style={styles.heroMedia} />
          )}
          {!exercise.gif_url && !exercise.video_url && (
            <Box style={[styles.heroMedia, { justifyContent: 'center', alignItems: 'center' }]}>
              <Icon name="dumbbell" size="xl" color="accent" />
            </Box>
          )}
        </Box>

        {/* Header Info */}
        <Box px="screenPadding" py="md">
          <Box row justifyContent="space-between" alignItems="flex-start" mb="sm">
            <Box>
              <Text variant="xs" weight="semibold" color="accent" textTransform="uppercase" letterSpacing={1} mb="xs">
                {exercise.muscleGroupLabel} • {exercise.equipmentLabel}
              </Text>
              <Text variant="3xl" weight="extrabold" color="text">
                {exercise.name}
              </Text>
            </Box>
            <Badge size="sm" color={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
          </Box>

          {/* Action Buttons */}
          <Box row gap="sm" mt="md">
            <Button variant="primary" size="md" flex={1} leftIcon={<Icon name="play" size="sm" />} onPress={handleStartWorkout}>
              Start Workout
            </Button>
            <Button variant="secondary" size="md" leftIcon={<Icon name="plus" size="sm" />} onPress={handleAddToWorkout}>
              Add to Workout
            </Button>
            <Button variant="ghost" size="md" onPress={() => Alert.alert('Replace exercise', 'Coming soon')}>
              <Icon name="rotate-ccw" size="sm" /> Replace
            </Button>
          </Box>
        </Box>

        {/* Video Player Card (if video but no GIF) */}
        {exercise.video_url && !exercise.gif_url && (
          <Box px="screenPadding" pb="md">
            <VideoPlayer videoUrl={exercise.video_url} style={styles.videoCard} />
          </Box>
        )}

        {/* Instructions */}
        <Box px="screenPadding" pb="md">
          <Text variant="xl" weight="semibold" color="text" mb="sm">
            Instructions
          </Text>
          <Card variant="default" padding="md">
            <Text variant="base" color="text" style={{ lineHeight: 24 }}>
              {exercise.instructions_md || 'No instructions available for this exercise.'}
            </Text>
          </Card>
        </Box>

        {/* Previous Sets */}
        {previousSets.length > 0 && (
          <Box px="screenPadding" pb="md">
            <Box row justifyContent="space-between" alignItems="center" mb="sm">
              <Text variant="xl" weight="semibold" color="text">
                Previous Sets
              </Text>
              <Text variant="sm" color="accent">View All →</Text>
            </Box>
            <Box gap="xs">
              {previousSets.slice(0, 5).map((set, i) => (
                <Card key={i} variant="default" padding="md" style={styles.setCard}>
                  <Box row justifyContent="space-between" alignItems="center">
                    <Box row gap="md" alignItems="center">
                      <Text variant="sm" weight="semibold" color="text">
                        Set {i + 1}
                      </Text>
                      <Text variant="base" weight="bold" color="text">
                        {set.reps} × {set.weight} kg
                      </Text>
                      {set.rpe && (
                        <Badge size="xs" color="xpGold">
                          RPE {set.rpe}
                        </Badge>
                      )}
                    </Box>
                    <Text variant="xs" color="textMuted">
                      {set.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* Muscle Group Info */}
        <Box px="screenPadding" pb="xl">
          <Text variant="xl" weight="semibold" color="text" mb="sm">
            Target Muscles
          </Text>
          <Card variant="default" padding="md">
            <Box row gap="sm" flexWrap="wrap">
              <Badge color="accent">Primary: {exercise.muscleGroupLabel}</Badge>
              {exercise.muscle_group !== 'core' && (
                <Badge color="success">Secondary: Core stabilizers</Badge>
              )}
            </Box>
          </Card>
        </Box>
      </ScrollView>
    </View>
  );
}

function getDifficultyColor(difficulty: string): keyof typeof colors.light {
  const map: Record<string, keyof typeof colors.light> = {
    beginner: 'success', intermediate: 'warning', advanced: 'danger',
  };
  return map[difficulty] || 'accent';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.bg },
  scrollContent: { paddingBottom: spacing.semantic.xl },
  hero: {
    height: 280,
    backgroundColor: colors.light.surface,
    borderBottomLeftRadius: radius.semantic.card,
    borderBottomRightRadius: radius.semantic.card,
    overflow: 'hidden',
  },
  heroMedia: {
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.light.surface,
    borderRadius: radius.semantic.card,
    overflow: 'hidden',
  },
  videoElement: {
    width: '100%',
    height: '100%',
  },
  videoControls: {
    padding: spacing.semantic.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  videoCard: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.light.surface,
    borderRadius: radius.semantic.card,
    overflow: 'hidden',
  },
  setCard: { backgroundColor: colors.light.surface },
});