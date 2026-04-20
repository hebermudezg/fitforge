import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useUser } from '@/contexts/UserContext';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { setupNotifications } from '@/utils/notifications';

const STEPS = ['welcome', 'disclaimer', 'profile', 'goals'] as const;
type Step = typeof STEPS[number];

const GOAL_KEYS = ['build', 'lose', 'recomp', 'maintain'] as const;

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { updateUser } = useUser();
  const { addMeasurement } = useMeasurements();

  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [genderIndex, setGenderIndex] = useState(0);
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [goalIndex, setGoalIndex] = useState(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [langIndex, setLangIndex] = useState(lang === 'en' ? 0 : 1);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const canProceed = () => {
    if (step === 'disclaimer') return disclaimerAccepted;
    if (step === 'profile') return name.trim().length > 0;
    return true;
  };

  const nextStep = async () => {
    if (!canProceed()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const nextIdx = stepIndex + 1;
    if (nextIdx < STEPS.length) {
      setStep(STEPS[nextIdx]);
    } else {
      // SAVE ALL DATA TO DB
      const gender = genderIndex === 0 ? 'male' : 'female';
      const height = parseFloat(heightCm);
      const weight = parseFloat(weightKg);
      const userAge = parseInt(age);
      const goal = GOAL_KEYS[goalIndex];

      // Calculate date of birth from age
      let dob: string | undefined;
      if (!isNaN(userAge) && userAge > 0) {
        const d = new Date();
        d.setFullYear(d.getFullYear() - userAge);
        dob = d.toISOString().split('T')[0];
      }

      // Save ALL to DB — terms, goal, phone, profile
      await updateUser({
        name: name.trim(),
        gender: gender as 'male' | 'female',
        heightCm: !isNaN(height) && height > 0 ? height : undefined,
        dateOfBirth: dob,
        phone: phone.trim() || undefined,
        termsAccepted: true,
        fitnessGoal: goal,
      } as any);

      // Save initial weight
      if (!isNaN(weight) && weight > 0) {
        await addMeasurement('weight', weight);
      }

      await AsyncStorage.setItem('onboarding_complete', 'true');
      await AsyncStorage.setItem('fitness_goal', goal);

      // Setup push notifications
      await setupNotifications(lang as 'en' | 'es');

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    }
  };

  const prevStep = () => {
    const prevIdx = stepIndex - 1;
    if (prevIdx >= 0) setStep(STEPS[prevIdx]);
  };

  const handleLangChange = (index: number) => {
    setLangIndex(index);
    setLang(index === 0 ? 'en' : 'es');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress bar */}
      <View style={[styles.progressBar, { backgroundColor: colors.surfaceLight }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.accent }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* WELCOME */}
        {step === 'welcome' && (
          <View style={styles.stepContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="fitness" size={48} color={colors.accent} />
            </View>
            <Text style={[styles.welcomeTitle, { color: colors.accent }]}>FitForge</Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
              {t.onboarding.tagline}
            </Text>

            {/* Language selector */}
            <View style={styles.langRow}>
              <SegmentedControl
                options={['English', 'Espanol']}
                selectedIndex={langIndex}
                onSelect={handleLangChange}
              />
            </View>

            <View style={styles.featureList}>
              {[
                { icon: 'body-outline', text: t.onboarding.feature1 },
                { icon: 'trending-up-outline', text: t.onboarding.feature2 },
                { icon: 'barbell-outline', text: t.onboarding.feature3 },
                { icon: 'library-outline', text: t.onboarding.feature4 },
              ].map((f, i) => (
                <View key={i} style={[styles.featureRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name={f.icon as any} size={22} color={colors.accent} />
                  <Text style={[styles.featureText, { color: colors.textPrimary }]}>{f.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* DISCLAIMER */}
        {step === 'disclaimer' && (
          <View style={styles.stepContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="shield-checkmark" size={48} color={colors.accent} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>{t.onboarding.disclaimerTitle}</Text>

            <View style={[styles.disclaimerBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>{t.onboarding.disclaimerText1}</Text>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                {t.onboarding.disclaimerText2}
              </Text>
              <Text style={[styles.disclaimerHighlight, { color: colors.accent }]}>
                {t.onboarding.disclaimerHighlight}
              </Text>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>{t.onboarding.disclaimerText3}</Text>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>{t.onboarding.disclaimerText4}</Text>
            </View>

            <Pressable style={styles.checkboxRow} onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}>
              <Ionicons
                name={disclaimerAccepted ? 'checkbox' : 'square-outline'}
                size={24}
                color={disclaimerAccepted ? colors.accent : colors.textMuted}
              />
              <Text style={[styles.checkboxText, { color: colors.textPrimary }]}>
                {t.onboarding.acceptTerms}
              </Text>
            </Pressable>
          </View>
        )}

        {/* PROFILE */}
        {step === 'profile' && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>{t.onboarding.aboutYou}</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>{t.onboarding.aboutYouDesc}</Text>

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t.profile.name} *</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border }]}
              value={name} onChangeText={setName}
              placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'}
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t.profile.gender}</Text>
            <SegmentedControl
              options={[t.measure.male, t.measure.female]}
              selectedIndex={genderIndex} onSelect={setGenderIndex}
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t.profile.age}</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border }]}
              value={age} onChangeText={setAge}
              placeholder="25" placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t.profile.height} (cm)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border }]}
              value={heightCm} onChangeText={setHeightCm}
              placeholder="170" placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>{t.dashboard.weight} (kg)</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border }]}
              value={weightKg} onChangeText={setWeightKg}
              placeholder="70" placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />

            <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
              {lang === 'es' ? 'TELEFONO (opcional)' : 'PHONE (optional)'}
            </Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border }]}
              value={phone} onChangeText={setPhone}
              placeholder="+57 300 123 4567" placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
          </View>
        )}

        {/* GOALS */}
        {step === 'goals' && (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>{t.onboarding.yourGoal}</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>{t.onboarding.yourGoalDesc}</Text>

            {[
              { icon: 'trending-up', title: t.onboarding.goalBuild, desc: t.onboarding.goalBuildDesc, color: colors.accent },
              { icon: 'trending-down', title: t.onboarding.goalLose, desc: t.onboarding.goalLoseDesc, color: colors.success },
              { icon: 'swap-horizontal', title: t.onboarding.goalRecomp, desc: t.onboarding.goalRecompDesc, color: colors.info },
              { icon: 'ribbon', title: t.onboarding.goalMaintain, desc: t.onboarding.goalMaintainDesc, color: colors.warning },
            ].map((goal, i) => (
              <Pressable
                key={i}
                style={[
                  styles.goalCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  goalIndex === i && { borderColor: colors.accent, backgroundColor: colors.accent + '10' },
                ]}
                onPress={() => setGoalIndex(i)}
              >
                <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                  <Ionicons name={goal.icon as any} size={24} color={goal.color} />
                </View>
                <View style={styles.goalContent}>
                  <Text style={[styles.goalTitle, { color: colors.textPrimary }]}>{goal.title}</Text>
                  <Text style={[styles.goalDesc, { color: colors.textMuted }]}>{goal.desc}</Text>
                </View>
                {goalIndex === i && <Ionicons name="checkmark-circle" size={24} color={colors.accent} />}
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { borderTopColor: colors.border }]}>
        {stepIndex > 0 && (
          <Pressable onPress={prevStep} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
            <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>{t.onboarding.back}</Text>
          </Pressable>
        )}
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={nextStep}
          disabled={!canProceed()}
          style={[styles.nextBtn, !canProceed() && { opacity: 0.4 }]}
        >
          <LinearGradient
            colors={[colors.gradientPrimary[0], colors.gradientPrimary[1]] as [string, string]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextBtnText}>
              {step === 'goals' ? t.onboarding.letsGo : t.onboarding.continue}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#0D0D0D" />
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressBar: { height: 3, marginHorizontal: Layout.screenPadding, borderRadius: 2, marginTop: 8 },
  progressFill: { height: 3, borderRadius: 2 },
  content: { flexGrow: 1, padding: Layout.screenPadding, paddingBottom: 100 },
  stepContainer: { flex: 1, paddingTop: Layout.spacing.lg },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: Layout.spacing.lg,
  },
  welcomeTitle: { ...Typography.h1, fontSize: 36, textAlign: 'center', marginBottom: Layout.spacing.sm },
  welcomeSubtitle: { ...Typography.body, textAlign: 'center', lineHeight: 24, marginBottom: Layout.spacing.md },
  langRow: { marginBottom: Layout.spacing.lg },
  featureList: { gap: Layout.spacing.md },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md,
    borderRadius: Layout.cardBorderRadius, padding: Layout.cardPadding, borderWidth: 1,
  },
  featureText: { ...Typography.body },
  disclaimerBox: {
    borderRadius: Layout.cardBorderRadius, padding: Layout.cardPadding,
    borderWidth: 1, gap: Layout.spacing.md, marginBottom: Layout.spacing.lg,
  },
  disclaimerText: { ...Typography.bodySmall, lineHeight: 22 },
  disclaimerHighlight: { ...Typography.body, lineHeight: 24, fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md },
  checkboxText: { ...Typography.body, flex: 1 },
  stepTitle: { ...Typography.h1, marginBottom: Layout.spacing.xs },
  stepSubtitle: { ...Typography.body, marginBottom: Layout.spacing.xl },
  fieldLabel: { ...Typography.label, marginTop: Layout.spacing.md, marginBottom: Layout.spacing.sm },
  input: { ...Typography.body, borderRadius: Layout.cardBorderRadius, padding: Layout.cardPadding, borderWidth: 1 },
  goalCard: {
    flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md,
    borderRadius: Layout.cardBorderRadius, padding: Layout.cardPadding,
    borderWidth: 1, marginBottom: Layout.spacing.sm,
  },
  goalIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  goalContent: { flex: 1 },
  goalTitle: { ...Typography.body, fontWeight: '600' },
  goalDesc: { ...Typography.caption, marginTop: 2 },
  bottomNav: {
    flexDirection: 'row', alignItems: 'center',
    padding: Layout.screenPadding, paddingBottom: 30, borderTopWidth: 1,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 8 },
  backBtnText: { ...Typography.body },
  nextBtn: { borderRadius: Layout.buttonBorderRadius, overflow: 'hidden' },
  nextGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 28 },
  nextBtnText: { ...Typography.body, color: '#0D0D0D', fontWeight: '700' },
});
