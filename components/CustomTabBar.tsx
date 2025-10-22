import React, { useEffect, useRef, createContext, useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle, Polyline, Rect } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

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
    // Spec: Active state uses lightColor3 (#0A76AF), inactive uses silverMid (#C8CDD5)
    const color = isFocused ? '#0A76AF' : '#C8CDD5';
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
        {/* Floating Island glass panel */}
        <View style={styles.tabBarContainer}>
          {/* Blur layer */}
          {Platform.OS === 'web' ? (
            <View style={styles.tabBarBlurWeb} />
          ) : (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          )}

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
      </Animated.View>
    </NavbarContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  tabBarContainer: {
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',  // Spec: glass background
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',       // Spec: glass border
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 35,
    elevation: 18,
  },
  tabBarBlurWeb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  tabBarInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
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
    inset: -8,
    borderRadius: 34,
    backgroundColor: 'rgba(10, 118, 175, 0.2)',  // lightColor3 glow
  },
  glowInner: {
    flex: 1,
    borderRadius: 34,
  },
  buttonContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
