import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { neumorphicStyles, NEU_COLORS, NEU_RADIUS } from '@/constants/neumorphicStyles';

interface NeumorphicButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export default function NeumorphicButton({
  title,
  onPress,
  disabled = false,
  active = false,
  style,
  textStyle,
  size = 'medium',
  fullWidth = false,
}: NeumorphicButtonProps) {
  const pressAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  React.useEffect(() => {
    if (active) {
      // Pulsing glow effect for active buttons
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [active, glowAnim]);

  const handlePressIn = () => {
    if (!disabled && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Enhanced spring animation - more tactile feel
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
      tension: 300,
    }).start();
  };

  const handlePressOut = () => {
    // Bouncy spring back animation
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 200,
    }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  // Size variants
  const sizeStyles = {
    small: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      fontSize: 14,
    },
    medium: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      fontSize: 16,
    },
    large: {
      paddingVertical: 20,
      paddingHorizontal: 40,
      fontSize: 18,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        fullWidth && { width: '100%' },
        {
          transform: [{ scale: pressAnim }],
        },
      ]}
    >
      {/* Active glow effect */}
      {active && (
        <Animated.View
          style={[
            styles.glowLayer,
            {
              borderRadius: NEU_RADIUS.xxl,
              opacity: glowAnim,
            }
          ]}
        >
          <LinearGradient
            colors={[
              NEU_COLORS.accentGlow,
              'rgba(88, 169, 230, 0.4)',
              NEU_COLORS.accentGlow,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: NEU_RADIUS.xxl }]}
          />
        </Animated.View>
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        style={[
          styles.buttonContainer,
          {
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
            borderRadius: NEU_RADIUS.xxl,
          },
          fullWidth && { width: '100%' },
          disabled && styles.disabled,
          style,
        ]}
      >
        {/* Platform-specific glass layers */}
        {Platform.OS !== 'web' ? (
          <BlurView
            intensity={active ? 20 : 15}
            tint="light"
            style={[StyleSheet.absoluteFill, { borderRadius: NEU_RADIUS.xxl, overflow: 'hidden' }]}
          >
            {/* Base gradient layers */}
            <LinearGradient
              colors={active ?
                [
                  'rgba(88, 169, 230, 0.4)',
                  'rgba(59, 130, 201, 0.5)',
                  'rgba(37, 99, 171, 0.6)'
                ] :
                [
                  NEU_COLORS.gradient1,
                  NEU_COLORS.gradient2,
                  NEU_COLORS.gradient3,
                ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: NEU_RADIUS.xxl }]}
            />

            {/* Light refraction gradient (top 35%) */}
            <LinearGradient
              colors={[
                active ? 'rgba(200, 220, 255, 0.15)' : NEU_COLORS.refractionLight,
                active ? 'rgba(150, 180, 230, 0.10)' : NEU_COLORS.refractionMid,
                'transparent'
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.refractionLayer, { borderRadius: NEU_RADIUS.xxl }]}
            />

            {/* Top shine highlight */}
            <View style={[styles.topShine, { borderRadius: NEU_RADIUS.xxl }]} />

            {/* Border highlights */}
            <View
              style={[
                styles.borderHighlights,
                { borderRadius: NEU_RADIUS.xxl - 1 },
                active && styles.activeBorderHighlights,
              ]}
            />
          </BlurView>
        ) : (
          <>
            {/* Web fallback */}
            <LinearGradient
              colors={active ?
                [
                  'rgba(88, 169, 230, 0.4)',
                  'rgba(59, 130, 201, 0.5)',
                  'rgba(37, 99, 171, 0.6)'
                ] :
                [
                  NEU_COLORS.gradient1,
                  NEU_COLORS.gradient2,
                  NEU_COLORS.gradient3,
                ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: NEU_RADIUS.xxl }]}
            />

            {/* Light refraction layer */}
            <LinearGradient
              colors={[
                active ? 'rgba(200, 220, 255, 0.15)' : NEU_COLORS.refractionLight,
                active ? 'rgba(150, 180, 230, 0.10)' : NEU_COLORS.refractionMid,
                'transparent'
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.refractionLayer, { borderRadius: NEU_RADIUS.xxl }]}
            />

            {/* Top shine effect */}
            <View style={[styles.topShine, { borderRadius: NEU_RADIUS.xxl }]} />

            {/* Border highlights */}
            <View
              style={[
                styles.borderHighlights,
                { borderRadius: NEU_RADIUS.xxl - 1 },
                active && styles.activeBorderHighlights,
              ]}
            />
          </>
        )}

        {/* Button text */}
        <Text
          style={[
            styles.buttonText,
            { fontSize: currentSize.fontSize },
            active && styles.activeText,
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'relative',
  },
  glowLayer: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    pointerEvents: 'none',
    shadowColor: NEU_COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderTopColor: NEU_COLORS.borderTop,
    borderLeftColor: NEU_COLORS.borderLeft,
    borderRightColor: NEU_COLORS.borderRight,
    borderBottomColor: NEU_COLORS.borderBottom,
    overflow: 'hidden',
    shadowColor: NEU_COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  refractionLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    pointerEvents: 'none',
  },
  topShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: NEU_COLORS.glassShine,
    pointerEvents: 'none',
  },
  borderHighlights: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    borderLeftColor: 'rgba(255, 255, 255, 0.10)',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    pointerEvents: 'none',
  },
  activeBorderHighlights: {
    borderTopColor: 'rgba(255, 255, 255, 0.20)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
  },
  buttonText: {
    position: 'relative',
    zIndex: 2,
    color: NEU_COLORS.textSecondary,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },
  disabled: {
    opacity: 0.4,
  },
  disabledText: {
    color: NEU_COLORS.textMuted,
  },
  activeText: {
    color: NEU_COLORS.textPrimary,
    fontWeight: '700' as const,
    textShadowColor: NEU_COLORS.textGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
