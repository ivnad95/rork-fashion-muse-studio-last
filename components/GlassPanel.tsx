import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { glassStyles } from '@/constants/glassStyles';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  radius?: number;
  intensity?: number;
  testID?: string;
}

export default function GlassPanel({ children, style, radius = 28, intensity = 30, testID }: GlassPanelProps) {
  return (
    <View style={[glassStyles.glass3DSurface, { borderRadius: radius }, style]} testID={testID ?? 'glass-panel'}>
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: radius }]} />
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        React.createElement(require('expo-blur').BlurView, { intensity, style: [StyleSheet.absoluteFill, { borderRadius: radius }] })
      )}
      {/* Top highlight - simulates light refraction */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.02)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={[styles.topHighlight, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]}
      />
      {/* Side reflections */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'transparent', 'rgba(255, 255, 255, 0.08)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.sideReflection, { borderRadius: radius }]}
      />
      {/* Bottom shadow inside */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.15)']}  
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.innerShadow, { borderBottomLeftRadius: radius, borderBottomRightRadius: radius }]}
      />
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
    height: '40%',
    zIndex: 1,
  },
  sideReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  innerShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
    zIndex: 3,
  },
});