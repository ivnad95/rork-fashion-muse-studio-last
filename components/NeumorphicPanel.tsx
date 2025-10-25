import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { neumorphicStyles, NEU_COLORS, NEU_RADIUS } from '@/constants/neumorphicStyles';

interface NeumorphicPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  inset?: boolean;
  noPadding?: boolean;
}

export default function NeumorphicPanel({
  children,
  style,
  inset = false,
  noPadding = false,
}: NeumorphicPanelProps) {
  const borderRadius = (style?.borderRadius as number) || NEU_RADIUS.xl;

  if (inset) {
    // Inset/carved panel with glass effect (appears pressed into surface)
    return (
      <View style={[styles.panelWrapper, style]}>
        {/* Glass inset container */}
        <View
          style={[
            neumorphicStyles.glassInset,
            noPadding && { padding: 0 },
            { borderRadius },
            style,
          ]}
        >
          {children}
        </View>
      </View>
    );
  }

  // Raised glass panel with multi-layer depth and blur
  return (
    <View style={[styles.panelWrapper, style]}>
      {/* Main glass panel container */}
      <View
        style={[
          styles.panelContainer,
          noPadding && { padding: 0 },
          { borderRadius },
        ]}
      >
        {/* Platform-specific blur and glass layers */}
        {Platform.OS !== 'web' ? (
          <>
            {/* iOS/Android: Heavy blur for authentic glass effect */}
            <BlurView
              intensity={25}
              tint="light"
              style={[StyleSheet.absoluteFill, { borderRadius, overflow: 'hidden' }]}
            >
              {/* Base 3-stop gradient for depth */}
              <LinearGradient
                colors={[
                  NEU_COLORS.gradient1,
                  NEU_COLORS.gradient2,
                  NEU_COLORS.gradient3,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius }]}
              />

              {/* Light refraction gradient (top 40%) */}
              <LinearGradient
                colors={[
                  NEU_COLORS.refractionLight,
                  NEU_COLORS.refractionMid,
                  'transparent',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.refractionLayer,
                  {
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                  }
                ]}
              />

              {/* Top shine highlight (2-3px) */}
              <View
                style={[
                  styles.topShine,
                  {
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                  }
                ]}
              />

              {/* Border highlights (4 sides) */}
              <View
                style={[
                  styles.borderHighlights,
                  { borderRadius: borderRadius - 1 },
                ]}
              />
            </BlurView>

            {/* Content layer (on top of glass with proper z-index) */}
            <View style={[styles.contentLayer, noPadding && { padding: 0 }]}>
              {children}
            </View>
          </>
        ) : (
          <>
            {/* Web: Fallback with gradient layers */}
            <LinearGradient
              colors={[
                NEU_COLORS.gradient1,
                NEU_COLORS.gradient2,
                NEU_COLORS.gradient3,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius }]}
            />

            {/* Light refraction gradient (top 40%) */}
            <LinearGradient
              colors={[
                NEU_COLORS.refractionLight,
                NEU_COLORS.refractionMid,
                'transparent',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.refractionLayer,
                {
                  borderTopLeftRadius: borderRadius,
                  borderTopRightRadius: borderRadius,
                }
              ]}
            />

            {/* Top shine highlight */}
            <View
              style={[
                styles.topShine,
                {
                  borderTopLeftRadius: borderRadius,
                  borderTopRightRadius: borderRadius,
                }
              ]}
            />

            {/* Border highlights */}
            <View
              style={[
                styles.borderHighlights,
                { borderRadius: borderRadius - 1 },
              ]}
            />

            {/* Content layer */}
            <View style={[styles.contentLayer, noPadding && { padding: 0 }]}>
              {children}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panelWrapper: {
    position: 'relative',
  },
  panelContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderTopColor: NEU_COLORS.borderTop,
    borderLeftColor: NEU_COLORS.borderLeft,
    borderRightColor: NEU_COLORS.borderRight,
    borderBottomColor: NEU_COLORS.borderBottom,
    padding: NEU_RADIUS.lg,
    overflow: 'hidden',
    // Floating shadow for depth
    shadowColor: NEU_COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  refractionLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
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
  contentLayer: {
    position: 'relative',
    zIndex: 2,
  },
});
