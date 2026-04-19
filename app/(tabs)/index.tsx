import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

export default function DashboardScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.logo}>FitForge</Text>
      <Text style={styles.greeting}>Welcome back!</Text>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>--</Text>
          <Text style={styles.statUnit}>kg</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Body Fat</Text>
          <Text style={styles.statValue}>--</Text>
          <Text style={styles.statUnit}>%</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statUnit}>days</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Recent Measurements</Text>
      <Card>
        <Text style={styles.emptyText}>No measurements yet. Tap Measure to start tracking!</Text>
      </Card>

      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      <Card>
        <Text style={styles.emptyText}>No upcoming events. Add one in Calendar!</Text>
      </Card>

      <Card style={styles.aiCard}>
        <Text style={styles.aiTitle}>AI Coach</Text>
        <Text style={styles.aiSubtitle}>Personalized coaching powered by AI — Coming Soon</Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
    ...Typography.h1,
    color: Colors.accent,
    marginBottom: Layout.spacing.xs,
  },
  greeting: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.xs,
  },
  statValue: {
    ...Typography.numeric,
    color: Colors.textPrimary,
  },
  statUnit: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.sm,
    marginTop: Layout.spacing.md,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Layout.spacing.md,
  },
  aiCard: {
    marginTop: Layout.spacing.lg,
    borderColor: Colors.accent,
    borderWidth: 1,
    opacity: 0.6,
  },
  aiTitle: {
    ...Typography.h3,
    color: Colors.accent,
    marginBottom: Layout.spacing.xs,
  },
  aiSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
