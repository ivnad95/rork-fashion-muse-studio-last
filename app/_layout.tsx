import 'whatwg-fetch';
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NEU_COLORS } from '@/constants/neumorphicStyles';
import { GenerationProvider } from '@/contexts/GenerationContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import test utilities for development (provides browser console helpers)
if (process.env.NODE_ENV === 'development') {
  import('@/scripts/add-credits');
}

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {

  // No need for splash screen - app loads directly to main content
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: NEU_COLORS.base },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="plans" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Set system UI to match neumorphic theme
    SystemUI.setBackgroundColorAsync(NEU_COLORS.base);
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <GenerationProvider>
              <GestureHandlerRootView style={{ flex: 1, backgroundColor: NEU_COLORS.base }}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </GenerationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
