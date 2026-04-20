import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';
import { Typography } from '@/constants/Typography';

interface BodyFatGaugeProps {
  value: number;
  size?: number;
}

export function BodyFatGauge({ value, size = 180 }: BodyFatGaugeProps) {
  const { colors } = useTheme();
  const cx = size / 2;
  const cy = size / 2 + 10;
  const radius = size / 2 - 20;
  const strokeWidth = 12;

  // Arc from 180deg to 0deg (semicircle)
  const startAngle = Math.PI;
  const endAngle = 0;
  const sweepAngle = Math.PI;

  // Clamp value between 5 and 40
  const clampedValue = Math.max(5, Math.min(40, value));
  const progress = (clampedValue - 5) / 35;
  const currentAngle = startAngle - progress * sweepAngle;

  // Background arc
  const bgStartX = cx + radius * Math.cos(startAngle);
  const bgStartY = cy - radius * Math.sin(startAngle);
  const bgEndX = cx + radius * Math.cos(endAngle);
  const bgEndY = cy - radius * Math.sin(endAngle);
  const bgPath = `M ${bgStartX},${bgStartY} A ${radius},${radius} 0 0 1 ${bgEndX},${bgEndY}`;

  // Value arc
  const valEndX = cx + radius * Math.cos(currentAngle);
  const valEndY = cy - radius * Math.sin(currentAngle);
  const largeArc = progress > 0.5 ? 1 : 0;
  const valPath = `M ${bgStartX},${bgStartY} A ${radius},${radius} 0 ${largeArc} 1 ${valEndX},${valEndY}`;

  // Color based on value
  const getColor = () => {
    if (value < 15) return colors.success;
    if (value < 25) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size / 2 + 30}>
        <Path
          d={bgPath}
          fill="none"
          stroke={colors.surfaceLight}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d={valPath}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Tick labels */}
        {[5, 15, 25, 35].map((tick) => {
          const tickProgress = (tick - 5) / 35;
          const tickAngle = startAngle - tickProgress * sweepAngle;
          const tickX = cx + (radius + 16) * Math.cos(tickAngle);
          const tickY = cy - (radius + 16) * Math.sin(tickAngle);
          return (
            <SvgText
              key={tick}
              x={tickX}
              y={tickY}
              textAnchor="middle"
              fill={colors.textMuted}
              fontSize={9}
            >
              {tick}%
            </SvgText>
          );
        })}
        <SvgText
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          fill={colors.textPrimary}
          fontSize={28}
          fontWeight="bold"
        >
          {value.toFixed(1)}
        </SvgText>
        <SvgText
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fill={colors.textMuted}
          fontSize={12}
        >
          % body fat
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
