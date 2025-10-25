import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';

interface SimpleCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function SimpleCard({ children, style }: SimpleCardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.glassMinimalLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderMinimalLeft,
  },
});
