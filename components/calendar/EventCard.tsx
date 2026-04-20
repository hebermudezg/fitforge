import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import type { CalendarEvent } from '@/types/models';
import { formatTime } from '@/utils/formatting';

const TYPE_LABELS: Record<CalendarEvent['eventType'], string> = {
  coaching: 'Coaching',
  check_in: 'Check-in',
  workout: 'Workout',
  custom: 'Custom',
};

interface EventCardProps {
  event: CalendarEvent;
  onPress: () => void;
  onToggleComplete: () => void;
}

export function EventCard({ event, onPress, onToggleComplete }: EventCardProps) {
  const { colors } = useTheme();

  const typeColors: Record<CalendarEvent['eventType'], string> = {
    coaching: colors.accent,
    check_in: colors.info,
    workout: colors.success,
    custom: colors.warning,
  };

  const borderColor = typeColors[event.eventType];

  return (
    <Pressable
      style={[styles.card, {
        backgroundColor: colors.surface,
        borderLeftColor: borderColor,
        borderColor: colors.border,
      }]}
      onPress={onPress}
    >
      <Pressable onPress={onToggleComplete} style={styles.checkbox}>
        <Ionicons
          name={event.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={event.isCompleted ? colors.success : colors.textMuted}
        />
      </Pressable>
      <View style={styles.content}>
        <Text style={[
          styles.title,
          { color: colors.textPrimary },
          event.isCompleted && { textDecorationLine: 'line-through', color: colors.textMuted },
        ]}>
          {event.title}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.type, { color: colors.textSecondary }]}>{TYPE_LABELS[event.eventType]}</Text>
          <Text style={[styles.time, { color: colors.textMuted }]}>{formatTime(event.startTime)}</Text>
          {event.location ? (
            <Text style={[styles.location, { color: colors.textMuted }]}>{event.location}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Layout.cardBorderRadius, borderLeftWidth: 4,
    padding: Layout.cardPadding, marginBottom: Layout.spacing.sm, borderWidth: 1,
  },
  checkbox: { marginRight: Layout.spacing.md },
  content: { flex: 1 },
  title: { ...Typography.body, fontWeight: '600' },
  meta: { flexDirection: 'row', gap: Layout.spacing.sm, marginTop: 4 },
  type: { ...Typography.caption },
  time: { ...Typography.caption },
  location: { ...Typography.caption },
});
