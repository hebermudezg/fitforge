import React, { useEffect, useState, useCallback } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressLineChart } from '@/components/charts/ProgressLineChart';
import { BodyFatGauge } from '@/components/charts/BodyFatGauge';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useUser } from '@/contexts/UserContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, BODY_PART_KEYS, type BodyPartKey } from '@/types/bodyParts';
import { convertValue, getDisplayUnit } from '@/utils/conversions';

const TIME_RANGES = ['1W', '1M', '3M', '6M', '1Y', 'All'] as const;
type TimeRange = typeof TIME_RANGES[number];

function getFromDate(range: TimeRange): string | undefined {
  if (range === 'All') return undefined;
  const now = new Date();
  const daysMap: Record<string, number> = {
    '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365,
  };
  now.setDate(now.getDate() - daysMap[range]);
  return now.toISOString();
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ProgressScreen() {
  const router = useRouter();
  const { user, goals } = useUser();
  const { getHistory, getStats } = useMeasurements();

  const [selectedPart, setSelectedPart] = useState<BodyPartKey>('chest');
  const [timeRangeIndex, setTimeRangeIndex] = useState(1); // 1M default
  const timeRange = TIME_RANGES[timeRangeIndex];

  const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);
  const [stats, setStats] = useState<{
    min: number; max: number; avg: number; count: number; change: number;
  } | null>(null);

  const partDef = BODY_PARTS[selectedPart];
  const displayUnit = getDisplayUnit(partDef.unit, user.unitSystem);
  const goal = goals[selectedPart];
  const goalDisplay = goal
    ? convertValue(goal.targetValue, partDef.unit, user.unitSystem)
    : undefined;

  const loadData = useCallback(async () => {
    const fromDate = getFromDate(timeRange);
    const history = await getHistory(selectedPart, fromDate);
    setChartData(
      history.map((m) => ({
        date: m.measuredAt,
        value: convertValue(m.value, partDef.unit, user.unitSystem),
      }))
    );
    const s = await getStats(selectedPart, fromDate);
    setStats({
      ...s,
      min: convertValue(s.min, partDef.unit, user.unitSystem),
      max: convertValue(s.max, partDef.unit, user.unitSystem),
      avg: convertValue(s.avg, partDef.unit, user.unitSystem),
      change: convertValue(s.change, partDef.unit, user.unitSystem),
    });
  }, [selectedPart, timeRange, user.unitSystem]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <Text style={styles.title}>Progress</Text>

          {/* Body part selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.partScroll}
            contentContainerStyle={styles.partScrollContent}
          >
            {BODY_PART_KEYS.map((key) => (
              <Pressable
                key={key}
                style={[
                  styles.partChip,
                  selectedPart === key && styles.partChipSelected,
                ]}
                onPress={() => setSelectedPart(key)}
              >
                <Text
                  style={[
                    styles.partChipText,
                    selectedPart === key && styles.partChipTextSelected,
                  ]}
                >
                  {BODY_PARTS[key].label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Time range */}
          <SegmentedControl
            options={[...TIME_RANGES]}
            selectedIndex={timeRangeIndex}
            onSelect={setTimeRangeIndex}
          />

          {/* Chart */}
          <Card style={styles.chartCard}>
            {selectedPart === 'bodyFat' && chartData.length > 0 ? (
              <BodyFatGauge value={chartData[chartData.length - 1]?.value || 0} />
            ) : null}
            <ProgressLineChart
              data={chartData}
              goalValue={goalDisplay}
              unit={displayUnit}
              width={SCREEN_WIDTH - 64}
            />
          </Card>

          {/* Stats */}
          {stats && stats.count > 0 && (
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Text style={styles.statLabel}>Min</Text>
                <Text style={styles.statValue}>{stats.min.toFixed(1)}</Text>
                <Text style={styles.statUnit}>{displayUnit}</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statLabel}>Max</Text>
                <Text style={styles.statValue}>{stats.max.toFixed(1)}</Text>
                <Text style={styles.statUnit}>{displayUnit}</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statLabel}>Avg</Text>
                <Text style={styles.statValue}>{stats.avg.toFixed(1)}</Text>
                <Text style={styles.statUnit}>{displayUnit}</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statLabel}>Change</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: stats.change > 0 ? Colors.success : stats.change < 0 ? Colors.error : Colors.textPrimary },
                  ]}
                >
                  {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)}
                </Text>
                <Text style={styles.statUnit}>{displayUnit}</Text>
              </Card>
            </View>
          )}

          {/* View full history */}
          <Pressable
            style={styles.historyBtn}
            onPress={() => router.push(`/history/${selectedPart}` as any)}
          >
            <Text style={styles.historyBtnText}>View Full History</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    padding: Layout.screenPadding,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Layout.spacing.md,
  },
  partScroll: {
    marginBottom: Layout.spacing.md,
  },
  partScrollContent: {
    gap: Layout.spacing.sm,
  },
  partChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Layout.chipBorderRadius,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  partChipSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  partChipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  partChipTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  chartCard: {
    marginTop: Layout.spacing.md,
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  statValue: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  statUnit: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  historyBtn: {
    marginTop: Layout.spacing.lg,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: Layout.buttonBorderRadius,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  historyBtnText: {
    ...Typography.body,
    color: Colors.accent,
    fontWeight: '600',
  },
});
