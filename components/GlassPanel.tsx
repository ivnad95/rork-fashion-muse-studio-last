import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { glassStyles, COLORS, RADIUS } from '@/constants/glassStyles';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  radius?: number;
  intensity?: number;
  testID?: string;
}

/**
 * GlassPanel - Deep Sea Glass surface component
 *
 * Features:
 * - Standardized blur intensity (28) for authentic frosted glass
 * - 3-layer shadow system (ambient, direct, contact)
 * - Top highlight gradient (40% height) for glossy effect
 * - Platform-specific blur handling (BlurView vs fallback)
 *
 * @param children - Content to render inside panel
 * @param style - Additional custom styles
 * @param radius - Border radius (default: 24px for panels)
 * @param intensity - Blur intensity (default: 28)
 * @param testID - Test identifier
 */
export default function GlassPanel({
  children,
  style,
  radius = RADIUS.xl,
  intensity = 28,
  testID,
}: GlassPanelProps) {
  return (
    <View
      style={[
        glassStyles.glass3DSurface,
        {
          borderRadius: radius,
        },
        style,
      ]}
      testID={testID ?? 'glass-panel'}
    >
      {/* Blur layer (native) or fallback (web) */}
      {Platform.OS === 'web' ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: COLORS.glassBase,
              borderRadius: radius,
            },
          ]}
        />
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        React.createElement(require('expo-blur').BlurView, {
          intensity,
          tint: 'dark',
          style: [StyleSheet.absoluteFill, { borderRadius: radius }],
        })
      )}

      {/* Top highlight gradient (40% height, glossy shine effect) */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.35)', // Top - brightest
          'rgba(255, 255, 255, 0.10)', // Mid - fading
          'rgba(255, 255, 255, 0.05)', // Bottom - subtle
          'transparent',                // Fade to nothing
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={[
          styles.topHighlight,
          {
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
          },
        ]}
      />

      {/* Inner gradient overlay (subtle depth) */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.05)', // Top
          'transparent',                // Mid
          'rgba(0, 0, 0, 0.10)',       // Bottom - subtle shadow
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.innerGradient, { borderRadius: radius }]}
      />

      {/* Content layer */}
      <View style={styles.content}>{children}</View>
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
    height: '40%', // 40% height for glossy top shine
    zIndex: 1,
  },
  innerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
});
