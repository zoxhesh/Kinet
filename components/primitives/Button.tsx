/**
 * Button - Primary interactive primitive
 * Variants: primary, secondary, ghost, danger
 * Sizes: sm (32px), md (40px), lg (48px)
 * States: default, hover, active, focus-visible, disabled, loading
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Box } from './Box';
import { Text } from './Text';
import { colors, radius, spacing, motion, shadows, focus } from '@/design/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const sizeStyles: Record<ButtonSize, { height: number; px: number; fontSize: number; iconSize: number }> = {
  sm: { height: 32, px: 12, fontSize: 14, iconSize: 16 },
  md: { height: 40, px: 16, fontSize: 16, iconSize: 20 },
  lg: { height: 48, px: 24, fontSize: 18, iconSize: 24 },
};

const variantStyles: Record<ButtonVariant, {
  bg: string;
  bgHover: string;
  bgActive: string;
  text: string;
  border: string;
  shadow: string;
}> = {
  primary: {
    bg: 'accent',
    bgHover: 'accentHover',
    bgActive: 'accentHover',
    text: 'onAccent',
    border: 'accent',
    shadow: 'sm',
  },
  secondary: {
    bg: 'surface',
    bgHover: 'border',
    bgActive: 'border',
    text: 'text',
    border: 'border',
    shadow: 'none',
  },
  ghost: {
    bg: 'transparent',
    bgHover: 'accentMuted',
    bgActive: 'accentMuted',
    text: 'accent',
    border: 'transparent',
    shadow: 'none',
  },
  danger: {
    bg: 'danger',
    bgHover: 'danger',
    bgActive: 'danger',
    text: 'onAccent',
    border: 'danger',
    shadow: 'sm',
  },
};

export const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      style,
      onPress,
      accessibilityLabel,
      ...props
    },
    ref
  ) => {
    const sizeConfig = sizeStyles[size];
    const vStyles = variantStyles[variant];
    const isInteractive = !disabled && !loading;

    const [pressed, setPressed] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const handlePressIn = () => isInteractive && setPressed(true);
    const handlePressOut = () => setPressed(false);

    const backgroundColor = pressed && isInteractive
      ? vStyles.bgActive
      : focused && isInteractive
        ? vStyles.bgHover
        : vStyles.bg;

    const containerStyle: ViewStyle = {
      height: sizeConfig.height,
      paddingHorizontal: sizeConfig.px,
      borderRadius: radius.semantic.button,
      backgroundColor: colors.light[backgroundColor as keyof typeof colors.light] || backgroundColor,
      borderWidth: vStyles.border === 'transparent' ? 0 : borders.width,
      borderColor: colors.light[vStyles.border as keyof typeof colors.light] || vStyles.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.semantic.sm,
      width: fullWidth ? '100%' : 'auto',
      opacity: isInteractive ? 1 : 0.5,
      ...(vStyles.shadow !== 'none' && shadows[vStyles.shadow as keyof typeof shadows]),
    };

    const textColor = colors.light[vStyles.text as keyof typeof colors.light] || vStyles.text;

    return (
      <TouchableOpacity
        ref={ref}
        style={[containerStyle, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled || loading}
        activeOpacity={0.8}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        accessibilityRole="button"
        {...props}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            {leftIcon && <Box>{leftIcon}</Box>}
            <Text
              variant="sm"
              weight="semibold"
              color={textColor}
              style={{ fontSize: sizeConfig.fontSize }}
            >
              {children}
            </Text>
            {rightIcon && <Box>{rightIcon}</Box>}
          </>
        )}
        {focused && isInteractive && (
          <Box
            position="absolute"
            inset={0}
            borderRadius={radius.semantic.button}
            borderWidth={focus.ringWidth}
            borderColor={colors.light[focus.ringColor as keyof typeof colors.light]}
            pointerEvents="none"
          />
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

// Convenience exports
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="secondary" {...props} />
);

export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="ghost" {...props} />
);

export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="danger" {...props} />
);

export default Button;