import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { GradientButton } from '@/components/ui/GradientButton';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, BODY_PART_KEYS, type BodyPartKey } from '@/types/bodyParts';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useI18n } from '@/i18n';
import { convertValue, getDisplayUnit } from '@/utils/conversions';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, goals, updateUser, setGoal } = useUser();
  const { latestMeasurements } = useMeasurements();
  const { colors, mode, setMode } = useTheme();
  const { t, lang, setLang } = useI18n();
  const themeModeIndex = mode === 'light' ? 0 : mode === 'dark' ? 1 : 2;
  const langIndex = lang === 'en' ? 0 : 1;

  const [name, setName] = useState(user.name);
  const [heightCm, setHeightCm] = useState(user.heightCm?.toString() || '');
  const [editingGoal, setEditingGoal] = useState<BodyPartKey | null>(null);
  const [goalValue, setGoalValue] = useState('');

  const genderIndex = user.gender === 'female' ? 1 : 0;
  const unitIndex = user.unitSystem === 'imperial' ? 1 : 0;

  const handleNameSave = async () => {
    await updateUser({ name: name.trim() });
  };

  const handleGenderChange = async (index: number) => {
    await updateUser({ gender: index === 0 ? 'male' : 'female' });
  };

  const handleUnitChange = async (index: number) => {
    await updateUser({ unitSystem: index === 0 ? 'metric' : 'imperial' });
  };

  const handleHeightSave = async () => {
    const val = parseFloat(heightCm);
    if (!isNaN(val) && val > 0) {
      await updateUser({ heightCm: val });
    }
  };

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets[0]) {
      await updateUser({ avatarUri: result.assets[0].uri });
    }
  };

  const handleGoalSave = async (bodyPart: BodyPartKey) => {
    const val = parseFloat(goalValue);
    if (!isNaN(val) && val > 0) {
      // Convert to metric if needed
      let metricVal = val;
      if (user.unitSystem === 'imperial') {
        const partDef = BODY_PARTS[bodyPart];
        if (partDef.unit === 'cm') metricVal = val / 0.393701;
        if (partDef.unit === 'kg') metricVal = val / 2.20462;
      }
      await setGoal(bodyPart, Math.round(metricVal * 10) / 10);
    }
    setEditingGoal(null);
    setGoalValue('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Profile</Text>

        {/* Avatar */}
        <Pressable style={styles.avatarContainer} onPress={handlePickAvatar}>
          {user.avatarUri ? (
            <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color={Colors.textMuted} />
            </View>
          )}
          <View style={styles.avatarBadge}>
            <Ionicons name="camera" size={14} color={Colors.textPrimary} />
          </View>
        </Pressable>

        {/* Name */}
        <Card style={styles.card}>
          <Text style={styles.label}>NAME</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            onBlur={handleNameSave}
            placeholder="Your name"
            placeholderTextColor={Colors.textMuted}
          />
        </Card>

        {/* Gender */}
        <Card style={styles.card}>
          <Text style={styles.label}>GENDER</Text>
          <SegmentedControl
            options={['Male', 'Female']}
            selectedIndex={genderIndex}
            onSelect={handleGenderChange}
          />
        </Card>

        {/* Height */}
        <Card style={styles.card}>
          <Text style={styles.label}>HEIGHT ({user.unitSystem === 'metric' ? 'cm' : 'in'})</Text>
          <TextInput
            style={styles.input}
            value={heightCm}
            onChangeText={setHeightCm}
            onBlur={handleHeightSave}
            keyboardType="decimal-pad"
            placeholder="Enter height"
            placeholderTextColor={Colors.textMuted}
          />
        </Card>

        {/* Units */}
        <Card style={styles.card}>
          <Text style={styles.label}>UNIT SYSTEM</Text>
          <SegmentedControl
            options={['Metric (cm, kg)', 'Imperial (in, lbs)']}
            selectedIndex={unitIndex}
            onSelect={handleUnitChange}
          />
        </Card>

        {/* Theme */}
        <Card style={styles.card}>
          <Text style={styles.label}>APPEARANCE</Text>
          <SegmentedControl
            options={['Light', 'Dark', 'System']}
            selectedIndex={themeModeIndex}
            onSelect={(i) => setMode((['light', 'dark', 'system'] as const)[i])}
          />
        </Card>

        {/* Language */}
        <Card style={styles.card}>
          <Text style={styles.label}>{t.profile.language}</Text>
          <SegmentedControl
            options={['English', 'Espanol']}
            selectedIndex={langIndex}
            onSelect={(i) => setLang(i === 0 ? 'en' : 'es')}
          />
        </Card>

        {/* Goals */}
        <Text style={styles.sectionTitle}>{t.profile.goals}</Text>
        {BODY_PART_KEYS.map((key) => {
          const partDef = BODY_PARTS[key];
          const displayUnit = getDisplayUnit(partDef.unit, user.unitSystem);
          const goal = goals[key];
          const goalDisplay = goal
            ? convertValue(goal.targetValue, partDef.unit, user.unitSystem)
            : null;
          const latest = latestMeasurements[key];
          const currentDisplay = latest
            ? convertValue(latest.value, partDef.unit, user.unitSystem)
            : null;

          const progress = goalDisplay && currentDisplay
            ? Math.min(100, (currentDisplay / goalDisplay) * 100)
            : 0;

          return (
            <Card key={key} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{partDef.label}</Text>
                <Text style={styles.goalCurrent}>
                  {currentDisplay ? `${currentDisplay.toFixed(1)} ${displayUnit}` : '--'}
                </Text>
              </View>

              {editingGoal === key ? (
                <View style={styles.goalEditRow}>
                  <TextInput
                    style={styles.goalInput}
                    value={goalValue}
                    onChangeText={setGoalValue}
                    keyboardType="decimal-pad"
                    placeholder={`Target (${displayUnit})`}
                    placeholderTextColor={Colors.textMuted}
                    autoFocus
                  />
                  <Pressable
                    onPress={() => handleGoalSave(key)}
                    style={styles.goalSaveBtn}
                  >
                    <Ionicons name="checkmark" size={20} color={Colors.success} />
                  </Pressable>
                  <Pressable
                    onPress={() => { setEditingGoal(null); setGoalValue(''); }}
                    style={styles.goalSaveBtn}
                  >
                    <Ionicons name="close" size={20} color={Colors.error} />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={() => {
                    setEditingGoal(key);
                    setGoalValue(goalDisplay?.toFixed(1) || '');
                  }}
                >
                  {goalDisplay ? (
                    <>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${progress}%`,
                              backgroundColor: progress >= 100 ? Colors.success : Colors.accent,
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.goalTarget}>
                        Target: {goalDisplay.toFixed(1)} {displayUnit}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.setGoalText}>Tap to set goal</Text>
                  )}
                </Pressable>
              )}
            </Card>
          );
        })}

        {/* AI Coach placeholder */}
        <Card style={styles.aiCard}>
          <Ionicons name="sparkles" size={24} color={Colors.accent} />
          <Text style={styles.aiTitle}>AI Coach</Text>
          <Text style={styles.aiDesc}>
            Personalized AI coaching based on your measurements and goals — Coming Soon
          </Text>
        </Card>

        {/* Logout */}
        <Pressable
          style={[styles.logoutBtn, { borderColor: Colors.error }]}
          onPress={() => {
            Alert.alert(
              lang === 'es' ? 'Cerrar Sesion' : 'Log Out',
              lang === 'es' ? 'Seguro que quieres cerrar sesion?' : 'Are you sure you want to log out?',
              [
                { text: t.common.cancel, style: 'cancel' },
                {
                  text: lang === 'es' ? 'Cerrar Sesion' : 'Log Out',
                  style: 'destructive',
                  onPress: async () => {
                    await AsyncStorage.removeItem('user_session');
                    await AsyncStorage.removeItem('onboarding_complete');
                    router.replace('/login');
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={[styles.logoutText, { color: Colors.error }]}>
            {lang === 'es' ? 'Cerrar Sesion' : 'Log Out'}
          </Text>
        </Pressable>

        {/* Footer */}
        <Text style={styles.footerDisclaimer}>{t.disclaimer}</Text>
        <Text style={styles.version}>{t.profile.version}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: Layout.screenPadding, paddingBottom: 40 },
  title: {
    ...Typography.h2, color: Colors.textPrimary,
    marginBottom: Layout.spacing.lg,
  },
  avatarContainer: { alignSelf: 'center', marginBottom: Layout.spacing.lg },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.surface, alignItems: 'center',
    justifyContent: 'center', borderWidth: 2, borderColor: Colors.border,
  },
  avatarBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.accent, alignItems: 'center',
    justifyContent: 'center',
  },
  card: { marginBottom: Layout.spacing.md },
  label: {
    ...Typography.label, color: Colors.textMuted,
    marginBottom: Layout.spacing.sm,
  },
  input: {
    ...Typography.body, color: Colors.textPrimary,
    paddingVertical: 4,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.h3, color: Colors.textPrimary,
    marginTop: Layout.spacing.lg, marginBottom: Layout.spacing.md,
  },
  goalCard: { marginBottom: Layout.spacing.sm },
  goalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Layout.spacing.sm,
  },
  goalName: { ...Typography.body, color: Colors.textPrimary, fontWeight: '600' },
  goalCurrent: { ...Typography.bodySmall, color: Colors.textSecondary },
  progressBar: {
    height: 6, borderRadius: 3,
    backgroundColor: Colors.surfaceLight, marginBottom: 4,
  },
  progressFill: { height: 6, borderRadius: 3 },
  goalTarget: { ...Typography.caption, color: Colors.textMuted },
  setGoalText: { ...Typography.bodySmall, color: Colors.accent },
  goalEditRow: {
    flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.sm,
  },
  goalInput: {
    ...Typography.body, color: Colors.textPrimary, flex: 1,
    borderBottomWidth: 1, borderBottomColor: Colors.accent, paddingVertical: 4,
  },
  goalSaveBtn: { padding: 8 },
  aiCard: {
    marginTop: Layout.spacing.lg, alignItems: 'center',
    borderColor: Colors.accent, borderWidth: 1, opacity: 0.6,
  },
  aiTitle: { ...Typography.h3, color: Colors.accent, marginTop: Layout.spacing.sm },
  aiDesc: {
    ...Typography.bodySmall, color: Colors.textSecondary,
    textAlign: 'center', marginTop: Layout.spacing.xs,
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Layout.spacing.sm, paddingVertical: 14, marginTop: Layout.spacing.lg,
    borderRadius: Layout.cardBorderRadius, borderWidth: 1,
  },
  logoutText: { ...Typography.body, fontWeight: '600' },
  footerDisclaimer: {
    ...Typography.caption, color: Colors.textMuted,
    textAlign: 'center', marginTop: Layout.spacing.lg, lineHeight: 18,
  },
  version: {
    ...Typography.caption, color: Colors.textMuted,
    textAlign: 'center', marginTop: Layout.spacing.sm,
  },
});
