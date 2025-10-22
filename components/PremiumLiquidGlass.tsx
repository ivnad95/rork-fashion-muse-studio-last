import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/colors';

interface PremiumLiquidGlassProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'primary';
  borderRadius?: number;
  testID?: string;
}

export default function PremiumLiquidGlass({
  children,
  style,
  variant = 'default',
  borderRadius = 24,
  testID,
}: PremiumLiquidGlassProps) {
  return (
    <View
      style={[
        styles.container,
        { borderRadius },
        variant === 'elevated' && styles.elevated,
        variant === 'primary' && styles.primary,
        style,
      ]}
      testID={testID ?? 'premium-glass'}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={[
          'rgba(80, 120, 180, 0.4)',
          'rgba(60, 100, 160, 0.3)',
          'rgba(40, 70, 120, 0.25)',
          'rgba(60, 100, 160, 0.3)',
          'rgba(80, 120, 180, 0.4)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.borderGradient, { borderRadius }]}
        pointerEvents="none"
      />

      <View style={[styles.innerContainer, { borderRadius: borderRadius - 2 }]}
        pointerEvents="box-none"
      >
        {Platform.OS === 'web' ? (
          <View style={[styles.blurLayer, { borderRadius: borderRadius - 2 }]} pointerEvents="none" />
        ) : (
          <BlurView
            intensity={28}
            style={[styles.blurLayer, { borderRadius: borderRadius - 2 }]}
            pointerEvents="none"
          />
        )}

        <LinearGradient
          colors={[
            'rgba(30, 50, 85, 0.65)',
            'rgba(25, 40, 70, 0.55)',
            'rgba(30, 50, 85, 0.6)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.backgroundGradient, { borderRadius: borderRadius - 2 }]}
          pointerEvents="none"
        />

        <LinearGradient
          colors={[
            'rgba(100, 140, 200, 0.28)',
            'rgba(60, 100, 160, 0.14)',
            'transparent',
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.45 }}
          style={[styles.topShine, { borderRadius: borderRadius - 2 }]}
          pointerEvents="none"
        />

        <LinearGradient
          colors={[
            'transparent',
            'rgba(80, 120, 180, 0.12)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.sideRefraction, { borderRadius: borderRadius - 2 }]}
          pointerEvents="none"
        />

        <View style={[styles.edgeHighlight, { borderRadius: borderRadius - 2 }]} pointerEvents="none" />

        {variant === 'primary' && (
          <LinearGradient
            colors={[
              'rgba(100, 140, 200, 0.22)',
              'rgba(80, 120, 180, 0.15)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.glowEffect, { borderRadius: borderRadius - 2 }]}
            pointerEvents="none"
          />
        )}

        <View style={[styles.content, { borderRadius: borderRadius - 2 }]} testID="premium-glass-content">
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  elevated: {
    shadowColor: Colors.dark.glassShadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
    elevation: 12,
  },
  primary: {
    shadowColor: Colors.dark.primaryGlow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 32,
    elevation: 15,
  },
  borderGradient: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  innerContainer: {
    position: 'relative',
    margin: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(80, 120, 180, 0.3)',
  },
  blurLayer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(25, 40, 70, 0.5)',
    zIndex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
  },
  topShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    opacity: 0.85,
    zIndex: 3,
  },
  sideRefraction: {
    position: 'absolute',
    inset: 0,
    opacity: 0.6,
    zIndex: 3,
  },
  edgeHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(120, 160, 220, 0.3)',
    zIndex: 4,
  },
  glowEffect: {
    position: 'absolute',
    inset: 0,
    opacity: 0.4,
    zIndex: 5,
  },
  content: {
    position: 'relative',
    zIndex: 10,
  },
});
