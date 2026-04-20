import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { getTodayWorkout, getWeeklyPlan, type WorkoutDay, type Exercise } from '@/constants/exercises';
import { getExerciseGif } from '@/constants/exerciseMedia';

export default function WorkoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const [fitnessGoal, setFitnessGoal] = useState('build');
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('fitness_goal').then((g) => { if (g) setFitnessGoal(g); });
  }, []);

  const todayWorkout = getTodayWorkout(fitnessGoal);
  const isRestDay = todayWorkout.muscleGroup === 'rest';

  const toggleExercise = (id: string) => {
    setExpandedExercise(expandedExercise === id ? null : id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t.workout.todaySession}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Workout info */}
        <View style={[styles.workoutHeader, { backgroundColor: colors.accent + '10', borderColor: colors.accent + '30' }]}>
          <View style={[styles.workoutIcon, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name={isRestDay ? 'bed-outline' : todayWorkout.icon as any} size={32} color={colors.accent} />
          </View>
          <Text style={[styles.workoutName, { color: colors.accent }]}>
            {todayWorkout.label[lang]}
          </Text>
          <Text style={[styles.workoutMeta, { color: colors.textSecondary }]}>
            {isRestDay
              ? (lang === 'es' ? 'Recuperacion y estiramiento' : 'Recovery and stretching')
              : `${todayWorkout.exercises.length} ${t.workout.exercises}`}
          </Text>
        </View>

        {isRestDay ? (
          <View style={styles.restContent}>
            <Ionicons name="leaf-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.restTitle, { color: colors.textPrimary }]}>
              {t.dashboard.restDay}
            </Text>
            <Text style={[styles.restDesc, { color: colors.textSecondary }]}>
              {t.dashboard.restDayDesc}
            </Text>
            <View style={[styles.restTips, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.restTipTitle, { color: colors.textPrimary }]}>
                {lang === 'es' ? 'Recomendaciones' : 'Recommendations'}
              </Text>
              {[
                { icon: 'water-outline', text: lang === 'es' ? 'Toma al menos 2-3 litros de agua' : 'Drink at least 2-3 liters of water' },
                { icon: 'bed-outline', text: lang === 'es' ? 'Duerme 7-9 horas' : 'Sleep 7-9 hours' },
                { icon: 'walk-outline', text: lang === 'es' ? 'Camina 20-30 minutos' : 'Walk 20-30 minutes' },
                { icon: 'body-outline', text: lang === 'es' ? 'Estira los musculos trabajados' : 'Stretch worked muscles' },
              ].map((tip, i) => (
                <View key={i} style={styles.restTipRow}>
                  <Ionicons name={tip.icon as any} size={18} color={colors.accent} />
                  <Text style={[styles.restTipText, { color: colors.textSecondary }]}>{tip.text}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <>
            {/* Exercise list */}
            {todayWorkout.exercises.map((ex, i) => {
              const isExpanded = expandedExercise === ex.id;
              return (
                <Pressable
                  key={ex.id}
                  style={[styles.exerciseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => toggleExercise(ex.id)}
                >
                  {/* Exercise number + name */}
                  <View style={styles.exerciseHeader}>
                    <View style={[styles.exerciseNum, { backgroundColor: colors.accent }]}>
                      <Text style={styles.exerciseNumText}>{i + 1}</Text>
                    </View>
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, { color: colors.textPrimary }]}>
                        {ex.name[lang]}
                      </Text>
                      <Text style={[styles.exerciseMeta, { color: colors.textMuted }]}>
                        {ex.sets} {t.workout.sets} x {ex.reps} {t.workout.reps} · {ex.restSec}s {t.workout.rest}
                      </Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </View>

                  {/* Expanded details */}
                  {isExpanded && (
                    <View style={[styles.exerciseDetails, { borderTopColor: colors.border }]}>
                      {/* Exercise GIF/Image */}
                      {getExerciseGif(ex.id) && (
                        <View style={[styles.gifContainer, { backgroundColor: colors.surfaceLight }]}>
                          <Image
                            source={{ uri: getExerciseGif(ex.id)! }}
                            style={styles.exerciseGif}
                            resizeMode="contain"
                          />
                        </View>
                      )}

                      {/* Description */}
                      <View style={styles.detailRow}>
                        <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                          {ex.description[lang]}
                        </Text>
                      </View>

                      {/* Tips */}
                      <View style={styles.detailRow}>
                        <Ionicons name="bulb-outline" size={16} color={colors.warning} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                          {ex.tips[lang]}
                        </Text>
                      </View>

                      {/* Muscles targeted */}
                      <View style={styles.muscleChips}>
                        {ex.muscles.map((muscle) => (
                          <View key={muscle} style={[styles.muscleChip, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}>
                            <Text style={[styles.muscleChipText, { color: colors.accent }]}>
                              {muscle}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </Pressable>
              );
            })}

            {/* Science note */}
            <View style={[styles.scienceNote, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="school-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.scienceText, { color: colors.textMuted }]}>
                {lang === 'es'
                  ? 'Rutina basada en evidencia cientifica. Frecuencia 2x/semana por grupo muscular (Schoenfeld et al., 2016). Volumen de 10-20 series semanales por musculo (Schoenfeld et al., 2017).'
                  : 'Evidence-based routine. 2x/week frequency per muscle group (Schoenfeld et al., 2016). 10-20 weekly sets per muscle (Schoenfeld et al., 2017).'}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Layout.screenPadding, borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { ...Typography.h3 },
  content: { padding: Layout.screenPadding, paddingBottom: 40 },

  workoutHeader: {
    alignItems: 'center', padding: Layout.spacing.lg,
    borderRadius: 16, borderWidth: 1, marginBottom: Layout.spacing.lg,
  },
  workoutIcon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  workoutName: { ...Typography.h2, marginBottom: 4 },
  workoutMeta: { ...Typography.body },

  // Rest day
  restContent: { alignItems: 'center', paddingVertical: Layout.spacing.xl },
  restTitle: { ...Typography.h2, marginTop: Layout.spacing.md },
  restDesc: { ...Typography.body, marginTop: 4, textAlign: 'center' },
  restTips: { marginTop: Layout.spacing.lg, padding: Layout.cardPadding, borderRadius: 14, borderWidth: 1, width: '100%' },
  restTipTitle: { ...Typography.h3, marginBottom: Layout.spacing.md },
  restTipRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  restTipText: { ...Typography.body, flex: 1 },

  // Exercise card
  exerciseCard: {
    borderRadius: 14, borderWidth: 1, marginBottom: Layout.spacing.sm, overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
  },
  exerciseNum: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
  },
  exerciseNumText: { fontSize: 13, fontWeight: '800', color: '#0D0D0D' },
  exerciseInfo: { flex: 1 },
  exerciseName: { ...Typography.body, fontWeight: '700' },
  exerciseMeta: { ...Typography.caption, marginTop: 2 },

  // Expanded details
  exerciseDetails: { padding: 14, paddingTop: 10, borderTopWidth: 1, gap: 10 },
  gifContainer: {
    borderRadius: 10, overflow: 'hidden', alignItems: 'center',
    marginBottom: 4,
  },
  exerciseGif: { width: '100%', height: 200, borderRadius: 10 },
  detailRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  detailText: { ...Typography.bodySmall, flex: 1, lineHeight: 20 },
  muscleChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  muscleChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  muscleChipText: { ...Typography.caption, fontWeight: '600' },

  // Science note
  scienceNote: {
    flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1,
    marginTop: Layout.spacing.md, alignItems: 'flex-start',
  },
  scienceText: { ...Typography.caption, flex: 1, lineHeight: 18, fontStyle: 'italic' },
});
