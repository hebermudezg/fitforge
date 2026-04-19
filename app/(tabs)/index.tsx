import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useUser } from '@/contexts/UserContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, type BodyPartKey } from '@/types/bodyParts';
import { convertValue, getDisplayUnit } from '@/utils/conversions';
import { getRelativeDate, formatDelta } from '@/utils/formatting';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { latestMeasurements, recentMeasurements } = useMeasurements();

  const greeting = user.name ? `Welcome back, ${user.name}!` : 'Welcome back!';

  // Quick stats
  const weightMeasurement = latestMeasurements.weight;
  const bodyFatMeasurement = latestMeasurements.bodyFat;
  const weightDisplay = weightMeasurement
    ? convertValue(weightMeasurement.value, 'kg', user.unitSystem)
    : null;
  const weightUnit = getDisplayUnit('kg', user.unitSystem);

  // Streak calculation
  const measureDates = new Set(
    recentMeasurements.map((m) => m.measuredAt.split('T')[0])
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (measureDates.has(dateStr)) streak++;
    else if (i > 0) break;
  }

  return (
    <ScreenContainer>
      <Text style={styles.logo}>FitForge</Text>
      <Text style={styles.greeting}>{greeting}</Text>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>
            {weightDisplay ? weightDisplay.toFixed(1) : '--'}
          </Text>
          <Text style={styles.statUnit}>{weightUnit}</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Body Fat</Text>
          <Text style={styles.statValue}>
            {bodyFatMeasurement ? bodyFatMeasurement.value.toFixed(1) : '--'}
          </Text>
          <Text style={styles.statUnit}>%</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statUnit}>days</Text>
        </Card>
      </View>

      {/* Recent Measurements */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Measurements</Text>
        <Pressable onPress={() => router.push('/(tabs)/measure' as any)}>
          <Text style={styles.seeAll}>Measure</Text>
        </Pressable>
      </View>

      {recentMeasurements.length > 0 ? (
        <Card>
          {recentMeasurements.slice(0, 5).map((m, i) => {
            const partDef = BODY_PARTS[m.bodyPart as BodyPartKey];
            if (!partDef) return null;
            const displayVal = convertValue(m.value, partDef.unit, user.unitSystem);
            const displayUnit = getDisplayUnit(partDef.unit, user.unitSystem);
            return (
              <Pressable
                key={m.id}
                style={[
                  styles.recentRow,
                  i < Math.min(recentMeasurements.length, 5) - 1 && styles.recentRowBorder,
                ]}
                onPress={() => router.push(`/history/${m.bodyPart}` as any)}
              >
                <View style={styles.recentLeft}>
                  <Text style={styles.recentPart}>{partDef.label}</Text>
                  <Text style={styles.recentDate}>{getRelativeDate(m.measuredAt)}</Text>
                </View>
                <Text style={styles.recentValue}>
                  {displayVal.toFixed(1)} {displayUnit}
                </Text>
              </Pressable>
            );
          })}
        </Card>
      ) : (
        <Card>
          <Pressable
            style={styles.emptyAction}
            onPress={() => router.push('/(tabs)/measure' as any)}
          >
            <Ionicons name="add-circle-outline" size={24} color={Colors.accent} />
            <Text style={styles.emptyText}>
              Tap to start tracking your body measurements
            </Text>
          </Pressable>
        </Card>
      )}

      {/* Progress shortcut */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <View style={styles.actionsRow}>
        <Pressable
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/measure' as any)}
        >
          <Ionicons name="body" size={28} color={Colors.accent} />
          <Text style={styles.actionLabel}>Measure</Text>
        </Pressable>
        <Pressable
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/progress' as any)}
        >
          <Ionicons name="trending-up" size={28} color={Colors.success} />
          <Text style={styles.actionLabel}>Progress</Text>
        </Pressable>
        <Pressable
          style={styles.actionCard}
          onPress={() => router.push('/event/new' as any)}
        >
          <Ionicons name="calendar" size={28} color={Colors.info} />
          <Text style={styles.actionLabel}>New Event</Text>
        </Pressable>
      </View>

      {/* AI Coach */}
      <Card style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <Ionicons name="sparkles" size={20} color={Colors.accent} />
          <Text style={styles.aiTitle}>AI Coach</Text>
        </View>
        <Text style={styles.aiSubtitle}>
          Personalized coaching powered by AI — Coming Soon
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logo: { ...Typography.h1, color: Colors.accent, marginBottom: Layout.spacing.xs },
  greeting: { ...Typography.body, color: Colors.textSecondary, marginBottom: Layout.spacing.lg },
  statsRow: { flexDirection: 'row', gap: Layout.spacing.sm, marginBottom: Layout.spacing.lg },
  statCard: { flex: 1, alignItems: 'center' },
  statLabel: { ...Typography.caption, color: Colors.textMuted, marginBottom: 2 },
  statValue: { ...Typography.numeric, color: Colors.textPrimary },
  statUnit: { ...Typography.caption, color: Colors.textSecondary },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Layout.spacing.sm, marginTop: Layout.spacing.md,
  },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  seeAll: { ...Typography.bodySmall, color: Colors.accent, fontWeight: '600' },
  recentRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
  },
  recentRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  recentLeft: {},
  recentPart: { ...Typography.body, color: Colors.textPrimary, fontWeight: '500' },
  recentDate: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  recentValue: { ...Typography.body, color: Colors.textSecondary, fontWeight: '600' },
  emptyAction: {
    flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
  },
  emptyText: { ...Typography.bodySmall, color: Colors.textMuted, flex: 1 },
  actionsRow: {
    flexDirection: 'row', gap: Layout.spacing.sm,
  },
  actionCard: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface, borderRadius: Layout.cardBorderRadius,
    paddingVertical: Layout.spacing.lg, borderWidth: 1, borderColor: Colors.border,
    gap: Layout.spacing.sm,
  },
  actionLabel: { ...Typography.bodySmall, color: Colors.textSecondary, fontWeight: '600' },
  aiCard: {
    marginTop: Layout.spacing.lg, borderColor: Colors.accent,
    borderWidth: 1, opacity: 0.6,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.sm },
  aiTitle: { ...Typography.h3, color: Colors.accent },
  aiSubtitle: {
    ...Typography.bodySmall, color: Colors.textSecondary, marginTop: Layout.spacing.xs,
  },
});
