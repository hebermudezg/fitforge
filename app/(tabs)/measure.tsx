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
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, BODY_PART_KEYS, type BodyPartKey } from '@/types/bodyParts';
import { convertValue, getDisplayUnit } from '@/utils/conversions';

export default function MeasureScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useUser();
  const { latestMeasurements } = useMeasurements();
  const [selectedPart, setSelectedPart] = useState<BodyPartKey | null>(null);
  const [genderIndex, setGenderIndex] = useState(user.gender === 'female' ? 1 : 0);
  const [sideIndex, setSideIndex] = useState(0);
  const gender = genderIndex === 0 ? 'male' : 'female';
  const side = sideIndex === 0 ? 'front' : 'back';

  // First tap selects, second tap on same part opens measurement
  const handleBodyPartTap = (key: BodyPartKey) => {
    if (selectedPart === key) {
      router.push(`/measurement/${key}` as any);
    } else {
      setSelectedPart(key);
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Body Measurements</Text>
        <View style={styles.togglesRow}>
          <View style={styles.toggleWrap}>
            <SegmentedControl
              options={['Male', 'Female']}
              selectedIndex={genderIndex}
              onSelect={setGenderIndex}
            />
          </View>
          <View style={styles.toggleWrap}>
            <SegmentedControl
              options={['Front', 'Back']}
              selectedIndex={sideIndex}
              onSelect={setSideIndex}
            />
          </View>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <BodyModel
          gender={gender}
          side={side as 'front' | 'back'}
          onBodyPartPress={handleBodyPartTap}
          selectedPart={selectedPart}
          measurements={latestMeasurements}
          unitSystem={user.unitSystem}
        />
      </View>

      {/* Selected part action bar */}
      {selectedPart && selectedDef && (
        <View style={[styles.actionBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={styles.actionInfo}>
            <Text style={[styles.actionLabel, { color: colors.textPrimary }]}>
              {selectedDef.label}
            </Text>
            {selectedValue !== null ? (
              <Text style={[styles.actionValue, { color: colors.accent }]}>
                {selectedValue.toFixed(1)} {selectedUnit}
              </Text>
            ) : (
              <Text style={[styles.actionNoData, { color: colors.textMuted }]}>No data</Text>
            )}
          </View>
          <Pressable onPress={handleAddMeasurement} style={styles.actionBtn}>
            <LinearGradient
              colors={[colors.gradientPrimary[0], colors.gradientPrimary[1]] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionBtnGradient}
            >
              <Ionicons name="add" size={20} color="#0D0D0D" />
              <Text style={styles.actionBtnText}>Measure</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

      {/* Quick-entry chips */}
      <View style={[styles.chipsContainer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {BODY_PART_KEYS.map((key) => (
            <Pressable
              key={key}
              style={[
                styles.chip,
                { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                selectedPart === key && { backgroundColor: colors.accent, borderColor: colors.accent },
              ]}
              onPress={() => handleBodyPartTap(key)}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: colors.textSecondary },
                  selectedPart === key && { color: '#0D0D0D', fontWeight: '600' },
                ]}
              >
                {BODY_PARTS[key].label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Layout.screenPadding, paddingBottom: 8, gap: Layout.spacing.sm },
  title: { ...Typography.h2 },
  togglesRow: { flexDirection: 'row', gap: Layout.spacing.sm },
  toggleWrap: { flex: 1 },
  bodyContainer: { flex: 1, justifyContent: 'center' },
  actionBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Layout.screenPadding, borderTopWidth: 1,
  },
  actionInfo: {},
  actionLabel: { ...Typography.h3 },
  actionValue: { ...Typography.body, fontWeight: '700', marginTop: 2 },
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
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Layout.chipBorderRadius, borderWidth: 1,
  },
  chipText: { ...Typography.bodySmall },
});
