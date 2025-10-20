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
            intensity={15}
            style={[styles.blurLayer, { borderRadius: borderRadius - 2 }]}
            pointerEvents="none"
          />
        )}

        <LinearGradient
          colors={['rgba(200, 220, 245, 0.06)', 'rgba(200, 220, 245, 0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.backgroundGradient, { borderRadius: borderRadius - 2 }]}
          pointerEvents="none"
        />

        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.35 }}
          style={[styles.topShine, { borderRadius: borderRadius - 2 }]}
          pointerEvents="none"
        />

        <View style={[styles.edgeHighlight, { borderRadius: borderRadius - 2 }]} pointerEvents="none" />

        {variant === 'primary' && (
          <LinearGradient
            colors={['rgba(90, 143, 214, 0.15)', 'rgba(61, 107, 184, 0.1)', 'transparent']}
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  primary: {
    shadowColor: Colors.dark.primaryGlow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
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
    height: '35%',
    opacity: 0.7,
    zIndex: 3,
  },
  edgeHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
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
