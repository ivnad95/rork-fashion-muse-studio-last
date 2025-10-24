import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import GlassPanel from '@/components/GlassPanel';
import { COLORS, SPACING } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

/**
 * EmptyState - Premium empty state component
 *
 * Features:
 * - Glass morphism design
 * - Animated icon with float effect
 * - Optional action button
 * - Consistent with app aesthetic
 */
export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <GlassPanel style={styles.container}>
      <View style={styles.content}>
        {/* Animated icon with glow */}
        <View style={styles.iconContainer}>
          <Animated.View style={[styles.iconGlow, { opacity: glowOpacity }]}>
            <LinearGradient
              colors={[
                'rgba(14, 165, 233, 0.25)',
                'rgba(14, 165, 233, 0.40)',
                'rgba(14, 165, 233, 0.25)',
              ]}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Animated.View style={[styles.iconWrapper, { transform: [{ translateY }] }]}>
            <View style={styles.iconInner}>
              <Icon size={40} color={COLORS.accent} strokeWidth={1.5} />
            </View>
          </Animated.View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Description */}
        <Text style={styles.description}>{description}</Text>

        {/* Optional action */}
        {action && <View style={styles.actionContainer}>{action}</View>}
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xxxl,
    paddingVertical: SPACING.xxxl * 1.25,
    paddingHorizontal: SPACING.xxl,
  },
  content: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  iconGlow: {
    position: 'absolute',
    inset: -16,
    borderRadius: 60,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.40,
    shadowRadius: 16,
    elevation: 8,
  },
  iconInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...TEXT_STYLES.h4Primary,
    color: COLORS.silverLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  description: {
    ...TEXT_STYLES.bodyRegularSecondary,
    color: COLORS.silverMid,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  },
  actionContainer: {
    marginTop: SPACING.lg,
    width: '100%',
    maxWidth: 240,
  },
});
