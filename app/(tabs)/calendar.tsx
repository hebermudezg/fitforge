import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function CalendarScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Calendar</Text>
      <EmptyState
        icon="calendar-outline"
        title="No Events"
        message="Schedule coaching sessions, check-ins, and workouts"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
});
