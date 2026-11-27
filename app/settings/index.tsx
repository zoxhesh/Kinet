/**
 * Settings Screen (S09)
 * Notifications, units, theme, data export, danger zone
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Share } from 'react-native';
import { useCurrentUser, useAllSettings, useWorkouts, useBodyStats } from '@/hooks/useDatabase';
import { Setting } from '@/hooks/useDatabase';
import {
  Box, Text, Button, Card, Divider, Avatar, Icon, Badge,
} from '@/components/primitives';
import { colors, spacing, typography, radius, shadows } from '@/design/tokens';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { user } = useCurrentUser();
  const { settings, updateSetting } = useAllSettings(user?.id || '');
  const { workouts } = useWorkouts({ userId: user?.id, isCompleted: true });
  const { stats } = useBodyStats(user?.id || '');

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');

  const units = settings[Setting.KEYS.UNITS] || 'metric';
  const theme = settings[Setting.KEYS.THEME] || 'system';
  const notificationsEnabled = settings[Setting.KEYS.NOTIFICATIONS_ENABLED] !== 'false';
  const streakReminder = settings[Setting.KEYS.STREAK_REMINDER] !== 'false';
  const autoRestTimer = settings[Setting.KEYS.AUTO_REST_TIMER] !== 'false';
  const hapticsEnabled = settings[Setting.KEYS.HAPTICS_ENABLED] !== 'false';
  const soundEnabled = settings[Setting.KEYS.SOUND_ENABLED] !== 'false';

  const handleToggleSetting = async (key: string, value: string | boolean) => {
    await updateSetting(key, String(value));
  };

  const handleExport = async () => {
    if (!user) return;

    const data = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        level: user.level,
        xp: user.xp,
        totalWorkouts: user.totalWorkouts,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        createdAt: user.createdAt,
      },
      workouts: workouts.map(w => ({
        id: w.id,
        startedAt: w.startedAt,
        completedAt: w.completedAt,
        durationSec: w.durationSec,
        totalSets: w.totalSets,
        totalVolumeKg: w.totalVolumeKg,
        notes: w.notes,
      })),
      bodyStats: stats.map(s => ({
        date: s.date,
        weightKg: s.weightKg,
        bodyFatPct: s.bodyFatPct,
        measurements: s.measurements,
      })),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const content = exportFormat === 'json'
      ? JSON.stringify(data, null, 2)
      : convertToCSV(data);

    try {
      await Share.share({
        title: 'Kinet Data Export',
        message: `Exported ${workouts.length} workouts and ${stats.length} body stats`,
        url: `data:text/${exportFormat === 'json' ? 'json' : 'csv'};charset=utf-8,${encodeURIComponent(content)}`,
      });
      setShowExportModal(false);
    } catch (e) {
      Alert.alert('Export Failed', 'Could not share file');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <Box px="screenPadding" py="md">
          <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">
            Account
          </Text>
          <Card variant="default" padding="md">
            <Box row alignItems="center" gap="md">
              <Avatar name={user?.displayName || 'User'} size="lg" />
              <Box flex={1}>
                <Text variant="base" weight="semibold" color="text">
                  {user?.displayName || 'User'}
                </Text>
                <Text variant="sm" color="textMuted">
                  {user?.email || 'No email'}
                </Text>
                <Box row gap="xs" mt="xs">
                  <Badge size="xs" color="xpGold">Level {user?.level || 1}</Badge>
                  <Badge size="xs" color="streakFire">{user?.currentStreak || 0} day streak</Badge>
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Preferences */}
        <Box px="screenPadding" py="md">
          <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">
            Preferences
          </Text>
          <Card variant="default" padding="sm" gap="md">
            <SettingRow
              label="Units"
              description="Measurement system"
              accessory={
                <Box row gap="xs">
                  {['metric', 'imperial'].map(u => (
                    <Box
                      key={u}
                      onPress={() => handleToggleSetting(Setting.KEYS.UNITS, u)}
                      paddingHorizontal="md"
                      paddingVertical="xs"
                      borderRadius="badge"
                      backgroundColor={units === u ? colors.light.accent : colors.light.surface}
                      borderWidth={1}
                      borderColor={units === u ? colors.light.accent : colors.light.border}
                    >
                      <Text variant="sm" weight="semibold" color={units === u ? colors.light.onAccent : colors.light.text}>
                        {u.charAt(0).toUpperCase() + u.slice(1)}
                      </Text>
                    </Box>
                  ))}
                </Box>
              }
            />
            <Divider orientation="horizontal" />
            <SettingRow
              label="Theme"
              description="App appearance"
              accessory={
                <Box row gap="xs">
                  {['light', 'dark', 'system'].map(t => (
                    <Box
                      key={t}
                      onPress={() => handleToggleSetting(Setting.KEYS.THEME, t)}
                      paddingHorizontal="md"
                      paddingVertical="xs"
                      borderRadius="badge"
                      backgroundColor={theme === t ? colors.light.accent : colors.light.surface}
                      borderWidth={1}
                      borderColor={theme === t ? colors.light.accent : colors.light.border}
                    >
                      <Text variant="sm" weight="semibold" color={theme === t ? colors.light.onAccent : colors.light.text}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </Text>
                    </Box>
                  ))}
                </Box>
              }
            />
            <Divider orientation="horizontal" />
            <SettingRow
              label="Language"
              description="App language"
              accessory={
                <Text variant="base" color="textMuted">English (only)</Text>
              }
            />
          </Card>
        </Box>

        {/* Notifications */}
        <Box px="screenPadding" py="md">
          <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">
            Notifications
          </Text>
          <Card variant="default" padding="sm" gap="md">
            <SettingToggle
              label="Push Notifications"
              description="Workout reminders & streak alerts"
              value={notificationsEnabled}
              onChange={v => handleToggleSetting(Setting.KEYS.NOTIFICATIONS_ENABLED, v)}
            />
            <Divider orientation="horizontal" />
            <SettingToggle
              label="Streak Reminders"
              description="Alert when streak is at risk"
              value={streakReminder}
              onChange={v => handleToggleSetting(Setting.KEYS.STREAK_REMINDER, v)}
              disabled={!notificationsEnabled}
            />
            <Divider orientation="horizontal" />
            <SettingToggle
              label="Workout Reminders"
              description="Daily reminder at set time"
              value={notificationsEnabled}
              onChange={v => handleToggleSetting(Setting.KEYS.NOTIFICATIONS_ENABLED, v)}
            />
          </Card>
        </Box>

        {/* Workout */}
        <Box px="screenPadding" py="md">
          <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">
            Workout
          </Text>
          <Card variant="default" padding="sm" gap="md">
            <SettingToggle
              label="Auto Rest Timer"
              description="Automatically start rest timer after sets"
              value={autoRestTimer}
              onChange={v => handleToggleSetting(Setting.KEYS.AUTO_REST_TIMER, v)}
            />
            <Divider orientation="horizontal" />
            <SettingRow
              label="Default Rest Time"
              description="Seconds between sets"
              accessory={
                <Box row gap="xs">
                  {[60, 90, 120, 180, 240, 300].map(t => (
                    <Box
                      key={t}
                      onPress={() => handleToggleSetting(Setting.KEYS.DEFAULT_REST_SECONDS, String(t))}
                      paddingHorizontal="md"
                      paddingVertical="xs"
                      borderRadius="badge"
                      backgroundColor={settings[Setting.KEYS.DEFAULT_REST_SECONDS] === String(t) ? colors.light.accent : colors.light.surface}
                      borderWidth={1}
                      borderColor={settings[Setting.KEYS.DEFAULT_REST_SECONDS] === String(t) ? colors.light.accent : colors.light.border}
                    >
                      <Text variant="sm" weight="semibold" color={settings[Setting.KEYS.DEFAULT_REST_SECONDS] === String(t) ? colors.light.onAccent : colors.light.text}>
                        {t}s
                      </Text>
                    </Box>
                  ))}
                </Box>
              }
            />
            <Divider orientation="horizontal" />
            <SettingRow
              label="Bar Weight (Plate Calculator)"
              description="Weight of the barbell in kg"
              accessory={
                <Box row gap="xs">
                  {[15, 20, 25].map(w => (
                    <Box
                      key={w}
                      onPress={() => handleToggleSetting(Setting.KEYS.PLATE_CALCULATOR_BAR_WEIGHT, String(w))}
                      paddingHorizontal="md"
                      paddingVertical="xs"
                      borderRadius="badge"
                      backgroundColor={settings[Setting.KEYS.PLATE_CALCULATOR_BAR_WEIGHT] === String(w) ? colors.light.accent : colors.light.surface}
                      borderWidth={1}
                      borderColor={settings[Setting.KEYS.PLATE_CALCULATOR_BAR_WEIGHT] === String(w) ? colors.light.accent : colors.light.border}
                    >
                      <Text variant="sm" weight="semibold" color={settings[Setting.KEYS.PLATE_CALCULATOR_BAR_WEIGHT] === String(w) ? colors.light.onAccent : colors.light.text}>
                        {w} kg
                      </Text>
                    </Box>
                  ))}
                </Box>
              }
            />
          </Card>
        </Box>

        {/* Feedback */}
        <Box px="screenPadding" py="md">
          <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">
            Feedback & Data
          </Text>
          <Card variant="default" padding="sm" gap="md">
            <SettingRow
              label="Export Data"
              description="Download your workouts & stats as JSON or CSV"
              accessory={
                <Button variant="secondary" size="sm" onPress={() => setShowExportModal(true)}>
                  <Icon name="download" size="sm" mr="xs" />
                  Export
                </Button>
              }
            />
            <Divider orientation="horizontal" />
            <SettingRow
              label="Import Data"
              description="Restore from a previous export"
              accessory={
                <Button variant="ghost" size="sm" onPress={() => Alert.alert('Import', 'Coming soon')}>
                  Import
                </Button>
              }
            />
            <Divider orientation="horizontal" />
            <SettingRow
              label="Send Feedback"
              description="Report bugs or suggest features"
              accessory={
                <Button variant="ghost" size="sm" onPress={() => Alert.alert('Feedback', 'Coming soon')}>
                  Send
                </Button>
              }
            />
          </Card>
        </Box>

        {/* Danger Zone */}
        <Box px="screenPadding" py="md">
          <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">
            Danger Zone
          </Text>
          <Card variant="default" padding="sm" gap="md">
            <Button variant="danger" fullWidth onPress={() => Alert.alert('Log Out', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Log Out', style: 'destructive', onPress: () => router.push('/auth/login') }])}>
              <Icon name="log-out" size="sm" mr="sm" />
              Log Out
            </Button>
            <Divider orientation="horizontal" />
            <Button variant="ghost" fullWidth onPress={() => Alert.alert('Delete Account', 'This will permanently delete all your data. This cannot be undone.', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive' }])}>
              <Icon name="trash" size="sm" mr="sm" />
              Delete Account
            </Button>
          </Card>
        </Box>

        {/* Version */}
        <Box px="screenPadding" py="xl" center>
          <Text variant="xs" color="textMuted">
            Kinet v1.0.0
          </Text>
          <Text variant="xs" color="textMuted" mt="xs">
            Built with Expo, WatermelonDB, and ❤️
          </Text>
        </Box>

        {/* Export Modal */}
        {showExportModal && (
          <ExportModal
            onClose={() => setShowExportModal(false)}
            onExport={handleExport}
            format={exportFormat}
            setFormat={setExportFormat}
          />
        )}
      </ScrollView>
    </View>
  );
}

// Setting Row Component
const SettingRow: React.FC<{
  label: string;
  description: string;
  accessory: React.ReactNode;
}> = ({ label, description, accessory }) => (
  <Box row justifyContent="space-between" alignItems="center" gap="md">
    <Box flex={1}>
      <Text variant="base" color="text">{label}</Text>
      <Text variant="xs" color="textMuted">{description}</Text>
    </Box>
    {accessory}
  </Box>
);

// Setting Toggle Component
const SettingToggle: React.FC<{
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}> = ({ label, description, value, onChange, disabled }) => (
  <Box
    row
    justifyContent="space-between"
    alignItems="center"
    opacity={disabled ? 0.5 : 1}
  >
    <Box flex={1}>
      <Text variant="base" color={disabled ? colors.light.textMuted : colors.light.text}>{label}</Text>
      <Text variant="xs" color="textMuted">{description}</Text>
    </Box>
    <Box
      onPress={() => !disabled && onChange(!value)}
      width={52}
      height={28}
      borderRadius={14}
      backgroundColor={value ? colors.light.accent : colors.light.border}
      justifyContent="center"
      paddingHorizontal={4}
    >
      <Box
        width={20}
        height={20}
        borderRadius={10}
        backgroundColor={colors.light.onAccent}
        style={{ marginLeft: value ? 28 : 4 }}
      />
    </Box>
  </Box>
);

// Export Modal
const ExportModal: React.FC<{
  onClose: () => void;
  onExport: () => void;
  format: 'json' | 'csv';
  setFormat: (format: 'json' | 'csv') => void;
}> = ({ onClose, onExport, format, setFormat }) => (
  <View style={styles.modalOverlay} onTouchStart={onClose}>
    <Box style={styles.modalContent} onTouchStart={e => e.stopPropagation()}>
      <Box px="modalPadding" py="lg" borderBottomWidth={1} borderColor={colors.light.border}>
        <Box row justifyContent="space-between" alignItems="center">
          <Text variant="xl" weight="semibold" color="text">Export Data</Text>
          <Button variant="ghost" size="sm" onPress={onClose}>
            <Icon name="x" size="md" />
          </Button>
        </Box>
      </Box>
      <ScrollView contentContainerStyle={styles.modalScroll}>
        <Box px="modalPadding" py="md">
          <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">Format</Text>
          <Box row gap="sm">
            {['json', 'csv'].map(f => (
              <Box
                key={f}
                onPress={() => setFormat(f)}
                paddingHorizontal="lg"
                paddingVertical="md"
                borderRadius="card"
                backgroundColor={format === f ? colors.light.accentMuted : colors.light.surface}
                borderWidth={2}
                borderColor={format === f ? colors.light.accent : colors.light.border}
              >
                <Text variant="base" weight="semibold" color={format === f ? colors.light.accent : colors.light.text}>
                  {f.toUpperCase()}
                </Text>
                <Text variant="xs" color="textMuted">
                  {f === 'json' ? 'Full data with nested objects' : 'Flat tables for spreadsheets'}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
        <Box px="modalPadding" py="md">
          <Text variant="sm" weight="semibold" color="textMuted" textTransform="uppercase" mb="md">Includes</Text>
          <Box gap="xs">
            {[
              'Profile (level, XP, streaks)',
              'All completed workouts with sets',
              'Body measurements history',
              'Achievement progress',
            ].map((item, i) => (
              <Box key={i} row alignItems="center" gap="sm">
                <Icon name="check" size="sm" color="success" />
                <Text variant="sm" color="text">{item}</Text>
              </Box>
            ))}
          </Box>
        </Box>
        <Box px="modalPadding" py="lg" row gap="sm">
          <Button variant="ghost" size="md" flex={1} onPress={onClose}>Cancel</Button>
          <Button variant="primary" size="md" flex={1} onPress={onExport}>Export & Share</Button>
        </Box>
      </ScrollView>
    </Box>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.bg },
  scrollContent: { paddingBottom: spacing.layout.tabBarHeight + spacing.semantic.lg },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 400,
  },
  modalContent: {
    backgroundColor: colors.light.surface,
    borderTopLeftRadius: radius.semantic.modal,
    borderTopRightRadius: radius.semantic.modal,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalScroll: { paddingBottom: spacing.semantic.xl },
});

function convertToCSV(data: any): string {
  // Simple CSV conversion for workouts
  const workouts = data.workouts || [];
  if (workouts.length === 0) return '';

  const headers = ['Date', 'Duration (min)', 'Total Sets', 'Total Volume (kg)', 'Notes'];
  const rows = workouts.map((w: any) => [
    new Date(w.startedAt).toISOString().split('T')[0],
    w.durationSec ? Math.floor(w.durationSec / 60) : 0,
    w.totalSets,
    w.totalVolumeKg,
    (w.notes || '').replace(/"/g, '""'),
  ]);

  return [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
}