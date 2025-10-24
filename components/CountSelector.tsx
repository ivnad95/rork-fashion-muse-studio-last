import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { glassStyles, COLORS, BLUR, RADIUS, GRADIENTS, SHADOW } from '@/constants/glassStyles';

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
          glassStyles.glassChip,
          isActive && glassStyles.glassChipActive,
          disabled && styles.disabled,
        ]}
        activeOpacity={1}
        testID={`count-${count}`}
      >
        {/* SIMPLIFIED TO 3 LAYERS */}
        {/* Layer 1: Blur or fallback */}
        {Platform.OS !== 'web' ? (
          <BlurView
            intensity={BLUR.light}
            tint="dark"
            style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.full, overflow: 'hidden' }]}
          >
            {/* Layer 2: Single gradient */}
            <LinearGradient
              colors={isActive ? GRADIENTS.accent : GRADIENTS.glassDepth}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Layer 3: Top highlight */}
            <LinearGradient
              colors={GRADIENTS.topShine}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.chipHighlight}
              pointerEvents="none"
            />
          </BlurView>
        ) : (
          <>
            {/* Web fallback */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.glassLight, borderRadius: RADIUS.full }]} />

            {/* Layer 2: Single gradient */}
            <LinearGradient
              colors={isActive ? GRADIENTS.accent : GRADIENTS.glassDepth}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Layer 3: Top highlight */}
            <LinearGradient
              colors={GRADIENTS.topShine}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.chipHighlight}
              pointerEvents="none"
            />
          </>
        )}

        {/* Chip text */}
        <Text style={[glassStyles.textPrimary, styles.chipText, isActive && styles.chipTextActive]}>
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
    shadowColor: COLORS.accentShadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 10,
  },
  chipHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    borderTopLeftRadius: RADIUS.full,
    borderTopRightRadius: RADIUS.full,
    pointerEvents: 'none',
  },
  chipText: {
    fontSize: 18,
    fontWeight: '700' as const,
    position: 'relative',
    zIndex: 10,
  },
  chipTextActive: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: COLORS.textPrimary,
    textShadowColor: COLORS.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  disabled: {
    opacity: 0.4,
  },
});