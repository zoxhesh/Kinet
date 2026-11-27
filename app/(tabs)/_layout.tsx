/**
 * Tabs Layout
 * Main app navigation with 4 tabs
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Icon } from '@/components/primitives';
import { colors, spacing, typography, zIndex } from '@/design/tokens';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  const colorScheme = 'light'; // TODO: use useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.light.accent,
        tabBarInactiveTintColor: colors.light.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Icon name="home" size="md" color={color} weight={focused ? 'filled' : 'outline'} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ focused, color }) => (
            <Icon name="dumbbell" size="md" color={color} weight={focused ? 'filled' : 'outline'} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ focused, color }) => (
            <Icon name="activity" size="md" color={color} weight={focused ? 'filled' : 'outline'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <Icon name="user" size="md" color={color} weight={focused ? 'filled' : 'outline'} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    backgroundColor: colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    paddingBottom: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: typography.fontFamilies.sans,
    fontWeight: '500',
    marginTop: 4,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});