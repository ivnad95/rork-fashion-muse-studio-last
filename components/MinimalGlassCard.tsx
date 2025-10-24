import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { glassStyles, COLORS, BLUR, GRADIENTS } from '@/constants/glassStyles';

interface MinimalGlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  blur?: boolean;
}

/**
 * Minimal Glass Card Component
 * Ultra-subtle glass morphism card with minimal visual weight
 * Perfect for premium, minimal aesthetic
 */
export default function MinimalGlassCard({
  children,
  style,
  blur = true
}: MinimalGlassCardProps) {
  return (
    <View style={[glassStyles.glassCardMinimal, style]}>
      {/* Blur layer for native platforms */}
      {Platform.OS !== 'web' && blur && (
        <BlurView
          intensity={BLUR.minimal}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Top highlight gradient for glass effect */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.08)',
          'rgba(255, 255, 255, 0.03)',
          'transparent',
        ]}
        style={styles.topHighlight}
        pointerEvents="none"
      />

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  content: {
    zIndex: 10,
  },
});
