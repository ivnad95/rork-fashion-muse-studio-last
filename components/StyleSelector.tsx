import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NEU_COLORS, NEU_SPACING, NEU_RADIUS, neumorphicStyles } from '@/constants/neumorphicStyles';
import { FASHION_STYLES, FashionStyle } from '@/constants/styles';
import * as haptics from '@/utils/haptics';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
}

function StyleCard({ style, isSelected, onPress }: {
  style: FashionStyle;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isSelected, glowAnim]);

  const handlePress = () => {
    haptics.light();
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

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0)', style.color + '80'],
  });

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={styles.cardTouchable}
      >
        <View style={[
          styles.card,
          isSelected && styles.cardSelected,
        ]}>
          {/* Animated glow for selected card */}
          {isSelected && (
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.cardGlow,
                { backgroundColor: glowColor }
              ]}
            />
          )}

          {/* Card gradient */}
          <LinearGradient
            colors={
              isSelected
                ? [`${style.color}40`, `${style.color}20`, `${style.color}10`]
                : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.02)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{style.icon}</Text>
          </View>

          {/* Name */}
          <Text style={[
            styles.styleName,
            isSelected && { color: style.color }
          ]}>
            {style.name}
          </Text>

          {/* Description */}
          <Text style={styles.styleDescription} numberOfLines={2}>
            {style.description}
          </Text>

          {/* Selection indicator */}
          {isSelected && (
            <View style={[styles.selectedBadge, { backgroundColor: style.color }]}>
              <Text style={styles.selectedBadgeText}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function StyleSelector({ selectedStyleId, onSelectStyle }: StyleSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>FASHION STYLE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={140}
        snapToAlignment="start"
      >
        {FASHION_STYLES.map((style) => (
          <StyleCard
            key={style.id}
            style={style}
            isSelected={selectedStyleId === style.id}
            onPress={() => onSelectStyle(style.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: NEU_SPACING.xl,
  },
  label: {
    ...neumorphicStyles.neuTextMuted,
    textTransform: 'uppercase',
    marginBottom: NEU_SPACING.sm,
    paddingLeft: NEU_SPACING.xxs,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  scrollContent: {
    paddingRight: NEU_SPACING.lg,
    gap: NEU_SPACING.sm,
  },
  cardWrapper: {
    width: 130,
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    height: 160,
    borderRadius: NEU_RADIUS.lg,
    overflow: 'hidden',
    padding: NEU_SPACING.md,
    position: 'relative',
    backgroundColor: NEU_COLORS.base,
    // Neumorphic shadows
    shadowColor: NEU_COLORS.shadowLight,
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardSelected: {
    shadowColor: NEU_COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  cardGlow: {
    borderRadius: NEU_RADIUS.lg,
    opacity: 0.3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: NEU_COLORS.baseLighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: NEU_SPACING.sm,
  },
  icon: {
    fontSize: 28,
  },
  styleName: {
    ...neumorphicStyles.neuTextPrimary,
    marginBottom: NEU_SPACING.xxs,
    fontWeight: '700',
    fontSize: 14,
  },
  styleDescription: {
    ...neumorphicStyles.neuTextSecondary,
    lineHeight: 16,
    flex: 1,
    fontSize: 11,
  },
  selectedBadge: {
    position: 'absolute',
    top: NEU_SPACING.xs,
    right: NEU_SPACING.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: NEU_COLORS.shadowDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
