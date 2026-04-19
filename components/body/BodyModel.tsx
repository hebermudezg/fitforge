import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Body, { type ExtendedBodyPart, type Slug } from 'react-native-body-highlighter';
import type { BodyPartKey } from '@/types/bodyParts';
import type { Measurement } from '@/types/models';
import { useTheme } from '@/contexts/ThemeContext';

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

// Reverse map: slug -> our body part key
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
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function BodyModel({
  gender,
  side = 'front',
  onBodyPartPress,
  selectedPart,
  measurements = {},
}: BodyModelProps) {
  const { colors, isDark } = useTheme();

  // Build highlighted data from measurements and selection
  const bodyData: ExtendedBodyPart[] = useMemo(() => {
    const data: ExtendedBodyPart[] = [];

    // Highlight measured parts
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

    // Highlight selected part with higher intensity
    if (selectedPart) {
      const slugs = BODY_PART_TO_SLUGS[selectedPart];
      if (slugs) {
        for (const slug of slugs) {
          // Remove existing entry for this slug
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
  }, [measurements, selectedPart, colors.accent]);

  const handlePress = (part: ExtendedBodyPart) => {
    if (part.slug) {
      const bodyPartKey = SLUG_TO_BODY_PART[part.slug];
      if (bodyPartKey) {
        onBodyPartPress(bodyPartKey);
      }
    }
  };

  const scale = Math.min(SCREEN_WIDTH * 0.0028, 1.5);

  return (
    <View style={styles.container}>
      <Body
        data={bodyData}
        gender={gender}
        side={side}
        scale={scale}
        onBodyPartPress={handlePress}
        colors={[colors.surfaceLight, colors.accent + '60', colors.accent]}
        border={colors.bodyStroke}
        defaultFill={isDark ? colors.surfaceLight : '#E8E8E8'}
        defaultStroke={isDark ? '#555' : '#CCC'}
        defaultStrokeWidth={0.8}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
