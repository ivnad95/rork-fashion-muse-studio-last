import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { glassStyles } from '@/constants/glassStyles';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  radius?: number;
  intensity?: number;
  testID?: string;
}

export default function GlassPanel({ children, style, radius = 28, intensity = 25, testID }: GlassPanelProps) {
  return (
    <View style={[glassStyles.glass3DSurface, { borderRadius: radius }, style]} testID={testID ?? 'glass-panel'}>
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: radius }]} />
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        React.createElement(require('expo-blur').BlurView, { intensity, style: [StyleSheet.absoluteFill, { borderRadius: radius }] })
      )}
      {/* Top highlight for glass effect */}
      <View style={[styles.topHighlight, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    zIndex: 2,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    opacity: 0.6,
    zIndex: 1,
  },
});