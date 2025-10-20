import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Grid3x3, Clock, Settings } from 'lucide-react-native';
import Colors from '@/constants/colors';

function IconChip({
  focused,
  icon: Icon,
  label,
}: {
  focused: boolean;
  icon: typeof Home;
  label: string;
}) {
  return (
    <View
      style={[styles.iconChip, focused && styles.iconChipActive]}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
    >
      <LinearGradient
        colors={['#e8f1f8', '#c8d9ed', '#a0b8d6', '#c8d9ed', '#e8f1f8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.chipBorder}
      />

      <View style={styles.chipInner}>
        {Platform.OS === 'web' ? (
          <View style={styles.chipBlur} />
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          React.createElement(require('expo-blur').BlurView, { intensity: 15, style: styles.chipBlur })
        )}

        <LinearGradient
          colors={
            focused
              ? ['rgba(255, 255, 255, 0.12)', 'transparent']
              : ['rgba(255, 255, 255, 0.06)', 'transparent']
          }
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.4 }}
          style={styles.chipShine}
        />

        {focused && (
          <View style={styles.chipGlowOuter}>
            <LinearGradient
              colors={[
                'rgba(90, 143, 214, 0.25)',
                'rgba(61, 107, 184, 0.35)',
                'rgba(90, 143, 214, 0.25)',
              ]}
              style={styles.glowGradient}
            />
          </View>
        )}

        <Icon
          size={22}
          color={focused ? Colors.dark.text : Colors.dark.textSecondary}
          style={styles.chipIcon}
        />
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.text,
        tabBarInactiveTintColor: Colors.dark.textSecondary,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 1,
          borderTopColor: Colors.dark.glassBorder,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 0,
          paddingBottom: Platform.OS === 'ios' ? 16 : 8,
          position: 'absolute',
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <LinearGradient
              colors={[
                'rgba(3, 7, 17, 0)',
                'rgba(6, 13, 31, 0.8)',
                'rgba(6, 13, 31, 0.92)',
              ]}
              locations={[0, 0.5, 1]}
              style={StyleSheet.absoluteFill}
            />
            {Platform.OS === 'web' ? (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,16,32,0.25)' }]} />
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              require('expo-blur').BlurView ? (
                React.createElement(require('expo-blur').BlurView, { intensity: 22, style: StyleSheet.absoluteFill })
              ) : (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,16,32,0.25)' }]} />
              )
            )}
          </View>
        ),
        tabBarLabelStyle: {
          fontSize: 0,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="generate"
        options={{
          title: 'Generate',
          tabBarIcon: ({ focused }) => <IconChip focused={focused} icon={Home} label="Generate" />,
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: 'Results',
          tabBarIcon: ({ focused }) => (
            <IconChip focused={focused} icon={Grid3x3} label="Results" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <IconChip focused={focused} icon={Clock} label="History" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <IconChip focused={focused} icon={Settings} label="Settings" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconChip: {
    width: 56,
    height: 44,
    borderRadius: 20,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconChipActive: {
    shadowColor: Colors.dark.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  chipBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: 20,
  },
  chipInner: {
    position: 'relative',
    margin: 2,
    width: 52,
    height: 40,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipBlur: {
    position: 'absolute',
    inset: 0,
    backgroundColor: Colors.dark.glass,
  },
  chipShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderRadius: 18,
  },
  chipGlowOuter: {
    position: 'absolute',
    inset: -6,
    borderRadius: 24,
    overflow: 'hidden',
    opacity: 0.5,
  },
  glowGradient: {
    flex: 1,
  },
  chipIcon: {
    zIndex: 10,
  },
});
