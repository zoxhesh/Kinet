/**
 * Icon - Lucide icon wrapper
 * Sizes: xs(14), sm(18), md(22), lg(26), xl(32)
 * Weights: outline (stroke), filled
 */

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { Box } from './Box';
import { icons, colors, typography } from '@/design/tokens';

type IconName = keyof typeof LucideIcons;
type IconSize = keyof typeof icons.sizes;
type IconWeight = 'outline' | 'filled';

interface IconProps {
  name: IconName;
  size?: IconSize | number;
  weight?: IconWeight;
  color?: keyof typeof colors.light | string;
  style?: ViewStyle;
  accessibilityLabel?: string;
  testID?: string;
}

// Map our icon names to Lucide components
const iconMap: Record<string, IconName> = {
  // Navigation
  'chevron-left': 'ChevronLeft',
  'chevron-right': 'ChevronRight',
  'chevron-up': 'ChevronUp',
  'chevron-down': 'ChevronDown',
  'menu': 'Menu',
  'x': 'X',
  'home': 'Home',
  'search': 'Search',
  'settings': 'Settings',
  'user': 'User',
  'bell': 'Bell',
  'more-horizontal': 'MoreHorizontal',
  'more-vertical': 'MoreVertical',
  'arrow-left': 'ArrowLeft',
  'arrow-right': 'ArrowRight',
  'arrow-up': 'ArrowUp',
  'arrow-down': 'ArrowDown',

  // Actions
  'plus': 'Plus',
  'minus': 'Minus',
  'check': 'Check',
  'check-circle': 'CheckCircle',
  'x-circle': 'XCircle',
  'alert-circle': 'AlertCircle',
  'info': 'Info',
  'help-circle': 'HelpCircle',
  'edit': 'Edit',
  'edit-2': 'Edit2',
  'delete': 'Trash2',
  'trash': 'Trash2',
  'copy': 'Copy',
  'share': 'Share',
  'share-2': 'Share2',
  'download': 'Download',
  'upload': 'Upload',
  'save': 'Save',
  'refresh': 'RefreshCw',
  'sync': 'Sync',
  'filter': 'Filter',
  'sort': 'ArrowUpDown',
  'grid': 'Grid',
  'list': 'List',

  // Fitness
  'dumbbell': 'Dumbbell',
  'activity': 'Activity',
  'heart': 'Heart',
  'zap': 'Zap',
  'flame': 'Flame',
  'trophy': 'Trophy',
  'star': 'Star',
  'medal': 'Award',
  'timer': 'Timer',
  'clock': 'Clock',
  'calendar': 'Calendar',
  'calendar-days': 'CalendarDays',
  'target': 'Target',
  'flag': 'Flag',
  'gauge': 'Gauge',
  'bar-chart': 'BarChart2',
  'line-chart': 'LineChart',
  'pie-chart': 'PieChart',
  'trending-up': 'TrendingUp',
  'trending-down': 'TrendingDown',

  // Body/Health
  'weight': 'Weight',
  'scale': 'Scale',
  'ruler': 'Ruler',
  'body': 'UserRound',
  'muscle': 'Dumbbell',

  // Social
  'users': 'Users',
  'user-plus': 'UserPlus',
  'user-check': 'UserCheck',
  'message-circle': 'MessageCircle',
  'send': 'Send',
  'reply': 'Reply',
  'thumbs-up': 'ThumbsUp',
  'thumbs-down': 'ThumbsDown',

  // Media
  'play': 'Play',
  'pause': 'Pause',
  'stop': 'Stop',
  'skip-back': 'SkipBack',
  'skip-forward': 'SkipForward',
  'volume-2': 'Volume2',
  'volume-x': 'VolumeX',
  'video': 'Video',
  'image': 'Image',
  'camera': 'Camera',
  'mic': 'Mic',
  'mic-off': 'MicOff',

  // Files/Data
  'file': 'File',
  'file-text': 'FileText',
  'folder': 'Folder',
  'download-cloud': 'CloudDownload',
  'upload-cloud': 'CloudUpload',
  'database': 'Database',
  'server': 'Server',
  'hard-drive': 'HardDrive',

  // Settings
  'sliders': 'SlidersHorizontal',
  'toggle-left': 'ToggleLeft',
  'toggle-right': 'ToggleRight',
  'key': 'Key',
  'lock': 'Lock',
  'unlock': 'Unlock',
  'shield': 'Shield',
  'eye': 'Eye',
  'eye-off': 'EyeOff',
  'fingerprint': 'Fingerprint',
  'face-id': 'FaceId',

  // Notifications
  'bell-ring': 'BellRing',
  'bell-off': 'BellOff',
  'inbox': 'Inbox',
  'archive': 'Archive',
  'mail': 'Mail',
  'map-pin': 'MapPin',

  // Misc
  'sun': 'Sun',
  'moon': 'Moon',
  'cloud': 'Cloud',
  'wifi': 'Wifi',
  'wifi-off': 'WifiOff',
  'bluetooth': 'Bluetooth',
  'battery': 'Battery',
  'plug': 'Plug',
  'link': 'Link',
  'link-2': 'Link2',
  'external-link': 'ExternalLink',
  'tag': 'Tag',
  'bookmark': 'Bookmark',
  'heart': 'Heart',
  'bookmark-check': 'BookmarkCheck',
  'star-half': 'StarHalf',
  'git-branch': 'GitBranch',
  'git-commit': 'GitCommit',
  'git-merge': 'GitMerge',
  'github': 'Github',
  'gitlab': 'Gitlab',
  'twitter': 'Twitter',
  'facebook': 'Facebook',
  'instagram': 'Instagram',
  'youtube': 'Youtube',
  'linkedin': 'Linkedin',
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  weight = 'outline',
  color = 'text',
  style,
  accessibilityLabel,
  testID,
}) => {
  const IconComponent = LucideIcons[iconMap[name] || name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }

  const iconSize = typeof size === 'number' ? size : icons.sizes[size];
  const iconColor = color in colors.light ? colors.light[color as keyof typeof colors.light] : color;

  return (
    <Box
      style={style}
      testID={testID}
      accessibilityRole="img"
      accessibilityLabel={accessibilityLabel || name}
    >
      <IconComponent
        size={iconSize}
        color={iconColor}
        strokeWidth={weight === 'filled' ? 0 : 2}
        fill={weight === 'filled' ? iconColor : 'none'}
      />
    </Box>
  );
};

// Semantic icon components
export const IconButton: React.FC<{
  name: IconName;
  onPress: () => void;
  size?: IconSize | number;
  color?: keyof typeof colors.light | string;
  variant?: 'default' | 'subtle';
  accessibilityLabel: string;
  disabled?: boolean;
}> = ({
  name,
  onPress,
  size = 'md',
  color = 'text',
  variant = 'default',
  accessibilityLabel,
  disabled = false,
}) => {
  const IconComponent = LucideIcons[iconMap[name] || name];
  const iconSize = typeof size === 'number' ? size : icons.sizes[size];
  const iconColor = color in colors.light ? colors.light[color as keyof typeof colors.light] : color;

  if (!IconComponent) return null;

  return (
    <Box
      onPress={onPress}
      disabled={disabled}
      padding="xs"
      borderRadius="full"
      backgroundColor={variant === 'subtle' ? colors.light.accentMuted : 'transparent'}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
    >
      <IconComponent
        size={iconSize}
        color={disabled ? colors.light.textMuted : iconColor}
        strokeWidth={2}
      />
    </Box>
  );
};

export default Icon;