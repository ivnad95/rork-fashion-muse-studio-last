import React, { useEffect, useRef, createContext, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle, Polyline, Rect } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS, SPACING } from '@/constants/glassStyles';

// Context for navbar visibility
interface NavbarContextType {
  hideNavbar: () => void;
  showNavbar: () => void;
  navbarTranslateY: Animated.Value;
}

const NavbarContext = createContext<NavbarContextType | null>(null);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    return {
      hideNavbar: () => {},
      showNavbar: () => {},
      navbarTranslateY: new Animated.Value(0),
    };
  }
  return context;
};

const HomeIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const ResultsIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Rect x="3" y="3" width="7" height="7" rx="1" />
    <Rect x="14" y="3" width="7" height="7" rx="1" />
    <Rect x="3" y="14" width="7" height="7" rx="1" />
    <Rect x="14" y="14" width="7" height="7" rx="1" />
  </Svg>
);

const HistoryIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

function TabButton({
  route,
  isFocused,
  onPress,
  accessibilityLabel
}: {
  route: any;
  isFocused: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.05 : 1,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();

    if (isFocused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isFocused, scaleAnim, glowAnim]);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.05 : 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const getIcon = (routeName: string) => {
    // Active state: updated accent, inactive: more subtle
    const color = isFocused ? COLORS.accent : 'rgba(226, 232, 240, 0.5)';  // More muted inactive
    switch (routeName) {
      case 'generate':
        return <HomeIcon color={color} />;
      case 'results':
        return <ResultsIcon color={color} />;
      case 'history':
        return <HistoryIcon color={color} />;
      case 'settings':
        return <SettingsIcon color={color} />;
      default:
        return <HomeIcon color={color} />;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={accessibilityLabel}
        onPress={handlePress}
        style={styles.navButton}
        activeOpacity={1}
      >
        {isFocused && (
          <Animated.View style={[styles.buttonGlow, { opacity: glowOpacity }]}>
            <View style={styles.glowInner} />
          </Animated.View>
        )}
        <View style={styles.buttonContainer}>
          {getIcon(route.name)}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

/**
 * CustomTabBar - "Floating Island" navigation component
 * Deep Sea Glass specification:
 * - Frosted white glass panel (rgba(255, 255, 255, 0.03))
 * - Blur intensity: 25-30
 * - Subtle border: rgba(255, 255, 255, 0.1)
 * - Active icons: lightColor3 (#0A76AF)
 * - Detached from bottom for "floating" effect
 */
export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const isHidden = useRef(false);

  const hideNavbar = () => {
    if (!isHidden.current) {
      isHidden.current = true;
      Animated.spring(translateY, {
        toValue: 120,
        friction: 9,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  };

  const showNavbar = () => {
    if (isHidden.current) {
      isHidden.current = false;
      Animated.spring(translateY, {
        toValue: 0,
        friction: 9,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <NavbarContext.Provider value={{ hideNavbar, showNavbar, navbarTranslateY: translateY }}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Gradient fade to create visual separation from content above */}
        <LinearGradient
          colors={[
            'rgba(10, 19, 59, 0)',
            'rgba(10, 19, 59, 0.3)',
            'rgba(10, 19, 59, 0.7)',
            'rgba(10, 19, 59, 0.95)',
          ]}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.topFadeGradient}
          pointerEvents="none"
        />

        {/* Multi-layer glass container with depth */}
        <View style={styles.tabBarOuter}>
          {/* Outer glow layer for floating effect */}
          <View style={styles.outerGlow} />

          {/* Main glass panel with multi-stage borders */}
          <View style={styles.tabBarContainer}>
            {/* Blur layer (standardized intensity 28) */}
            {Platform.OS === 'web' ? (
              <View style={styles.tabBarBlurWeb} />
            ) : (
              <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
            )}

            {/* Gradient overlay for depth */}
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.08)',
                'rgba(255, 255, 255, 0.04)',
                'rgba(255, 255, 255, 0.02)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Top glossy highlight for 3D glass effect */}
            <View style={styles.topHighlight} />

            {/* Tab buttons */}
            <View style={styles.tabBarInner}>
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                return (
                  <TabButton
                    key={route.key}
                    route={route}
                    isFocused={isFocused}
                    onPress={onPress}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </Animated.View>
    </NavbarContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: SPACING.lg,                          // 20px bottom margin (floating effect)
    paddingHorizontal: SPACING.lg,                      // 20px horizontal margin
  },
  topFadeGradient: {
    position: 'absolute',
    top: -60,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 0,
  },
  tabBarOuter: {
    position: 'relative',
    height: 72,
    borderRadius: 36,
    zIndex: 1,
  },
  outerGlow: {
    position: 'absolute',
    inset: -3,                                          // Reduced from -4
    borderRadius: 39,
    backgroundColor: 'rgba(14, 165, 233, 0.10)',        // Updated accent, more subtle
    shadowColor: COLORS.shadowAccent,                   // Updated accent shadow
    shadowOffset: { width: 0, height: 8 },              // Reduced from 12
    shadowOpacity: 0.60,                                // Reduced from 0.90
    shadowRadius: 20,                                   // Reduced from 28
    elevation: 10,
  },
  tabBarContainer: {
    height: 68,                                         // Slightly reduced from 72
    borderRadius: 34,                                   // Adjusted
    backgroundColor: COLORS.glassBase,
    borderWidth: 1,                                     // Reduced from 2.5
    borderTopColor: COLORS.borderTop,
    borderLeftColor: COLORS.borderLeft,
    borderRightColor: COLORS.borderRight,
    borderBottomColor: COLORS.borderBottom,
    overflow: 'hidden',
    // Simplified shadow
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 12 },             // Reduced from 20
    shadowOpacity: 0.60,                                // Reduced from 0.65
    shadowRadius: 28,                                   // Reduced from 40
    elevation: 14,
    position: 'relative',
  },
  tabBarBlurWeb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 20, 35, 0.65)',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    opacity: 0.6,
  },
  tabBarInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  navButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'visible',
    position: 'relative',
  },
  buttonGlow: {
    position: 'absolute',
    inset: -8,                                          // Reduced from -10
    borderRadius: 34,
    backgroundColor: 'rgba(14, 165, 233, 0.18)',        // Updated accent, more subtle
    shadowColor: COLORS.shadowAccent,                   // Updated accent shadow
    shadowOffset: { width: 0, height: 3 },              // Reduced from 4
    shadowOpacity: 0.70,                                // Reduced from 0.90
    shadowRadius: 12,                                   // Reduced from 16
    elevation: 6,
  },
  glowInner: {
    flex: 1,
    borderRadius: 34,
  },
  buttonContainer: {
    width: 48,                                          // Reduced from 52
    height: 48,                                         // Reduced from 52
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',       // More subtle
    borderWidth: 1,                                     // Reduced from 1.5
    borderTopColor: 'rgba(255, 255, 255, 0.15)',        // More subtle
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
    borderRightColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    shadowColor: COLORS.shadowBlack,
    shadowOffset: { width: 0, height: 3 },              // Reduced from 4
    shadowOpacity: 0.40,                                // Reduced from 0.45
    shadowRadius: 6,                                    // Reduced from 8
    elevation: 3,
  },
});
