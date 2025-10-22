import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path, Circle, Polyline, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

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
    outputRange: [0.3, 0.8],
  });

  const getIcon = (routeName: string) => {
    const color = isFocused ? 'rgba(200, 220, 255, 0.95)' : 'rgba(180, 200, 230, 0.6)';
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
            <LinearGradient
              colors={['rgba(200, 220, 255, 0.4)', 'rgba(150, 180, 230, 0.2)', 'rgba(200, 220, 255, 0.4)']}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}
        <LinearGradient
          colors={
            isFocused
              ? ['rgba(200, 220, 255, 0.25)', 'rgba(150, 180, 230, 0.18)', 'rgba(120, 160, 220, 0.15)']
              : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.06)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <View style={styles.buttonInner}>
            {getIcon(route.name)}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.12)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tabBarGradient}
      >
        <View style={styles.tabBarBorder}>
          {Platform.OS === 'web' ? (
            <View style={styles.tabBarBlurWeb} />
          ) : (
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          )}

          <View style={styles.topHighlight} />

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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  tabBarGradient: {
    borderRadius: 40,
    padding: 3.5,
    shadowColor: 'rgba(200, 220, 255, 0.6)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 25,
    borderWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderLeftColor: 'rgba(255, 255, 255, 0.42)',
    borderRightColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomColor: 'rgba(255, 255, 255, 0.18)',
  },
  tabBarBorder: {
    height: 84,
    backgroundColor: 'rgba(12, 18, 28, 0.75)',
    borderRadius: 37,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.16)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabBarBlurWeb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 18, 28, 0.85)',
  },
  tabBarInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonGlow: {
    position: 'absolute',
    inset: -8,
    borderRadius: 38,
  },
  buttonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 3,
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderLeftColor: 'rgba(255, 255, 255, 0.28)',
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonInner: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.15)',
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 37,
    borderTopRightRadius: 37,
    zIndex: 1,
    pointerEvents: 'none',
  },
});