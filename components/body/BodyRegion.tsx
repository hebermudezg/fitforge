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
  return (
    <G onPress={onPress}>
      {/* Touchable region - transparent normally, highlighted on select */}
      <Path
        d={region.path}
        fill={isSelected ? Colors.accent : 'transparent'}
        fillOpacity={isSelected ? 0.3 : 0}
        stroke={isSelected ? Colors.accent : 'transparent'}
        strokeWidth={isSelected ? 1.5 : 0}
      />

      {/* Value badge */}
      {latestValue !== undefined && (
        <>
          <Rect
            x={region.labelAnchor.x - 20}
            y={region.labelAnchor.y - 9}
            width={40}
            height={18}
            rx={9}
            fill={Colors.accent}
          />
          <SvgText
            x={region.labelAnchor.x}
            y={region.labelAnchor.y + 4}
            textAnchor="middle"
            fill="#0D0D0D"
            fontSize={9}
            fontWeight="bold"
          >
            {latestValue.toFixed(1)}
          </SvgText>
        </>
      )}
    </G>
  );
}
