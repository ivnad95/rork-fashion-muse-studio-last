import React from 'react';
import { Text, ViewStyle, View, StyleSheet } from 'react-native';
import { glassStyles } from '@/constants/glassStyles';

interface GlassyTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Simplified GlassyTitle - just uses glassStyles.titleText
 */
export default function GlassyTitle({ children, style }: GlassyTitleProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={glassStyles.titleText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
});