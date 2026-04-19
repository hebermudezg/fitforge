import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import type { CalendarEvent } from '@/types/models';
import { formatTime } from '@/utils/formatting';

const TYPE_COLORS: Record<CalendarEvent['eventType'], string> = {
  coaching: Colors.accent,
  check_in: Colors.info,
  workout: Colors.success,
  custom: Colors.warning,
};

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
  const borderColor = TYPE_COLORS[event.eventType];

  return (
    <Pressable style={[styles.card, { borderLeftColor: borderColor }]} onPress={onPress}>
      <Pressable onPress={onToggleComplete} style={styles.checkbox}>
        <Ionicons
          name={event.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={event.isCompleted ? Colors.success : Colors.textMuted}
        />
      </Pressable>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            event.isCompleted && styles.titleCompleted,
          ]}
        >
          {event.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.type}>{TYPE_LABELS[event.eventType]}</Text>
          <Text style={styles.time}>{formatTime(event.startTime)}</Text>
          {event.location ? (
            <Text style={styles.location}>{event.location}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardBorderRadius,
    borderLeftWidth: 4,
    padding: Layout.cardPadding,
    marginBottom: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkbox: {
    marginRight: Layout.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  meta: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    marginTop: 4,
  },
  type: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  location: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
