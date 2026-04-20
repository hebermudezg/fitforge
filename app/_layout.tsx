import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { I18nProvider } from '@/i18n';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import { UserProvider } from '@/contexts/UserContext';
import { MeasurementProvider } from '@/contexts/MeasurementContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@/constants/Colors';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    AsyncStorage.getItem('onboarding_complete').then((val) => {
      setOnboardingDone(val === 'true');
      if (loaded) SplashScreen.hideAsync();
    });
  }, [loaded]);

  if (!loaded || onboardingDone === null) return null;

  return (
    <ThemeProvider>
      <I18nProvider>
        <RootLayoutNav onboardingDone={onboardingDone} />
      </I18nProvider>
    </ThemeProvider>
  );
}

function RootLayoutNav({ onboardingDone }: { onboardingDone: boolean }) {
  const { colors, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavThemeProvider value={navTheme}>
      <DatabaseProvider>
        <UserProvider>
          <MeasurementProvider>
            <SubscriptionProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="measurement/[bodyPart]" options={{ presentation: 'modal' }} />
              <Stack.Screen
                name="history/[bodyPart]"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: colors.surface },
                  headerTintColor: colors.textPrimary,
                  title: 'History',
                }}
              />
              <Stack.Screen name="event/new" options={{ presentation: 'modal' }} />
              <Stack.Screen
                name="event/[id]"
                options={{
                  headerShown: true,
                  headerStyle: { backgroundColor: colors.surface },
                  headerTintColor: colors.textPrimary,
                  title: 'Event',
                }}
              />
              <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
            </Stack>
            {/* Redirect based on onboarding state */}
            {onboardingDone && <Redirect href="/(tabs)" />}
            </SubscriptionProvider>
          </MeasurementProvider>
        </UserProvider>
      </DatabaseProvider>
    </NavThemeProvider>
  );
}
