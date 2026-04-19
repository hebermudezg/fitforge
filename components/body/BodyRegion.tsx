import React from 'react';
import { Path, G, Text as SvgText, Rect } from 'react-native-svg';
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
  const opacity = isSelected ? 0.9 : 0.6;
  const strokeColor = isSelected ? Colors.accent : Colors.bodyStroke;

  return (
    <G onPress={onPress}>
      <Path
        d={region.path}
        fill={fill}
        fillOpacity={opacity}
        stroke={strokeColor}
        strokeWidth={isSelected ? 2 : 1}
      />
      {latestValue !== undefined && (
        <>
          <Rect
            x={region.labelAnchor.x - 18}
            y={region.labelAnchor.y - 10}
            width={36}
            height={16}
            rx={4}
            fill={Colors.accent}
            fillOpacity={0.9}
          />
          <SvgText
            x={region.labelAnchor.x}
            y={region.labelAnchor.y + 1}
            textAnchor="middle"
            fill="#0D0D0D"
            fontSize={8}
            fontWeight="bold"
          >
            {latestValue.toFixed(1)}
          </SvgText>
        </>
      )}
    </G>
  );
}
