import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { glassStyles, COLORS } from '@/constants/glassStyles';

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
      {/* Animated glow for active state */}
      {isActive && (
        <Animated.View style={[styles.activeGlow, { opacity: glowOpacity }]}>
          <LinearGradient
            colors={[
              'rgba(10, 118, 175, 0.4)',                    // Spec: accent color #0A76AF
              'rgba(10, 118, 175, 0.6)',
              'rgba(10, 118, 175, 0.4)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
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
        {/* Outer border with gradient */}
        <View style={[styles.chipOuter, isActive && styles.chipOuterActive]}>
          {/* Inner glass surface */}
          <View style={[styles.chipInner, isActive && styles.chipInnerActive]}>
            {/* Blur layer */}
            {Platform.OS === 'web' ? (
              <View style={[styles.blurLayerWeb, { borderRadius: 20 }]} />
            ) : (
              <BlurView intensity={isActive ? 20 : 25} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
            )}

            {/* Base gradient */}
            <LinearGradient
              colors={
                isActive
                  ? ['rgba(10, 118, 175, 0.25)', 'rgba(10, 118, 175, 0.15)', 'rgba(10, 118, 175, 0.08)']  // Spec: accent for active
                  : ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Top shine */}
            <LinearGradient
              colors={[
                isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.6 }}
              style={styles.chipShine}
            />

            {/* Content */}
            <View style={styles.chipContent}>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {count}
              </Text>
            </View>
          </View>
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
    zIndex: 0,
  },
  chip: {
    width: 56,
    height: 56,
    borderRadius: 28,
    zIndex: 1,
  },
  chipOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    borderLeftColor: 'rgba(255, 255, 255, 0.18)',
    borderRightColor: 'rgba(255, 255, 255, 0.10)',
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  chipOuterActive: {
    borderTopColor: 'rgba(10, 118, 175, 0.55)',          // Spec: accent color for active
    borderLeftColor: 'rgba(10, 118, 175, 0.45)',
    borderRightColor: 'rgba(10, 118, 175, 0.30)',
    borderBottomColor: 'rgba(10, 118, 175, 0.20)',
    shadowColor: 'rgba(10, 118, 175, 0.6)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 12,
  },
  chipInner: {
    flex: 1,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 25, 35, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chipInnerActive: {
    backgroundColor: 'rgba(10, 118, 175, 0.15)',
  },
  blurLayerWeb: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(20, 25, 35, 0.7)',
  },
  chipShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    zIndex: 1,
  },
  chipContent: {
    zIndex: 10,
  },
  chipText: {
    color: COLORS.silverMid,                             // Spec: secondary text
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  chipTextActive: {
    color: COLORS.silverLight,                           // Spec: near-white for active
    fontSize: 20,
    fontWeight: '800' as const,
    textShadowColor: 'rgba(10, 118, 175, 0.8)',         // Spec: accent glow for active
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  disabled: {
    opacity: 0.4,
  },
});