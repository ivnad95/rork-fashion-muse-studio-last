import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';
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
    marginBottom: SPACING.xl,
  },
  label: {
    ...TEXT_STYLES.overlineSecondary,
    textTransform: 'uppercase',
    color: COLORS.silverDark,
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.xxs,
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  scrollContent: {
    paddingRight: SPACING.lg,
    gap: SPACING.sm,
  },
  cardWrapper: {
    width: 130,
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    height: 160,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
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
  cardGlow: {
    borderRadius: RADIUS.lg,
    opacity: 0.3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  icon: {
    fontSize: 28,
  },
  styleName: {
    ...TEXT_STYLES.labelPrimary,
    color: COLORS.silverLight,
    marginBottom: SPACING.xxs,
    fontWeight: '700',
  },
  styleDescription: {
    ...TEXT_STYLES.caption,
    color: COLORS.silverMid,
    lineHeight: 16,
    flex: 1,
  },
  selectedBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
