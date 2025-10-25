import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { glassStyles, COLORS, RADIUS, BLUR, GRADIENTS } from '@/constants/glassStyles';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  radius?: number;
  noPadding?: boolean;
  testID?: string;
}

/**
 * Simplified GlassPanel - 3-layer structure
 *
 * Layer 1: Blur (native) or fallback (web)
 * Layer 2: Single gradient for depth
 * Layer 3: Top highlight
 */
export default function GlassPanel({
  children,
  style,
  radius = RADIUS.xl,
  noPadding = false,
  testID,
}: GlassPanelProps) {
  return (
    <View
      style={[
        glassStyles.glassPanel,
        {
          borderRadius: radius,
        },
        style,
      ]}
      testID={testID ?? 'glass-panel'}
    >
      {/* Layer 1: Blur or fallback */}
      {Platform.OS !== 'web' ? (
        <BlurView
          intensity={BLUR.medium}
          tint="dark"
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: COLORS.glassLight,
              borderRadius: radius,
            },
          ]}
        />
      )}

      {/* Layer 2: Single gradient for depth */}
      <LinearGradient
        colors={GRADIENTS.glassDepth}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />

      {/* Layer 3: Top highlight */}
      <LinearGradient
        colors={GRADIENTS.topShine}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.topHighlight,
          {
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
          },
        ]}
        pointerEvents="none"
      />

      {/* Content layer */}
      <View style={[styles.content, !noPadding && { padding: 16 }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    zIndex: 10,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    pointerEvents: 'none',
  },
});
