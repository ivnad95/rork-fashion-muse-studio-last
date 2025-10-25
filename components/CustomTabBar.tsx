import React, { useEffect, useRef, createContext, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path, Rect, Circle, Polyline } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';

interface NavbarContextType {
  hideNavbar: () => void;
  showNavbar: () => void;
  navbarTranslateY: Animated.Value;
}

const NavbarContext = createContext<NavbarContextType | null>(null);

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    const fallback = new Animated.Value(0);
    return {
      hideNavbar: () => {},
      showNavbar: () => {},
      navbarTranslateY: fallback,
    };
  }
  return context;
};

const iconProps = { width: 22, height: 22, fill: 'none', strokeWidth: 1.7 } as const;

const HomeIcon = ({ color }: { color: string }) => (
  <Svg {...iconProps} stroke={color} viewBox="0 0 24 24">
    <Path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const ResultsIcon = ({ color }: { color: string }) => (
  <Svg {...iconProps} stroke={color} viewBox="0 0 24 24">
    <Rect x="3" y="3" width="7" height="7" rx="1" />
    <Rect x="14" y="3" width="7" height="7" rx="1" />
    <Rect x="3" y="14" width="7" height="7" rx="1" />
    <Rect x="14" y="14" width="7" height="7" rx="1" />
  </Svg>
);

const HistoryIcon = ({ color }: { color: string }) => (
  <Svg {...iconProps} stroke={color} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const SettingsIcon = ({ color }: { color: string }) => (
  <Svg {...iconProps} stroke={color} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

type TabButtonProps = {
  route: any;
  isFocused: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

function TabButton({ route, isFocused, onPress, accessibilityLabel }: TabButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.05 : 1,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [isFocused, scaleAnim]);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const iconColor = isFocused ? COLORS.accent : COLORS.textSecondary;

  const renderIcon = () => {
    switch (route.name) {
      case 'generate':
        return <HomeIcon color={iconColor} />;
      case 'results':
        return <ResultsIcon color={iconColor} />;
      case 'history':
        return <HistoryIcon color={iconColor} />;
      case 'settings':
        return <SettingsIcon color={iconColor} />;
      default:
        return <HomeIcon color={iconColor} />;
    }
  };

  const label = (() => {
    switch (route.name) {
      case 'generate':
        return 'Generate';
      case 'results':
        return 'Results';
      case 'history':
        return 'History';
      case 'settings':
        return 'Settings';
      default:
        return route.name;
    }
  })();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={accessibilityLabel}
        onPress={handlePress}
        style={styles.tabButton}
        activeOpacity={0.85}
      >
        <View style={[styles.iconBadge, isFocused && styles.iconBadgeActive]}>
          {renderIcon()}
        </View>
        <Text
          style={[
            styles.label,
            isFocused && styles.labelActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const isHidden = useRef(false);

  const hideNavbar = () => {
    if (!isHidden.current) {
      isHidden.current = true;
      Animated.spring(translateY, {
        toValue: 120,
        friction: 10,
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
        friction: 10,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <NavbarContext.Provider value={{ hideNavbar, showNavbar, navbarTranslateY: translateY }}>
      <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

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
              accessibilityLabel={typeof label === 'string' ? label : route.name}
            />
          );
        })}
      </Animated.View>
    </NavbarContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDeepest,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMinimalBottom,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    gap: 4,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.glassMinimalLight,
  },
  iconBadgeActive: {
    backgroundColor: COLORS.glassMinimalMedium,
    borderWidth: 1,
    borderColor: COLORS.accentGlow,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  labelActive: {
    color: COLORS.accent,
  },
});
