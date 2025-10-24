import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { neumorphicStyles, NEU_COLORS, NEU_RADIUS } from '@/constants/neumorphicStyles';

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
      {/* Active glow effect */}
      {isActive && (
        <Animated.View style={[styles.activeGlow, { opacity: glowOpacity }]} />
      )}

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
        {/* Platform-specific glass chip */}
        {Platform.OS !== 'web' ? (
          <BlurView
            intensity={isActive ? 20 : 12}
            tint="light"
            style={[StyleSheet.absoluteFill, { borderRadius: 28, overflow: 'hidden' }]}
          >
            {/* Base gradient */}
            <LinearGradient
              colors={isActive ?
                [
                  'rgba(88, 169, 230, 0.5)',
                  'rgba(59, 130, 201, 0.6)',
                  'rgba(37, 99, 171, 0.7)'
                ] :
                [
                  NEU_COLORS.gradient1,
                  NEU_COLORS.gradient2,
                  NEU_COLORS.gradient3,
                ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Light refraction (top 30%) */}
            <LinearGradient
              colors={[
                isActive ? 'rgba(200, 220, 255, 0.18)' : NEU_COLORS.refractionLight,
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.chipRefraction}
            />

            {/* Top shine */}
            <View style={styles.chipShine} />

            {/* Border highlights */}
            <View style={[styles.chipBorder, isActive && styles.chipBorderActive]} />
          </BlurView>
        ) : (
          <>
            {/* Web fallback */}
            <LinearGradient
              colors={isActive ?
                [
                  'rgba(88, 169, 230, 0.5)',
                  'rgba(59, 130, 201, 0.6)',
                  'rgba(37, 99, 171, 0.7)'
                ] :
                [
                  NEU_COLORS.gradient1,
                  NEU_COLORS.gradient2,
                  NEU_COLORS.gradient3,
                ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Light refraction */}
            <LinearGradient
              colors={[
                isActive ? 'rgba(200, 220, 255, 0.18)' : NEU_COLORS.refractionLight,
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.chipRefraction}
            />

            {/* Top shine */}
            <View style={styles.chipShine} />

            {/* Border highlights */}
            <View style={[styles.chipBorder, isActive && styles.chipBorderActive]} />
          </>
        )}

        {/* Chip text */}
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {count}
        </Text>
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
    inset: -6,
    borderRadius: 34,
    shadowColor: NEU_COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  chip: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderTopColor: NEU_COLORS.borderTop,
    borderLeftColor: NEU_COLORS.borderLeft,
    borderRightColor: NEU_COLORS.borderRight,
    borderBottomColor: NEU_COLORS.borderBottom,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: NEU_COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  chipRefraction: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    pointerEvents: 'none',
  },
  chipShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: NEU_COLORS.glassShine,
    pointerEvents: 'none',
  },
  chipBorder: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 27,
    borderWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.10)',
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    pointerEvents: 'none',
  },
  chipBorderActive: {
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
  },
  chipText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: NEU_COLORS.textSecondary,
    position: 'relative',
    zIndex: 2,
  },
  chipTextActive: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: NEU_COLORS.textPrimary,
    textShadowColor: NEU_COLORS.textGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  disabled: {
    opacity: 0.4,
  },
});