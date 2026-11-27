/**
 * Modal / BottomSheet - Overlay primitive
 * Variants: full (center), half (bottom), confirmation (alert)
 * States: open, closing, dismissed
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  ViewStyle,
  StyleSheet,
  Animated,
  Keyboard,
  Platform,
  BackHandler,
} from 'react-native';
import { Box } from './Box';
import { Text, Button } from './Text';
import { colors, radius, spacing, motion, shadows, zIndex } from '@/design/tokens';

type ModalVariant = 'full' | 'half' | 'confirmation';

interface ModalProps {
  visible: boolean;
  variant?: ModalVariant;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onBackdropPress?: () => void;
  closeButton?: boolean;
  actions?: Array<{
    label: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    onPress: () => void;
    disabled?: boolean;
  }>;
  handle?: boolean;
  maxHeight?: number;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  variant = 'full',
  title,
  children,
  onClose,
  onBackdropPress,
  closeButton = true,
  actions,
  handle = variant === 'half',
  maxHeight,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(variant === 'half' ? 300 : 0)).current;
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    const showKeyboard = (e: any) => setKeyboardHeight(e.endCoordinates.height);
    const hideKeyboard = () => setKeyboardHeight(0);

    Keyboard.addListener('keyboardDidShow', showKeyboard);
    Keyboard.addListener('keyboardDidHide', hideKeyboard);

    return () => {
      Keyboard.removeListener('keyboardDidShow', showKeyboard);
      Keyboard.removeListener('keyboardDidHide', hideKeyboard);
    };
  }, []);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: motion.semantic.modalEnter.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      if (variant === 'half') {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: motion.semantic.sheetEnter.duration,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          useNativeDriver: true,
        }).start();
      }
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: motion.semantic.modalExit.duration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();

      if (variant === 'half') {
        Animated.timing(slideAnim, {
          toValue: 300 + keyboardHeight,
          duration: motion.semantic.sheetExit.duration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, keyboardHeight]);

  // Android back button handling
  React.useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        onClose();
        return true;
      });
      return () => backHandler.remove();
    }
  }, [visible]);

  if (!visible && fadeAnim._value === 0) return null;

  const backdropStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    opacity: fadeAnim,
  };

  const containerStyle: ViewStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: variant === 'half' ? 0 : undefined,
    top: variant === 'full' ? '50%' : undefined,
    transform: variant === 'full' ? [{ translateY: '-50%' }] : undefined,
    maxHeight: maxHeight || (variant === 'half' ? '85%' : '90%'),
    zIndex: zIndex.modal,
    opacity: fadeAnim,
    transform: variant === 'half'
      ? [{ translateY: slideAnim }]
      : variant === 'full'
        ? [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: ['-50%', '-50%'] }) }]
        : undefined,
  };

  const modalStyle: ViewStyle = {
    backgroundColor: colors.light.surface,
    borderTopLeftRadius: variant !== 'full' ? radius.semantic.modal : radius.semantic.modal,
    borderTopRightRadius: variant !== 'full' ? radius.semantic.modal : radius.semantic.modal,
    borderBottomLeftRadius: radius.semantic.modal,
    borderBottomRightRadius: radius.semantic.modal,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: maxHeight || (variant === 'half' ? '85%' : '90%'),
    overflow: 'hidden',
  };

  const handlePress = () => {
    if (onBackdropPress) onBackdropPress();
    else if (variant !== 'confirmation') onClose();
  };

  return (
    <RNModal
      visible={visible || fadeAnim._value > 0}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Box
        style={backdropStyle}
        onPress={handlePress}
        pointerEvents={visible ? 'auto' : 'none'}
      />
      <Animated.View style={containerStyle}>
        <View style={modalStyle}>
          {handle && (
            <Box
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.light.border,
                alignSelf: 'center',
                marginTop: spacing.semantic.sm,
                marginBottom: spacing.semantic.xs,
              }}
            />
          )}
          {title && (
            <Box px="cardPadding" py="sm" borderBottomWidth={borders.width} borderColor={colors.light.border}>
              <Box row justifyContent="space-between" alignItems="center">
                <Text variant="xl" weight="semibold">{title}</Text>
                {closeButton && (
                  <Box
                    onPress={onClose}
                    padding="xs"
                    borderRadius="full"
                    backgroundColor={colors.light.accentMuted}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                  >
                    <Text variant="lg" color="accent">✕</Text>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          <Box
            style={{
              padding: spacing.semantic.cardPadding,
              maxHeight: variant === 'half' ? '70%' : '65%',
              overflow: 'auto',
            }}
          >
            {children}
          </Box>
          {actions && actions.length > 0 && (
            <Box
              px="cardPadding"
              py="md"
              borderTopWidth={borders.width}
              borderColor={colors.light.border}
              row
              justifyContent="flex-end"
              gap="sm"
            >
              {actions.map((action, i) => (
                <Button
                  key={i}
                  variant={action.variant || 'primary'}
                  size="md"
                  onPress={() => {
                    action.onPress();
                    if (action.variant !== 'ghost') onClose();
                  }}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              ))}
            </Box>
          )}
        </View>
      </Animated.View>
    </RNModal>
  );
};

import { Easing } from 'react-native';

export default Modal;