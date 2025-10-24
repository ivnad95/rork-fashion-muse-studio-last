import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, RADIUS } from '@/constants/glassStyles';

interface GlowingButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'small' | 'ghost';
  icon?: React.ReactNode;
  testID?: string;
}

/**
 * GlowingButton - Deep Sea Glass button component
 *
 * Variants:
 * - default: Standard glass button with white borders
 * - primary: Accent (#0A76AF) glow with animated pulse
 * - small: Compact size for secondary actions
 * - ghost: Ultra-minimal transparent variant
 *
 * Features:
 * - Blur intensity 28 (standardized)
 * - Multi-layer glass structure (outer border + inner surface + top highlight)
 * - Animated scale on press (spring physics)
 * - Haptic feedback on mobile
 * - Accent glow animation (2-second loop) for primary variant
 */
export default function GlowingButton({
  onPress,
  children,
  text,
  style,
  textStyle,
  disabled = false,
  variant = 'default',
  icon,
  testID,
}: GlowingButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  // Simplified and more subtle variant configurations
  const variantColors = {
    default: {
      glow: 'rgba(255, 255, 255, 0.40)',
      shadow: 'rgba(0, 0, 0, 0.50)',
      gradient: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.02)'] as const,
      accentGradient: null,
    },
    primary: {
      glow: 'rgba(14, 165, 233, 0.45)',     // Updated accent
      shadow: 'rgba(14, 165, 233, 0.50)',   // Updated accent
      gradient: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.02)'] as const,
      accentGradient: ['rgba(14, 165, 233, 0.18)', 'rgba(14, 165, 233, 0.12)', 'rgba(14, 165, 233, 0.06)'] as const,
    },
    ghost: {
      glow: 'rgba(255, 255, 255, 0.20)',
      shadow: 'rgba(0, 0, 0, 0.25)',
      gradient: ['rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.01)'] as const,
      accentGradient: null,
    },
    small: {
      glow: 'rgba(255, 255, 255, 0.40)',
      shadow: 'rgba(0, 0, 0, 0.50)',
      gradient: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.02)'] as const,
      accentGradient: null,
    },
  };

  const activeVariantColors = variantColors[variant] || variantColors.default;

  // Animated glow pulse for primary variant only
  useEffect(() => {
    if (!disabled && variant === 'primary') {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [disabled, variant, glowAnim]);

  const handlePressIn = () => {
    // Haptic feedback on press
    if (Platform.OS !== 'web' && !disabled) {
      const Haptics = require('expo-haptics');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 45,
      useNativeDriver: true,
    }).start();
  };

  const containerStyle = [
    styles.container,
    variant === 'small' && styles.containerSmall,
    variant === 'primary' && styles.containerPrimary,
    variant === 'ghost' && styles.containerGhost,
    style,
  ];

  return (
    <Animated.View
      style={[
        containerStyle,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
      testID={testID ?? 'glowing-button'}
    >
      {/* Outer glow ring for primary variant only */}
      {variant === 'primary' && !disabled && (
        <Animated.View
          style={[
            styles.glowRing,
            {
              opacity: glowAnim,
            },
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(10, 118, 175, 0.40)', // Accent glow - edges
              'rgba(10, 118, 175, 0.60)', // Accent glow - center
              'rgba(10, 118, 175, 0.40)', // Accent glow - edges
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glowGradient}
          />
        </Animated.View>
      )}

      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={styles.touchable}
      >
        {/* Multi-layer glass container */}
        <View style={styles.outerBorder}>
          {/* Inner glass surface */}
          <View style={styles.innerContainer}>
            {/* Blur layer (standardized intensity 28) */}
            {Platform.OS === 'web' ? (
              <View style={styles.blurLayerWeb} />
            ) : (
              <BlurView intensity={28} tint="dark" style={styles.blurLayer} />
            )}

            {/* Base gradient overlay */}
            <LinearGradient
              colors={activeVariantColors.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.baseGradient}
            />

            {/* Accent gradient for colored variants */}
            {activeVariantColors.accentGradient && (
              <LinearGradient
                colors={activeVariantColors.accentGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.accentGradient}
              />
            )}

            {/* Top glossy highlight */}
            <View style={styles.topHighlight} />

            {/* Content */}
            <View style={styles.content}>
              {icon && icon}
              {text && (
                <Text
                  style={[
                    styles.text,
                    variant === 'small' && styles.textSmall,
                    variant === 'primary' && styles.textPrimary,
                    textStyle,
                  ]}
                >
                  {text}
                </Text>
              )}
              {children}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 64,
    borderRadius: RADIUS.xxxl,              // 32px for buttons
    overflow: 'visible',
    position: 'relative',
  },
  containerSmall: {
    minHeight: 36,
    borderRadius: 18,
  },
  containerPrimary: {
    shadowColor: COLORS.shadowAccent,       // Accent shadow for primary
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.90,
    shadowRadius: 32,
    elevation: 16,
  },
  containerGhost: {
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 6,
  },
  glowRing: {
    position: 'absolute',
    inset: -10,
    borderRadius: 42,                       // Slightly larger than container
    overflow: 'hidden',
  },
  glowGradient: {
    flex: 1,
    borderRadius: 42,
  },
  touchable: {
    flex: 1,
    position: 'relative',
    borderRadius: RADIUS.xxxl,
    overflow: 'hidden',
  },
  outerBorder: {
    flex: 1,
    borderRadius: RADIUS.xxxl,
    padding: 2,                                     // Reduced from 3
    backgroundColor: COLORS.glassBase,
    borderWidth: 1,                                 // Reduced from 2.5
    borderTopColor: 'rgba(255, 255, 255, 0.20)',    // Simplified
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 6 },          // Reduced from 8
    shadowOpacity: 0.50,
    shadowRadius: 12,                               // Reduced from 16
    elevation: 6,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 30,                               // Adjusted
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 25, 35, 0.5)',       // More transparent
    borderWidth: 1,                                 // Reduced from 1.5
    borderTopColor: 'rgba(255, 255, 255, 0.10)',    // More subtle
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    borderRightColor: 'rgba(255, 255, 255, 0.04)',
    borderBottomColor: 'rgba(255, 255, 255, 0.02)',
    position: 'relative',
  },
  blurLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  blurLayerWeb: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(20, 25, 35, 0.7)',
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
    height: '35%',                                  // Reduced from 40%
    backgroundColor: 'rgba(255, 255, 255, 0.12)',   // More subtle
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    opacity: 0.5,                                   // More subtle
    zIndex: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    zIndex: 10,
  },
  text: {
    color: COLORS.silverLight,              // Pure white primary text
    fontSize: 16,                           // Reduced from 17
    fontWeight: '600' as const,             // Lighter weight
    lineHeight: 22,
    letterSpacing: -0.3,                    // Less tight
    textShadowColor: 'rgba(0, 0, 0, 0.40)', // More subtle shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,                    // Reduced from 3
  },
  textSmall: {
    fontSize: 14,
    fontWeight: '500' as const,             // Lighter weight
    lineHeight: 18,
  },
  textPrimary: {
    color: COLORS.silverLight,
    fontWeight: '700' as const,             // Reduced from 800
    fontSize: 17,                           // Reduced from 19
    letterSpacing: -0.4,                    // Less tight
    textShadowColor: COLORS.accentGlow,     // Updated accent glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,                   // Reduced from 16
  },
});
