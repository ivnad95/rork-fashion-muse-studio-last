import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface SwipeNavigationWrapperProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onScroll?: (event: { nativeEvent: { contentOffset: { y: number } } }) => void;
  enabled?: boolean;
}

export default function SwipeNavigationWrapper({
  children,
  onSwipeLeft,
  onSwipeRight,
  onScroll,
  enabled = true,
}: SwipeNavigationWrapperProps) {
  const startX = useRef(0);
  const startY = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const panGesture = Gesture.Pan()
    .enabled(enabled && Platform.OS !== 'web')
    .onStart((event) => {
      startX.current = event.translationX;
      startY.current = event.translationY;
    })
    .onUpdate((event) => {
      // Only allow horizontal swipes (ignore vertical scrolls)
      const dx = Math.abs(event.translationX);
      const dy = Math.abs(event.translationY);

      if (dx > dy && dx > 20) {
        // Horizontal swipe detected
        translateX.setValue(event.translationX * 0.3); // Reduced translation for subtle effect
      }
    })
    .onEnd((event) => {
      const dx = event.translationX;
      const dy = Math.abs(event.translationY);
      const velocity = event.velocityX;

      // Reset animation
      Animated.spring(translateX, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Check if horizontal swipe with momentum
      if (Math.abs(dx) > dy && Math.abs(dx) > 100) {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // Swipe left (next tab)
        if (dx < -100 && velocity < -500 && onSwipeLeft) {
          onSwipeLeft();
        }
        // Swipe right (previous tab)
        else if (dx > 100 && velocity > 500 && onSwipeRight) {
          onSwipeRight();
        }
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
