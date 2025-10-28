import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Polyline, Rect } from 'react-native-svg';
import { COLORS, SPACING, RADIUS } from '@/constants/glassStyles';
import GlassPanel from '@/components/GlassPanel';

const iconColor = (focused: boolean) => (focused ? COLORS.silverLight : COLORS.silverMid);

const GenerateIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={iconColor(focused)} strokeWidth={2}>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const ResultsIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={iconColor(focused)} strokeWidth={2}>
    <Rect x={3} y={3} width={7} height={7} rx={1} />
    <Rect x={14} y={3} width={7} height={7} rx={1} />
    <Rect x={3} y={14} width={7} height={7} rx={1} />
    <Rect x={14} y={14} width={7} height={7} rx={1} />
  </Svg>
);

const HistoryIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={iconColor(focused)} strokeWidth={2}>
    <Circle cx={12} cy={12} r={10} />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const SettingsIcon = ({ focused }: { focused: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={iconColor(focused)} strokeWidth={2}>
    <Circle cx={12} cy={12} r={3} />
    <Path d="M12 1v6m0 6v10M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h10M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
  </Svg>
);

const iconForRoute = (name: string, focused: boolean) => {
  switch (name) {
    case 'generate':
      return <GenerateIcon focused={focused} />;
    case 'results':
      return <ResultsIcon focused={focused} />;
    case 'history':
      return <HistoryIcon focused={focused} />;
    case 'settings':
      return <SettingsIcon focused={focused} />;
    default:
      return <GenerateIcon focused={focused} />;
  }
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : 8;

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <GlassPanel style={styles.bar} radius={RADIUS.xxl} noPadding>
        <View style={styles.inner}>
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
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? `${route.name} tab`}
              onPress={onPress}
              style={styles.navButton}
              activeOpacity={0.75}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              testID={`tab-${route.name}`}
            >
              <View style={[styles.iconWrapper, isFocused && styles.iconWrapperActive]}>
                {iconForRoute(route.name, isFocused)}
              </View>
            </TouchableOpacity>
          );
        })}
        </View>
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.lg,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
