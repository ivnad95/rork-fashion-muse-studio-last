import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle, DimensionValue } from 'react-native';
import { COLORS, RADIUS } from '@/constants/glassStyles';

interface ShimmerLoaderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function ShimmerLoader({
  width = '100%',
  height = '100%',
  borderRadius = RADIUS.xl,
  style,
}: ShimmerLoaderProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 2-second loop animation (1 second forward, 1 second back)
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
        },
        style,
        width !== undefined && { width },
        height !== undefined && { height },
      ]}
    >
      {/* Animated shimmer sweep */}
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.glassBase,          // Updated to match new palette
    overflow: 'hidden',
    // Refined border to match new design system
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  shimmer: {
    width: 300,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',  // More subtle shimmer
    transform: [{ skewX: '-20deg' }],
  },
});
