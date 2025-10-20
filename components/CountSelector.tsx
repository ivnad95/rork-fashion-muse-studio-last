import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
      {counts.map((count) => (
        <TouchableOpacity
          key={count}
          onPress={() => onChange(count)}
          disabled={disabled}
          style={[
            glassStyles.glass3DButton,
            glassStyles.numberChip,
            value === count && glassStyles.activeNumberChip,
            disabled && styles.disabled,
          ]}
          activeOpacity={0.7}
          testID={`count-${count}`}
        >
          <Text
            style={[
              glassStyles.buttonText,
              value === count && glassStyles.activeNumberChipText,
            ]}
          >
            {count}
          </Text>
        </TouchableOpacity>
      ))}
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
});