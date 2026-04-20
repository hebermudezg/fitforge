import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MonthView } from '@/components/calendar/MonthView';
import { EventCard } from '@/components/calendar/EventCard';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { getEventsByMonth, updateEvent } from '@/database/eventQueries';
import { getWeeklyPlan } from '@/constants/exercises';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import type { CalendarEvent } from '@/types/models';

export default function CalendarScreen() {
  const router = useRouter();
  const db = useDatabase();
  const { user } = useUser();
  const { colors } = useTheme();
  const { t, lang } = useI18n();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [fitnessGoal, setFitnessGoal] = useState('build');

  useEffect(() => {
    AsyncStorage.getItem('fitness_goal').then((g) => { if (g) setFitnessGoal(g); });
  }, []);

  const weeklyPlan = getWeeklyPlan(fitnessGoal);

  const MONTH_NAMES_I18N = lang === 'es'
    ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const loadEvents = useCallback(async () => {
    const evts = await getEventsByMonth(db, user.id, year, month);
    setEvents(evts);
  }, [db, user.id, year, month]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const eventDays = new Set(events.map((e) => new Date(e.startTime).getDate()));

  const filteredEvents = selectedDay
    ? events.filter((e) => new Date(e.startTime).getDate() === selectedDay)
    : events;

  // Get workout for selected day
  const getWorkoutForDate = (day: number) => {
    const date = new Date(year, month - 1, day);
    const dow = date.getDay(); // 0=Sun
    const planIdx = dow === 0 ? 6 : dow - 1;
    return weeklyPlan[planIdx];
  };

  const selectedWorkout = selectedDay ? getWorkoutForDate(selectedDay) : null;

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
    setSelectedDay(null);
  };

  const toggleComplete = async (event: CalendarEvent) => {
    await updateEvent(db, event.id, { isCompleted: !event.isCompleted });
    await loadEvents();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t.calendar.title}</Text>

          {/* Month nav */}
          <View style={styles.monthNav}>
            <Pressable onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </Pressable>
            <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>
              {MONTH_NAMES_I18N[month - 1]} {year}
            </Text>
            <Pressable onPress={nextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>

          <MonthView
            year={year} month={month}
            selectedDay={selectedDay}
            eventDays={eventDays}
            onDayPress={setSelectedDay}
          />

          {/* Workout for selected day */}
          {selectedDay && selectedWorkout && (
            <View style={[styles.workoutSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.workoutHeader}>
                <Ionicons name={selectedWorkout.icon as any} size={20} color={colors.accent} />
                <Text style={[styles.workoutTitle, { color: colors.accent }]}>
                  {selectedWorkout.label[lang]}
                </Text>
              </View>
              {selectedWorkout.exercises.length > 0 ? (
                selectedWorkout.exercises.slice(0, 5).map((ex, i) => (
                  <View key={ex.id} style={[styles.exRow, { borderBottomColor: colors.border }]}>
                    <View style={[styles.exNum, { backgroundColor: colors.accent }]}>
                      <Text style={styles.exNumText}>{i + 1}</Text>
                    </View>
                    <View style={styles.exInfo}>
                      <Text style={[styles.exName, { color: colors.textPrimary }]}>{ex.name[lang]}</Text>
                      <Text style={[styles.exMeta, { color: colors.textMuted }]}>{ex.sets}x{ex.reps}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.restText, { color: colors.textMuted }]}>
                  {lang === 'es' ? 'Dia de descanso y recuperacion' : 'Rest and recovery day'}
                </Text>
              )}
            </View>
          )}

          {/* Events */}
          <View style={styles.eventsHeader}>
            <Text style={[styles.eventsTitle, { color: colors.textPrimary }]}>
              {selectedDay
                ? `${t.calendar.eventsFor} ${selectedDay} ${MONTH_NAMES_I18N[month - 1]}`
                : t.calendar.allEvents}
            </Text>
          </View>

          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push(`/event/${event.id}` as any)}
                onToggleComplete={() => toggleComplete(event)}
              />
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              {t.calendar.noEvents}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/event/new')}
      >
        <Ionicons name="add" size={28} color="#0D0D0D" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: Layout.screenPadding, paddingBottom: 100 },
  title: { ...Typography.h2, marginBottom: Layout.spacing.md },
  monthNav: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: Layout.spacing.sm,
  },
  navBtn: { padding: 8 },
  monthTitle: { ...Typography.h3 },

  // Workout section
  workoutSection: {
    borderRadius: 14, borderWidth: 1, padding: 14,
    marginTop: Layout.spacing.md, gap: 8,
  },
  workoutHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  workoutTitle: { ...Typography.body, fontWeight: '700' },
  exRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 6, borderBottomWidth: 1,
  },
  exNum: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  exNumText: { fontSize: 10, fontWeight: '700', color: '#0D0D0D' },
  exInfo: { flex: 1 },
  exName: { ...Typography.bodySmall, fontWeight: '600' },
  exMeta: { ...Typography.caption },
  restText: { ...Typography.bodySmall, textAlign: 'center', paddingVertical: 8 },

  // Events
  eventsHeader: { marginTop: Layout.spacing.lg, marginBottom: Layout.spacing.sm },
  eventsTitle: { ...Typography.h3 },
  emptyText: { ...Typography.bodySmall, textAlign: 'center', marginTop: Layout.spacing.lg },
  fab: {
    position: 'absolute', right: 20, bottom: 100,
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
});
