import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
}

interface ParticleEffectProps {
  trigger?: boolean;
  particleCount?: number;
  colors?: string[];
  duration?: number;
}

export default function ParticleEffect({
  trigger = false,
  particleCount = 20,
  colors = ['#a0c8ff', '#b4d4ff', '#c8e0ff', '#dceeff'],
  duration = 2000,
}: ParticleEffectProps) {
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Initialize particles
    particles.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: new Animated.Value(SCREEN_WIDTH / 2),
      y: new Animated.Value(SCREEN_HEIGHT / 2),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [particleCount]);

  useEffect(() => {
    if (trigger && particles.current.length > 0) {
      animateParticles();
    }
  }, [trigger]);

  const animateParticles = () => {
    particles.current.forEach((particle, index) => {
      const angle = (Math.PI * 2 * index) / particles.current.length;
      const velocity = 100 + Math.random() * 150;
      const targetX = SCREEN_WIDTH / 2 + Math.cos(angle) * velocity;
      const targetY = SCREEN_HEIGHT / 2 + Math.sin(angle) * velocity;
      const delay = Math.random() * 200;

      // Reset to center
      particle.x.setValue(SCREEN_WIDTH / 2);
      particle.y.setValue(SCREEN_HEIGHT / 2);
      particle.opacity.setValue(0);
      particle.scale.setValue(0);

      Animated.parallel([
        // Fade in and out
        Animated.sequence([
          Animated.timing(particle.opacity, {
            toValue: 1,
            duration: duration * 0.2,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: duration * 0.8,
            useNativeDriver: true,
          }),
        ]),
        // Scale up
        Animated.spring(particle.scale, {
          toValue: 1,
          delay,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        // Move outward
        Animated.timing(particle.x, {
          toValue: targetX,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: targetY,
          duration,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.current.map((particle) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#a0c8ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});
