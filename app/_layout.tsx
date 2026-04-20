import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
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

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <I18nProvider>
        <RootLayoutNav />
      </I18nProvider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  // Check if onboarding was completed — redirect if so
  useEffect(() => {
    AsyncStorage.getItem('onboarding_complete').then((val) => {
      if (val === 'true') {
        router.replace('/(tabs)');
      }
      setChecked(true);
    });
  }, []);

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
            <Stack>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="measurement/[bodyPart]"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen
                name="history/[bodyPart]"
                options={{
                  headerStyle: { backgroundColor: colors.surface },
                  headerTintColor: colors.textPrimary,
                  title: 'History',
                }}
              />
              <Stack.Screen
                name="event/new"
                options={{ presentation: 'modal', headerShown: false }}
              />
              <Stack.Screen
                name="event/[id]"
                options={{
                  headerStyle: { backgroundColor: colors.surface },
                  headerTintColor: colors.textPrimary,
                  title: 'Event',
                }}
              />
              <Stack.Screen
                name="paywall"
                options={{ presentation: 'modal', headerShown: false }}
              />
            </Stack>
            </SubscriptionProvider>
          </MeasurementProvider>
        </UserProvider>
      </DatabaseProvider>
    </NavThemeProvider>
  );
}
