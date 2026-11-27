/**
 * Text - Typography primitive
 * All font sizes, weights, line heights from design tokens
 */

import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { typography, colors } from '@/design/tokens';

type ScaleToken = keyof typeof typography.scale;
type WeightToken = keyof typeof typography.weights;
type ColorMode = 'light' | 'dark';
type ColorRole = keyof typeof colors.light;

interface TextProps extends React.ComponentPropsWithoutRef<typeof RNText> {
  // Typography scale
  variant?: ScaleToken;
  weight?: WeightToken;
  color?: ColorRole | string;
  colorMode?: ColorMode;

  // Text style
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: TextStyle['textAlign'];
  textTransform?: TextStyle['textTransform'];
  textDecorationLine?: TextStyle['textDecorationLine'];
  textDecorationColor?: string;
  textDecorationStyle?: TextStyle['textDecorationStyle'];

  // Overflow
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';

  // Semantic
  selectable?: boolean;
  accessibilityRole?: 'header' | 'link' | 'text' | 'summary';
}

function getColorValue(color: ColorRole | string | undefined, mode: ColorMode): string {
  if (!color) return colors[mode].text;
  if (color in colors[mode]) return colors[mode][color as ColorRole];
  return color; // Assume it's a valid color string
}

function getVariantStyle(variant: ScaleToken, weight?: WeightToken): TextStyle {
  const scale = typography.scale[variant];
  const w = weight ? typography.weights[weight] : scale.weight;
  return {
    fontSize: scale.size,
    lineHeight: scale.lineHeight,
    fontWeight: w as TextStyle['fontWeight'],
    fontFamily: typography.fontFamilies.sans,
  };
}

export const Text = React.forwardRef<RNText, TextProps>(
  (
    {
      variant = 'base',
      weight,
      color,
      colorMode = 'light',
      lineHeight,
      letterSpacing,
      textAlign,
      textTransform,
      textDecorationLine,
      textDecorationColor,
      textDecorationStyle,
      numberOfLines,
      ellipsizeMode,
      selectable,
      accessibilityRole = 'text',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const styles = StyleSheet.flatten([
      getVariantStyle(variant, weight),
      color && { color: getColorValue(color, colorMode) },
      lineHeight !== undefined && { lineHeight },
      letterSpacing !== undefined && { letterSpacing },
      textAlign && { textAlign },
      textTransform && { textTransform },
      textDecorationLine && { textDecorationLine },
      textDecorationColor && { textDecorationColor },
      textDecorationStyle && { textDecorationStyle },
      numberOfLines !== undefined && { numberOfLines },
      ellipsizeMode && { ellipsizeMode },
      selectable && { userSelect: 'text' },
      style,
    ]);

    return (
      <RNText
        ref={ref}
        style={styles}
        accessibilityRole={accessibilityRole}
        {...props}
      >
        {children}
      </RNText>
    );
  }
);

Text.displayName = 'Text';

// Semantic text components
export const Heading = ({ level = 1, ...props }: TextProps & { level?: 1 | 2 | 3 | 4 }) => {
  const variantMap = { 1: 'display', 2: '4xl', 3: '3xl', 4: '2xl' } as const;
  return <Text variant={variantMap[level]} weight="bold" {...props} />;
};

export const Body = ({ size = 'base', ...props }: TextProps & { size?: 'sm' | 'base' | 'lg' }) => {
  return <Text variant={size} {...props} />;
};

export const Caption = ({ ...props }: TextProps) => {
  return <Text variant="xs" color="textMuted" {...props} />;
};

export const Label = ({ ...props }: TextProps) => {
  return <Text variant="sm" weight="semibold" {...props} />;
};

export const Link = ({ ...props }: TextProps) => {
  return <Text color="accentText" accessibilityRole="link" {...props} />;
};

export default Text;