import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_KEY = 'fitforge_notifications_setup';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleWorkoutReminder(
  hour: number = 8,
  minute: number = 0,
  lang: 'en' | 'es' = 'es'
): Promise<void> {
  if (Platform.OS === 'web') return;

  // Cancel existing workout reminders
  await Notifications.cancelAllScheduledNotificationsAsync();

  const titles = {
    en: ['Time to train!', 'Workout time!', "Let's go!", 'No excuses!'],
    es: ['Hora de entrenar!', 'A darle!', 'Vamos!', 'Sin excusas!'],
  };
  const bodies = {
    en: [
      'Your muscles are waiting. Open FitForge and crush it.',
      "Today's workout is ready. Don't skip it.",
      'Consistency beats perfection. Get your session in.',
      'The only bad workout is the one that didn\'t happen.',
    ],
    es: [
      'Tus musculos te esperan. Abre FitForge y dale con todo.',
      'El entrenamiento de hoy esta listo. No lo saltes.',
      'La consistencia vence a la perfeccion. Haz tu sesion.',
      'El unico mal entrenamiento es el que no sucedio.',
    ],
  };

  // Schedule for each day of the week (Mon-Sat)
  for (let weekday = 2; weekday <= 7; weekday++) {
    const idx = (weekday - 2) % titles[lang].length;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: titles[lang][idx],
        body: bodies[lang][idx],
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour,
        minute,
      },
    });
  }

  await AsyncStorage.setItem(NOTIF_KEY, 'true');
}

export async function scheduleMeasurementReminder(lang: 'en' | 'es' = 'es'): Promise<void> {
  if (Platform.OS === 'web') return;

  // Weekly measurement reminder on Sunday
  await Notifications.scheduleNotificationAsync({
    content: {
      title: lang === 'es' ? 'Hora de medir tu progreso!' : 'Time to measure your progress!',
      body: lang === 'es'
        ? 'Toma tus medidas corporales para ver tu avance esta semana.'
        : 'Take your body measurements to see your progress this week.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1, // Sunday
      hour: 10,
      minute: 0,
    },
  });
}

export async function setupNotifications(lang: 'en' | 'es' = 'es'): Promise<void> {
  const alreadySetup = await AsyncStorage.getItem(NOTIF_KEY);
  if (alreadySetup) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  await scheduleWorkoutReminder(8, 0, lang);
  await scheduleMeasurementReminder(lang);
}

export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.removeItem(NOTIF_KEY);
}
