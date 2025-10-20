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

export default function GlassPanel({ children, style, radius = 28, intensity = 20, testID }: GlassPanelProps) {
  return (
    <View style={[glassStyles.glass3DSurface, { borderRadius: radius }, style]} testID={testID ?? 'glass-panel'}>
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.02)' }]} />
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        React.createElement(require('expo-blur').BlurView, { intensity, style: StyleSheet.absoluteFill })
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});