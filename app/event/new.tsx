import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useUser } from '@/contexts/UserContext';
import { insertEvent } from '@/database/eventQueries';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import type { CalendarEvent } from '@/types/models';

const EVENT_TYPES: CalendarEvent['eventType'][] = ['coaching', 'check_in', 'workout', 'custom'];
const EVENT_TYPE_LABELS = ['Coaching', 'Check-in', 'Workout', 'Custom'];

export default function NewEventScreen() {
  const router = useRouter();
  const db = useDatabase();
  const { user } = useUser();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [timeStr, setTimeStr] = useState('09:00');
  const [location, setLocation] = useState('');

  const handleSave = async () => {
    if (!title.trim()) return;
    const startTime = `${dateStr}T${timeStr}:00`;
    await insertEvent(db, user.id, {
      title: title.trim(),
      description: description.trim(),
      eventType: EVENT_TYPES[typeIndex],
      startTime,
      location: location.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>New Event</Text>
          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.label}>TYPE</Text>
        <SegmentedControl
          options={EVENT_TYPE_LABELS}
          selectedIndex={typeIndex}
          onSelect={setTypeIndex}
        />

        <Text style={styles.label}>TITLE</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Event title"
          placeholderTextColor={Colors.textMuted}
        />

        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeField}>
            <Text style={styles.label}>DATE</Text>
            <TextInput
              style={styles.input}
              value={dateStr}
              onChangeText={setDateStr}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <View style={styles.dateTimeField}>
            <Text style={styles.label}>TIME</Text>
            <TextInput
              style={styles.input}
              value={timeStr}
              onChangeText={setTimeStr}
              placeholder="HH:MM"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>

        <Text style={styles.label}>LOCATION</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Location (optional)"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>DESCRIPTION</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add details (optional)"
          placeholderTextColor={Colors.textMuted}
          multiline
        />

        <Pressable
          onPress={handleSave}
          disabled={!title.trim()}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && { opacity: 0.8 },
            !title.trim() && { opacity: 0.4 },
          ]}
        >
          <LinearGradient
            colors={[...Colors.gradientPrimary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Ionicons name="checkmark" size={24} color={Colors.textPrimary} />
            <Text style={styles.saveText}>Create Event</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { padding: Layout.screenPadding },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: Layout.spacing.lg,
  },
  closeBtn: { padding: 4 },
  headerTitle: { ...Typography.h2, color: Colors.textPrimary },
  label: {
    ...Typography.label, color: Colors.textMuted,
    marginTop: Layout.spacing.md, marginBottom: Layout.spacing.sm,
  },
  input: {
    ...Typography.body, color: Colors.textPrimary,
    backgroundColor: Colors.surface, borderRadius: Layout.cardBorderRadius,
    padding: Layout.cardPadding, borderWidth: 1, borderColor: Colors.border,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  dateTimeRow: { flexDirection: 'row', gap: Layout.spacing.md },
  dateTimeField: { flex: 1 },
  saveButton: {
    borderRadius: Layout.buttonBorderRadius, overflow: 'hidden',
    marginTop: Layout.spacing.xl,
  },
  saveGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Layout.spacing.sm, paddingVertical: 16,
  },
  saveText: { ...Typography.h3, color: Colors.textPrimary },
});
