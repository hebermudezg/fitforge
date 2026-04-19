import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BodyRegion } from './BodyRegion';
import {
  BODY_VIEWBOX,
  MALE_OUTLINE,
  FEMALE_OUTLINE,
  MALE_MUSCLE_DETAILS,
  FEMALE_MUSCLE_DETAILS,
  MALE_REGIONS,
  FEMALE_REGIONS,
} from './bodyPaths';
import { Colors } from '@/constants/Colors';
import { BODY_PARTS, type BodyPartKey } from '@/types/bodyParts';
import type { Measurement } from '@/types/models';
import { convertValue, getDisplayUnit } from '@/utils/conversions';

interface BodyModelProps {
  gender: 'male' | 'female';
  onBodyPartPress: (key: BodyPartKey) => void;
  selectedPart?: BodyPartKey | null;
  measurements?: Partial<Record<BodyPartKey, Measurement>>;
  unitSystem?: 'metric' | 'imperial';
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function BodyModel({
  gender,
  onBodyPartPress,
  selectedPart,
  measurements = {},
  unitSystem = 'metric',
}: BodyModelProps) {
  const regions = gender === 'male' ? MALE_REGIONS : FEMALE_REGIONS;
  const outline = gender === 'male' ? MALE_OUTLINE : FEMALE_OUTLINE;
  const muscleDetails = gender === 'male' ? MALE_MUSCLE_DETAILS : FEMALE_MUSCLE_DETAILS;

  // Fit within screen — viewBox is 300x650
  const maxHeight = SCREEN_HEIGHT * 0.52;
  const maxWidth = SCREEN_WIDTH * 0.85;
  const aspectRatio = 300 / 650;
  let svgHeight = maxHeight;
  let svgWidth = svgHeight * aspectRatio;
  if (svgWidth > maxWidth) {
    svgWidth = maxWidth;
    svgHeight = svgWidth / aspectRatio;
  }

  return (
    <View style={styles.container}>
      <Svg width={svgWidth} height={svgHeight} viewBox={BODY_VIEWBOX}>
        {/* Body outline */}
        <Path
          d={outline}
          fill="none"
          stroke={Colors.bodyStroke}
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Muscle definition lines */}
        <Path
          d={muscleDetails}
          fill="none"
          stroke={Colors.bodyStroke}
          strokeWidth={0.8}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Interactive regions */}
        {regions.map((region) => {
          const measurement = measurements[region.key];
          const partDef = BODY_PARTS[region.key];
          const displayValue = measurement
            ? convertValue(measurement.value, partDef.unit, unitSystem)
            : undefined;
          const displayUnit = getDisplayUnit(partDef.unit, unitSystem);

          return (
            <BodyRegion
              key={region.key}
              region={region}
              isSelected={selectedPart === region.key}
              latestValue={displayValue}
              unit={displayUnit}
              onPress={() => onBodyPartPress(region.key)}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
});
