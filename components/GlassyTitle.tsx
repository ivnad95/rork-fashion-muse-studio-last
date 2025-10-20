import React from 'react';
import { Text, ViewStyle } from 'react-native';
import GlassPanel from '@/components/GlassPanel';
import { glassStyles } from '@/constants/glassStyles';

interface GlassyTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function GlassyTitle({ children, style }: GlassyTitleProps) {
  return (
    <GlassPanel style={[glassStyles.titleContainer, style]} radius={20}>
      <Text style={glassStyles.titleText}>{children}</Text>
    </GlassPanel>
  );
}