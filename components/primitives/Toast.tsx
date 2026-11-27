/**
 * Toast / Snackbar - Notification primitive
 * Variants: success, error, info, warning, achievement
 * Queue-based with auto-dismiss
 */

import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Box } from './Box';
import { Text, Button } from './Text';
import { colors, radius, spacing, motion, shadows, zIndex } from '@/design/tokens';

type ToastVariant = 'success' | 'error' | 'info' | 'warning' | 'achievement';

interface ToastData {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: { label: string; onPress: () => void };
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: string; text: string }> = {
  success: { bg: 'successMuted', border: 'success', icon: '✓', text: 'success' },
  error: { bg: 'dangerMuted', border: 'danger', icon: '✕', text: 'danger' },
  info: { bg: 'accentMuted', border: 'accent', icon: 'ℹ', text: 'accent' },
  warning: { bg: 'warningMuted', border: 'warning', icon: '⚠', text: 'warning' },
  achievement: { bg: 'xpGoldMuted', border: 'xpGold', icon: '★', text: 'xpGold' },
};

const ToastItem: React.FC<{ toast: ToastData; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const vStyles = variantStyles[toast.variant];

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: motion.semantic.sheetEnter.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: motion.semantic.sheetEnter.duration,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      dismiss();
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: motion.semantic.sheetExit.duration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: motion.semantic.sheetExit.duration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onDismiss(toast.id);
    });
  };

  const containerStyle: ViewStyle = {
    transform: [{ translateY: slideAnim }],
    opacity: fadeAnim,
  };

  return (
    <Animated.View style={containerStyle}>
      <Box
        row
        alignItems="flex-start"
        gap="sm"
        padding="md"
        backgroundColor={colors.light[vStyles.bg]}
        borderLeftWidth={4}
        borderLeftColor={colors.light[vStyles.border]}
        borderRadius={radius.semantic.card}
        shadow="card"
        style={{ width: '100%', minWidth: 280, maxWidth: 400 }}
      >
        <Box
          width={28}
          height={28}
          borderRadius="full"
          backgroundColor={colors.light[vStyles.border]}
          center
          marginTop={2}
        >
          <Text variant="sm" color="onAccent" weight="bold">
            {vStyles.icon}
          </Text>
        </Box>
        <Box flex={1} flexDirection="column" gap="xs">
          <Text variant="sm" weight="semibold" color={colors.light[vStyles.text]}>
            {toast.variant === 'achievement' ? 'Achievement Unlocked!' : toast.variant.charAt(0).toUpperCase() + toast.variant.slice(1)}
          </Text>
          <Text variant="sm" color={colors.light[vStyles.text]} numberOfLines={3}>
            {toast.message}
          </Text>
          {toast.action && (
            <Button variant="ghost" size="sm" onPress={() => { toast.action?.onPress(); onDismiss(toast.id); }}>
              {toast.action.label}
            </Button>
          )}
        </Box>
        <Box
          onPress={() => onDismiss(toast.id)}
          padding="xs"
          borderRadius="full"
          backgroundColor={colors.light[vStyles.border + 'Muted'] as any}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
        >
          <Text variant="xs" color={colors.light[vStyles.border]}>✕</Text>
        </Box>
      </Box>
    </Animated.View>
  );
};

// Toast context and hook
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastContextType {
  show: (message: string, variant?: ToastVariant, options?: { action?: ToastData['action']; duration?: number }) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const show = useCallback((message: string, variant: ToastVariant = 'info', options = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, variant, ...options }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <Box
      position="absolute"
      bottom={spacing.semantic.xl}
      left={spacing.semantic.md}
      right={spacing.semantic.md}
      zIndex={zIndex.toast}
      flexDirection="column"
      gap="sm"
      pointerEvents="none"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </Box>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export default ToastItem;