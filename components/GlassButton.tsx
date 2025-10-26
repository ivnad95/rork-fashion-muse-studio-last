import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  glassStyles,
  COLORS,
  RADIUS,
  SPACING,
  ANIMATION,
} from '@/constants/glassStyles';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

/**
 * Simplified Glass Button Component
 * 3-layer structure:
 * 1. BlurView (intensity: BLUR.light = 20)
 * 2. Single gradient (active: accent gradient, inactive: glass depth)
 * 3. Top highlight (2px)
 */
export default function GlassButton({
  title,
  onPress,
  disabled = false,
  active = false,
  style,
  textStyle,
  size = 'medium',
  fullWidth = false,
}: GlassButtonProps) {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      ...ANIMATION.spring.snappy,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...ANIMATION.spring.snappy,
    }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  // Size variants
  const sizeStyles = {
    small: {
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.lg,
      fontSize: 14,
    },
    medium: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xxl,
      fontSize: 16,
    },
    large: {
      paddingVertical: SPACING.lg,
      paddingHorizontal: 40,
      fontSize: 18,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        fullWidth && { width: '100%' },
        {
          transform: [{ scale: pressAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        style={[
          glassStyles.glassButtonMinimal,
          active && glassStyles.glassButtonMinimalActive,
          {
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
          },
          fullWidth && { width: '100%' },
          disabled && styles.disabled,
          style,
        ]}
      >
        {/* Minimal top highlight only */}
        <LinearGradient
          colors={[
            active ? 'rgba(255, 255, 255, 0.10)' : 'rgba(255, 255, 255, 0.06)',
            'rgba(255, 255, 255, 0.02)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.topHighlight, { borderTopLeftRadius: RADIUS.xxl, borderTopRightRadius: RADIUS.xxl }]}
          pointerEvents="none"
        />

        {/* Button text */}
        <Text
          style={[
            glassStyles.buttonTextMinimal,
            { fontSize: currentSize.fontSize },
            active && glassStyles.buttonTextMinimalActive,
            disabled && styles.disabledText,
            textStyle,
            { zIndex: 10 },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'relative',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    pointerEvents: 'none',
  },
  disabled: {
    opacity: 0.4,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
});
