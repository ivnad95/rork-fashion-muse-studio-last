import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';

interface ProgressBarProps {
  progress: number; // 0-100
  total?: number;
  current?: number;
  label?: string;
  style?: ViewStyle;
  showPercentage?: boolean;
}

/**
 * ProgressBar - Premium animated progress indicator
 *
 * Features:
 * - Glass morphism design
 * - Animated progress with smooth transitions
 * - Optional labels and counts
 * - Gradient fill with accent color
 */
export default function ProgressBar({
  progress,
  total,
  current,
  label,
  style,
  showPercentage = true,
}: ProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress
    Animated.spring(progressAnim, {
      toValue: progress,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();

    // Animate glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [progress]);

  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Label and count */}
      {(label || (current !== undefined && total !== undefined)) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {current !== undefined && total !== undefined && (
            <Text style={styles.count}>
              {current} / {total}
            </Text>
          )}
        </View>
      )}

      {/* Progress track */}
      <View style={styles.track}>
        {/* Background */}
        <View style={styles.trackBg} />

        {/* Progress fill */}
        <Animated.View style={[styles.fillContainer, { width: widthInterpolation }]}>
          {/* Glow layer */}
          <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

          {/* Gradient fill */}
          <LinearGradient
            colors={[
              'rgba(14, 165, 233, 0.60)',
              'rgba(14, 165, 233, 0.80)',
              'rgba(14, 165, 233, 0.60)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />

          {/* Top shine */}
          <View style={styles.shine} />
        </Animated.View>

        {/* Percentage text */}
        {showPercentage && (
          <View style={styles.percentageContainer}>
            <Text style={styles.percentage}>{Math.round(progress)}%</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    ...TEXT_STYLES.labelPrimary,
    color: COLORS.silverLight,
  },
  count: {
    ...TEXT_STYLES.captionSecondary,
    color: COLORS.silverMid,
  },
  track: {
    height: 8,
    borderRadius: RADIUS.sm / 2,
    position: 'relative',
    overflow: 'hidden',
  },
  trackBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: RADIUS.sm / 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  fillContainer: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: RADIUS.sm / 2,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14, 165, 233, 0.30)',
    shadowColor: COLORS.shadowAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.80,
    shadowRadius: 8,
    elevation: 4,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.sm / 2,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderTopLeftRadius: RADIUS.sm / 2,
    borderTopRightRadius: RADIUS.sm / 2,
  },
  percentageContainer: {
    position: 'absolute',
    right: SPACING.xs,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  percentage: {
    ...TEXT_STYLES.caption,
    color: COLORS.silverLight,
    fontSize: 10,
    fontWeight: '700' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.60)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
