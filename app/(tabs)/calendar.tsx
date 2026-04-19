import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MonthView } from '@/components/calendar/MonthView';
import { EventCard } from '@/components/calendar/EventCard';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useUser } from '@/contexts/UserContext';
import { getEventsByMonth, updateEvent } from '@/database/eventQueries';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import type { CalendarEvent } from '@/types/models';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarScreen() {
  const router = useRouter();
  const db = useDatabase();
  const { user } = useUser();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const loadEvents = useCallback(async () => {
    const evts = await getEventsByMonth(db, user.id, year, month);
    setEvents(evts);
  }, [db, user.id, year, month]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const eventDays = new Set(
    events.map((e) => new Date(e.startTime).getDate())
  );

  const filteredEvents = selectedDay
    ? events.filter((e) => new Date(e.startTime).getDate() === selectedDay)
    : events;

  const goToPrevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
    setSelectedDay(null);
  };

  const toggleComplete = async (event: CalendarEvent) => {
    await updateEvent(db, event.id, { isCompleted: !event.isCompleted });
    await loadEvents();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.inner}>
        <Text style={styles.title}>Calendar</Text>

        {/* Month navigation */}
        <View style={styles.monthNav}>
          <Pressable onPress={goToPrevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.monthTitle}>
            {MONTH_NAMES[month - 1]} {year}
          </Text>
          <Pressable onPress={goToNextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>

        <MonthView
          year={year}
          month={month}
          selectedDay={selectedDay}
          eventDays={eventDays}
          onDayPress={setSelectedDay}
        />

        {/* Events list */}
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>
            {selectedDay
              ? `Events for ${MONTH_NAMES[month - 1]} ${selectedDay}`
              : 'All Events'}
          </Text>
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => router.push(`/event/${item.id}` as any)}
              onToggleComplete={() => toggleComplete(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No events for this day</Text>
          }
          style={styles.eventsList}
        />
      </View>

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/event/new')}
      >
        <Ionicons name="add" size={28} color={Colors.textPrimary} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    padding: Layout.screenPadding,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.md,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  navBtn: {
    padding: 8,
  },
  monthTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  eventsHeader: {
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  eventsTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  eventsList: {
    flex: 1,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Layout.spacing.lg,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
