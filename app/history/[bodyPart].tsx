import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useUser } from '@/contexts/UserContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, type BodyPartKey } from '@/types/bodyParts';
import { convertValue, getDisplayUnit } from '@/utils/conversions';
import { formatDateTime, getRelativeDate } from '@/utils/formatting';
import type { Measurement } from '@/types/models';

export default function HistoryScreen() {
  const { bodyPart } = useLocalSearchParams<{ bodyPart: string }>();
  const { user } = useUser();
  const { getHistory, removeMeasurement } = useMeasurements();
  const [data, setData] = useState<Measurement[]>([]);

  const key = bodyPart as BodyPartKey;
  const partDef = BODY_PARTS[key];
  const displayUnit = getDisplayUnit(partDef?.unit || 'cm', user.unitSystem);

  useEffect(() => {
    loadHistory();
  }, [key]);

  const loadHistory = async () => {
    const history = await getHistory(key);
    setData(history.reverse());
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Measurement', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeMeasurement(id);
          await loadHistory();
        },
      },
    ]);
  };

  const renderItem = ({ item, index }: { item: Measurement; index: number }) => {
    const displayVal = convertValue(item.value, partDef.unit, user.unitSystem);
    const prev = index < data.length - 1 ? data[index + 1] : null;
    const prevVal = prev ? convertValue(prev.value, partDef.unit, user.unitSystem) : null;
    const delta = prevVal !== null ? displayVal - prevVal : null;

    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.rowValue}>
            {displayVal.toFixed(1)} {displayUnit}
          </Text>
          {delta !== null && (
            <Text
              style={[
                styles.rowDelta,
                { color: delta > 0 ? Colors.success : delta < 0 ? Colors.error : Colors.textMuted },
              ]}
            >
              {delta > 0 ? '+' : ''}{delta.toFixed(1)}
            </Text>
          )}
        </View>
        <View style={styles.rowRight}>
          <Text style={styles.rowDate}>{getRelativeDate(item.measuredAt)}</Text>
          <Text style={styles.rowDateTime}>{formatDateTime(item.measuredAt)}</Text>
        </View>
        <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No measurements recorded yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Layout.screenPadding,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLeft: {
    flex: 1,
  },
  rowValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  rowDelta: {
    ...Typography.caption,
    marginTop: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
    marginRight: Layout.spacing.md,
  },
  rowDate: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  rowDateTime: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  empty: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});
