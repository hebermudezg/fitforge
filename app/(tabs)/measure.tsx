import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BodyModel } from '@/components/body/BodyModel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, MUSCLE_PARTS, MUSCLE_KEYS, GENERAL_METRIC_KEYS, type BodyPartKey, type MuscleKey } from '@/types/bodyParts';
import { convertValue, getDisplayUnit } from '@/utils/conversions';
import { getRelativeDate } from '@/utils/formatting';

const MUSCLE_ICONS: Partial<Record<BodyPartKey, string>> = {
  neck: 'body-outline',
  trapezius: 'fitness-outline',
  deltoids: 'fitness-outline',
  chest: 'shirt-outline',
  biceps: 'barbell-outline',
  triceps: 'barbell-outline',
  forearms: 'hand-left-outline',
  abs: 'grid-outline',
  obliques: 'swap-horizontal-outline',
  upperBack: 'arrow-up-outline',
  lowerBack: 'arrow-down-outline',
  gluteal: 'body-outline',
  quadriceps: 'walk-outline',
  hamstring: 'walk-outline',
  adductors: 'walk-outline',
  calves: 'footsteps-outline',
  weight: 'scale-outline',
  bodyFat: 'analytics-outline',
  waist: 'resize-outline',
  hips: 'ellipse-outline',
};

export default function MeasureScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useI18n();
  const { user } = useUser();
  const { latestMeasurements } = useMeasurements();
  const [selectedPart, setSelectedPart] = useState<BodyPartKey | null>(null);
  const [sideIndex, setSideIndex] = useState(0);
  const side = sideIndex === 0 ? 'front' : 'back';

  const handleBodyPartTap = (key: BodyPartKey) => {
    if (selectedPart === key) {
      router.push(`/measurement/${key}` as any);
    } else {
      setSelectedPart(key);
      // Auto-flip body to show the correct side for this muscle
      const muscleDef = MUSCLE_PARTS[key as MuscleKey];
      if (muscleDef) {
        const muscleSide = muscleDef.side;
        if (muscleSide === 'back') {
          setSideIndex(1); // flip to back
        } else if (muscleSide === 'front') {
          setSideIndex(0); // flip to front
        }
        // 'both' = don't change current view
      }
    }
  };

  const handleAddMeasurement = () => {
    if (selectedPart) {
      router.push(`/measurement/${selectedPart}` as any);
    }
  };

  const selectedDef = selectedPart ? BODY_PARTS[selectedPart] : null;
  const selectedMeasurement = selectedPart ? latestMeasurements[selectedPart] : null;
  const selectedValue = selectedMeasurement && selectedDef
    ? convertValue(selectedMeasurement.value, selectedDef.unit, user.unitSystem)
    : null;
  const selectedUnit = selectedDef ? getDisplayUnit(selectedDef.unit, user.unitSystem) : '';
  const selectedLabel = selectedPart ? (t.bodyParts as any)[selectedPart] || selectedDef?.label : '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t.measure.title}</Text>
        <SegmentedControl
          options={[t.measure.front, t.measure.back]}
          selectedIndex={sideIndex}
          onSelect={setSideIndex}
        />
      </View>

      <View style={styles.bodyContainer}>
        <BodyModel
          gender={user.gender}
          side={side as 'front' | 'back'}
          onBodyPartPress={handleBodyPartTap}
          selectedPart={selectedPart}
          measurements={latestMeasurements}
          unitSystem={user.unitSystem}
        />
      </View>

      {/* Selected muscle action bar */}
      {selectedPart && selectedDef && (
        <View style={[styles.actionBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={styles.actionInfo}>
            <View style={styles.actionNameRow}>
              <Ionicons name={MUSCLE_ICONS[selectedPart] as any} size={18} color={colors.accent} />
              <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>{selectedLabel}</Text>
            </View>
            {selectedValue !== null ? (
              <View style={styles.actionValueRow}>
                <Text style={[styles.actionValue, { color: colors.accent }]}>
                  {selectedValue.toFixed(1)} {selectedUnit}
                </Text>
                {selectedMeasurement && (
                  <Text style={[styles.actionDate, { color: colors.textMuted }]}>
                    · {getRelativeDate(selectedMeasurement.measuredAt)}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={[styles.actionNoData, { color: colors.textMuted }]}>{t.measure.noData}</Text>
            )}
          </View>
          <Pressable onPress={handleAddMeasurement} style={styles.actionBtn}>
            <LinearGradient
              colors={[colors.gradientPrimary[0], colors.gradientPrimary[1]] as [string, string]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.actionBtnGradient}
            >
              <Ionicons name="add" size={20} color="#0D0D0D" />
              <Text style={styles.actionBtnText}>{t.measure.addMeasure}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

      {/* Muscle chips (body-mapped) + general metrics */}
      <View style={[styles.chipsContainer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {/* Muscles that highlight on body */}
          {MUSCLE_KEYS.map((key) => {
            const partDef = BODY_PARTS[key];
            const measurement = latestMeasurements[key];
            const displayVal = measurement ? convertValue(measurement.value, partDef.unit, user.unitSystem) : null;
            const displayUnit = getDisplayUnit(partDef.unit, user.unitSystem);
            const label = (t.bodyParts as any)[key] || partDef.label;
            const isSelected = selectedPart === key;

            return (
              <Pressable
                key={key}
                style={[
                  styles.chip,
                  { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                  isSelected && { backgroundColor: colors.accent, borderColor: colors.accent },
                ]}
                onPress={() => handleBodyPartTap(key)}
              >
                <Ionicons
                  name={MUSCLE_ICONS[key] as any}
                  size={14}
                  color={isSelected ? '#0D0D0D' : colors.accent}
                />
                <View>
                  <Text style={[styles.chipLabel, { color: isSelected ? '#0D0D0D' : colors.textPrimary }]}>
                    {label}
                  </Text>
                  {displayVal !== null && (
                    <Text style={[styles.chipValue, { color: isSelected ? '#0D0D0D80' : colors.textMuted }]}>
                      {displayVal.toFixed(1)} {displayUnit}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
          {/* Separator */}
          <View style={[styles.chipSep, { backgroundColor: colors.border }]} />
          {/* General metrics (not on body) */}
          {GENERAL_METRIC_KEYS.map((key) => {
            const partDef = BODY_PARTS[key];
            const measurement = latestMeasurements[key];
            const displayVal = measurement ? convertValue(measurement.value, partDef.unit, user.unitSystem) : null;
            const displayUnit = getDisplayUnit(partDef.unit, user.unitSystem);
            const label = (t.bodyParts as any)[key] || partDef.label;
            const isSelected = selectedPart === key;

            return (
              <Pressable
                key={key}
                style={[
                  styles.chip,
                  { backgroundColor: colors.surfaceLight, borderColor: colors.border, borderStyle: 'dashed' },
                  isSelected && { backgroundColor: colors.accent, borderColor: colors.accent, borderStyle: 'solid' },
                ]}
                onPress={() => {
                  setSelectedPart(key);
                  router.push(`/measurement/${key}` as any);
                }}
              >
                <Ionicons name="clipboard-outline" size={14} color={isSelected ? '#0D0D0D' : colors.textMuted} />
                <View>
                  <Text style={[styles.chipLabel, { color: isSelected ? '#0D0D0D' : colors.textSecondary }]}>
                    {label}
                  </Text>
                  {displayVal !== null && (
                    <Text style={[styles.chipValue, { color: isSelected ? '#0D0D0D80' : colors.textMuted }]}>
                      {displayVal.toFixed(1)} {displayUnit}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Layout.screenPadding, paddingBottom: 8, gap: Layout.spacing.sm },
  title: { ...Typography.h2 },
  bodyContainer: { flex: 1, justifyContent: 'center' },
  actionBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Layout.screenPadding, borderTopWidth: 1,
  },
  actionInfo: { flex: 1 },
  actionNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionLabel: { ...Typography.h3 },
  actionValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  actionValue: { ...Typography.body, fontWeight: '700' },
  actionDate: { ...Typography.caption },
  actionNoData: { ...Typography.bodySmall, marginTop: 2 },
  actionBtn: { borderRadius: Layout.buttonBorderRadius, overflow: 'hidden' },
  actionBtnGradient: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 10, paddingHorizontal: 20,
  },
  actionBtnText: { ...Typography.body, color: '#0D0D0D', fontWeight: '700' },
  chipsContainer: { borderTopWidth: 1, paddingVertical: Layout.spacing.sm },
  chipsScroll: { paddingHorizontal: Layout.screenPadding, gap: Layout.spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: Layout.chipBorderRadius, borderWidth: 1,
  },
  chipSep: { width: 1, height: 30, alignSelf: 'center' },
  chipLabel: { ...Typography.caption, fontWeight: '600' },
  chipValue: { ...Typography.caption, fontSize: 10, marginTop: 1 },
});
