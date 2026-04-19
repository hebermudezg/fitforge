import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, type BodyPartKey } from '@/types/bodyParts';
import { convertValue, getDisplayUnit } from '@/utils/conversions';
import { getRelativeDate } from '@/utils/formatting';
import { getTodayWorkout, type Exercise } from '@/constants/exercises';
import { getDailyQuote, getGreeting } from '@/constants/quotes';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const { user } = useUser();
  const { latestMeasurements, recentMeasurements } = useMeasurements();

  const greeting = getGreeting(lang);
  const userName = user.name || '';
  const quote = getDailyQuote();
  const todayWorkout = getTodayWorkout();
  const isRestDay = todayWorkout.muscleGroup === 'rest';

  // Quick stats
  const weightM = latestMeasurements.weight;
  const bodyFatM = latestMeasurements.bodyFat;
  const weightDisplay = weightM ? convertValue(weightM.value, 'kg', user.unitSystem) : null;
  const weightUnit = getDisplayUnit('kg', user.unitSystem);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Text style={[styles.logo, { color: colors.accent }]}>FitForge</Text>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          {greeting}{userName ? `, ${userName}` : ''}! 💪
        </Text>

        {/* Daily motivational quote */}
        <View style={[styles.quoteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="flash" size={16} color={colors.accent} />
          <View style={styles.quoteContent}>
            <Text style={[styles.quoteText, { color: colors.textPrimary }]}>
              "{quote.text[lang]}"
            </Text>
            <Text style={[styles.quoteAuthor, { color: colors.accent }]}>
              — {quote.author}
            </Text>
          </View>
        </View>

        {/* Today's Workout */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t.dashboard.todayWorkout}
        </Text>

        {isRestDay ? (
          <Card style={styles.surfaceBg}>
            <View style={styles.restDay}>
              <Ionicons name="bed-outline" size={40} color={colors.accent} />
              <Text style={[styles.restTitle, { color: colors.textPrimary }]}>
                {t.dashboard.restDay}
              </Text>
              <Text style={[styles.restDesc, { color: colors.textMuted }]}>
                {t.dashboard.restDayDesc}
              </Text>
            </View>
          </Card>
        ) : (
          <Pressable style={[styles.workoutCard, { backgroundColor: colors.accent + '15', borderColor: colors.accent }]}>
            <View style={styles.workoutHeader}>
              <View style={[styles.workoutIcon, { backgroundColor: colors.accent + '25' }]}>
                <Ionicons name={todayWorkout.icon as any} size={28} color={colors.accent} />
              </View>
              <View style={styles.workoutInfo}>
                <Text style={[styles.workoutLabel, { color: colors.accent }]}>
                  {todayWorkout.label[lang]}
                </Text>
                <Text style={[styles.workoutCount, { color: colors.textSecondary }]}>
                  {todayWorkout.exercises.length} {t.dashboard.exercises}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.accent} />
            </View>

            {/* Exercise preview */}
            <View style={styles.exercisePreview}>
              {todayWorkout.exercises.slice(0, 4).map((ex, i) => (
                <View key={ex.id} style={[styles.exerciseRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.exerciseNum, { backgroundColor: colors.accent }]}>
                    <Text style={styles.exerciseNumText}>{i + 1}</Text>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={[styles.exerciseName, { color: colors.textPrimary }]}>
                      {ex.name[lang]}
                    </Text>
                    <Text style={[styles.exerciseMeta, { color: colors.textMuted }]}>
                      {ex.sets} {t.workout.sets} × {ex.reps} {t.workout.reps} · {ex.restSec}{t.workout.seconds} {t.workout.rest}
                    </Text>
                  </View>
                </View>
              ))}
              {todayWorkout.exercises.length > 4 && (
                <Text style={[styles.moreExercises, { color: colors.accent }]}>
                  +{todayWorkout.exercises.length - 4} more...
                </Text>
              )}
            </View>
          </Pressable>
        )}

        {/* Quick Stats */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t.dashboard.quickStats}
        </Text>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t.dashboard.weight}</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {weightDisplay ? weightDisplay.toFixed(1) : '--'}
            </Text>
            <Text style={[styles.statUnit, { color: colors.textSecondary }]}>{weightUnit}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{t.dashboard.bodyFat}</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {bodyFatM ? bodyFatM.value.toFixed(1) : '--'}
            </Text>
            <Text style={[styles.statUnit, { color: colors.textSecondary }]}>%</Text>
          </Card>
        </View>

        {/* Recent Measurements */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t.dashboard.recentMeasurements}
          </Text>
        </View>

        {recentMeasurements.length > 0 ? (
          <Card style={styles.surfaceBg}>
            {recentMeasurements.slice(0, 5).map((m, i) => {
              const partKey = m.bodyPart as BodyPartKey;
              const partDef = BODY_PARTS[partKey];
              if (!partDef) return null;
              const displayVal = convertValue(m.value, partDef.unit, user.unitSystem);
              const displayUnit = getDisplayUnit(partDef.unit, user.unitSystem);
              const partLabel = t.bodyParts[partKey] || partDef.label;
              return (
                <Pressable
                  key={m.id}
                  style={[styles.recentRow, i < 4 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                  onPress={() => router.push(`/history/${m.bodyPart}` as any)}
                >
                  <View>
                    <Text style={[styles.recentPart, { color: colors.textPrimary }]}>{partLabel}</Text>
                    <Text style={[styles.recentDate, { color: colors.textMuted }]}>{getRelativeDate(m.measuredAt)}</Text>
                  </View>
                  <Text style={[styles.recentValue, { color: colors.accent }]}>
                    {displayVal.toFixed(1)} {displayUnit}
                  </Text>
                </Pressable>
              );
            })}
          </Card>
        ) : (
          <Card style={styles.surfaceBg}>
            <Pressable style={styles.emptyAction} onPress={() => router.push('/(tabs)/measure' as any)}>
              <Ionicons name="add-circle-outline" size={24} color={colors.accent} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t.dashboard.noMeasurements}</Text>
            </Pressable>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <Pressable style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/measure' as any)}>
            <Ionicons name="body" size={26} color={colors.accent} />
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{t.dashboard.measure}</Text>
          </Pressable>
          <Pressable style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/progress' as any)}>
            <Ionicons name="trending-up" size={26} color={colors.success} />
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{t.progress.title}</Text>
          </Pressable>
          <Pressable style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push('/event/new' as any)}>
            <Ionicons name="calendar" size={26} color={colors.info} />
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{t.dashboard.newEvent}</Text>
          </Pressable>
        </View>

        {/* Footer disclaimer */}
        <Text style={[styles.footerDisclaimer, { color: colors.textMuted }]}>
          {t.disclaimer}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Layout.screenPadding, paddingBottom: 30 },
  logo: { ...Typography.h1, marginBottom: 2 },
  greeting: { ...Typography.body, marginBottom: Layout.spacing.md },

  // Quote
  quoteCard: {
    flexDirection: 'row', padding: 14, borderRadius: 14,
    borderWidth: 1, gap: 10, marginBottom: Layout.spacing.lg,
    alignItems: 'flex-start',
  },
  quoteContent: { flex: 1 },
  quoteText: { ...Typography.bodySmall, fontStyle: 'italic', lineHeight: 20 },
  quoteAuthor: { ...Typography.caption, fontWeight: '600', marginTop: 6 },

  // Today's workout
  sectionTitle: { ...Typography.h3, marginBottom: Layout.spacing.sm, marginTop: Layout.spacing.md },
  workoutCard: {
    borderRadius: Layout.cardBorderRadius, borderWidth: 1, padding: Layout.cardPadding,
    overflow: 'hidden',
  },
  workoutHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  workoutIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  workoutInfo: { flex: 1, marginLeft: 12 },
  workoutLabel: { ...Typography.h3 },
  workoutCount: { ...Typography.caption, marginTop: 2 },
  exercisePreview: {},
  exerciseRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    borderBottomWidth: 1, gap: 10,
  },
  exerciseNum: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  exerciseNumText: { fontSize: 11, fontWeight: '700', color: '#0D0D0D' },
  exerciseInfo: { flex: 1 },
  exerciseName: { ...Typography.bodySmall, fontWeight: '600' },
  exerciseMeta: { ...Typography.caption, marginTop: 2 },
  moreExercises: { ...Typography.bodySmall, fontWeight: '600', textAlign: 'center', paddingTop: 8 },

  // Rest day
  restDay: { alignItems: 'center', paddingVertical: Layout.spacing.lg },
  restTitle: { ...Typography.h3, marginTop: 8 },
  restDesc: { ...Typography.bodySmall, marginTop: 4, textAlign: 'center' },

  // Stats
  statsRow: { flexDirection: 'row', gap: Layout.spacing.sm },
  statCard: { flex: 1, alignItems: 'center' },
  statLabel: { ...Typography.caption, marginBottom: 2 },
  statValue: { ...Typography.numeric },
  statUnit: { ...Typography.caption },

  // Recent
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Layout.spacing.md, marginBottom: Layout.spacing.sm },
  recentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  recentPart: { ...Typography.body, fontWeight: '500' },
  recentDate: { ...Typography.caption, marginTop: 2 },
  recentValue: { ...Typography.body, fontWeight: '700' },
  emptyAction: { flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md, paddingVertical: Layout.spacing.md },
  emptyText: { ...Typography.bodySmall, flex: 1 },

  // Actions
  actionsRow: { flexDirection: 'row', gap: Layout.spacing.sm, marginTop: Layout.spacing.md },
  actionCard: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: Layout.cardBorderRadius, paddingVertical: Layout.spacing.lg,
    borderWidth: 1, gap: Layout.spacing.sm,
  },
  actionLabel: { ...Typography.caption, fontWeight: '600' },

  // Footer
  surfaceBg: {},
  footerDisclaimer: { ...Typography.caption, textAlign: 'center', marginTop: Layout.spacing.xl, lineHeight: 18 },
});
