import 'whatwg-fetch';
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from 'expo-system-ui';
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { COLORS } from '@/constants/glassStyles';
import { GenerationProvider } from '@/contexts/GenerationContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { trpc, trpcReactClient } from '@/lib/trpc';



SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {

  // No need for splash screen - app loads directly to main content
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.bgDeepest },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="plans" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(COLORS.bgDeepest);
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcReactClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <GenerationProvider>
                  <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.bgDeepest }}>
                    <RootLayoutNav />
                  </GestureHandlerRootView>
                </GenerationProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}
