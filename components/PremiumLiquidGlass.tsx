import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface PremiumLiquidGlassProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'primary';
  borderRadius?: number;
  testID?: string;
}

/**
 * PremiumLiquidGlass - Deep Sea Glass glassmorphism component
 * Spec: Frosted white glass panels floating on deep blue background
 * - Background: rgba(255, 255, 255, 0.03) - extremely low opacity white
 * - Border: rgba(255, 255, 255, 0.1) - subtle light border
 * - Blur: 20-30 intensity for authentic frosted glass effect
 */
export default function PremiumLiquidGlass({
  children,
  style,
  variant = 'default',
  borderRadius = 24,
  testID,
}: PremiumLiquidGlassProps) {
  return (
    <View
      style={[
        styles.container,
        { borderRadius },
        variant === 'elevated' && styles.elevated,
        variant === 'primary' && styles.primary,
        style,
      ]}
      testID={testID ?? 'premium-glass'}
      pointerEvents="box-none"
    >
      {/* Glassmorphism container */}
      <View style={[styles.glassContainer, { borderRadius }]} pointerEvents="box-none">
        {/* Blur layer */}
        {Platform.OS === 'web' ? (
          <View style={[styles.blurLayerWeb, { borderRadius }]} pointerEvents="none" />
        ) : (
          <BlurView
            intensity={25}
            tint="dark"
            style={[styles.blurLayer, { borderRadius }]}
            pointerEvents="none"
          />
        )}

        {/* Content layer */}
        <View style={[styles.content, { borderRadius }]} testID="premium-glass-content">
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 35,
    elevation: 12,
  },
  primary: {
    shadowColor: 'rgba(10, 118, 175, 0.5)',  // lightColor3 accent
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 35,
    elevation: 15,
  },
  glassContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',  // Spec: extremely low opacity white
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',       // Spec: subtle light border
    overflow: 'hidden',
  },
  blurLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  blurLayerWeb: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 10,
  },
});
