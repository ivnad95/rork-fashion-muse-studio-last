import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';
import * as haptics from '@/utils/haptics';

export interface ThemeOption {
  id: string;
  name: string;
  colors: string[];
  accentColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: ['#1e3a8a', '#1e40af', '#2563eb'],
    accentColor: '#60A5FA',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#991b1b', '#dc2626', '#f97316'],
    accentColor: '#FB923C',
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#14532d', '#15803d', '#22c55e'],
    accentColor: '#4ADE80',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    colors: ['#4c1d95', '#6d28d9', '#8b5cf6'],
    accentColor: '#A78BFA',
  },
  {
    id: 'rose',
    name: 'Rose',
    colors: ['#881337', '#be123c', '#e11d48'],
    accentColor: '#FB7185',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: ['#0f172a', '#1e293b', '#334155'],
    accentColor: '#94A3B8',
  },
];

interface ThemePickerProps {
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

function ThemeCard({
  theme,
  isSelected,
  onPress,
}: {
  theme: ThemeOption;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    haptics.medium();
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View
          style={[
            styles.card,
            isSelected && styles.cardSelected,
          ]}
        >
          {/* Gradient preview */}
          <LinearGradient
            colors={theme.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            {/* Selection indicator */}
            {isSelected && (
              <View style={[styles.selectedBadge, { backgroundColor: theme.accentColor }]}>
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
          </LinearGradient>

          {/* Theme name */}
          <Text
            style={[
              styles.themeName,
              isSelected && { color: theme.accentColor },
            ]}
          >
            {theme.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ThemePicker({ selectedThemeId, onSelectTheme }: ThemePickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>THEME</Text>
      <View style={styles.grid}>
        {THEME_OPTIONS.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={selectedThemeId === theme.id}
            onPress={() => onSelectTheme(theme.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  label: {
    ...TEXT_STYLES.overlineSecondary,
    textTransform: 'uppercase',
    color: COLORS.silverDark,
    marginBottom: SPACING.md,
    paddingLeft: SPACING.xxs,
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  cardWrapper: {
    width: '48%',
  },
  card: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(200, 220, 255, 0.5)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  cardGradient: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  themeName: {
    ...TEXT_STYLES.labelPrimary,
    color: COLORS.silverLight,
    textAlign: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    fontWeight: '600',
    fontSize: 13,
  },
});
