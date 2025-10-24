import React, { useEffect, useRef, createContext, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle, Polyline, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { COLORS, BLUR, RADIUS, SPACING, GRADIENTS, SHADOW } from '@/constants/glassStyles';

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
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const ResultsIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <Rect x="3" y="3" width="7" height="7" rx="1" />
    <Rect x="14" y="3" width="7" height="7" rx="1" />
    <Rect x="3" y="14" width="7" height="7" rx="1" />
    <Rect x="14" y="14" width="7" height="7" rx="1" />
  </Svg>
);

const HistoryIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      toValue: isFocused ? 1.02 : 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();

    // Removed heavy glow for minimal aesthetic
    glowAnim.setValue(0);
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
        toValue: isFocused ? 1.02 : 1,
        friction: 6,
        tension: 60,
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
    // Active state: bright accent, inactive: muted silver
    const color = isFocused ? COLORS.accent : COLORS.textSecondary;
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
 * CustomTabBar - Premium Glass Morphism Navigation
 * Design specification:
 * - Heavy blur (intensity: 40) for transparency
 * - Multi-layer glass with light refraction
 * - Floats above content with depth shadow
 * - Top shine highlight for glossy effect
 * - Active tabs with animated glow
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
        {/* Premium glass tab bar container - SIMPLIFIED TO 3 LAYERS */}
        <View style={styles.tabBarOuter}>
          {Platform.OS !== 'web' ? (
            // Native: Heavy blur with simplified glass layers
            <BlurView intensity={BLUR.heavy} tint="dark" style={styles.blurContainer}>
              {/* Layer 2: Single gradient for depth */}
              <LinearGradient
                colors={GRADIENTS.glassDepth}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {/* Layer 3: Top highlight only */}
              <LinearGradient
                colors={GRADIENTS.topShine}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.topShine}
                pointerEvents="none"
              />

              {/* Tab buttons container */}
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
            </BlurView>
          ) : (
            // Web: Fallback with simplified glass gradients
            <View style={styles.webGlassContainer}>
              {/* Layer 2: Single gradient for depth */}
              <LinearGradient
                colors={GRADIENTS.glassDepth}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {/* Layer 3: Top highlight only */}
              <LinearGradient
                colors={GRADIENTS.topShine}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.topShine}
                pointerEvents="none"
              />

              {/* Tab buttons container */}
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
          )}
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
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  tabBarOuter: {
    position: 'relative',
    height: 64,
    borderRadius: 32,
    // Minimal soft shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  blurContainer: {
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderTopColor: COLORS.borderMinimalTop,
    borderLeftColor: COLORS.borderMinimalLeft,
    borderRightColor: COLORS.borderMinimalRight,
    borderBottomColor: COLORS.borderMinimalBottom,
    backgroundColor: COLORS.glassMinimal,
  },
  webGlassContainer: {
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: COLORS.glassMinimalLight,
    borderWidth: 1,
    borderTopColor: COLORS.borderMinimalTop,
    borderLeftColor: COLORS.borderMinimalLeft,
    borderRightColor: COLORS.borderMinimalRight,
    borderBottomColor: COLORS.borderMinimalBottom,
  },
  topShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    pointerEvents: 'none',
  },
  tabBarInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 10,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'visible',
    position: 'relative',
  },
  buttonGlow: {
    position: 'absolute',
    inset: -6,
    borderRadius: 28,
    shadowColor: COLORS.accentShadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  glowInner: {
    flex: 1,
    borderRadius: 28,
  },
  buttonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
