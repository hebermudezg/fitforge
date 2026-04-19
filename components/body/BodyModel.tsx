import React, { useState } from 'react';
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

const SCREEN_WIDTH = Dimensions.get('window').width;

export function BodyModel({
  gender,
  onBodyPartPress,
  selectedPart,
  measurements = {},
  unitSystem = 'metric',
}: BodyModelProps) {
  const regions = gender === 'male' ? MALE_REGIONS : FEMALE_REGIONS;
  const outline = gender === 'male' ? MALE_OUTLINE : FEMALE_OUTLINE;
  const svgWidth = SCREEN_WIDTH - 32;
  const svgHeight = svgWidth * 2.5;

  return (
    <View style={styles.container}>
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={BODY_VIEWBOX}
        style={styles.svg}
      >
        {/* Body outline silhouette */}
        <Path
          d={outline}
          fill={Colors.surfaceLight}
          stroke={Colors.bodyStroke}
          strokeWidth={1}
          fillOpacity={0.4}
        />

        {/* Interactive body regions */}
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
  },
  svg: {
    alignSelf: 'center',
  },
});
