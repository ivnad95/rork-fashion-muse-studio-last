import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  visible: boolean;
}

/**
 * Toast - Premium notification component
 *
 * Features:
 * - Glass morphism design matching app aesthetic
 * - Animated slide-in from top
 * - Auto-dismiss after duration
 * - Icon based on type
 * - Haptic feedback on show
 */
export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onHide,
  visible,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (Platform.OS !== 'web') {
        const Haptics = require('expo-haptics');
        Haptics.notificationAsync(
          type === 'success'
            ? Haptics.NotificationFeedbackType.Success
            : type === 'error'
            ? Haptics.NotificationFeedbackType.Error
            : Haptics.NotificationFeedbackType.Warning
        );
      }

      // Slide in animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: -100,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  const getIcon = () => {
    const iconProps = { size: 20, strokeWidth: 2.5 };
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} color={COLORS.success} />;
      case 'error':
        return <XCircle {...iconProps} color={COLORS.error} />;
      case 'warning':
        return <AlertCircle {...iconProps} color={COLORS.warning} />;
      default:
        return <Info {...iconProps} color={COLORS.accent} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          border: 'rgba(16, 185, 129, 0.30)',
          glow: 'rgba(16, 185, 129, 0.20)',
          shadow: 'rgba(16, 185, 129, 0.40)',
        };
      case 'error':
        return {
          border: 'rgba(239, 68, 68, 0.30)',
          glow: 'rgba(239, 68, 68, 0.20)',
          shadow: 'rgba(239, 68, 68, 0.40)',
        };
      case 'warning':
        return {
          border: 'rgba(245, 158, 11, 0.30)',
          glow: 'rgba(245, 158, 11, 0.20)',
          shadow: 'rgba(245, 158, 11, 0.40)',
        };
      default:
        return {
          border: 'rgba(14, 165, 233, 0.30)',
          glow: 'rgba(14, 165, 233, 0.20)',
          shadow: 'rgba(14, 165, 233, 0.40)',
        };
    }
  };

  if (!visible) return null;

  const colors = getColors();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      {/* Glow layer */}
      <View
        style={[
          styles.glow,
          {
            backgroundColor: colors.glow,
            shadowColor: colors.shadow,
          },
        ]}
      />

      {/* Glass container */}
      <View style={[styles.toast, { borderColor: colors.border }]}>
        {/* Blur layer */}
        {Platform.OS === 'web' ? (
          <View style={styles.blurWeb} />
        ) : (
          <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
        )}

        {/* Gradient overlay */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.08)',
            'rgba(255, 255, 255, 0.04)',
            'rgba(255, 255, 255, 0.02)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconWrapper}>{getIcon()}</View>
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 9999,
  },
  glow: {
    position: 'absolute',
    inset: -4,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.60,
    shadowRadius: 20,
    elevation: 10,
  },
  toast: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.glassBase,
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.60,
    shadowRadius: 16,
    elevation: 12,
  },
  blurWeb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 25, 35, 0.70)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
    zIndex: 10,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...TEXT_STYLES.bodyRegularPrimary,
    flex: 1,
    color: COLORS.silverLight,
  },
});
