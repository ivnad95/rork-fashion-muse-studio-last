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
import Colors from '@/constants/colors';

interface GlowingButtonProps {
  onPress?: () => void;
  children?: React.ReactNode;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'small';
  icon?: React.ReactNode;
  testID?: string;
}

/**
 * GlowingButton - Deep Sea Glass button component
 * Matches design specification:
 * - Frosted white glass background
 * - Active state uses lightColor3 (#0A76AF) accent
 * - Text: 14-18px semi-bold, silverLight color
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
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const containerStyle = [
    styles.container,
    variant === 'small' && styles.containerSmall,
    variant === 'primary' && styles.containerPrimary,
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
      {/* Outer glow ring for primary variant */}
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
              'rgba(10, 118, 175, 0.4)',
              'rgba(10, 118, 175, 0.6)',
              'rgba(10, 118, 175, 0.4)',
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
              colors={[
                'rgba(255, 255, 255, 0.12)',
                'rgba(255, 255, 255, 0.06)',
                'rgba(255, 255, 255, 0.03)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.baseGradient}
            />

            {/* Accent gradient for primary variant */}
            {variant === 'primary' && (
              <LinearGradient
                colors={[
                  'rgba(10, 118, 175, 0.25)',
                  'rgba(10, 118, 175, 0.15)',
                  'rgba(10, 118, 175, 0.08)',
                ]}
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
    borderRadius: 30,
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
    borderRadius: 30,
    overflow: 'hidden',
  },
  outerBorder: {
    flex: 1,
    borderRadius: 30,
    padding: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    borderLeftColor: 'rgba(255, 255, 255, 0.22)',
    borderRightColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  innerContainer: {
    flex: 1,
    borderRadius: 27.5,
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
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 27.5,
    borderTopRightRadius: 27.5,
    opacity: 0.5,
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
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: -0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  textPrimary: {
    color: '#FFFFFF',
    fontWeight: '700' as const,
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
