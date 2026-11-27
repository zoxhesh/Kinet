/**
 * Avatar - User/profile image primitive
 * Sizes: xs(24), sm(32), md(40), lg(48), xl(56), 2xl(72)
 * Fallback: initials, icon, color
 */

import React from 'react';
import { Image, ViewStyle, StyleSheet } from 'react-native';
import { Box } from './Box';
import { Text } from './Text';
import { icons, colors, radius, spacing, typography } from '@/design/tokens';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: AvatarSize;
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusSize?: 'sm' | 'md';
  fallbackIcon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

const sizeConfig: Record<AvatarSize, { size: number; fontSize: number; statusSize: number; statusOffset: number }> = {
  xs: { size: 24, fontSize: 9, statusSize: 8, statusOffset: -2 },
  sm: { size: 32, fontSize: 11, statusSize: 10, statusOffset: -2 },
  md: { size: 40, fontSize: 14, statusSize: 12, statusOffset: -3 },
  lg: { size: 48, fontSize: 16, statusSize: 14, statusOffset: -3 },
  xl: { size: 56, fontSize: 18, statusSize: 16, statusOffset: -4 },
  '2xl': { size: 72, fontSize: 24, statusSize: 18, statusOffset: -5 },
};

const fallbackColors = [
  colors.light.accent,
  colors.light.success,
  colors.light.warning,
  colors.light.danger,
  '#8B5CF6', // purple
  '#06B6D4', // cyan
  '#F97316', // orange
  '#EC4899', // pink
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return fallbackColors[Math.abs(hash) % fallbackColors.length];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  shape = 'circle',
  status,
  statusSize = 'md',
  fallbackIcon,
  onPress,
  style,
}) => {
  const config = sizeConfig[size];
  const borderRadius = shape === 'circle' ? radius.full : radius.semantic.card;

  const backgroundColor = name ? getColorFromName(name) : colors.light.border;

  const handlePress = () => onPress?.();

  return (
    <Box
      onPress={handlePress}
      style={[
        styles.container,
        { width: config.size, height: config.size, borderRadius },
        style,
      ]}
      accessibilityRole={onPress ? 'button' : 'img'}
      accessibilityLabel={name || 'Avatar'}
    >
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            { width: config.size, height: config.size, borderRadius },
          ]}
          resizeMode="cover"
        />
      ) : name ? (
        <Box
          style={[
            styles.fallback,
            { width: config.size, height: config.size, borderRadius, backgroundColor },
          ]}
        >
          <Text
            variant={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'base'}
            weight="bold"
            color="textInverse"
            style={{ fontSize: config.fontSize }}
          >
            {getInitials(name)}
          </Text>
        </Box>
      ) : fallbackIcon ? (
        <Box
          style={[
            styles.fallback,
            { width: config.size, height: config.size, borderRadius, backgroundColor },
          ]}
        >
          {fallbackIcon}
        </Box>
      ) : (
        <Box
          style={[
            styles.fallback,
            { width: config.size, height: config.size, borderRadius, backgroundColor },
          ]}
        >
          <Text variant="xs" color="textMuted" weight="bold" style={{ fontSize: config.fontSize * 0.6 }}>
            ?
          </Text>
        </Box>
      )}
      {status && (
        <Box
          style={[
            styles.status,
            {
              width: config.statusSize,
              height: config.statusSize,
              borderRadius: radius.full,
              borderWidth: 2,
              borderColor: colors.light.surface,
              bottom: config.statusOffset,
              right: config.statusOffset,
              backgroundColor:
                status === 'online' ? colors.light.success :
                status === 'busy' ? colors.light.danger :
                status === 'away' ? colors.light.warning :
                colors.light.border,
            },
          ]}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    position: 'absolute',
  },
});

export default Avatar;