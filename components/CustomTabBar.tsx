yesimport React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Polyline, Rect } from 'react-native-svg';
import { glassStyles, COLORS } from '@/constants/glassStyles';

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
  return (
    <View style={styles.container}>
      <View style={[glassStyles.glass3DSurface, styles.tabBar]}>
        <BlurView intensity={30} style={StyleSheet.absoluteFill} />
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
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={[glassStyles.glass3DButton, styles.navButton, isFocused && glassStyles.activeButton]}
                activeOpacity={0.75}
              >
                {iconForRoute(route.name, isFocused)}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  tabBar: {
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
    paddingHorizontal: 16,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
