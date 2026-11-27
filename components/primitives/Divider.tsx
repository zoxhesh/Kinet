/**
 * Divider - Separator primitive
 * Variants: horizontal, vertical
 * Styles: solid, dashed, dotted
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Box } from './Box';
import { colors, spacing, borders } from '@/design/tokens';

type DividerOrientation = 'horizontal' | 'vertical';
type DividerStyle = 'solid' | 'dashed' | 'dotted';

interface DividerProps {
  orientation?: DividerOrientation;
  style?: DividerStyle;
  thickness?: number;
  color?: keyof typeof colors.light | string;
  length?: string | number; // 'full', 'auto', or number
  inset?: keyof typeof spacing.semantic | number;
  children?: React.ReactNode; // For "or" divider with text
  styleProp?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  style: dividerStyle = 'solid',
  thickness = borders.width,
  color = 'border',
  length = 'full',
  inset = 0,
  children,
  styleProp,
}) => {
  const dividerColor = color in colors.light ? colors.light[color as keyof typeof colors.light] : color;
  const insetValue = typeof inset === 'number' ? inset : spacing.semantic[inset];

  const borderStyleMap: Record<DividerStyle, ViewStyle['borderStyle']> = {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  };

  const baseStyle: ViewStyle = {
    borderWidth: thickness,
    borderColor: dividerColor,
    borderStyle: borderStyleMap[dividerStyle],
    opacity: 0.6,
  };

  if (orientation === 'horizontal') {
    if (children) {
      return (
        <Box row alignItems="center" gap="sm" style={styleProp}>
          <Box
            flex={1}
            style={[
              baseStyle,
              { borderTopWidth: thickness, borderBottomWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 },
            ]}
          />
          <Box px="sm" color="textMuted" variant="xs">
            {children}
          </Box>
          <Box
            flex={1}
            style={[
              baseStyle,
              { borderTopWidth: thickness, borderBottomWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 },
            ]}
          />
        </Box>
      );
    }

    return (
      <Box
        style={[
          baseStyle,
          { borderTopWidth: thickness, borderBottomWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 },
          length === 'full' ? { width: '100%' } : { width: length },
          { marginLeft: insetValue, marginRight: insetValue },
          styleProp,
        ]}
      />
    );
  } else {
    // Vertical divider
    return (
      <Box
        style={[
          baseStyle,
          { borderLeftWidth: thickness, borderTopWidth: 0, borderBottomWidth: 0, borderRightWidth: 0 },
          length === 'full' ? { height: '100%' } : { height: length },
          { marginTop: insetValue, marginBottom: insetValue },
          styleProp,
        ]}
      />
    );
  }
};

export default Divider;