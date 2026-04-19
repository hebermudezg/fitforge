import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BodyModel } from '@/components/body/BodyModel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, BODY_PART_KEYS, type BodyPartKey } from '@/types/bodyParts';

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

  const handleBodyPartPress = (key: BodyPartKey) => {
    setSelectedPart(key);
    router.push(`/measurement/${key}` as any);
  };

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
          onBodyPartPress={handleBodyPartPress}
          selectedPart={selectedPart}
          measurements={latestMeasurements}
        />
      </View>

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
              onPress={() => handleBodyPartPress(key)}
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
  header: { padding: Layout.screenPadding, gap: Layout.spacing.sm },
  title: { ...Typography.h2 },
  togglesRow: { flexDirection: 'row', gap: Layout.spacing.sm },
  toggleWrap: { flex: 1 },
  bodyContainer: { flex: 1, justifyContent: 'center' },
  chipsContainer: {
    borderTopWidth: 1,
    paddingVertical: Layout.spacing.sm,
  },
  chipsScroll: { paddingHorizontal: Layout.screenPadding, gap: Layout.spacing.sm },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Layout.chipBorderRadius, borderWidth: 1,
  },
  chipText: { ...Typography.bodySmall },
});
