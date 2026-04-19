import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function ProgressScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Progress</Text>
      <EmptyState
        icon="trending-up-outline"
        title="No Data Yet"
        message="Start tracking your measurements to see your progress over time"
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
