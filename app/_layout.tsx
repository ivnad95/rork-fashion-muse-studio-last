import 'whatwg-fetch';
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from '@/constants/colors';
import { GenerationProvider } from '@/contexts/GenerationContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import AuthSplash from '@/components/AuthSplash';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      // Still loading auth state
      return;
    }

    const inAuthGroup = segments[0] === 'auth';

    // Only redirect away from auth screens if user is authenticated
    if (isAuthenticated && inAuthGroup) {
      // User is signed in but on an auth screen, redirect to main app
      router.replace('/(tabs)/generate');
    }
    // Allow guest users to access all screens without redirecting to login
  }, [isAuthenticated, isLoading, segments, router]);

  // Show splash screen while loading
  if (isLoading) {
    return <AuthSplash />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.background },
      }}
    >
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="plans" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.dark.backgroundDeep);
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <GenerationProvider>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.dark.backgroundDeep }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </GenerationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
