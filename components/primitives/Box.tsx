/**
 * Box - Layout primitive
 * All spacing, flex, grid values come from design tokens
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { spacing, typography } from '@/design/tokens';

type SpacingToken = keyof typeof spacing.semantic;

interface BoxProps extends React.ComponentPropsWithoutRef<typeof View> {
  // Flexbox
  flex?: number | string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: ViewStyle['justifyContent'];
  alignItems?: ViewStyle['alignItems'];
  alignSelf?: ViewStyle['alignSelf'];
  flexWrap?: ViewStyle['flexWrap'];
  gap?: SpacingToken | number;

  // Spacing
  p?: SpacingToken | number;
  px?: SpacingToken | number;
  py?: SpacingToken | number;
  pt?: SpacingToken | number;
  pr?: SpacingToken | number;
  pb?: SpacingToken | number;
  pl?: SpacingToken | number;
  m?: SpacingToken | number;
  mx?: SpacingToken | number;
  my?: SpacingToken | number;
  mt?: SpacingToken | number;
  mr?: SpacingToken | number;
  mb?: SpacingToken | number;
  ml?: SpacingToken | number;

  // Sizing
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  minWidth?: ViewStyle['minWidth'];
  minHeight?: ViewStyle['minHeight'];
  maxWidth?: ViewStyle['maxWidth'];
  maxHeight?: ViewStyle['maxHeight'];

  // Position
  position?: ViewStyle['position'];
  top?: ViewStyle['top'];
  right?: ViewStyle['right'];
  bottom?: ViewStyle['bottom'];
  left?: ViewStyle['left'];
  zIndex?: ViewStyle['zIndex'];

  // Overflow
  overflow?: ViewStyle['overflow'];

  // Layout helpers
  center?: boolean;
  row?: boolean;
  col?: boolean;
  fill?: boolean;
}

function getSpacing(value: SpacingToken | number | undefined): number {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  return spacing.semantic[value] ?? 0;
}

export const Box = React.forwardRef<View, BoxProps>(
  (
    {
      flex,
      flexDirection,
      justifyContent,
      alignItems,
      alignSelf,
      flexWrap,
      gap,
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      position,
      top,
      right,
      bottom,
      left,
      zIndex,
      overflow,
      center,
      row,
      col,
      fill,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const styles = StyleSheet.flatten([
      // Flexbox
      flex && { flex },
      flexDirection && { flexDirection },
      justifyContent && { justifyContent },
      alignItems && { alignItems },
      alignSelf && { alignSelf },
      flexWrap && { flexWrap },
      gap !== undefined && { gap: getSpacing(gap) },

      // Spacing - padding
      p !== undefined && { padding: getSpacing(p) },
      px !== undefined && { paddingHorizontal: getSpacing(px) },
      py !== undefined && { paddingVertical: getSpacing(py) },
      pt !== undefined && { paddingTop: getSpacing(pt) },
      pr !== undefined && { paddingRight: getSpacing(pr) },
      pb !== undefined && { paddingBottom: getSpacing(pb) },
      pl !== undefined && { paddingLeft: getSpacing(pl) },

      // Spacing - margin
      m !== undefined && { margin: getSpacing(m) },
      mx !== undefined && { marginHorizontal: getSpacing(mx) },
      my !== undefined && { marginVertical: getSpacing(my) },
      mt !== undefined && { marginTop: getSpacing(mt) },
      mr !== undefined && { marginRight: getSpacing(mr) },
      mb !== undefined && { marginBottom: getSpacing(mb) },
      ml !== undefined && { marginLeft: getSpacing(ml) },

      // Sizing
      width !== undefined && { width },
      height !== undefined && { height },
      minWidth !== undefined && { minWidth },
      minHeight !== undefined && { minHeight },
      maxWidth !== undefined && { maxWidth },
      maxHeight !== undefined && { maxHeight },

      // Position
      position && { position },
      top !== undefined && { top },
      right !== undefined && { right },
      bottom !== undefined && { bottom },
      left !== undefined && { left },
      zIndex !== undefined && { zIndex },
      overflow && { overflow },

      // Layout helpers
      center && {
        alignItems: 'center',
        justifyContent: 'center',
      },
      row && { flexDirection: 'row', alignItems: 'center' },
      col && { flexDirection: 'column' },
      fill && { flex: 1, width: '100%', height: '100%' },

      style,
    ]);

    return <View ref={ref} style={styles} {...props}>{children}</View>;
  }
);

Box.displayName = 'Box';

export default Box;