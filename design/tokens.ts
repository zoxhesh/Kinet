/**
 * Design Tokens - TypeScript version of tokens.json
 * Single source of truth for all design values
 * Never use raw hex/px in components - import from here
 */

export const colors = {
  // Light mode (default)
  light: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: '#E5E5E5',
    borderInput: '#737373',
    text: '#171717',
    textMuted: '#737373',
    textInverse: '#FFFFFF',
    accent: '#0891B2',
    accentHover: '#0E7490',
    accentMuted: '#CFFAFE',
    onAccent: '#FFFFFF',
    danger: '#DC2626',
    dangerMuted: '#FEF2F2',
    success: '#16A34A',
    successMuted: '#F0FDF4',
    warning: '#D97706',
    warningMuted: '#FFFBEB',
    xpGold: '#F59E0B',
    xpGoldMuted: '#FFFBEB',
    streakFire: '#EF4444',
    accentText: '#0E7490',
  },
  // Dark mode
  dark: {
    bg: '#0A0A0A',
    surface: '#141414',
    surfaceElevated: '#1C1C1C',
    border: '#2A2A2A',
    borderInput: '#737373',
    text: '#F5F5F5',
    textMuted: '#A3A3A3',
    textInverse: '#0A0A0A',
    accent: '#22D3EE',
    accentHover: '#06B6D4',
    accentMuted: '#164E63',
    onAccent: '#000000',
    danger: '#EF4444',
    dangerMuted: '#3D0A0A',
    success: '#22C55E',
    successMuted: '#0A2D14',
    warning: '#FBBF24',
    warningMuted: '#3D2A00',
    xpGold: '#FBBF24',
    xpGoldMuted: '#3D2A00',
    streakFire: '#F87171',
    accentText: '#22D3EE',
  },
} as const;

export const typography = {
  fontFamilies: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  scale: {
    xs: { size: 12, lineHeight: 16, weight: '400' },
    sm: { size: 14, lineHeight: 20, weight: '400' },
    base: { size: 16, lineHeight: 24, weight: '400' },
    lg: { size: 18, lineHeight: 28, weight: '400' },
    xl: { size: 20, lineHeight: 28, weight: '600' },
    '2xl': { size: 24, lineHeight: 32, weight: '600' },
    '3xl': { size: 30, lineHeight: 36, weight: '700' },
    '4xl': { size: 36, lineHeight: 40, weight: '700' },
    display: { size: 48, lineHeight: 52, weight: '800' },
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

export const spacing = {
  base: 4,
  scale: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 80, 96, 128],
  semantic: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  layout: {
    screenPadding: 16,
    cardPadding: 16,
    modalPadding: 24,
    headerHeight: 56,
    tabBarHeight: 80,
    maxContentWidth: 640,
  },
} as const;

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
  semantic: {
    input: 8,
    button: 8,
    card: 12,
    modal: 16,
    badge: 9999,
  },
} as const;

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  semantic: {
    card: 'sm',
    modal: 'xl',
    dropdown: 'md',
    fab: 'lg',
    sheet: 'lg',
  },
} as const;

export const motion = {
  durations: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  easings: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  semantic: {
    buttonPress: { duration: 100, easing: 'easeOut' },
    modalEnter: { duration: 250, easing: 'easeOut' },
    modalExit: { duration: 200, easing: 'easeIn' },
    sheetEnter: { duration: 300, easing: 'spring' },
    sheetExit: { duration: 250, easing: 'easeIn' },
    tabSwitch: { duration: 200, easing: 'easeInOut' },
    listReorder: { duration: 300, easing: 'spring' },
    achievementUnlock: { duration: 800, easing: 'spring' },
    progressRing: { duration: 500, easing: 'easeOut' },
  },
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  sheet: 400,
  toast: 500,
  tooltip: 600,
} as const;

export const icons = {
  set: 'lucide',
  sizes: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 26,
    xl: 32,
  },
} as const;

export const focus = {
  ringWidth: 2,
  ringColor: 'accent',
  ringOffset: 2,
  ringOffsetColor: 'bg',
} as const;

export const borders = {
  width: 1,
  color: 'border',
  inputColor: 'borderInput',
} as const;

// Type helpers
export type ColorMode = 'light' | 'dark';
export type ColorRole = keyof typeof colors.light;
export type SpacingToken = keyof typeof spacing.semantic;
export type RadiusToken = keyof typeof radius.semantic;
export type ShadowToken = keyof typeof shadows.semantic;
export type MotionToken = keyof typeof motion.semantic;
export type TypographyScale = keyof typeof typography.scale;