import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function MeasureScreen() {
  return (
    <ScreenContainer scrollable={false}>
      <Text style={styles.title}>Body Measurements</Text>
      <Text style={styles.subtitle}>Tap a body part to record a measurement</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
