/**
 * ProgressRing - Circular progress primitive
 * Variants: small (48px), large (120px)
 * Types: stroke, fill
 * States: animating, static, incomplete, warning
 */

import React from 'react';
import { View, ViewStyle, StyleSheet, Animated, Easing } from 'react-native';
import { Box } from './Box';
import { Text } from './Text';
import { colors, spacing, motion, typography } from '@/design/tokens';

type ProgressRingSize = 'small' | 'large';
type ProgressRingType = 'stroke' | 'fill';

interface ProgressRingProps {
  progress: number; // 0-1
  size?: ProgressRingSize;
  type?: ProgressRingType;
  strokeWidth?: number;
  color?: keyof typeof colors.light;
  backgroundColor?: keyof typeof colors.light;
  showLabel?: boolean;
  label?: string;
  children?: React.ReactNode;
  animated?: boolean;
  animateDuration?: number;
  accessibilityLabel?: string;
}

const sizeConfig: Record<ProgressRingSize, { size: number; strokeWidth: number; fontSize: number }> = {
  small: { size: 48, strokeWidth: 4, fontSize: 12 },
  large: { size: 120, strokeWidth: 8, fontSize: 24 },
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress = 0,
  size = 'large',
  type = 'stroke',
  strokeWidth: strokeWidthProp,
  color = 'accent',
  backgroundColor = 'border',
  showLabel = true,
  label,
  children,
  animated = true,
  animateDuration,
  accessibilityLabel,
}) => {
  const config = sizeConfig[size];
  const strokeWidth = strokeWidthProp ?? config.strokeWidth;
  const radius = (config.size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  const [animatedProgress, setAnimatedProgress] = React.useState(0);

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedProgress, {
        toValue: clampedProgress,
        duration: animateDuration ?? motion.semantic.progressRing.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => setAnimatedProgress(clampedProgress));
    } else {
      setAnimatedProgress(clampedProgress);
    }
  }, [clampedProgress, animated]);

  const strokeDashoffset = circumference * (1 - animatedProgress);

  const ringColor = colors.light[color];
  const bgColor = colors.light[backgroundColor];

  const a11yLabel = accessibilityLabel || `Progress: ${Math.round(clampedProgress * 100)}%`;

  return (
    <Box center style={{ width: config.size, height: config.size }}>
      <View style={styles.container} accessibilityRole="img" accessibilityLabel={a11yLabel}>
        {/* Background track */}
        <Animated.View
          style={[
            styles.ring,
            {
              width: config.size,
              height: config.size,
              borderWidth: strokeWidth,
              borderColor: bgColor,
              borderRadius: config.size / 2,
            },
          ]}
        />
        {/* Progress ring */}
        <Animated.View
          style={[
            styles.ring,
            {
              width: config.size,
              height: config.size,
              borderWidth: strokeWidth,
              borderColor: ringColor,
              borderRadius: config.size / 2,
              borderTopColor: ringColor,
              borderRightColor: type === 'stroke' ? 'transparent' : ringColor,
              borderBottomColor: type === 'stroke' ? 'transparent' : ringColor,
              borderLeftColor: type === 'stroke' ? 'transparent' : ringColor,
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.progressMask,
              {
                width: config.size,
                height: config.size,
                borderWidth: strokeWidth,
                borderColor: ringColor,
                borderRadius: config.size / 2,
                borderTopColor: ringColor,
                borderRightColor: type === 'stroke' ? 'transparent' : ringColor,
                borderBottomColor: type === 'stroke' ? 'transparent' : ringColor,
                borderLeftColor: type === 'stroke' ? 'transparent' : ringColor,
                transform: [{ rotate: '-90deg' }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: config.size,
                  height: config.size,
                  borderRadius: config.size / 2,
                  clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
                  transform: [
                    { rotate: `${animatedProgress * 360}deg` },
                  ],
                },
              ]}
            />
          </Animated.View>
        </Animated.View>

        {/* Center content */}
        <Box center style={styles.center}>
          {children || (showLabel && (
            <Box flexDirection="column" alignItems="center">
              <Text
                variant={size === 'large' ? '3xl' : 'xl'}
                weight="bold"
                color="text"
                style={{ fontSize: config.fontSize }}
              >
                {label ?? `${Math.round(animatedProgress * 100)}%`}
              </Text>
            </Box>
          ))}
        </Box>
      </View>
    </Box>
  );
};

// Simplified version using SVG-like approach for better performance
export const ProgressRingSimple: React.FC<ProgressRingProps> = ({
  progress = 0,
  size = 'large',
  type = 'stroke',
  strokeWidth: strokeWidthProp,
  color = 'accent',
  backgroundColor = 'border',
  showLabel = true,
  label,
  children,
  animated = true,
  animateDuration,
  accessibilityLabel,
}) => {
  const config = sizeConfig[size];
  const strokeWidth = strokeWidthProp ?? config.strokeWidth;
  const radius = (config.size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  const [animatedProgress, setAnimatedProgress] = React.useState(0);

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedProgress, {
        toValue: clampedProgress,
        duration: animateDuration ?? motion.semantic.progressRing.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => setAnimatedProgress(clampedProgress));
    } else {
      setAnimatedProgress(clampedProgress);
    }
  }, [clampedProgress, animated]);

  const strokeDashoffset = circumference * (1 - animatedProgress);

  const ringColor = colors.light[color];
  const bgColor = colors.light[backgroundColor];

  const a11yLabel = accessibilityLabel || `Progress: ${Math.round(clampedProgress * 100)}%`;

  return (
    <Box center style={{ width: config.size, height: config.size }}>
      <View style={styles.container} accessibilityRole="img" accessibilityLabel={a11yLabel}>
        {/* Using border trick for progress ring */}
        <View
          style={[
            styles.ringSimple,
            {
              width: config.size,
              height: config.size,
              borderWidth: strokeWidth,
              borderColor: bgColor,
              borderRadius: config.size / 2,
            },
          ]}
        />
        <View
          style={[
            styles.ringSimple,
            {
              width: config.size,
              height: config.size,
              borderWidth: strokeWidth,
              borderColor: ringColor,
              borderRadius: config.size / 2,
              borderTopColor: ringColor,
              borderRightColor: ringColor,
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
              transform: [{ rotate: '-90deg' }],
            },
          ]}
        >
          <View
            style={[
              styles.progressArc,
              {
                width: config.size,
                height: config.size,
                borderRadius: config.size / 2,
                transform: [{ rotate: `${animatedProgress * 360}deg` }],
              },
            ]}
          >
            <View
              style={[
                styles.ringSimple,
                {
                  width: config.size,
                  height: config.size,
                  borderWidth: strokeWidth,
                  borderColor: ringColor,
                  borderRadius: config.size / 2,
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: ringColor,
                  borderLeftColor: ringColor,
                },
              ]}
            />
          </View>
        </View>

        {/* Center content */}
        <Box center style={styles.center}>
          {children || (showLabel && (
            <Box flexDirection="column" alignItems="center">
              <Text
                variant={size === 'large' ? '3xl' : 'xl'}
                weight="bold"
                color="text"
                style={{ fontSize: config.fontSize }}
              >
                {label ?? `${Math.round(animatedProgress * 100)}%`}
              </Text>
            </Box>
          ))}
        </Box>
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  ringSimple: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  progressMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    transformOrigin: 'center center',
  },
  progressArc: {
    position: 'absolute',
    top: 0,
    left: 0,
    transformOrigin: 'center center',
  },
  center: {
    position: 'relative',
    zIndex: 1,
  },
});

export default ProgressRingSimple;