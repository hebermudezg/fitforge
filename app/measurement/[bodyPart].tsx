import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMeasurements } from '@/contexts/MeasurementContext';
import { useUser } from '@/contexts/UserContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { BODY_PARTS, type BodyPartKey } from '@/types/bodyParts';
import { convertValue, getDisplayUnit } from '@/utils/conversions';
import { formatDate } from '@/utils/formatting';

export default function MeasurementEntryScreen() {
  const { bodyPart } = useLocalSearchParams<{ bodyPart: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { addMeasurement, getHistory, latestMeasurements } = useMeasurements();

  const key = bodyPart as BodyPartKey;
  const partDef = BODY_PARTS[key];
  const displayUnit = getDisplayUnit(partDef?.unit || 'cm', user.unitSystem);

  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [recentHistory, setRecentHistory] = useState<{ value: number; measuredAt: string }[]>([]);

  useEffect(() => {
    if (!key) return;
    (async () => {
      const history = await getHistory(key);
      setRecentHistory(
        history.slice(-5).reverse().map((m) => ({
          value: convertValue(m.value, partDef.unit, user.unitSystem),
          measuredAt: m.measuredAt,
        }))
      );
    })();
  }, [key]);

  const handleSave = async () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    // Convert back to metric for storage if imperial
    let metricValue = numValue;
    if (user.unitSystem === 'imperial') {
      if (partDef.unit === 'cm') metricValue = numValue / 0.393701;
      if (partDef.unit === 'kg') metricValue = numValue / 2.20462;
    }

    await addMeasurement(key, Math.round(metricValue * 10) / 10, undefined, notes);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const adjustValue = (delta: number) => {
    const current = parseFloat(value) || 0;
    const newVal = Math.max(0, current + delta);
    setValue(newVal.toFixed(1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!partDef) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid body part</Text>
      </View>
    );
  }

  const latestMeasurement = latestMeasurements[key];
  const latestDisplayValue = latestMeasurement
    ? convertValue(latestMeasurement.value, partDef.unit, user.unitSystem)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>{partDef.label}</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Current value display */}
        {latestDisplayValue !== null && (
          <View style={styles.currentContainer}>
            <Text style={styles.currentLabel}>Current</Text>
            <Text style={styles.currentValue}>
              {latestDisplayValue.toFixed(1)} {displayUnit}
            </Text>
          </View>
        )}

        {/* Value input */}
        <View style={styles.inputContainer}>
          <Pressable style={styles.stepperBtn} onPress={() => adjustValue(-1)}>
            <Ionicons name="remove-circle" size={40} color={Colors.accent} />
          </Pressable>

          <View style={styles.valueInputWrap}>
            <TextInput
              style={styles.valueInput}
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
              placeholder="0.0"
              placeholderTextColor={Colors.textMuted}
              textAlign="center"
            />
            <Text style={styles.unitLabel}>{displayUnit}</Text>
          </View>

          <Pressable style={styles.stepperBtn} onPress={() => adjustValue(1)}>
            <Ionicons name="add-circle" size={40} color={Colors.accent} />
          </Pressable>
        </View>

        {/* Fine adjustment */}
        <View style={styles.fineAdjust}>
          <Pressable style={styles.fineBtn} onPress={() => adjustValue(-0.5)}>
            <Text style={styles.fineBtnText}>-0.5</Text>
          </Pressable>
          <Pressable style={styles.fineBtn} onPress={() => adjustValue(-0.1)}>
            <Text style={styles.fineBtnText}>-0.1</Text>
          </Pressable>
          <Pressable style={styles.fineBtn} onPress={() => adjustValue(0.1)}>
            <Text style={styles.fineBtnText}>+0.1</Text>
          </Pressable>
          <Pressable style={styles.fineBtn} onPress={() => adjustValue(0.5)}>
            <Text style={styles.fineBtnText}>+0.5</Text>
          </Pressable>
        </View>

        {/* Notes */}
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes (optional)"
          placeholderTextColor={Colors.textMuted}
          multiline
        />

        {/* Recent entries */}
        {recentHistory.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent</Text>
            {recentHistory.map((entry, i) => (
              <View key={i} style={styles.recentRow}>
                <Text style={styles.recentValue}>
                  {entry.value.toFixed(1)} {displayUnit}
                </Text>
                <Text style={styles.recentDate}>{formatDate(entry.measuredAt)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Save button */}
        <Pressable
          onPress={handleSave}
          disabled={!value || parseFloat(value) <= 0}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && { opacity: 0.8 },
            (!value || parseFloat(value) <= 0) && { opacity: 0.4 },
          ]}
        >
          <LinearGradient
            colors={[...Colors.gradientPrimary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Ionicons name="checkmark" size={24} color="#0D0D0D" />
            <Text style={styles.saveText}>Save Measurement</Text>
          </LinearGradient>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    padding: Layout.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  currentContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  currentLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  currentValue: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  stepperBtn: {
    padding: 8,
  },
  valueInputWrap: {
    alignItems: 'center',
  },
  valueInput: {
    ...Typography.numeric,
    fontSize: 48,
    color: Colors.textPrimary,
    minWidth: 150,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.accent,
    paddingBottom: 4,
  },
  unitLabel: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: 4,
  },
  fineAdjust: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
  fineBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Layout.chipBorderRadius,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fineBtnText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  notesInput: {
    ...Typography.body,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
    borderRadius: Layout.cardBorderRadius,
    padding: Layout.cardPadding,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 50,
    marginBottom: Layout.spacing.md,
  },
  recentSection: {
    marginBottom: Layout.spacing.md,
  },
  recentTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Layout.spacing.sm,
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentValue: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  recentDate: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  saveButton: {
    borderRadius: Layout.buttonBorderRadius,
    overflow: 'hidden',
    marginTop: 'auto',
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
    paddingVertical: 16,
  },
  saveText: {
    ...Typography.h3,
    color: '#0D0D0D',
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
});
