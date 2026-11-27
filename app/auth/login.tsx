/**
 * Login Screen (S02)
 * Email/password login, social auth
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/hooks/useDatabase';
import {
  Box, Text, Button, Input, Divider, Icon,
} from '@/components/primitives';
import { colors, spacing, typography, radius, motion } from '@/design/tokens';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    // TODO: Implement Supabase OAuth
    Alert.alert(`${provider} login`, 'Coming soon with Supabase Auth');
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
          <Icon name="dumbbell" size="xl" color="accent" />
          <Text variant="display" weight="extrabold" color="text" textAlign="center">
            Welcome Back
          </Text>
          <Text variant="base" color="textMuted" textAlign="center">
            Sign in to continue your fitness journey
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
              <Box row justifyContent="space-between" alignItems="center">
                <Text variant="sm" weight="semibold" color="text">Password</Text>
                <Text variant="xs" color="accent" onPress={() => router.push('/auth/forgot-password')}>
                  Forgot?
                </Text>
              </Box>
              <Input
                variant="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                secureTextEntry
                textContentType="password"
              />
            </Box>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
            >
              Sign In
            </Button>
          </Box>

          <Divider orientation="horizontal" children="or continue with" mb="lg" />

          <Box row gap="sm">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              leftIcon={<Icon name="chrome" size="sm" />}
              onPress={() => handleSocialLogin('google')}
            >
              Google
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              leftIcon={<Icon name="apple" size="sm" />}
              onPress={() => handleSocialLogin('apple')}
            >
              Apple
            </Button>
          </Box>

          <Box center mt="lg">
            <Text variant="sm" color="textMuted">
              Don't have an account?{' '}
            </Text>
            <Button variant="ghost" size="sm" onPress={() => router.push('/auth/signup')}>
              Sign Up
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