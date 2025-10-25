import React from 'react';
import { Text, ViewStyle, StyleProp } from 'react-native';
import GlassPanel from '@/components/GlassPanel';
import { glassStyles } from '@/constants/glassStyles';

interface GlassyTitleProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Simplified GlassyTitle - just uses glassStyles.titleText
 */
export default function GlassyTitle({ children, style }: GlassyTitleProps) {
  return (
    <GlassPanel style={style} radius={20} noPadding>
      <Text style={glassStyles.titleText}>{children}</Text>
    </GlassPanel>
  );
}
