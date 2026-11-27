/**
 * Badge - Status/count indicator primitive
 * Variants: default, dot, count, icon
 * Colors: accent, danger, success, warning, xpGold
 */

import React from 'react';
import { View, ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { Box } from './Box';
import { Text } from './Text';
import { colors, radius, spacing, typography } from '@/design/tokens';

type BadgeVariant = 'default' | 'dot' | 'count' | 'icon';
type BadgeColor = 'accent' | 'danger' | 'success' | 'warning' | 'xpGold' | 'neutral';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: 'sm' | 'md' | 'lg';
  count?: number;
  maxCount?: number;
  dot?: boolean;
  style?: ViewStyle | TextStyle;
}

const colorStyles: Record<BadgeColor, { bg: string; text: string }> = {
  accent: { bg: 'accentMuted', text: 'accent' },
  danger: { bg: 'dangerMuted', text: 'danger' },
  success: { bg: 'successMuted', text: 'success' },
  warning: { bg: 'warningMuted', text: 'warning' },
  xpGold: { bg: 'xpGoldMuted', text: 'xpGold' },
  neutral: { bg: 'border', text: 'textMuted' },
};

const sizeStyles: Record<'sm' | 'md' | 'lg', { px: number; py: number; fontSize: number; dotSize: number }> = {
  sm: { px: 6, py: 2, fontSize: 10, dotSize: 6 },
  md: { px: 8, py: 3, fontSize: 11, dotSize: 8 },
  lg: { px: 10, py: 4, fontSize: 12, dotSize: 10 },
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  color = 'accent',
  size = 'md',
  count,
  maxCount = 99,
  dot = false,
  style,
}) => {
  const cStyles = colorStyles[color];
  const sStyles = sizeStyles[size];

  const displayCount = count !== undefined
    ? count > maxCount
      ? `${maxCount}+`
      : String(count)
    : undefined;

  const showDot = dot || (count !== undefined && count > 0);
  const showCount = displayCount !== undefined;

  if (variant === 'dot' || showDot) {
    return (
      <Box
        width={sStyles.dotSize}
        height={sStyles.dotSize}
        borderRadius="full"
        backgroundColor={colors.light[cStyles.bg]}
        style={style}
      />
    );
  }

  if (variant === 'count' || showCount) {
    return (
      <Box
        paddingHorizontal={sStyles.px}
        paddingVertical={sStyles.py}
        minWidth={size === 'sm' ? 16 : 18}
        height={size === 'sm' ? 16 : size === 'md' ? 18 : 20}
        borderRadius="badge"
        backgroundColor={colors.light[cStyles.bg]}
        center
        style={style}
      >
        <Text
          variant="xs"
          weight="semibold"
          color={cStyles.text}
          style={{ fontSize: sStyles.fontSize }}
        >
          {displayCount}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      paddingHorizontal={sStyles.px}
      paddingVertical={sStyles.py}
      borderRadius="badge"
      backgroundColor={colors.light[cStyles.bg]}
      style={style}
    >
      <Text
        variant="xs"
        weight="semibold"
        color={cStyles.text}
        style={{ fontSize: sStyles.fontSize }}
      >
        {children}
      </Text>
    </Box>
  );
};

// Status badge with icon
export const StatusBadge: React.FC<{
  status: 'active' | 'completed' | 'pending' | 'failed' | 'locked' | 'unlocked';
  label: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, label, size = 'md' }) => {
  const statusConfig: Record<string, { color: BadgeColor; icon: string }> = {
    active: { color: 'success', icon: '●' },
    completed: { color: 'success', icon: '✓' },
    pending: { color: 'warning', icon: '⏳' },
    failed: { color: 'danger', icon: '✕' },
    locked: { color: 'neutral', icon: '🔒' },
    unlocked: { color: 'xpGold', icon: '★' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Box row center gap="xs" paddingHorizontal={sizeStyles[size].px} paddingVertical={sizeStyles[size].py} borderRadius="badge" backgroundColor={colors.light[colorStyles[config.color].bg]}>
      <Text variant="xs" weight="bold" color={config.color} style={{ fontSize: sizeStyles[size].fontSize }}>
        {config.icon}
      </Text>
      <Text variant="xs" weight="semibold" color={config.color} style={{ fontSize: sizeStyles[size].fontSize }}>
        {label}
      </Text>
    </Box>
  );
};

export default Badge;