import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { neumorphicStyles, NEU_COLORS, NEU_RADIUS } from '@/constants/neumorphicStyles';

interface NeumorphicButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export default function NeumorphicButton({
  title,
  onPress,
  disabled = false,
  active = false,
  style,
  textStyle,
  size = 'medium',
  fullWidth = false,
}: NeumorphicButtonProps) {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Soft press animation - scale down slightly
    Animated.spring(pressAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    // Spring back to original size
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  // Size variants
  const sizeStyles = {
    small: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      fontSize: 14,
    },
    medium: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      fontSize: 16,
    },
    large: {
      paddingVertical: 20,
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
      {/* Dark shadow layer */}
      <View
        style={[
          neumorphicStyles.neuButtonDarkShadow,
          { borderRadius: NEU_RADIUS.xxl },
        ]}
      />

      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        style={[
          neumorphicStyles.neuButton,
          {
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
          },
          fullWidth && { width: '100%' },
          disabled && styles.disabled,
          style,
        ]}
      >
        {/* Gradient overlay for active state */}
        {active && (
          <LinearGradient
            colors={[NEU_COLORS.accentStart, NEU_COLORS.accentMiddle, NEU_COLORS.accentEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              neumorphicStyles.neuGradientOverlay,
              { borderRadius: NEU_RADIUS.xxl },
            ]}
          />
        )}

        <Text
          style={[
            neumorphicStyles.neuButtonText,
            { fontSize: currentSize.fontSize },
            active && styles.activeText,
            disabled && styles.disabledText,
            textStyle,
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
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: NEU_COLORS.textMuted,
  },
  activeText: {
    color: NEU_COLORS.textPrimary,
    fontWeight: '700',
  },
});
