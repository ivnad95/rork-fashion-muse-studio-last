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
      {/* Active glow for primary variant */}
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
              'rgba(10, 118, 175, 0.3)',   // lightColor3 accent glow
              'rgba(10, 118, 175, 0.5)',
              'rgba(10, 118, 175, 0.3)',
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
        {/* Glass container */}
        <View style={styles.innerContainer}>
          {/* Blur layer */}
          {Platform.OS === 'web' ? (
            <View style={styles.blurLayerWeb} />
          ) : (
            <BlurView intensity={20} tint="dark" style={styles.blurLayer} />
          )}

          {/* Accent gradient for primary variant */}
          {variant === 'primary' && (
            <LinearGradient
              colors={[
                'rgba(10, 118, 175, 0.15)',  // lightColor3 tint
                'rgba(10, 118, 175, 0.08)',
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.accentGradient}
            />
          )}

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
    shadowColor: 'rgba(10, 118, 175, 0.5)',  // lightColor3 shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
  },
  glowRing: {
    position: 'absolute',
    inset: -8,
    borderRadius: 38,
    overflow: 'hidden',
  },
  glowGradient: {
    flex: 1,
    borderRadius: 38,
  },
  touchable: {
    flex: 1,
    position: 'relative',
    borderRadius: 30,
    overflow: 'hidden',
  },
  innerContainer: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',  // Spec: glass background
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',       // Spec: glass border
  },
  blurLayer: {
    position: 'absolute',
    inset: 0,
  },
  blurLayerWeb: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  accentGradient: {
    position: 'absolute',
    inset: 0,
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
    color: '#F5F7FA',                              // Spec: silverLight
    fontSize: 16,                                   // Spec: 14-18px
    fontWeight: '600' as const,                     // Spec: semi-bold
    lineHeight: 20,
    letterSpacing: -0.4,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  textPrimary: {
    color: '#F5F7FA',
    fontWeight: '700' as const,
    fontSize: 18,
  },
});
