import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BodyModel } from '@/components/body/BodyModel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useUser } from '@/contexts/UserContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, BODY_PART_KEYS, type BodyPartKey } from '@/types/bodyParts';

export default function MeasureScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { latestMeasurements } = useMeasurements();
  const [selectedPart, setSelectedPart] = useState<BodyPartKey | null>(null);
  const genderOptions = ['Male', 'Female'];
  const [genderIndex, setGenderIndex] = useState(user.gender === 'female' ? 1 : 0);
  const gender = genderIndex === 0 ? 'male' : 'female';

  const handleBodyPartPress = (key: BodyPartKey) => {
    setSelectedPart(key);
    router.push(`/measurement/${key}` as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Body Measurements</Text>
        <SegmentedControl
          options={genderOptions}
          selectedIndex={genderIndex}
          onSelect={setGenderIndex}
        />
      </View>

      <ScrollView
        style={styles.bodyScroll}
        contentContainerStyle={styles.bodyScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BodyModel
          gender={gender}
          onBodyPartPress={handleBodyPartPress}
          selectedPart={selectedPart}
          measurements={latestMeasurements}
          unitSystem={user.unitSystem}
        />
      </ScrollView>

      {/* Quick-entry chips */}
      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {BODY_PART_KEYS.map((key) => (
            <Pressable
              key={key}
              style={[
                styles.chip,
                selectedPart === key && styles.chipSelected,
              ]}
              onPress={() => handleBodyPartPress(key)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedPart === key && styles.chipTextSelected,
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Layout.screenPadding,
    gap: Layout.spacing.sm,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyScrollContent: {
    alignItems: 'center',
    paddingBottom: Layout.spacing.md,
  },
  chipsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: Layout.spacing.sm,
  },
  chipsScroll: {
    paddingHorizontal: Layout.screenPadding,
    gap: Layout.spacing.sm,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Layout.chipBorderRadius,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
