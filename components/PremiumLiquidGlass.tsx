import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface PremiumLiquidGlassProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'primary' | 'luxury' | 'accent';
  colorTint?: 'blue' | 'purple' | 'teal' | 'warm' | 'none';
  borderRadius?: number;
  glowIntensity?: 'none' | 'subtle' | 'medium' | 'strong';
  testID?: string;
}

/**
 * PremiumLiquidGlass - Deep Sea Glass glassmorphism component
 * Multi-layer glass morphism with:
 * - Frosted blur effect (intensity 25-30)
 * - Multi-stage gradient borders for 3D depth
 * - Top glossy highlight layer for authentic glass reflection
 * - Layered gradients for light refraction
 * - Deep shadows for floating effect
 * - Color tinting for purple, teal, warm accent variants
 * - Luxury variant with enhanced borders and glow
 */
export default function PremiumLiquidGlass({
  children,
  style,
  variant = 'default',
  colorTint = 'none',
  borderRadius = 24,
  glowIntensity = 'none',
  testID,
}: PremiumLiquidGlassProps) {
  // Color tint configurations
  const tintColors = {
    blue: {
      gradient: ['rgba(100, 150, 200, 0.15)', 'rgba(100, 150, 200, 0.08)', 'rgba(100, 150, 200, 0.04)'] as const,
      shadow: Colors.dark.shadowBlue,
      border: {
        top: 'rgba(150, 180, 240, 0.35)',
        left: 'rgba(150, 180, 240, 0.28)',
        right: 'rgba(150, 180, 240, 0.15)',
        bottom: 'rgba(150, 180, 240, 0.08)',
      },
    },
    purple: {
      gradient: ['rgba(150, 100, 200, 0.15)', 'rgba(150, 100, 200, 0.08)', 'rgba(150, 100, 200, 0.04)'] as const,
      shadow: Colors.dark.shadowPurple,
      border: {
        top: 'rgba(180, 150, 240, 0.35)',
        left: 'rgba(180, 150, 240, 0.28)',
        right: 'rgba(180, 150, 240, 0.15)',
        bottom: 'rgba(180, 150, 240, 0.08)',
      },
    },
    teal: {
      gradient: ['rgba(100, 200, 200, 0.15)', 'rgba(100, 200, 200, 0.08)', 'rgba(100, 200, 200, 0.04)'] as const,
      shadow: Colors.dark.shadowTeal,
      border: {
        top: 'rgba(100, 220, 220, 0.35)',
        left: 'rgba(100, 220, 220, 0.28)',
        right: 'rgba(100, 220, 220, 0.15)',
        bottom: 'rgba(100, 220, 220, 0.08)',
      },
    },
    warm: {
      gradient: ['rgba(240, 180, 120, 0.15)', 'rgba(240, 180, 120, 0.08)', 'rgba(240, 180, 120, 0.04)'] as const,
      shadow: Colors.dark.shadowWarm,
      border: {
        top: 'rgba(240, 200, 150, 0.35)',
        left: 'rgba(240, 200, 150, 0.28)',
        right: 'rgba(240, 200, 150, 0.15)',
        bottom: 'rgba(240, 200, 150, 0.08)',
      },
    },
    none: {
      gradient: ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'] as const,
      shadow: Colors.dark.shadowBlack,
      border: {
        top: 'rgba(255, 255, 255, 0.25)',
        left: 'rgba(255, 255, 255, 0.18)',
        right: 'rgba(255, 255, 255, 0.10)',
        bottom: 'rgba(255, 255, 255, 0.06)',
      },
    },
  };

  const activeTint = tintColors[colorTint];
  return (
    <View
      style={[
        styles.container,
        { borderRadius },
        variant === 'elevated' && styles.elevated,
        variant === 'primary' && styles.primary,
        variant === 'luxury' && styles.luxury,
        variant === 'accent' && styles.accent,
        colorTint !== 'none' && {
          shadowColor: activeTint.shadow,
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.8,
          shadowRadius: 40,
          elevation: 20,
        },
        style,
      ]}
      testID={testID ?? 'premium-glass'}
      pointerEvents="box-none"
    >
      {/* Outer border layer with gradient */}
      <View
        style={[
          styles.outerBorder,
          { borderRadius },
          colorTint !== 'none' && {
            borderTopColor: activeTint.border.top,
            borderLeftColor: activeTint.border.left,
            borderRightColor: activeTint.border.right,
            borderBottomColor: activeTint.border.bottom,
          },
        ]}
        pointerEvents="box-none"
      >
        {/* Inner glass container */}
        <View style={[styles.glassContainer, { borderRadius: borderRadius - 2.5 }]} pointerEvents="box-none">
          {/* Blur layer */}
          {Platform.OS === 'web' ? (
            <View style={[styles.blurLayerWeb, { borderRadius: borderRadius - 2.5 }]} pointerEvents="none" />
          ) : (
            <BlurView
              intensity={28}
              tint="dark"
              style={[styles.blurLayer, { borderRadius: borderRadius - 2.5 }]}
              pointerEvents="none"
            />
          )}

          {/* Base gradient overlay for depth */}
          <LinearGradient
            colors={activeTint.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.baseGradient, { borderRadius: borderRadius - 2.5 }]}
            pointerEvents="none"
          />

          {/* Accent gradient for primary variant */}
          {variant === 'primary' && (
            <LinearGradient
              colors={[
                'rgba(10, 118, 175, 0.18)',
                'rgba(10, 118, 175, 0.10)',
                'rgba(10, 118, 175, 0.05)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.accentGradient, { borderRadius: borderRadius - 2.5 }]}
              pointerEvents="none"
            />
          )}

          {/* Enhanced gradient for luxury variant */}
          {variant === 'luxury' && (
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.20)',
                'rgba(255, 255, 255, 0.12)',
                'rgba(255, 255, 255, 0.06)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.accentGradient, { borderRadius: borderRadius - 2.5 }]}
              pointerEvents="none"
            />
          )}

          {/* Top glossy highlight for 3D glass effect */}
          <View style={[styles.topHighlight, { borderTopLeftRadius: borderRadius - 2.5, borderTopRightRadius: borderRadius - 2.5 }]} pointerEvents="none" />

          {/* Content layer */}
          <View style={[styles.content, { borderRadius: borderRadius - 2.5 }]} testID="premium-glass-content">
            {children}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.7,
    shadowRadius: 40,
    elevation: 18,
  },
  primary: {
    shadowColor: 'rgba(10, 118, 175, 0.6)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  luxury: {
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.9,
    shadowRadius: 50,
    elevation: 24,
  },
  accent: {
    shadowColor: 'rgba(150, 180, 240, 0.6)',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.85,
    shadowRadius: 38,
    elevation: 18,
  },
  outerBorder: {
    position: 'relative',
    padding: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    borderLeftColor: 'rgba(255, 255, 255, 0.18)',
    borderRightColor: 'rgba(255, 255, 255, 0.10)',
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  glassContainer: {
    position: 'relative',
    backgroundColor: 'rgba(20, 25, 35, 0.55)',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
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
    backgroundColor: 'rgba(20, 25, 35, 0.65)',
    zIndex: 1,
  },
  baseGradient: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
  },
  accentGradient: {
    position: 'absolute',
    inset: 0,
    zIndex: 3,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    opacity: 0.5,
    zIndex: 4,
  },
  content: {
    position: 'relative',
    zIndex: 10,
  },
});
