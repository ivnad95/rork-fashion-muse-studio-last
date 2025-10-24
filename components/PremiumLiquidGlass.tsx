import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS } from '@/constants/glassStyles';
import { NEU_COLORS } from '@/constants/neumorphicStyles';

interface PremiumLiquidGlassProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'primary';
  borderRadius?: number;
  testID?: string;
}

/**
 * PremiumLiquidGlass - Deep Sea Glass full-screen background component
 *
 * Simplified variants:
 * - default: Standard glass with white borders and black shadow
 * - primary: Accent (#0A76AF) glow and tint
 *
 * Features:
 * - Blur intensity 28 (standardized)
 * - Multi-layer glass structure (outer border + inner surface + top highlight)
 * - 3-layer shadow system
 * - Top highlight gradient (30% height) for glossy effect
 * - Platform-specific blur handling
 */
export default function PremiumLiquidGlass({
  children,
  style,
  variant = 'default',
  borderRadius = RADIUS.xl,
  testID,
}: PremiumLiquidGlassProps) {
  // Blue gradient configuration using new palette
  const gradient = variant === 'primary'
    ? ([
        'rgba(88, 169, 230, 0.25)',
        'rgba(59, 130, 201, 0.15)',
        'rgba(37, 99, 171, 0.10)'
      ] as const)
    : ([
        NEU_COLORS.gradient1,
        NEU_COLORS.gradient2,
        NEU_COLORS.gradient3,
      ] as const);

  const shadow = variant === 'primary' ? NEU_COLORS.accentGlow : NEU_COLORS.shadowBlack;
  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          shadowColor: shadow,
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: variant === 'primary' ? 0.80 : 0.65,
          shadowRadius: 40,
          elevation: 20,
        },
        style,
      ]}
      testID={testID ?? 'premium-glass'}
      pointerEvents="box-none"
    >
      {/* Outer border layer */}
      <View
        style={[
          styles.outerBorder,
          { borderRadius },
        ]}
        pointerEvents="box-none"
      >
        {/* Inner glass container */}
        <View style={[styles.glassContainer, { borderRadius: borderRadius - 2.5 }]} pointerEvents="box-none">
          {/* Blur layer (standardized intensity 28) */}
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
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.baseGradient, { borderRadius: borderRadius - 2.5 }]}
            pointerEvents="none"
          />

          {/* Top glossy highlight (30% height) */}
          <View
            style={[
              styles.topHighlight,
              {
                borderTopLeftRadius: borderRadius - 2.5,
                borderTopRightRadius: borderRadius - 2.5,
              },
            ]}
            pointerEvents="none"
          />

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
  outerBorder: {
    position: 'relative',
    padding: 2.5,
    backgroundColor: COLORS.glassBase,
    borderWidth: 2.5,
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    overflow: 'hidden',
  },
  glassContainer: {
    position: 'relative',
    backgroundColor: NEU_COLORS.glassBase,
    borderWidth: 1.5,
    borderTopColor: NEU_COLORS.borderTop,
    borderLeftColor: NEU_COLORS.borderLeft,
    borderRightColor: NEU_COLORS.borderRight,
    borderBottomColor: NEU_COLORS.borderBottom,
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
    backgroundColor: NEU_COLORS.glassBase,
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
    backgroundColor: NEU_COLORS.refractionLight,
    opacity: 0.6,
    zIndex: 4,
  },
  content: {
    position: 'relative',
    zIndex: 10,
  },
});
