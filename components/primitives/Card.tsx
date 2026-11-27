/**
 * Card - Container primitive
 * Variants: default, elevated, interactive
 * States: default, loading, hover, active
 */

import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { Box } from './Box';
import { colors, radius, spacing, shadows } from '@/design/tokens';

type CardVariant = 'default' | 'elevated' | 'interactive';

interface CardProps extends React.ComponentPropsWithoutRef<typeof View> {
  variant?: CardVariant;
  padding?: keyof typeof spacing.semantic;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<View, CardProps>(
  (
    {
      variant = 'default',
      padding = 'cardPadding',
      onPress,
      disabled = false,
      loading = false,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isInteractive = variant === 'interactive' && !disabled && !loading && !!onPress;

    const baseStyle: ViewStyle = {
      backgroundColor: colors.light[variant === 'elevated' ? 'surfaceElevated' : 'surface'],
      borderRadius: radius.semantic.card,
      borderWidth: borders.width,
      borderColor: colors.light.border,
      padding: spacing.semantic[padding],
      ...(variant === 'elevated' || variant === 'interactive'
        ? shadows.semantic[variant === 'elevated' ? 'card' : 'card']
        : {}),
    };

    const interactiveStyles: ViewStyle = isInteractive
      ? {
          // Hover/active handled by TouchableOpacity
        }
      : {};

    const Content = isInteractive ? TouchableOpacity : View;

    return (
      <Content
        ref={ref}
        style={StyleSheet.flatten([baseStyle, interactiveStyles, style])}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.95}
        accessibilityRole={isInteractive ? 'button' : undefined}
        accessibilityState={{ disabled: disabled || loading }}
        {...(!isInteractive ? props : {})}
      >
        {loading ? (
          <Box row center gap="sm">
            <Box
              width={20}
              height={20}
              borderRadius="full"
              borderWidth={2}
              borderColor="accent"
              borderTopColor="transparent"
            />
            <Text variant="sm" color="textMuted">
              Loading...
            </Text>
          </Box>
        ) : (
          children
        )}
      </Content>
    );
  }
);

Card.displayName = 'Card';

export default Card;