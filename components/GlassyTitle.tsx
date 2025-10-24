import React, { useRef, useEffect } from 'react';
import { Text, ViewStyle, View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GlassPanel from '@/components/GlassPanel';
import { COLORS } from '@/constants/glassStyles';

interface GlassyTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function GlassyTitle({ children, style }: GlassyTitleProps) {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle pulsing glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <View style={[styles.container, style]}>
      {/* Animated glow layer */}
      <Animated.View style={[styles.glowLayer, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={[
            'rgba(10, 118, 175, 0.3)',                      // Spec: accent color glow
            'rgba(10, 118, 175, 0.5)',
            'rgba(10, 118, 175, 0.3)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <GlassPanel style={styles.panel} radius={24}>
        {/* Gradient overlay for depth */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.02)',
            'rgba(255, 255, 255, 0.01)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        />

        {/* Title text with premium styling */}
        <Text style={styles.titleText}>{children}</Text>

        {/* Gradient text effect overlay (simulated) */}
        <LinearGradient
          colors={[
            'rgba(10, 118, 175, 0.15)',
            'transparent',
            'rgba(10, 118, 175, 0.10)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.textGradientOverlay}
          pointerEvents="none"
        />
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 8,
  },
  glowLayer: {
    position: 'absolute',
    inset: -6,
    borderRadius: 30,
    zIndex: 0,
  },
  panel: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
    shadowColor: 'rgba(10, 118, 175, 0.4)',              // Spec: accent color shadow
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 24,
    zIndex: 1,
  },
  titleText: {
    color: COLORS.silverLight,                            // Spec: near-white text
    fontSize: 38,
    fontWeight: '800' as const,
    lineHeight: 44,
    letterSpacing: -1.5,
    textAlign: 'center',
    zIndex: 10,
    textShadowColor: 'rgba(10, 118, 175, 0.6)',         // Spec: accent color glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  textGradientOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 24,
    zIndex: 5,
  },
});