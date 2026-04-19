import React, { useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Body, { type ExtendedBodyPart, type Slug } from 'react-native-body-highlighter';
import type { BodyPartKey } from '@/types/bodyParts';
import { BODY_PARTS } from '@/types/bodyParts';
import type { Measurement } from '@/types/models';
import { useTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { convertValue, getDisplayUnit } from '@/utils/conversions';

// Map our body part keys to the library's slugs
const BODY_PART_TO_SLUGS: Record<BodyPartKey, Slug[]> = {
  neck: ['neck'],
  shoulders: ['deltoids', 'trapezius'],
  chest: ['chest'],
  biceps: ['biceps'],
  forearms: ['forearm'],
  waist: ['abs', 'obliques'],
  hips: ['gluteal', 'adductors'],
  thighs: ['quadriceps', 'hamstring'],
  calves: ['calves', 'tibialis'],
  weight: ['feet'],
  bodyFat: ['head'],
};

// Reverse map
const SLUG_TO_BODY_PART: Record<string, BodyPartKey> = {};
for (const [key, slugs] of Object.entries(BODY_PART_TO_SLUGS)) {
  for (const slug of slugs) {
    SLUG_TO_BODY_PART[slug] = key as BodyPartKey;
  }
}

interface BodyModelProps {
  gender: 'male' | 'female';
  side?: 'front' | 'back';
  onBodyPartPress: (key: BodyPartKey) => void;
  selectedPart?: BodyPartKey | null;
  measurements?: Partial<Record<BodyPartKey, Measurement>>;
  unitSystem?: 'metric' | 'imperial';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function BodyModel({
  gender,
  side = 'front',
  onBodyPartPress,
  selectedPart,
  measurements = {},
  unitSystem = 'metric',
}: BodyModelProps) {
  const { colors, isDark } = useTheme();
  const [hoveredPart, setHoveredPart] = useState<BodyPartKey | null>(null);

  const activePart = selectedPart || hoveredPart;

  // Build highlight data
  const bodyData: ExtendedBodyPart[] = useMemo(() => {
    const data: ExtendedBodyPart[] = [];

    // Highlight all measured parts lightly
    for (const [key, measurement] of Object.entries(measurements)) {
      const slugs = BODY_PART_TO_SLUGS[key as BodyPartKey];
      if (!slugs || !measurement) continue;
      for (const slug of slugs) {
        data.push({
          slug,
          intensity: 1,
          color: colors.accent,
        });
      }
    }

    // Highlight active/selected part more intensely
    if (activePart) {
      const slugs = BODY_PART_TO_SLUGS[activePart];
      if (slugs) {
        for (const slug of slugs) {
          const existingIdx = data.findIndex((d) => d.slug === slug);
          if (existingIdx >= 0) data.splice(existingIdx, 1);
          data.push({
            slug,
            intensity: 2,
            color: colors.accent,
          });
        }
      }
    }

    return data;
  }, [measurements, activePart, colors.accent]);

  const handlePress = (part: ExtendedBodyPart) => {
    if (part.slug) {
      const bodyPartKey = SLUG_TO_BODY_PART[part.slug];
      if (bodyPartKey) {
        setHoveredPart(bodyPartKey);
        onBodyPartPress(bodyPartKey);
      }
    }
  };

  // Get info for the active part tooltip
  const activePartDef = activePart ? BODY_PARTS[activePart] : null;
  const activeMeasurement = activePart ? measurements[activePart] : null;
  const activeDisplayValue = activeMeasurement && activePartDef
    ? convertValue(activeMeasurement.value, activePartDef.unit, unitSystem || 'metric')
    : null;
  const activeDisplayUnit = activePartDef
    ? getDisplayUnit(activePartDef.unit, unitSystem || 'metric')
    : '';

  const scale = Math.min(SCREEN_WIDTH * 0.0026, 1.4);

  return (
    <View style={styles.container}>
      {/* Tooltip showing selected muscle */}
      <View style={[styles.tooltip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {activePart && activePartDef ? (
          <View style={styles.tooltipContent}>
            <View style={[styles.tooltipDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.tooltipLabel, { color: colors.textPrimary }]}>
              {activePartDef.label}
            </Text>
            {activeDisplayValue !== null && (
              <Text style={[styles.tooltipValue, { color: colors.accent }]}>
                {activeDisplayValue.toFixed(1)} {activeDisplayUnit}
              </Text>
            )}
          </View>
        ) : (
          <Text style={[styles.tooltipHint, { color: colors.textMuted }]}>
            Tap a muscle group to measure
          </Text>
        )}
      </View>

      {/* Body */}
      <Body
        data={bodyData}
        gender={gender}
        side={side}
        scale={scale}
        onBodyPartPress={handlePress}
        colors={[
          isDark ? '#1A1A1A' : '#E0E0E0',
          colors.accent + '50',
          colors.accent,
        ]}
        border={isDark ? '#444' : '#BBB'}
        defaultFill={isDark ? '#1E1E1E' : '#EAEAEA'}
        defaultStroke={isDark ? '#444' : '#CCC'}
        defaultStrokeWidth={0.6}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  tooltipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tooltipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tooltipLabel: {
    ...Typography.body,
    fontWeight: '600',
  },
  tooltipValue: {
    ...Typography.body,
    fontWeight: '700',
  },
  tooltipHint: {
    ...Typography.bodySmall,
  },
});
