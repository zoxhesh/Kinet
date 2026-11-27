/**
 * Root Layout
 * Expo Router + Providers + Theme
 */

import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { Providers } from '@/lib/providers';
import { colors } from '@/design/tokens';

export default function RootLayout() {
  return (
    <Providers>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.light.surface}
        translucent={false}
      />
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.light.bg },
          }}
        >
          <Stack.Screen name="(auth)" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
});