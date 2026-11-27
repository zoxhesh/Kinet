/**
 * Signup Screen (S02)
 * Email/password registration, username
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/hooks/useDatabase';
import {
  Box, Text, Button, Input, Divider, Icon,
} from '@/components/primitives';
import { colors, spacing, typography, radius, motion } from '@/design/tokens';
import { router } from 'expo-router';

export default function SignupScreen() {
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signup(email, password, username);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'apple') => {
    Alert.alert(`${provider} signup`, 'Coming soon with Supabase Auth');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Box px="screenPadding" py="xl" center gap="lg">
          <Icon name="user-plus" size="xl" color="accent" />
          <Text variant="display" weight="extrabold" color="text" textAlign="center">
            Create Account
          </Text>
          <Text variant="base" color="textMuted" textAlign="center">
            Start your fitness journey today
          </Text>
        </Box>

        <Card variant="elevated" style={styles.formCard} padding="xl" gap="lg">
          {error && (
            <Box
              row
              alignItems="center"
              gap="sm"
              padding="md"
              backgroundColor={colors.light.dangerMuted}
              borderRadius={radius.semantic.input}
              mb="md"
            >
              <Icon name="alert-circle" size="sm" color="danger" />
              <Text variant="sm" color="danger" flex={1}>{error}</Text>
            </Box>
          )}

          <Box gap="md">
            <Box gap="xs">
              <Text variant="sm" weight="semibold" color="text">Username</Text>
              <Text variant="xs" color="textMuted">How others will see you</Text>
              <Input
                variant="text"
                placeholder="Enter username"
                value={username}
                onChange={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
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
                textContentType="email"
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
                textContentType="newPassword"
              />
            </Box>

            <Box gap="xs">
              <Text variant="sm" weight="semibold" color="text">Confirm Password</Text>
              <Input
                variant="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={setConfirmPassword}
                secureTextEntry
                textContentType="newPassword"
              />
            </Box>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleSignup}
              disabled={isLoading}
              loading={isLoading}
            >
              Create Account
            </Button>
          </Box>

          <Divider orientation="horizontal" children="or continue with" mb="lg" />

          <Box row gap="sm">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              leftIcon={<Icon name="chrome" size="sm" />}
              onPress={() => handleSocialSignup('google')}
            >
              Google
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              leftIcon={<Icon name="apple" size="sm" />}
              onPress={() => handleSocialSignup('apple')}
            >
              Apple
            </Button>
          </Box>

          <Box center mt="lg">
            <Text variant="sm" color="textMuted">
              Already have an account?{' '}
            </Text>
            <Button variant="ghost" size="sm" onPress={() => router.push('/auth/login')}>
              Sign In
            </Button>
          </Box>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.bg },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.semantic.xl, paddingHorizontal: spacing.semantic.screenPadding },
  formCard: { width: '100%' },
});