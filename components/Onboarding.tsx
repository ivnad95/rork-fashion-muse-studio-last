import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Sparkles, Camera, Palette, Download, X } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import { TEXT_STYLES } from '@/constants/typography';
import GlowingButton from './GlowingButton';
import * as haptics from '@/utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlide {
  title: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  color: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    title: 'Welcome to Fashion Muse',
    description: 'Transform your photos into stunning AI-powered fashion photoshoots',
    icon: Sparkles,
    color: '#60A5FA',
  },
  {
    title: 'Upload Your Photo',
    description: 'Choose any photo and let our AI create professional fashion shots',
    icon: Camera,
    color: '#8B5CF6',
  },
  {
    title: 'Choose Your Style',
    description: 'Select from casual, formal, streetwear, and more fashion styles',
    icon: Palette,
    color: '#EC4899',
  },
  {
    title: 'Download & Share',
    description: 'Save your favorites and share them with the world',
    icon: Download,
    color: '#10B981',
  },
];

interface OnboardingProps {
  visible: boolean;
  onComplete: () => void;
}

export default function Onboarding({ visible, onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating icon animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconFloatAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(iconFloatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotating icon animation
      Animated.loop(
        Animated.timing(iconRotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible, fadeAnim, scaleAnim, iconFloatAnim, iconRotateAnim]);

  useEffect(() => {
    // Slide transition animation
    Animated.spring(slideAnim, {
      toValue: currentSlide,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [currentSlide, slideAnim]);

  const handleNext = () => {
    haptics.light();
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    haptics.medium();
    handleComplete();
  };

  const handleComplete = () => {
    haptics.success();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
      setCurrentSlide(0);
    });
  };

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  const iconFloat = iconFloatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const iconRotate = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleComplete}
    >
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Blur background */}
        {Platform.OS === 'web' ? (
          <View style={styles.webBlur} />
        ) : (
          <BlurView intensity={100} style={StyleSheet.absoluteFill} tint="dark" />
        )}

        {/* Skip button */}
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          activeOpacity={0.8}
        >
          <View style={styles.skipButtonInner}>
            <X size={20} color="rgba(255, 255, 255, 0.8)" strokeWidth={2} />
          </View>
        </TouchableOpacity>

        {/* Main content */}
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Animated icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [
                  { translateY: iconFloat },
                  { rotate: iconRotate },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[`${slide.color}40`, `${slide.color}20`, `${slide.color}10`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Icon size={64} color={slide.color} strokeWidth={1.5} />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title}>{slide.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{slide.description}</Text>

          {/* Pagination dots */}
          <View style={styles.pagination}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide && [styles.dotActive, { backgroundColor: slide.color }],
                ]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <GlowingButton
              onPress={handleNext}
              text={currentSlide === SLIDES.length - 1 ? "Get Started" : "Next"}
              variant="primary"
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  webBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 17, 0.95)',
  },
  skipButton: {
    position: 'absolute',
    top: SPACING.xxxl + 20,
    right: SPACING.xl,
    zIndex: 10,
  },
  skipButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.xxl,
    padding: SPACING.xxxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  iconContainer: {
    marginBottom: SPACING.xxl,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: 'rgba(200, 220, 255, 0.5)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    ...TEXT_STYLES.h2Primary,
    color: COLORS.silverLight,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    ...TEXT_STYLES.bodyRegularSecondary,
    color: COLORS.silverMid,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  pagination: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    width: 24,
    shadowColor: 'rgba(200, 220, 255, 0.6)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  buttons: {
    width: '100%',
  },
});
