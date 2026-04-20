import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, BODY_PART_KEYS, type BodyPartKey } from '@/types/bodyParts';
import { convertValue, getDisplayUnit } from '@/utils/conversions';
import { getRelativeDate } from '@/utils/formatting';
import { getTodayWorkout, getWeeklyPlan } from '@/constants/exercises';
import { getDailyQuote, getGreeting } from '@/constants/quotes';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const { user } = useUser();
  const { latestMeasurements, recentMeasurements } = useMeasurements();

  const [fitnessGoal, setFitnessGoal] = useState<string>('build');
  useEffect(() => {
    AsyncStorage.getItem('fitness_goal').then((g) => { if (g) setFitnessGoal(g); });
  }, []);

  const greeting = getGreeting(lang);
  const quote = getDailyQuote();
  const todayWorkout = getTodayWorkout(fitnessGoal);
  const weeklyPlan = getWeeklyPlan(fitnessGoal);
  const isRestDay = todayWorkout.muscleGroup === 'rest';
  const todayDayIndex = new Date().getDay();
  const todayPlanIndex = todayDayIndex === 0 ? 6 : todayDayIndex - 1;
  const DAY_LABELS = [t.workout.monday, t.workout.tuesday, t.workout.wednesday, t.workout.thursday, t.workout.friday, t.workout.saturday, t.workout.sunday];

  const weightM = latestMeasurements.weight;
  const bodyFatM = latestMeasurements.bodyFat;
  const weightVal = weightM ? convertValue(weightM.value, 'kg', user.unitSystem) : null;
  const weightUnit = getDisplayUnit('kg', user.unitSystem);

  // Count measured body parts
  const measuredCount = Object.keys(latestMeasurements).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header + Quote */}
        <View style={styles.headerSection}>
          <Text style={[styles.logo, { color: colors.accent }]}>FitForge</Text>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {greeting}{user.name ? `, ${user.name}` : ''}
          </Text>
        </View>

        <View style={[styles.quoteCard, { backgroundColor: colors.accent + '12', borderColor: colors.accent + '30' }]}>
          <Text style={[styles.quoteText, { color: colors.textPrimary }]}>
            "{quote.text[lang]}"
          </Text>
          <Text style={[styles.quoteAuthor, { color: colors.accent }]}>— {quote.author}</Text>
        </View>

        {/* Today's Workout - compact */}
        <Pressable
          style={[styles.workoutBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => {/* TODO: navigate to workout detail */}}
        >
          <View style={[styles.workoutIconBg, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name={isRestDay ? 'bed-outline' : todayWorkout.icon as any} size={24} color={colors.accent} />
          </View>
          <View style={styles.workoutInfo}>
            <Text style={[styles.workoutTitle, { color: colors.textPrimary }]}>
              {isRestDay ? t.dashboard.restDay : todayWorkout.label[lang]}
            </Text>
            <Text style={[styles.workoutSub, { color: colors.textMuted }]}>
              {isRestDay
                ? t.dashboard.restDayDesc
                : `${todayWorkout.exercises.length} ${t.dashboard.exercises}`}
            </Text>
          </View>
          {!isRestDay && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
        </Pressable>

        {/* Weekly Plan Strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekStrip} contentContainerStyle={styles.weekStripContent}>
          {weeklyPlan.map((day, i) => {
            const isToday = i === todayPlanIndex;
            const isRest = day.muscleGroup === 'rest' || day.muscleGroup === 'cardio';
            return (
              <View key={day.dayKey} style={[
                styles.weekDay,
                { backgroundColor: isToday ? colors.accent : colors.surface, borderColor: isToday ? colors.accent : colors.border },
              ]}>
                <Text style={[styles.weekDayLabel, { color: isToday ? '#0D0D0D' : colors.textMuted }]}>
                  {DAY_LABELS[i]}
                </Text>
                <Ionicons name={day.icon as any} size={16} color={isToday ? '#0D0D0D' : isRest ? colors.textMuted : colors.accent} />
                <Text style={[styles.weekDayType, { color: isToday ? '#0D0D0D' : colors.textSecondary }]} numberOfLines={1}>
                  {day.label[lang].split(' ')[0]}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Body Stats Grid */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t.dashboard.quickStats}
        </Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statBig, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="scale-outline" size={20} color={colors.accent} />
            <Text style={[styles.statBigValue, { color: colors.textPrimary }]}>
              {weightVal ? weightVal.toFixed(1) : '--'}
            </Text>
            <Text style={[styles.statBigUnit, { color: colors.textMuted }]}>{weightUnit}</Text>
            <Text style={[styles.statBigLabel, { color: colors.textSecondary }]}>{t.dashboard.weight}</Text>
          </View>
          <View style={[styles.statBig, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="analytics-outline" size={20} color={colors.accent} />
            <Text style={[styles.statBigValue, { color: colors.textPrimary }]}>
              {bodyFatM ? bodyFatM.value.toFixed(1) : '--'}
            </Text>
            <Text style={[styles.statBigUnit, { color: colors.textMuted }]}>%</Text>
            <Text style={[styles.statBigLabel, { color: colors.textSecondary }]}>{t.dashboard.bodyFat}</Text>
          </View>
          <View style={[styles.statBig, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="body-outline" size={20} color={colors.accent} />
            <Text style={[styles.statBigValue, { color: colors.textPrimary }]}>{measuredCount}</Text>
            <Text style={[styles.statBigUnit, { color: colors.textMuted }]}>/11</Text>
            <Text style={[styles.statBigLabel, { color: colors.textSecondary }]}>
              {lang === 'es' ? 'Medidos' : 'Measured'}
            </Text>
          </View>
        </View>

        {/* All body measurements summary */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t.dashboard.recentMeasurements}
        </Text>
        <View style={[styles.measureGrid, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {BODY_PART_KEYS.map((key) => {
            const partDef = BODY_PARTS[key];
            const m = latestMeasurements[key];
            const val = m ? convertValue(m.value, partDef.unit, user.unitSystem) : null;
            const unit = getDisplayUnit(partDef.unit, user.unitSystem);
            const label = (t.bodyParts as any)[key] || partDef.label;

            return (
              <Pressable
                key={key}
                style={[styles.measureCell, { borderBottomColor: colors.border }]}
                onPress={() => router.push(`/measurement/${key}` as any)}
              >
                <Text style={[styles.measureLabel, { color: colors.textSecondary }]}>{label}</Text>
                <Text style={[styles.measureValue, { color: val ? colors.accent : colors.textMuted }]}>
                  {val ? `${val.toFixed(1)} ${unit}` : '--'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Exercises preview for today */}
        {!isRestDay && todayWorkout.exercises.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t.workout.exercises} — {todayWorkout.label[lang]}
            </Text>
            {todayWorkout.exercises.slice(0, 5).map((ex, i) => (
              <View key={ex.id} style={[styles.exerciseItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.exNum, { backgroundColor: colors.accent }]}>
                  <Text style={styles.exNumText}>{i + 1}</Text>
                </View>
                <View style={styles.exInfo}>
                  <Text style={[styles.exName, { color: colors.textPrimary }]}>{ex.name[lang]}</Text>
                  <Text style={[styles.exMeta, { color: colors.textMuted }]}>
                    {ex.sets}×{ex.reps} · {ex.restSec}s
                  </Text>
                </View>
                <Text style={[styles.exTip, { color: colors.textMuted }]} numberOfLines={1}>
                  {ex.tips[lang]}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/(tabs)/measure' as any)}>
            <Ionicons name="body" size={22} color="#0D0D0D" />
            <Text style={styles.actionBtnText}>{t.tabs.measure}</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/progress' as any)}>
            <Ionicons name="trending-up" size={22} color={colors.accent} />
            <Text style={[styles.actionBtnTextAlt, { color: colors.textPrimary }]}>{t.tabs.progress}</Text>
          </Pressable>
        </View>

        {/* Footer disclaimer */}
        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>{t.disclaimer}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Layout.screenPadding, paddingBottom: 30 },

  headerSection: { marginBottom: Layout.spacing.md },
  logo: { ...Typography.h1, marginBottom: 2 },
  greeting: { ...Typography.body },

  quoteCard: {
    padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: Layout.spacing.lg,
  },
  quoteText: { ...Typography.bodySmall, fontStyle: 'italic', lineHeight: 22 },
  quoteAuthor: { ...Typography.caption, fontWeight: '700', marginTop: 6 },

  workoutBanner: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderRadius: 14, borderWidth: 1, marginBottom: Layout.spacing.md, gap: 12,
  },
  workoutIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  workoutInfo: { flex: 1 },
  workoutTitle: { ...Typography.body, fontWeight: '700' },
  workoutSub: { ...Typography.caption, marginTop: 2 },

  weekStrip: { marginBottom: Layout.spacing.sm },
  weekStripContent: { gap: 6 },
  weekDay: {
    alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10,
    borderRadius: 10, borderWidth: 1, minWidth: 52, gap: 3,
  },
  weekDayLabel: { ...Typography.caption, fontWeight: '700', fontSize: 10 },
  weekDayType: { ...Typography.caption, fontSize: 9 },

  sectionTitle: { ...Typography.h3, marginBottom: Layout.spacing.sm, marginTop: Layout.spacing.md },

  statsGrid: { flexDirection: 'row', gap: Layout.spacing.sm },
  statBig: {
    flex: 1, alignItems: 'center', padding: 14,
    borderRadius: 14, borderWidth: 1, gap: 2,
  },
  statBigValue: { ...Typography.numeric, fontSize: 28 },
  statBigUnit: { ...Typography.caption },
  statBigLabel: { ...Typography.caption, fontWeight: '600', marginTop: 2 },

  measureGrid: {
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
  },
  measureCell: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1,
  },
  measureLabel: { ...Typography.bodySmall },
  measureValue: { ...Typography.body, fontWeight: '700' },

  exerciseItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 6,
  },
  exNum: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  exNumText: { fontSize: 12, fontWeight: '700', color: '#0D0D0D' },
  exInfo: { flex: 1 },
  exName: { ...Typography.bodySmall, fontWeight: '600' },
  exMeta: { ...Typography.caption, marginTop: 1 },
  exTip: { ...Typography.caption, flex: 0.6 },

  actionsRow: { flexDirection: 'row', gap: Layout.spacing.sm, marginTop: Layout.spacing.lg },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12,
  },
  actionBtnText: { ...Typography.body, color: '#0D0D0D', fontWeight: '700' },
  actionBtnTextAlt: { ...Typography.body, fontWeight: '700' },

  disclaimer: { ...Typography.caption, textAlign: 'center', marginTop: Layout.spacing.xl, lineHeight: 18 },
});
