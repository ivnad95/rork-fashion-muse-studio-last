import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { glassStyles, COLORS, BLUR } from '@/constants/glassStyles';
import * as Haptics from 'expo-haptics';

interface MinimalGlassButtonProps {
  title: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  small?: boolean;
}

/**
 * Minimal Glass Button Component
 * Premium subtle button with soft glow on active state
 */
export default function MinimalGlassButton({
  title,
  onPress,
  active = false,
  disabled = false,
  style,
  small = false,
}: MinimalGlassButtonProps) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
      >
        <View
          style={[
            glassStyles.glassButtonMinimal,
            active && glassStyles.glassButtonMinimalActive,
            small && styles.small,
            disabled && styles.disabled,
            style,
          ]}
        >
          {/* Blur layer for native */}
          {Platform.OS !== 'web' && (
            <BlurView
              intensity={BLUR.soft}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Top highlight */}
          <LinearGradient
            colors={[
              active
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.06)',
              'rgba(255, 255, 255, 0.02)',
              'transparent',
            ]}
            style={styles.topHighlight}
            pointerEvents="none"
          />

          {/* Button text */}
          <Text
            style={[
              glassStyles.buttonTextMinimal,
              active && glassStyles.buttonTextMinimalActive,
              small && styles.textSmall,
              disabled && styles.textDisabled,
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textSmall: {
    fontSize: 13,
  },
  disabled: {
    opacity: 0.4,
  },
  textDisabled: {
    color: COLORS.textMuted,
  },
});
