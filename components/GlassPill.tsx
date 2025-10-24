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
import { glassStyles, COLORS } from '@/constants/glassStyles';
import * as Haptics from 'expo-haptics';

interface GlassPillProps {
  label: string;
  onPress?: () => void;
  active?: boolean;
  style?: ViewStyle;
}

/**
 * Glass Pill Component
 * Compact minimal pill/chip for filters, tags, selectors
 */
export default function GlassPill({
  label,
  onPress,
  active = false,
  style,
}: GlassPillProps) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scaleAnim, {
      toValue: 0.94,
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

  const content = (
    <View
      style={[
        glassStyles.glassPill,
        active && glassStyles.glassPillActive,
        style,
      ]}
    >
      {/* Top highlight */}
      <LinearGradient
        colors={[
          active
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.08)',
          'rgba(255, 255, 255, 0.03)',
          'transparent',
        ]}
        style={styles.topHighlight}
        pointerEvents="none"
      />

      {/* Label text */}
      <Text
        style={[
          styles.text,
          active && styles.textActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {content}
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
    borderRadius: 9999,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
    zIndex: 10,
  },
  textActive: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
});
