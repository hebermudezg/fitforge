import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.title}>Profile</Text>
      <Card style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>Set up your profile</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.label}>Goals</Text>
        <Text style={styles.hint}>Set targets for each body measurement</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.label}>Units</Text>
        <Text style={styles.value}>Metric (cm, kg)</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.lg,
  },
  card: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.xs,
  },
  value: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  hint: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
