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
              'rgba(107, 160, 255, 0.5)',
              'rgba(74, 126, 214, 0.7)',
              'rgba(107, 160, 255, 0.5)',
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
        <LinearGradient
          colors={['#e8f1f8', '#c8d9ed', '#a0b8d6', '#c8d9ed', '#e8f1f8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.borderGradient}
        />

        <View style={styles.innerContainer}>
          <LinearGradient
            colors={
              variant === 'primary'
                ? ['rgba(74, 126, 214, 0.28)', 'rgba(51, 91, 168, 0.18)']
                : ['rgba(220, 235, 255, 0.12)', 'rgba(220, 235, 255, 0.04)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          />

          {Platform.OS === 'web' ? (
            <View style={[styles.blurLayer, { backgroundColor: Colors.dark.glass }]} />
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            React.createElement(require('expo-blur').BlurView, { intensity: 25, style: styles.blurLayer })
          )}

          <LinearGradient
            colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.08)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
            style={styles.shineLayer}
          />

          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.08)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.sideGlow}
          />

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
    shadowColor: Colors.dark.primaryGlow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.85,
    shadowRadius: 32,
    elevation: 18,
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
  borderGradient: {
    position: 'absolute',
    inset: 0,
    borderRadius: 30,
  },
  innerContainer: {
    flex: 1,
    margin: 2,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
  },
  gradient: {
    position: 'absolute',
    inset: 0,
  },
  blurLayer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: Colors.dark.glass,
  },
  shineLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderRadius: 28,
  },
  sideGlow: {
    position: 'absolute',
    inset: 0,
    borderRadius: 28,
    opacity: 0.7,
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
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.4,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  textPrimary: {
    color: Colors.dark.text,
    fontWeight: '700' as const,
  },
});
