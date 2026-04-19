import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import { UserProvider } from '@/contexts/UserContext';
import { MeasurementProvider } from '@/contexts/MeasurementContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

SplashScreen.preventAutoHideAsync();

const FitForgeTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.accent,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.textPrimary,
    border: Colors.border,
    notification: Colors.accent,
  },
};

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

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={FitForgeTheme}>
      <DatabaseProvider>
        <UserProvider>
          <MeasurementProvider>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="measurement/[bodyPart]"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="history/[bodyPart]"
          options={{
            headerStyle: { backgroundColor: Colors.surface },
            headerTintColor: Colors.textPrimary,
            title: 'History',
          }}
        />
        <Stack.Screen
          name="event/new"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{
            headerStyle: { backgroundColor: Colors.surface },
            headerTintColor: Colors.textPrimary,
            title: 'Event',
          }}
        />
      </Stack>
          </MeasurementProvider>
        </UserProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}
