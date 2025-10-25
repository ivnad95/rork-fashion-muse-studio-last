import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/glassStyles';
import { toggleFavorite, isFavorite } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface FavoriteButtonProps {
  imageId: string;
  size?: number;
  onToggle?: (isFavorite: boolean) => void;
}

/**
 * FavoriteButton - Animated favorite toggle button
 *
 * Features:
 * - Heart icon with fill animation
 * - Haptic feedback on press
 * - Toast notification on toggle
 * - Scales and bounces on interaction
 * - Syncs with database
 */
export default function FavoriteButton({ imageId, size = 24, onToggle }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fillAnim = useRef(new Animated.Value(0)).current;

  // Load favorite status
  useEffect(() => {
    loadFavoriteStatus();
  }, [imageId, user?.id]);

  useEffect(() => {
    // Animate fill
    Animated.spring(fillAnim, {
      toValue: favorite ? 1 : 0,
      friction: 5,
      tension: 80,
      useNativeDriver: false,
    }).start();
  }, [favorite]);

  const loadFavoriteStatus = async () => {
    if (!user?.id) return;
    try {
      const status = await isFavorite(user.id, imageId);
      setFavorite(status);
    } catch (error) {
      console.error('Error loading favorite status:', error);
    }
  };

  const handlePress = async () => {
    if (!user?.id || loading) return;

    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // Toggle favorite
    setLoading(true);
    try {
      const newStatus = await toggleFavorite(user.id, imageId);
      setFavorite(newStatus);
      onToggle?.(newStatus);

      // Show toast
      showToast(
        newStatus ? 'Added to favorites' : 'Removed from favorites',
        'success',
        2000
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Failed to update favorites', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillColor = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', COLORS.error],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={loading || !user}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Heart
          size={size}
          color={favorite ? COLORS.error : COLORS.silverMid}
          fill={favorite ? COLORS.error : 'transparent'}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
  },
});
