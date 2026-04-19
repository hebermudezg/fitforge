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
import * as Haptics from 'expo-haptics';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STEPS = ['welcome', 'disclaimer', 'profile', 'goals'] as const;
type Step = typeof STEPS[number];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [genderIndex, setGenderIndex] = useState(0);
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [goalIndex, setGoalIndex] = useState(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const nextStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextIdx = stepIndex + 1;
    if (nextIdx < STEPS.length) {
      setStep(STEPS[nextIdx]);
    } else {
      router.replace('/(tabs)');
    }
  };

  const prevStep = () => {
    const prevIdx = stepIndex - 1;
    if (prevIdx >= 0) setStep(STEPS[prevIdx]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* STEP 1: Welcome */}
        {step === 'welcome' && (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="fitness" size={48} color={Colors.accent} />
            </View>
            <Text style={styles.welcomeTitle}>FitForge</Text>
            <Text style={styles.welcomeSubtitle}>
              Track your body. See your progress.{'\n'}Reach your goals.
            </Text>

            <View style={styles.featureList}>
              {[
                { icon: 'body-outline', text: 'Interactive body measurements' },
                { icon: 'trending-up-outline', text: 'Track your progress over time' },
                { icon: 'calendar-outline', text: 'Schedule coaching sessions' },
                { icon: 'sparkles-outline', text: 'AI Coach coming soon' },
              ].map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons
                    name={feature.icon as any}
                    size={22}
                    color={Colors.accent}
                  />
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* STEP 2: Disclaimer */}
        {step === 'disclaimer' && (
          <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={48} color={Colors.accent} />
            </View>
            <Text style={styles.stepTitle}>Health Disclaimer</Text>

            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>
                FitForge is a body measurement tracking tool designed to help you monitor your fitness journey.
              </Text>
              <Text style={styles.disclaimerText}>
                This app is <Text style={styles.bold}>NOT a substitute</Text> for professional medical advice, diagnosis, or treatment.
              </Text>
              <Text style={styles.disclaimerHighlight}>
                Always consult a qualified physician, nutritionist, or certified fitness professional before starting any exercise program or making significant changes to your diet.
              </Text>
              <Text style={styles.disclaimerText}>
                If you experience pain, dizziness, or any unusual symptoms during exercise, stop immediately and seek medical attention.
              </Text>
              <Text style={styles.disclaimerText}>
                By using this app, you acknowledge that you are solely responsible for your health decisions.
              </Text>
            </View>

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}
            >
              <Ionicons
                name={disclaimerAccepted ? 'checkbox' : 'square-outline'}
                size={24}
                color={disclaimerAccepted ? Colors.accent : Colors.textMuted}
              />
              <Text style={styles.checkboxText}>
                I understand and accept these terms
              </Text>
            </Pressable>
          </View>
        )}

        {/* STEP 3: Profile setup */}
        {step === 'profile' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>About You</Text>
            <Text style={styles.stepSubtitle}>
              Let's set up your profile to personalize your experience
            </Text>

            <Text style={styles.fieldLabel}>NAME</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.fieldLabel}>GENDER</Text>
            <SegmentedControl
              options={['Male', 'Female']}
              selectedIndex={genderIndex}
              onSelect={setGenderIndex}
            />

            <Text style={styles.fieldLabel}>HEIGHT (cm)</Text>
            <TextInput
              style={styles.input}
              value={heightCm}
              onChangeText={setHeightCm}
              placeholder="170"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
            />

            <Text style={styles.fieldLabel}>CURRENT WEIGHT (kg)</Text>
            <TextInput
              style={styles.input}
              value={weightKg}
              onChangeText={setWeightKg}
              placeholder="70"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
        )}

        {/* STEP 4: Goal selection */}
        {step === 'goals' && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your Goal</Text>
            <Text style={styles.stepSubtitle}>
              What do you want to achieve?
            </Text>

            {[
              {
                icon: 'trending-up',
                title: 'Build Muscle',
                desc: 'Increase muscle mass and track growth',
                color: Colors.accent,
              },
              {
                icon: 'trending-down',
                title: 'Lose Fat',
                desc: 'Reduce body fat and track measurements',
                color: Colors.success,
              },
              {
                icon: 'swap-horizontal',
                title: 'Body Recomposition',
                desc: 'Build muscle while losing fat',
                color: Colors.info,
              },
              {
                icon: 'ribbon',
                title: 'Stay in Shape',
                desc: 'Maintain current physique and track consistency',
                color: Colors.warning,
              },
            ].map((goal, i) => (
              <Pressable
                key={i}
                style={[
                  styles.goalCard,
                  goalIndex === i && styles.goalCardSelected,
                ]}
                onPress={() => setGoalIndex(i)}
              >
                <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                  <Ionicons name={goal.icon as any} size={24} color={goal.color} />
                </View>
                <View style={styles.goalContent}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <Text style={styles.goalDesc}>{goal.desc}</Text>
                </View>
                {goalIndex === i && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
                )}
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        {stepIndex > 0 && (
          <Pressable onPress={prevStep} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>
        )}
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={nextStep}
          disabled={step === 'disclaimer' && !disclaimerAccepted}
          style={[
            styles.nextBtn,
            step === 'disclaimer' && !disclaimerAccepted && { opacity: 0.4 },
          ]}
        >
          <LinearGradient
            colors={[...Colors.gradientPrimary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextGradient}
          >
            <Text style={styles.nextBtnText}>
              {step === 'goals' ? "Let's Go!" : 'Continue'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#0D0D0D" />
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  progressBar: {
    height: 3, backgroundColor: Colors.surfaceLight,
    marginHorizontal: Layout.screenPadding,
    borderRadius: 2, marginTop: 8,
  },
  progressFill: {
    height: 3, backgroundColor: Colors.accent, borderRadius: 2,
  },
  content: {
    flexGrow: 1, padding: Layout.screenPadding, paddingBottom: 100,
  },
  stepContainer: { flex: 1, paddingTop: Layout.spacing.lg },

  // Welcome
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.accent + '15', alignItems: 'center',
    justifyContent: 'center', alignSelf: 'center', marginBottom: Layout.spacing.lg,
  },
  welcomeTitle: {
    ...Typography.h1, fontSize: 36, color: Colors.accent,
    textAlign: 'center', marginBottom: Layout.spacing.sm,
  },
  welcomeSubtitle: {
    ...Typography.body, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 24, marginBottom: Layout.spacing.xl,
  },
  featureList: { gap: Layout.spacing.md },
  featureRow: {
    flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md,
    backgroundColor: Colors.surface, borderRadius: Layout.cardBorderRadius,
    padding: Layout.cardPadding, borderWidth: 1, borderColor: Colors.border,
  },
  featureText: { ...Typography.body, color: Colors.textPrimary },

  // Disclaimer
  disclaimerBox: {
    backgroundColor: Colors.surface, borderRadius: Layout.cardBorderRadius,
    padding: Layout.cardPadding, borderWidth: 1, borderColor: Colors.border,
    gap: Layout.spacing.md, marginBottom: Layout.spacing.lg,
  },
  disclaimerText: {
    ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 22,
  },
  disclaimerHighlight: {
    ...Typography.body, color: Colors.accent, lineHeight: 24,
    fontWeight: '600',
  },
  bold: { fontWeight: '700', color: Colors.textPrimary },
  checkboxRow: {
    flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md,
  },
  checkboxText: { ...Typography.body, color: Colors.textPrimary, flex: 1 },

  // Profile
  stepTitle: {
    ...Typography.h1, color: Colors.textPrimary,
    marginBottom: Layout.spacing.xs,
  },
  stepSubtitle: {
    ...Typography.body, color: Colors.textSecondary,
    marginBottom: Layout.spacing.xl,
  },
  fieldLabel: {
    ...Typography.label, color: Colors.textMuted,
    marginTop: Layout.spacing.md, marginBottom: Layout.spacing.sm,
  },
  input: {
    ...Typography.body, color: Colors.textPrimary,
    backgroundColor: Colors.surface, borderRadius: Layout.cardBorderRadius,
    padding: Layout.cardPadding, borderWidth: 1, borderColor: Colors.border,
  },

  // Goals
  goalCard: {
    flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.md,
    backgroundColor: Colors.surface, borderRadius: Layout.cardBorderRadius,
    padding: Layout.cardPadding, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Layout.spacing.sm,
  },
  goalCardSelected: {
    borderColor: Colors.accent, backgroundColor: Colors.accent + '10',
  },
  goalIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  goalContent: { flex: 1 },
  goalTitle: { ...Typography.body, color: Colors.textPrimary, fontWeight: '600' },
  goalDesc: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row', alignItems: 'center',
    padding: Layout.screenPadding, paddingBottom: 30,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, padding: 8,
  },
  backBtnText: { ...Typography.body, color: Colors.textSecondary },
  nextBtn: {
    borderRadius: Layout.buttonBorderRadius, overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 28,
  },
  nextBtnText: { ...Typography.body, color: '#0D0D0D', fontWeight: '700' },
});
