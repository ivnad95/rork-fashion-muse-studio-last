import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  COLORS,
  BLUR,
  RADIUS,
  SHADOW,
  GRADIENTS,
  glassStyles,
  SPACING,
} from '@/constants/glassStyles';

// ============================================================================
// TYPES
// ============================================================================

type GlassVariant = 'panel' | 'button' | 'background' | 'modal' | 'card';

interface GlassContainerProps {
  children: React.ReactNode;
  variant?: GlassVariant;
  style?: ViewStyle;
  noPadding?: boolean;
  borderRadius?: number;
}

// ============================================================================
// UNIFIED GLASS CONTAINER COMPONENT
// ============================================================================

/**
 * Unified Glass Container Component
 *
 * Simple 3-layer structure:
 * 1. Blur layer (native) or fallback background (web)
 * 2. Gradient layer for depth
 * 3. Top highlight for glossy effect
 *
 * Usage:
 * <GlassContainer variant="panel">
 *   <Text>Content</Text>
 * </GlassContainer>
 */
const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  variant = 'panel',
  style,
  noPadding = false,
  borderRadius,
}) => {
  // Get variant-specific configuration
  const config = getVariantConfig(variant);
  const finalBorderRadius = borderRadius ?? config.borderRadius;

  return (
    <View
      style={[
        config.containerStyle,
        { borderRadius: finalBorderRadius },
        style,
      ]}
    >
      {/* Layer 1: Blur or Fallback Background */}
      {Platform.OS !== 'web' ? (
        <BlurView
          intensity={config.blurIntensity}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: config.fallbackBackground,
              backdropFilter: `blur(${config.blurIntensity / 2}px)`,
            },
          ]}
        />
      )}

      {/* Layer 2: Gradient for Depth */}
      <LinearGradient
        colors={[...config.gradientColors] as any}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Layer 3: Top Highlight for Glossy Effect */}
      <LinearGradient
        colors={GRADIENTS.topShine}
        style={[
          glassStyles.topHighlight,
          { borderTopLeftRadius: finalBorderRadius, borderTopRightRadius: finalBorderRadius },
        ]}
        pointerEvents="none"
      />

      {/* Content with proper z-index */}
      <View
        style={[
          styles.contentContainer,
          !noPadding && { padding: config.padding },
          { zIndex: 10 },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

// ============================================================================
// VARIANT CONFIGURATIONS
// ============================================================================

interface VariantConfig {
  containerStyle: ViewStyle;
  blurIntensity: number;
  fallbackBackground: string;
  gradientColors: readonly string[];
  borderRadius: number;
  padding: number;
}

const getVariantConfig = (variant: GlassVariant): VariantConfig => {
  switch (variant) {
    case 'panel':
      return {
        containerStyle: {
          ...glassStyles.glassPanel,
          overflow: 'hidden',
        },
        blurIntensity: BLUR.medium,
        fallbackBackground: COLORS.glassLight,
        gradientColors: GRADIENTS.glassDepth,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
      };

    case 'card':
      return {
        containerStyle: {
          ...glassStyles.glassCard,
          overflow: 'hidden',
        },
        blurIntensity: BLUR.medium,
        fallbackBackground: COLORS.glassLight,
        gradientColors: GRADIENTS.glassDepth,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
      };

    case 'button':
      return {
        containerStyle: {
          ...glassStyles.glassButton,
          overflow: 'hidden',
        },
        blurIntensity: BLUR.light,
        fallbackBackground: COLORS.glassLight,
        gradientColors: GRADIENTS.glassDepth,
        borderRadius: RADIUS.xxl,
        padding: SPACING.md,
      };

    case 'background':
      return {
        containerStyle: {
          flex: 1,
          overflow: 'hidden',
        },
        blurIntensity: BLUR.light,
        fallbackBackground: COLORS.glassUltraLight,
        gradientColors: [
          'rgba(58, 89, 130, 0.08)',
          'rgba(42, 73, 114, 0.12)',
          'rgba(26, 57, 98, 0.15)',
        ] as const,
        borderRadius: 0,
        padding: 0,
      };

    case 'modal':
      return {
        containerStyle: {
          borderRadius: RADIUS.xxxl,
          borderWidth: 2,
          borderTopColor: COLORS.borderTop,
          borderLeftColor: COLORS.borderLeft,
          borderRightColor: COLORS.borderRight,
          borderBottomColor: COLORS.borderBottom,
          ...SHADOW.high,
          overflow: 'hidden',
        },
        blurIntensity: BLUR.heavy,
        fallbackBackground: COLORS.glassMedium,
        gradientColors: GRADIENTS.glassDepth,
        borderRadius: RADIUS.xxxl,
        padding: SPACING.xl,
      };

    default:
      return getVariantConfig('panel');
  }
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  contentContainer: {
    position: 'relative',
  },
});

export default GlassContainer;
