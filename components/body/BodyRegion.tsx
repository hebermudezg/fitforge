import React from 'react';
import { Path, G, Text as SvgText } from 'react-native-svg';
import type { BodyRegionDef } from './bodyPaths';
import { Colors } from '@/constants/Colors';

interface BodyRegionProps {
  region: BodyRegionDef;
  isSelected: boolean;
  latestValue?: number;
  unit: string;
  onPress: () => void;
}

export function BodyRegion({ region, isSelected, latestValue, unit, onPress }: BodyRegionProps) {
  const fill = isSelected ? Colors.bodyHighlight : Colors.bodyFill;
  const opacity = isSelected ? 0.8 : 0.5;

  return (
    <G onPress={onPress}>
      <Path
        d={region.path}
        fill={fill}
        fillOpacity={opacity}
        stroke={isSelected ? Colors.accent : Colors.bodyStroke}
        strokeWidth={isSelected ? 1.5 : 0.5}
      />
      {latestValue !== undefined && (
        <>
          <SvgText
            x={region.labelAnchor.x}
            y={region.labelAnchor.y - 6}
            textAnchor="middle"
            fill={Colors.textPrimary}
            fontSize={7}
            fontWeight="bold"
          >
            {latestValue.toFixed(1)}
          </SvgText>
          <SvgText
            x={region.labelAnchor.x}
            y={region.labelAnchor.y + 2}
            textAnchor="middle"
            fill={Colors.textSecondary}
            fontSize={5}
          >
            {unit}
          </SvgText>
        </>
      )}
    </G>
  );
}
