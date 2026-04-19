import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BodyRegion } from './BodyRegion';
import {
  BODY_VIEWBOX,
  MALE_OUTLINE,
  FEMALE_OUTLINE,
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

  // Fit body within available screen space (leave room for header + chips)
  const maxHeight = SCREEN_HEIGHT * 0.55;
  const maxWidth = SCREEN_WIDTH * 0.7;
  // viewBox is 200x500, aspect ratio = 0.4
  const aspectRatio = 200 / 500;
  let svgHeight = maxHeight;
  let svgWidth = svgHeight * aspectRatio;
  if (svgWidth > maxWidth) {
    svgWidth = maxWidth;
    svgHeight = svgWidth / aspectRatio;
  }

  return (
    <View style={styles.container}>
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={BODY_VIEWBOX}
      >
        <Path
          d={outline}
          fill={Colors.surfaceLight}
          stroke={Colors.bodyStroke}
          strokeWidth={1.2}
          fillOpacity={0.5}
        />

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
    paddingVertical: 8,
  },
});
