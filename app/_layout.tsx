import 'whatwg-fetch';
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from 'expo-system-ui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from '@/constants/colors';
import { GenerationProvider } from '@/contexts/GenerationContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import AuthSplash from '@/components/AuthSplash';
import Onboarding from '@/components/Onboarding';

// Import test utilities for development (provides browser console helpers)
if (process.env.NODE_ENV === 'development') {
  import('@/scripts/add-credits');
}

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('@fashion_muse_onboarding_completed');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setOnboardingChecked(true);
      }
    };

    SystemUI.setBackgroundColorAsync(Colors.dark.backgroundDeep);
    SplashScreen.hideAsync();
    checkOnboarding();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('@fashion_muse_onboarding_completed', 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      setShowOnboarding(false);
    }
  };

  if (!onboardingChecked) {
    return null; // Or show a loading screen
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <GenerationProvider>
              <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.dark.backgroundDeep }}>
                <RootLayoutNav />
                <Onboarding
                  visible={showOnboarding}
                  onComplete={handleOnboardingComplete}
                />
              </GestureHandlerRootView>
            </GenerationProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
