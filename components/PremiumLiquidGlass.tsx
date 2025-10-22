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
        colors={['#e8f1f8', '#c8d9ed', '#a0b8d6', '#c8d9ed', '#e8f1f8']}
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
          colors={['rgba(220, 235, 255, 0.12)', 'rgba(220, 235, 255, 0.04)', 'rgba(220, 235, 255, 0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.backgroundGradient, { borderRadius: borderRadius - 2 }]}
          pointerEvents="none"
        />

        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.45 }}
          style={[styles.topShine, { borderRadius: borderRadius - 2 }]}
          pointerEvents="none"
        />

        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.05)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.sideRefraction, { borderRadius: borderRadius - 2 }]}
          pointerEvents="none"
        />

        <View style={[styles.edgeHighlight, { borderRadius: borderRadius - 2 }]} pointerEvents="none" />

        {variant === 'primary' && (
          <LinearGradient
            colors={['rgba(107, 160, 255, 0.25)', 'rgba(74, 126, 214, 0.15)', 'transparent']}
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
    borderColor: Colors.dark.glassBorder,
  },
  blurLayer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: Colors.dark.glass,
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
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
