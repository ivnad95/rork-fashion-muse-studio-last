import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { glassStyles } from '@/constants/glassStyles';

interface CountSelectorProps {
  value: number;
  onChange: (count: number) => void;
  disabled?: boolean;
}

export default function CountSelector({ value, onChange, disabled = false }: CountSelectorProps) {
  const counts = [1, 2, 4, 6, 8] as const;

  return (
    <View style={styles.container} testID="count-selector">
      {counts.map((count) => {
        const isActive = value === count;
        return (
          <TouchableOpacity
            key={count}
            onPress={() => onChange(count)}
            disabled={disabled}
            style={[
              glassStyles.glass3DButton,
              glassStyles.numberChip,
              isActive && glassStyles.activeNumberChip,
              disabled && styles.disabled,
            ]}
            activeOpacity={0.7}
            testID={`count-${count}`}
          >
            {Platform.OS === 'web' ? (
              <View style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              React.createElement(require('expo-blur').BlurView, { 
                intensity: isActive ? 15 : 20, 
                style: [StyleSheet.absoluteFill, { borderRadius: 20 }] 
              })
            )}
            {/* Top shine for glass effect */}
            <LinearGradient
              colors={[
                isActive ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)', 
                'transparent'
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.6 }}
              style={styles.chipShine}
            />
            <View style={styles.chipContent}>
              <Text
                style={[
                  glassStyles.buttonText,
                  isActive && glassStyles.activeNumberChipText,
                ]}
              >
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  chipShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
  },
  chipContent: {
    zIndex: 2,
  },
});