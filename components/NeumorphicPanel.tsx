import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
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
  if (inset) {
    // Inset/carved panel (appears pressed into surface)
    return (
      <View
        style={[
          neumorphicStyles.neuInset,
          noPadding && { padding: 0 },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // Raised panel with dual shadows
  return (
    <View style={[styles.panelWrapper, style]}>
      {/* Dark shadow layer */}
      <View
        style={[
          neumorphicStyles.neuCardDarkShadow,
          { borderRadius: style?.borderRadius || NEU_RADIUS.xl },
        ]}
      />

      {/* Main card surface */}
      <View
        style={[
          neumorphicStyles.neuCard,
          noPadding && { padding: 0 },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panelWrapper: {
    position: 'relative',
  },
});
