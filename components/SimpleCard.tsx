import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SimpleCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
