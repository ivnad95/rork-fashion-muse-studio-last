import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { neumorphicStyles, NEU_COLORS } from '@/constants/neumorphicStyles';

interface CountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  disabled?: boolean;
}

export default function CountSelector({ value, onChange, disabled = false }: CountSelectorProps) {
  const counts = [1, 2, 4, 6, 8] as const;

  return (
    <View style={styles.container} testID="count-selector">
      {counts.map((count) => {
        const isActive = value === count;
        return (
          <CountChip
            key={count}
            count={count}
            isActive={isActive}
            disabled={disabled}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              onChange(count);
            }}
          />
        );
      })}
    </View>
  );
}

function CountChip({ count, isActive, disabled, onPress }: { count: number; isActive: boolean; disabled: boolean; onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.08 : 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isActive, scaleAnim, glowAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1.08 : 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.9],
  });

  return (
    <Animated.View
      style={[
        styles.chipWrapper,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Glow for active state */}
      {isActive && (
        <Animated.View style={[styles.activeGlow, { opacity: glowOpacity }]} />
      )}

      {/* Dark shadow layer */}
      <View style={[styles.darkShadow, isActive && styles.darkShadowActive]} />

      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.chip,
          disabled && styles.disabled,
        ]}
        activeOpacity={1}
        testID={`count-${count}`}
      >
        <View style={[styles.chipInner, isActive && styles.chipInnerActive]}>
          {/* Gradient for active state */}
          {isActive && (
            <LinearGradient
              colors={[NEU_COLORS.accentStart, NEU_COLORS.accentMiddle, NEU_COLORS.accentEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Content */}
          <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipWrapper: {
    position: 'relative',
  },
  activeGlow: {
    position: 'absolute',
    inset: -8,
    borderRadius: 28,
    backgroundColor: NEU_COLORS.accentGlow,
    shadowColor: NEU_COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  darkShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    shadowColor: NEU_COLORS.shadowDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  darkShadowActive: {
    shadowColor: NEU_COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  chip: {
    width: 56,
    height: 56,
    borderRadius: 28,
    zIndex: 1,
  },
  chipInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: NEU_COLORS.base,
    justifyContent: 'center',
    alignItems: 'center',
    // Light shadow (top-left)
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  chipInnerActive: {
    shadowColor: NEU_COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  chipText: {
    ...neumorphicStyles.neuTextSecondary,
    fontSize: 18,
    fontWeight: '700' as const,
    zIndex: 10,
  },
  chipTextActive: {
    ...neumorphicStyles.neuTextPrimary,
    fontSize: 20,
    fontWeight: '800' as const,
  },
  disabled: {
    opacity: 0.4,
  },
});