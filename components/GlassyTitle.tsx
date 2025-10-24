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
      {/* Subtle animated glow layer */}
      <Animated.View style={[styles.glowLayer, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={[
            'rgba(14, 165, 233, 0.20)',                     // Updated refined accent
            'rgba(14, 165, 233, 0.30)',
            'rgba(14, 165, 233, 0.20)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <GlassPanel style={styles.panel} radius={24}>
        {/* Subtle gradient overlay */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.03)',                    // More subtle
            'rgba(255, 255, 255, 0.01)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        />

        {/* Title text with refined styling */}
        <Text style={styles.titleText}>{children}</Text>

        {/* Minimal accent gradient overlay */}
        <LinearGradient
          colors={[
            'rgba(14, 165, 233, 0.10)',                     // Updated accent
            'transparent',
            'rgba(14, 165, 233, 0.06)',
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
    marginBottom: 12,                                   // Increased spacing
  },
  glowLayer: {
    position: 'absolute',
    inset: -4,                                          // Reduced from -6
    borderRadius: 28,
    zIndex: 0,
  },
  panel: {
    padding: 18,                                        // Reduced from 20
    position: 'relative',
    zIndex: 1,
    shadowColor: 'rgba(14, 165, 233, 0.30)',            // Updated accent, more subtle
    shadowOffset: { width: 0, height: 8 },              // Reduced from 12
    shadowOpacity: 0.50,                                // Reduced from 0.6
    shadowRadius: 20,                                   // Reduced from 24
    elevation: 10,
  },
  gradientOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 24,
    zIndex: 1,
  },
  titleText: {
    color: COLORS.silverLight,                          // Pure white text
    fontSize: 34,                                       // Reduced from 38
    fontWeight: '700' as const,                         // Reduced from 800
    lineHeight: 40,                                     // Adjusted
    letterSpacing: -1.2,                                // Less tight
    textAlign: 'center',
    zIndex: 10,
    textShadowColor: 'rgba(14, 165, 233, 0.40)',        // Updated accent, more subtle
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,                               // Reduced from 20
  },
  textGradientOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 24,
    zIndex: 5,
  },
});