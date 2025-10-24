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
      toValue: isActive ? 1.02 : 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();

    // Removed heavy glow animation for minimal aesthetic
    glowAnim.setValue(0);
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
      toValue: isActive ? 1.02 : 1,
      friction: 6,
      tension: 60,
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
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.minimalChip,
          isActive && styles.minimalChipActive,
          disabled && styles.disabled,
        ]}
        activeOpacity={0.9}
        testID={`count-${count}`}
      >
        {/* Top highlight only */}
        <LinearGradient
          colors={[
            isActive ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
            'rgba(255, 255, 255, 0.02)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.chipHighlight}
          pointerEvents="none"
        />

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
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipWrapper: {
    position: 'relative',
  },
  minimalChip: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftColor: 'rgba(255, 255, 255, 0.06)',
    borderRightColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomColor: 'rgba(255, 255, 255, 0.02)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  minimalChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopColor: `${COLORS.accent}35`,
    borderLeftColor: `${COLORS.accent}28`,
    borderRightColor: `${COLORS.accent}18`,
    borderBottomColor: `${COLORS.accent}10`,
    shadowColor: COLORS.accentShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  chipHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: RADIUS.full,
    borderTopRightRadius: RADIUS.full,
    pointerEvents: 'none',
  },
  chipText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: COLORS.textSecondary,
    zIndex: 10,
  },
  chipTextActive: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
  },
  disabled: {
    opacity: 0.4,
  },
});