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

interface GlowingButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'small' | 'success' | 'warning' | 'danger' | 'ghost';
  icon?: React.ReactNode;
  testID?: string;
}

/**
 * GlowingButton - Deep Sea Glass button component
 * Matches design specification:
 * - Frosted white glass background
 * - Active state uses lightColor3 (#0A76AF) accent
 * - Text: 14-18px semi-bold, silverLight color
 * - Success/Warning/Danger variants with color-matched glows
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

  // Variant color configurations
  const variantColors = {
    default: {
      glow: 'rgba(255, 255, 255, 0.6)',
      shadow: 'rgba(255, 255, 255, 0.4)',
      gradient: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)'] as const,
      accentGradient: null,
    },
    primary: {
      glow: 'rgba(10, 118, 175, 0.6)',
      shadow: 'rgba(10, 118, 175, 0.4)',
      gradient: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)'] as const,
      accentGradient: ['rgba(10, 118, 175, 0.25)', 'rgba(10, 118, 175, 0.15)', 'rgba(10, 118, 175, 0.08)'] as const,
    },
    success: {
      glow: 'rgba(74, 222, 128, 0.6)',
      shadow: 'rgba(74, 222, 128, 0.4)',
      gradient: ['rgba(74, 222, 128, 0.25)', 'rgba(74, 222, 128, 0.15)', 'rgba(74, 222, 128, 0.08)'] as const,
      accentGradient: ['rgba(74, 222, 128, 0.30)', 'rgba(74, 222, 128, 0.18)', 'rgba(74, 222, 128, 0.10)'] as const,
    },
    warning: {
      glow: 'rgba(251, 191, 36, 0.6)',
      shadow: 'rgba(251, 191, 36, 0.4)',
      gradient: ['rgba(251, 191, 36, 0.25)', 'rgba(251, 191, 36, 0.15)', 'rgba(251, 191, 36, 0.08)'] as const,
      accentGradient: ['rgba(251, 191, 36, 0.30)', 'rgba(251, 191, 36, 0.18)', 'rgba(251, 191, 36, 0.10)'] as const,
    },
    danger: {
      glow: 'rgba(239, 68, 68, 0.6)',
      shadow: 'rgba(239, 68, 68, 0.4)',
      gradient: ['rgba(239, 68, 68, 0.25)', 'rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.08)'] as const,
      accentGradient: ['rgba(239, 68, 68, 0.30)', 'rgba(239, 68, 68, 0.18)', 'rgba(239, 68, 68, 0.10)'] as const,
    },
    ghost: {
      glow: 'rgba(255, 255, 255, 0.3)',
      shadow: 'rgba(255, 255, 255, 0.2)',
      gradient: ['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)'] as const,
      accentGradient: null,
    },
    small: {
      glow: 'rgba(255, 255, 255, 0.6)',
      shadow: 'rgba(255, 255, 255, 0.4)',
      gradient: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.03)'] as const,
      accentGradient: null,
    },
  };

  const activeVariantColors = variantColors[variant] || variantColors.default;

  useEffect(() => {
    if (!disabled && ['primary', 'success', 'warning', 'danger'].includes(variant)) {
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
    variant === 'success' && {
      shadowColor: activeVariantColors.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.8,
      shadowRadius: 32,
      elevation: 16,
    },
    variant === 'warning' && {
      shadowColor: activeVariantColors.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.8,
      shadowRadius: 32,
      elevation: 16,
    },
    variant === 'danger' && {
      shadowColor: activeVariantColors.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.8,
      shadowRadius: 32,
      elevation: 16,
    },
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
      {/* Outer glow ring for primary/success/warning/danger variants */}
      {['primary', 'success', 'warning', 'danger'].includes(variant) && !disabled && (
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
              activeVariantColors.glow.replace('0.6', '0.4'),
              activeVariantColors.glow,
              activeVariantColors.glow.replace('0.6', '0.4'),
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
            {/* Blur layer */}
            {Platform.OS === 'web' ? (
              <View style={styles.blurLayerWeb} />
            ) : (
              <BlurView intensity={25} tint="dark" style={styles.blurLayer} />
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
    borderRadius: 32,
    overflow: 'visible',
    position: 'relative',
  },
  containerSmall: {
    minHeight: 36,
    borderRadius: 18,
  },
  containerPrimary: {
    shadowColor: 'rgba(10, 118, 175, 0.6)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 32,
    elevation: 16,
  },
  containerGhost: {
    shadowColor: 'rgba(255, 255, 255, 0.2)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  glowRing: {
    position: 'absolute',
    inset: -10,
    borderRadius: 40,
    overflow: 'hidden',
  },
  glowGradient: {
    flex: 1,
    borderRadius: 40,
  },
  touchable: {
    flex: 1,
    position: 'relative',
    borderRadius: 32,
    overflow: 'hidden',
  },
  outerBorder: {
    flex: 1,
    borderRadius: 32,
    padding: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.30)',
    borderLeftColor: 'rgba(255, 255, 255, 0.24)',
    borderRightColor: 'rgba(255, 255, 255, 0.14)',
    borderBottomColor: 'rgba(255, 255, 255, 0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 29,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 25, 35, 0.6)',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
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
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
    opacity: 0.6,
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
    color: '#F5F7FA',
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 22,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  textPrimary: {
    color: '#FFFFFF',
    fontWeight: '800' as const,
    fontSize: 19,
    letterSpacing: -0.6,
    textShadowColor: 'rgba(10, 118, 175, 0.8)',           // Spec: accent color glow for primary
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
});
