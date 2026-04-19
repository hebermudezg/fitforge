import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

interface DataPoint {
  date: string;
  value: number;
}

interface ProgressLineChartProps {
  data: DataPoint[];
  goalValue?: number;
  unit: string;
  width: number;
  height?: number;
}

export function ProgressLineChart({
  data,
  goalValue,
  unit,
  width,
  height = 220,
}: ProgressLineChartProps) {
  if (data.length === 0) {
    return (
      <View style={[styles.empty, { width, height }]}>
        <Text style={styles.emptyText}>No data to display</Text>
      </View>
    );
  }

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const allValues = goalValue ? [...values, goalValue] : values;
  const minVal = Math.floor(Math.min(...allValues) * 0.95);
  const maxVal = Math.ceil(Math.max(...allValues) * 1.05);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: padding.left + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2),
    y: padding.top + chartH - ((d.value - minVal) / range) * chartH,
  }));

  // Build smooth path
  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    pathD += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = minVal + (range * i) / 4;
    return {
      value: Math.round(val * 10) / 10,
      y: padding.top + chartH - (i / 4) * chartH,
    };
  });

  // X-axis labels (max 5)
  const xLabelCount = Math.min(data.length, 5);
  const xLabels = Array.from({ length: xLabelCount }, (_, i) => {
    const idx = Math.round((i / (xLabelCount - 1 || 1)) * (data.length - 1));
    const d = new Date(data[idx].date);
    return {
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      x: points[idx].x,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <Line
            key={`grid-${i}`}
            x1={padding.left}
            y1={tick.y}
            x2={width - padding.right}
            y2={tick.y}
            stroke={Colors.border}
            strokeWidth={0.5}
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <SvgText
            key={`ylabel-${i}`}
            x={padding.left - 8}
            y={tick.y + 4}
            textAnchor="end"
            fill={Colors.textMuted}
            fontSize={10}
          >
            {tick.value}
          </SvgText>
        ))}

        {/* X-axis labels */}
        {xLabels.map((label, i) => (
          <SvgText
            key={`xlabel-${i}`}
            x={label.x}
            y={height - 8}
            textAnchor="middle"
            fill={Colors.textMuted}
            fontSize={10}
          >
            {label.label}
          </SvgText>
        ))}

        {/* Goal line */}
        {goalValue !== undefined && (
          <>
            <Line
              x1={padding.left}
              y1={padding.top + chartH - ((goalValue - minVal) / range) * chartH}
              x2={width - padding.right}
              y2={padding.top + chartH - ((goalValue - minVal) / range) * chartH}
              stroke={Colors.success}
              strokeWidth={1}
              strokeDasharray="6,4"
            />
            <SvgText
              x={width - padding.right}
              y={padding.top + chartH - ((goalValue - minVal) / range) * chartH - 6}
              textAnchor="end"
              fill={Colors.success}
              fontSize={9}
            >
              Goal: {goalValue}
            </SvgText>
          </>
        )}

        {/* Data line */}
        <Path
          d={pathD}
          fill="none"
          stroke={Colors.accent}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <Circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={Colors.accent}
            stroke={Colors.background}
            strokeWidth={2}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
});
