/**
 * Input - Form input primitive
 * Variants: text, number, email, password, select, textarea, date
 * Sizes: sm (36px), md (44px), lg (52px)
 * States: default, focused, error, disabled, filled
 */

import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Box } from './Box';
import { Text, Label } from './Text';
import { colors, radius, spacing, typography, focus, borders } from '@/design/tokens';

type InputVariant = 'text' | 'number' | 'email' | 'password' | 'search' | 'textarea';
type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<TextInputProps, 'style' | 'onChangeText' | 'value' | 'defaultValue'> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

const sizeStyles: Record<InputSize, { height: number; px: number; fontSize: number; py: number }> = {
  sm: { height: 36, px: 12, fontSize: 14, py: 6 },
  md: { height: 44, px: 16, fontSize: 16, py: 8 },
  lg: { height: 52, px: 16, fontSize: 18, py: 10 },
};

const variantKeyboards: Record<InputVariant, TextInputProps['keyboardType']> = {
  text: 'default',
  number: 'numeric',
  email: 'email-address',
  password: 'default',
  search: 'default',
  textarea: 'default',
};

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      helperText,
      error,
      variant = 'text',
      size = 'md',
      fullWidth = true,
      leftElement,
      rightElement,
      value,
      onChange,
      name,
      style,
      disabled = false,
      required = false,
      placeholder,
      autoComplete,
      secureTextEntry: secureTextEntryProp,
      multiline = variant === 'textarea',
      numberOfLines = 4,
      textContentType,
      ...props
    },
    ref
  ) => {
    const sizeConfig = sizeStyles[size];
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!value);
    const secureTextEntry = variant === 'password' ? !props.secureTextEntry : secureTextEntryProp;
    const showPassword = React.useRef(false);

    const isError = !!error;
    const isFilled = hasValue || focused;

    const borderColor = isError
      ? colors.light.danger
      : focused
        ? colors.light.accent
        : colors.light.borderInput;

    const containerStyle: ViewStyle = {
      width: fullWidth ? '100%' : 'auto',
      gap: spacing.semantic.xs,
    };

    const inputWrapperStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.light.surface,
      borderRadius: radius.semantic.input,
      borderWidth: borders.width,
      borderColor,
      paddingHorizontal: sizeConfig.px,
      height: multiline ? undefined : sizeConfig.height,
      minHeight: multiline ? sizeConfig.height * 3 : sizeConfig.height,
      ...(focused && {
        shadowColor: colors.light.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
      }),
    };

    const labelStyle: TextStyle = {
      position: 'absolute',
      top: sizeConfig.py,
      left: sizeConfig.px,
      fontSize: sizeConfig.fontSize,
      lineHeight: sizeConfig.fontSize * 1.5,
      color: focused || isFilled
        ? colors.light.accent
        : colors.light.textMuted,
      backgroundColor: colors.light.surface,
      paddingHorizontal: spacing.semantic.xs,
      pointerEvents: 'none',
      transition: 'all 150ms ease-out',
      transform: isFilled
        ? [{ translateY: -sizeConfig.height / 2 - 2 }, { scale: 0.85 }]
        : 'none',
    };

    const handleChangeText = (text: string) => {
      setHasValue(text.length > 0);
      onChange?.(text);
    };

    const togglePassword = () => {
      showPassword.current = !showPassword.current;
      // Force re-render by updating secureTextEntry
    };

    return (
      <Box style={containerStyle}>
        {label && (
          <Box position="relative">
            <Text
              variant="sm"
              weight="medium"
              style={[
                labelStyle,
                {
                  color: isError
                    ? colors.light.danger
                    : focused || isFilled
                      ? colors.light.accent
                      : colors.light.textMuted,
                },
              ]}
            >
              {label} {required && <Text color="danger">*</Text>}
            </Text>
          </Box>
        )}
        <Box style={inputWrapperStyle}>
          {leftElement && (
            <Box paddingRight={spacing.semantic.sm}>
              {leftElement}
            </Box>
          )}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.light.textMuted}
            style={{
              flex: 1,
              fontSize: sizeConfig.fontSize,
              lineHeight: sizeConfig.fontSize * 1.5,
              color: colors.light.text,
              paddingVertical: multiline ? sizeConfig.py : 0,
              paddingHorizontal: 0,
              fontFamily: typography.fontFamilies.sans,
            }}
            keyboardType={variantKeyboards[variant]}
            secureTextEntry={secureTextEntry && !showPassword.current}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textContentType={textContentType}
            autoComplete={autoComplete}
            disabled={disabled}
            editable={!disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onContentSizeChange={() => {}}
            {...props}
          />
          {variant === 'password' && (
            <Box
              paddingLeft={spacing.semantic.sm}
              onPress={togglePassword}
              accessibilityRole="button"
              accessibilityLabel={showPassword.current ? 'Hide password' : 'Show password'}
            >
              <Text
                variant="sm"
                color={showPassword.current ? colors.light.text : colors.light.textMuted}
              >
                {showPassword.current ? '👁' : '🔒'}
              </Text>
            </Box>
          )}
          {rightElement && (
            <Box paddingLeft={spacing.semantic.sm}>
              {rightElement}
            </Box>
          )}
        </Box>
        {(error || helperText) && (
          <Text
            variant="xs"
            color={error ? 'danger' : 'textMuted'}
            accessibilityLiveRegion={error ? 'assertive' : 'polite'}
          >
            {error || helperText}
          </Text>
        )}
      </Box>
    );
  }
);

Input.displayName = 'Input';

export default Input;