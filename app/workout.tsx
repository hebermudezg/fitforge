import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { useUser } from '@/contexts/UserContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { getTodayWorkout, type Exercise } from '@/constants/exercises';
import { getExerciseGif } from '@/constants/exerciseMedia';
import {
  startWorkoutSession, getActiveSession, getSessionSets,
  completeSet, uncompleteSet, completeWorkoutSession,
  type WorkoutSet,
} from '@/database/workoutQueries';
import { getDailyQuote } from '@/constants/quotes';

export default function WorkoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, lang } = useI18n();
  const { user } = useUser();
  const db = useDatabase();

  const [fitnessGoal, setFitnessGoal] = useState('build');
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('fitness_goal').then((g) => { if (g) setFitnessGoal(g); });
  }, []);

  const todayWorkout = getTodayWorkout(fitnessGoal, user.gender);
  const isRestDay = todayWorkout.muscleGroup === 'rest';

  // Check for active session on mount
  useEffect(() => {
    (async () => {
      const active = await getActiveSession(db, user.id);
      if (active) {
        setSessionId(active.id);
        setIsWorkoutActive(true);
        const s = await getSessionSets(db, active.id);
        setSets(s);
      }
    })();
  }, [db, user.id]);

  const handleStartWorkout = async () => {
    const exercises = todayWorkout.exercises.map((ex) => ({
      id: ex.id, name: ex.name[lang], sets: ex.sets,
    }));
    const id = await startWorkoutSession(db, user.id, todayWorkout.label[lang], exercises);
    setSessionId(id);
    setIsWorkoutActive(true);
    const s = await getSessionSets(db, id);
    setSets(s);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Toggle ALL sets of an exercise at once
  const handleToggleExercise = async (exerciseId: string) => {
    const exSets = sets.filter((s) => s.exerciseId === exerciseId);
    const allDone = exSets.every((s) => s.completed);
    for (const set of exSets) {
      if (allDone) {
        await uncompleteSet(db, set.id);
      } else {
        if (!set.completed) await completeSet(db, set.id);
      }
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (sessionId) {
      const s = await getSessionSets(db, sessionId);
      setSets(s);
    }
  };

  // Mark ALL exercises as done
  const handleCompleteAll = async () => {
    for (const set of sets) {
      if (!set.completed) await completeSet(db, set.id);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (sessionId) {
      const s = await getSessionSets(db, sessionId);
      setSets(s);
    }
  };

  const handleFinishWorkout = async () => {
    const msg = lang === 'es' ? 'Terminar entrenamiento?' : 'Finish workout?';
    const confirmed = Platform.OS === 'web'
      ? window.confirm(msg)
      : await new Promise<boolean>((resolve) => {
          Alert.alert('', msg, [
            { text: lang === 'es' ? 'Cancelar' : 'Cancel', onPress: () => resolve(false) },
            { text: 'OK', onPress: () => resolve(true) },
          ]);
        });
    if (!confirmed) return;

    if (sessionId) {
      await completeWorkoutSession(db, sessionId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Calculate duration
      const session = await getActiveSession(db, user.id);
      if (session) {
        const start = new Date(session.startedAt).getTime();
        const mins = Math.round((Date.now() - start) / 60000);
        setWorkoutDuration(mins);
      }
    }
    setShowCelebration(true);
    setIsWorkoutActive(false);
  };

  // Group sets by exercise
  const exerciseSets: Record<string, WorkoutSet[]> = {};
  for (const s of sets) {
    if (!exerciseSets[s.exerciseId]) exerciseSets[s.exerciseId] = [];
    exerciseSets[s.exerciseId].push(s);
  }

  const totalSets = sets.length;
  const completedSets = sets.filter((s) => s.completed).length;
  // Count completed exercises (all sets done = 1 exercise done)
  const totalExercises = todayWorkout.exercises.length;
  const completedExercises = todayWorkout.exercises.filter((ex) => {
    const exSets = exerciseSets[ex.id] || [];
    return exSets.length > 0 && exSets.every((s) => s.completed);
  }).length;
  const progress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

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
        {isWorkoutActive && (
          <Pressable onPress={handleFinishWorkout}>
            <Text style={[styles.finishText, { color: colors.success }]}>
              {lang === 'es' ? 'Terminar' : 'Finish'}
            </Text>
          </Pressable>
        )}
        {!isWorkoutActive && <View style={{ width: 60 }} />}
      </View>

      {/* CELEBRATION SCREEN */}
      {showCelebration && (
        <View style={[styles.celebrationContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.celebrationIcon, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </View>
          <Text style={[styles.celebrationTitle, { color: colors.textPrimary }]}>
            {lang === 'es' ? 'Entrenamiento Completado!' : 'Workout Complete!'}
          </Text>
          <Text style={[styles.celebrationQuote, { color: colors.textSecondary }]}>
            "{getDailyQuote().text[lang]}"
          </Text>
          <Text style={[styles.celebrationAuthor, { color: colors.accent }]}>
            — {getDailyQuote().author}
          </Text>

          <View style={styles.celebrationStats}>
            <View style={[styles.celebrationStat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="barbell-outline" size={22} color={colors.accent} />
              <Text style={[styles.celebrationStatValue, { color: colors.textPrimary }]}>{completedExercises}</Text>
              <Text style={[styles.celebrationStatLabel, { color: colors.textMuted }]}>
                {t.workout.exercises}
              </Text>
            </View>
            <View style={[styles.celebrationStat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={22} color={colors.accent} />
              <Text style={[styles.celebrationStatValue, { color: colors.textPrimary }]}>{workoutDuration}</Text>
              <Text style={[styles.celebrationStatLabel, { color: colors.textMuted }]}>min</Text>
            </View>
            <View style={[styles.celebrationStat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="flame-outline" size={22} color={colors.accent} />
              <Text style={[styles.celebrationStatValue, { color: colors.textPrimary }]}>+1</Text>
              <Text style={[styles.celebrationStatLabel, { color: colors.textMuted }]}>
                {lang === 'es' ? 'racha' : 'streak'}
              </Text>
            </View>
          </View>

          <Pressable onPress={() => router.back()} style={styles.celebrationBtn}>
            <LinearGradient
              colors={[colors.gradientPrimary[0], colors.gradientPrimary[1]] as [string, string]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.celebrationBtnGradient}
            >
              <Ionicons name="home" size={20} color="#0D0D0D" />
              <Text style={styles.celebrationBtnText}>
                {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

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

        {/* Progress bar when active */}
        {isWorkoutActive && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressText, { color: colors.textPrimary }]}>
                {completedExercises}/{totalExercises} {t.workout.exercises}
              </Text>
              <Text style={[styles.progressPercent, { color: colors.accent }]}>
                {Math.round(progress)}%
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.surfaceLight }]}>
              <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.accent }]} />
            </View>
          </View>
        )}

        {isRestDay ? (
          <View style={styles.restContent}>
            <Ionicons name="leaf-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.restTitle, { color: colors.textPrimary }]}>{t.dashboard.restDay}</Text>
            <Text style={[styles.restDesc, { color: colors.textSecondary }]}>{t.dashboard.restDayDesc}</Text>
          </View>
        ) : (
          <>
            {/* Start workout button */}
            {!isWorkoutActive && (
              <Pressable onPress={handleStartWorkout} style={styles.startBtn}>
                <LinearGradient
                  colors={[colors.gradientPrimary[0], colors.gradientPrimary[1]] as [string, string]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.startGradient}
                >
                  <Ionicons name="play" size={22} color="#0D0D0D" />
                  <Text style={styles.startText}>
                    {lang === 'es' ? 'Iniciar Entrenamiento' : 'Start Workout'}
                  </Text>
                </LinearGradient>
              </Pressable>
            )}

            {/* Exercise list */}
            {todayWorkout.exercises.map((ex, i) => {
              const isExpanded = expandedExercise === ex.id;
              const exSets = exerciseSets[ex.id] || [];
              const exCompleted = exSets.filter((s) => s.completed).length;
              const exTotal = exSets.length;
              const allDone = exTotal > 0 && exCompleted === exTotal;

              return (
                <View key={ex.id} style={[styles.exerciseCard, { backgroundColor: colors.surface, borderColor: allDone ? colors.success + '50' : colors.border }]}>
                  <Pressable style={styles.exerciseHeader} onPress={() => setExpandedExercise(isExpanded ? null : ex.id)}>
                    {/* Tap checkbox to mark exercise done */}
                    {isWorkoutActive ? (
                      <Pressable
                        onPress={(e) => { e.stopPropagation(); handleToggleExercise(ex.id); }}
                        style={[styles.exerciseNum, { backgroundColor: allDone ? colors.success : colors.surfaceLight }]}
                      >
                        {allDone
                          ? <Ionicons name="checkmark" size={16} color="#fff" />
                          : <Text style={[styles.exerciseNumText, { color: allDone ? '#fff' : colors.textMuted }]}>{i + 1}</Text>
                        }
                      </Pressable>
                    ) : (
                      <View style={[styles.exerciseNum, { backgroundColor: colors.accent }]}>
                        <Text style={styles.exerciseNumText}>{i + 1}</Text>
                      </View>
                    )}
                    <View style={styles.exerciseInfo}>
                      <Text style={[styles.exerciseName, { color: colors.textPrimary }]}>
                        {ex.name[lang]}
                      </Text>
                      <Text style={[styles.exerciseMeta, { color: colors.textMuted }]}>
                        {ex.sets} {t.workout.sets} x {ex.reps} · {ex.restSec}s
                        {isWorkoutActive && exTotal > 0 && ` · ${exCompleted}/${exTotal}`}
                      </Text>
                    </View>
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
                  </Pressable>

                  {isExpanded && (
                    <View style={[styles.exerciseDetails, { borderTopColor: colors.border }]}>
                      {/* GIF */}
                      {getExerciseGif(ex.id) && (
                        <View style={[styles.gifContainer, { backgroundColor: colors.surfaceLight }]}>
                          <Image
                            source={{ uri: getExerciseGif(ex.id)! }}
                            style={styles.exerciseGif}
                            resizeMode="contain"
                            onError={() => {}} // Silently handle load errors
                          />
                          <Text style={[styles.gifLabel, { color: colors.textMuted }]}>
                            {ex.name[lang]}
                          </Text>
                        </View>
                      )}

                      {/* Description + Tips */}
                      <View style={styles.detailRow}>
                        <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>{ex.description[lang]}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="bulb-outline" size={16} color={colors.warning} />
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>{ex.tips[lang]}</Text>
                      </View>

                      {/* Muscles */}
                      <View style={styles.muscleChips}>
                        {ex.muscles.map((m) => (
                          <View key={m} style={[styles.muscleChip, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]}>
                            <Text style={[styles.muscleChipText, { color: colors.accent }]}>{m}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Complete All + Finish buttons */}
            {isWorkoutActive && (
              <View style={styles.actionButtons}>
                {completedSets < totalSets && (
                  <Pressable onPress={handleCompleteAll} style={[styles.completeAllBtn, { backgroundColor: colors.accent }]}>
                    <Ionicons name="checkmark-done" size={20} color="#0D0D0D" />
                    <Text style={styles.completeAllText}>
                      {lang === 'es' ? 'Marcar Todo Completo' : 'Mark All Complete'}
                    </Text>
                  </Pressable>
                )}
                <Pressable onPress={handleFinishWorkout} style={[styles.finishBtn, { borderColor: colors.success }]}>
                  <Ionicons name="flag" size={20} color={colors.success} />
                  <Text style={[styles.finishBtnText, { color: colors.success }]}>
                    {lang === 'es' ? 'Terminar Entrenamiento' : 'Finish Workout'}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Science note */}
            <View style={[styles.scienceNote, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="school-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.scienceText, { color: colors.textMuted }]}>
                {lang === 'es'
                  ? 'Basado en evidencia cientifica (Schoenfeld et al., 2016; Contreras et al., 2019).'
                  : 'Based on scientific evidence (Schoenfeld et al., 2016; Contreras et al., 2019).'}
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
  finishText: { ...Typography.body, fontWeight: '700' },
  content: { padding: Layout.screenPadding, paddingBottom: 40 },

  workoutHeader: {
    alignItems: 'center', padding: Layout.spacing.lg,
    borderRadius: 16, borderWidth: 1, marginBottom: Layout.spacing.md,
  },
  workoutIcon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  workoutName: { ...Typography.h2, marginBottom: 4 },
  workoutMeta: { ...Typography.body },

  // Progress
  progressSection: { marginBottom: Layout.spacing.md },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { ...Typography.body, fontWeight: '600' },
  progressPercent: { ...Typography.body, fontWeight: '800' },
  progressBar: { height: 8, borderRadius: 4 },
  progressFill: { height: 8, borderRadius: 4 },

  // Start button
  startBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: Layout.spacing.lg },
  startGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16,
  },
  startText: { ...Typography.h3, color: '#0D0D0D', fontWeight: '800' },

  // Rest
  restContent: { alignItems: 'center', paddingVertical: Layout.spacing.xl },
  restTitle: { ...Typography.h2, marginTop: Layout.spacing.md },
  restDesc: { ...Typography.body, marginTop: 4, textAlign: 'center' },

  // Exercise card
  exerciseCard: { borderRadius: 14, borderWidth: 1, marginBottom: Layout.spacing.sm, overflow: 'hidden' },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  exerciseNum: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  exerciseNumText: { fontSize: 13, fontWeight: '800', color: '#0D0D0D' },
  exerciseInfo: { flex: 1 },
  exerciseName: { ...Typography.body, fontWeight: '700' },
  exerciseMeta: { ...Typography.caption, marginTop: 2 },

  // Details
  exerciseDetails: { padding: 14, paddingTop: 10, borderTopWidth: 1, gap: 10 },
  gifContainer: { borderRadius: 10, overflow: 'hidden', alignItems: 'center', marginBottom: 4 },
  exerciseGif: { width: '100%', height: 200, borderRadius: 10 },
  gifLabel: { ...Typography.caption, textAlign: 'center', paddingVertical: 4 },
  detailRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  detailText: { ...Typography.bodySmall, flex: 1, lineHeight: 20 },

  // Interactive sets
  setsSection: { marginTop: 4 },
  setsTitle: { ...Typography.label, marginBottom: 6 },
  setRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, borderBottomWidth: 1,
  },
  setLabel: { ...Typography.body, flex: 1, fontWeight: '600' },
  setReps: { ...Typography.bodySmall },

  // Muscles
  muscleChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  muscleChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  muscleChipText: { ...Typography.caption, fontWeight: '600' },

  // Action buttons
  actionButtons: { gap: Layout.spacing.sm, marginTop: Layout.spacing.lg },
  completeAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 14,
  },
  completeAllText: { ...Typography.body, color: '#0D0D0D', fontWeight: '700' },

  finishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 14, borderWidth: 2, marginTop: Layout.spacing.lg,
  },
  finishBtnText: { ...Typography.h3, fontWeight: '800' },

  // Celebration
  celebrationContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: Layout.screenPadding, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10,
  },
  celebrationIcon: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  celebrationTitle: { ...Typography.h1, marginBottom: Layout.spacing.md },
  celebrationQuote: { ...Typography.body, fontStyle: 'italic', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  celebrationAuthor: { ...Typography.bodySmall, fontWeight: '700', marginTop: 8, marginBottom: Layout.spacing.xl },
  celebrationStats: { flexDirection: 'row', gap: Layout.spacing.md, marginBottom: Layout.spacing.xl },
  celebrationStat: {
    alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, minWidth: 90, gap: 4,
  },
  celebrationStatValue: { ...Typography.h2, fontWeight: '800' },
  celebrationStatLabel: { ...Typography.caption },
  celebrationBtn: { borderRadius: 14, overflow: 'hidden', width: '100%' },
  celebrationBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16,
  },
  celebrationBtnText: { ...Typography.body, color: '#0D0D0D', fontWeight: '800' },

  // Science
  scienceNote: {
    flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1,
    marginTop: Layout.spacing.md, alignItems: 'flex-start',
  },
  scienceText: { ...Typography.caption, flex: 1, lineHeight: 18, fontStyle: 'italic' },
});
