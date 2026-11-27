/**
 * Onboarding Screen (S01)
 * Welcome flow, permissions, account creation
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth, useCurrentUser } from '@/hooks/useDatabase';
import {
  Box, Text, Button, ProgressRing, Icon, Avatar,
} from '@/components/primitives';
import { colors, spacing, typography, radius, motion } from '@/design/tokens';
import { router } from 'expo-router';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Kinet',
    subtitle: 'Your personal fitness RPG — track workouts, level up, and build habits.',
    icon: 'dumbbell',
    color: 'accent',
  },
  {
    id: 'features',
    title: 'Track Everything',
    subtitle: 'Log sets, reps, weight. See progress with charts, heatmaps, and personal records.',
    icon: 'bar-chart',
    color: 'success',
  },
  {
    id: 'gamify',
    title: 'Level Up Your Life',
    subtitle: 'Earn XP, unlock 50+ achievements, maintain streaks. Every rep counts.',
    icon: 'trophy',
    color: 'xpGold',
  },
  {
    id: 'free',
    title: 'Completely Free',
    subtitle: 'No paywalls, no subscriptions, no ads. All features unlocked forever.',
    icon: 'gift',
    color: 'warning',
  },
];

export default function OnboardingScreen() {
  const { user } = useCurrentUser();
  const { signup, isLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    // Skip to auth
    router.replace('/(auth)');
  };

  const handleCreateAccount = async () => {
    if (!username.trim() || !email.trim() || !password) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }
    try {
      await signup(email, password, username);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create account');
    }
  };

  const currentStepData = ONBOARDING_STEPS[step];
  const isLastStep = step === ONBOARDING_STEPS.length - 1;
  const isAuthStep = step === ONBOARDING_STEPS.length; // After feature steps

  if (user) {
    // Already logged in, redirect
    React.useEffect(() => {
      router.replace('/(tabs)');
    }, []);
    return null;
  }

  return (
    <View style={styles.container}>
      <Box flex={1} style={styles.content}>
        {/* Progress Indicator */}
        <Box px="screenPadding" pt="xl" pb="md" row justifyContent="center" gap="xs">
          {ONBOARDING_STEPS.map((_, i) => (
            <Box
              key={i}
              width={i <= step ? 24 : 8}
              height={8}
              borderRadius={4}
              backgroundColor={i <= step ? colors.light.accent : colors.light.border}
              style={i === step ? { transition: 'width 300ms ease-out' } : {}}
            />
          ))}
        </Box>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isAuthStep ? (
            // Account Creation Form
            <Box px="screenPadding" py="xl" center gap="lg">
              <Icon name="user-plus" size="xl" color="accent" />
              <Text variant="display" weight="extrabold" color="text" textAlign="center">
                Create Your Account
              </Text>
              <Text variant="base" color="textMuted" textAlign="center">
                Start tracking your fitness journey
              </Text>

              <Card variant="elevated" padding="lg" width="100%" gap="md">
                <Box gap="xs">
                  <Text variant="sm" weight="semibold" color="text">Username</Text>
                  <Text
                    variant="xs"
                    color="textMuted"
                  >
                    How others will see you
                  </Text>
                  <Input
                    variant="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </Box>

                <Box gap="xs">
                  <Text variant="sm" weight="semibold" color="text">Email</Text>
                  <Input
                    variant="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </Box>

                <Box gap="xs">
                  <Text variant="sm" weight="semibold" color="text">Password</Text>
                  <Input
                    variant="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    secureTextEntry
                  />
                </Box>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={handleCreateAccount}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Create Account
                </Button>

                <Button variant="ghost" size="sm" onPress={() => router.push('/(auth)/login')}>
                  Already have an account? Sign in
                </Button>
              </Card>
            </Box>
          ) : (
            // Feature Steps
            <Box px="screenPadding" py="xl" center gap="xl">
              <Box
                width={120}
                height={120}
                borderRadius="full"
                backgroundColor={colors.light[currentStepData.color + 'Muted' as keyof typeof colors.light]}
                center
              >
                <Icon name={currentStepData.icon} size="xl" color={currentStepData.color} />
              </Box>

              <Box alignItems="center" gap="sm">
                <Text variant="2xl" weight="extrabold" color="text" textAlign="center">
                  {currentStepData.title}
                </Text>
                <Text variant="lg" color="textMuted" textAlign="center" lineHeight={28}>
                  {currentStepData.subtitle}
                </Text>
              </Box>

              {/* Skip button */}
              {!isLastStep && (
                <Button variant="ghost" size="sm" onPress={handleSkip}>
                  Skip
                </Button>
              )}
            </Box>
          )}

          {/* Bottom Navigation */}
          <Box px="screenPadding" py="lg" style={styles.bottomNav}>
            {isAuthStep ? null : (
              <Box row justifyContent="space-between" width="100%">
                <Button
                  variant="ghost"
                  size="md"
                  onPress={step > 0 ? () => setStep(step - 1) : handleSkip}
                  disabled={step === 0}
                >
                  <Icon name="chevron-left" size="sm" mr="xs" />
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onPress={isLastStep ? () => setStep(step + 1) : handleNext}
                >
                  {isLastStep ? 'Get Started' : 'Next'}
                  <Icon name="chevron-right" size="sm" ml="xs" />
                </Button>
              </Box>
            )}
          </Box>
        </ScrollView>
      </Box>
    </View>
  );
}

import { Input } from '@/components/primitives';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.bg },
  content: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.semantic.xl + 100 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0 },
});