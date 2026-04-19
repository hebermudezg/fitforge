import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useDatabase } from '@/contexts/DatabaseContext';
import { getEvent, updateEvent, deleteEvent } from '@/database/eventQueries';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { formatDateTime } from '@/utils/formatting';
import type { CalendarEvent } from '@/types/models';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useDatabase();
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    const e = await getEvent(db, parseInt(id));
    if (e) {
      setEvent(e);
      setTitle(e.title);
      setDescription(e.description);
      setLocation(e.location);
    }
  };

  const handleSave = async () => {
    if (!event) return;
    await updateEvent(db, event.id, {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setEditing(false);
    await loadEvent();
  };

  const handleDelete = () => {
    Alert.alert('Delete Event', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!event) return;
          await deleteEvent(db, event.id);
          router.back();
        },
      },
    ]);
  };

  const handleToggleComplete = async () => {
    if (!event) return;
    await updateEvent(db, event.id, { isCompleted: !event.isCompleted });
    await loadEvent();
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {editing ? (
        <>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={Colors.textMuted}
          />
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor={Colors.textMuted}
          />
          <TextInput
            style={[styles.input, styles.multiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor={Colors.textMuted}
            multiline
          />
          <Pressable onPress={handleSave} style={styles.saveBtn}>
            <LinearGradient
              colors={[...Colors.gradientPrimary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveGradient}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </LinearGradient>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.metaText}>{formatDateTime(event.startTime)}</Text>
          </View>
          {event.location ? (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.metaText}>{event.location}</Text>
            </View>
          ) : null}
          {event.description ? (
            <Text style={styles.description}>{event.description}</Text>
          ) : null}

          <View style={styles.actions}>
            <Pressable style={styles.actionBtn} onPress={handleToggleComplete}>
              <Ionicons
                name={event.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={event.isCompleted ? Colors.success : Colors.textMuted}
              />
              <Text style={styles.actionText}>
                {event.isCompleted ? 'Completed' : 'Mark Complete'}
              </Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => setEditing(true)}>
              <Ionicons name="pencil-outline" size={22} color={Colors.info} />
              <Text style={styles.actionText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={22} color={Colors.error} />
              <Text style={[styles.actionText, { color: Colors.error }]}>Delete</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { padding: Layout.screenPadding },
  loadingText: { ...Typography.body, color: Colors.textMuted, textAlign: 'center', marginTop: 40 },
  eventTitle: { ...Typography.h1, color: Colors.textPrimary, marginBottom: Layout.spacing.md },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  metaText: { ...Typography.body, color: Colors.textSecondary },
  description: {
    ...Typography.body, color: Colors.textSecondary,
    marginTop: Layout.spacing.md, lineHeight: 24,
  },
  actions: {
    marginTop: Layout.spacing.xl, gap: Layout.spacing.md,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Layout.spacing.sm,
    paddingVertical: 12, paddingHorizontal: Layout.cardPadding,
    backgroundColor: Colors.surface, borderRadius: Layout.cardBorderRadius,
    borderWidth: 1, borderColor: Colors.border,
  },
  actionText: { ...Typography.body, color: Colors.textPrimary },
  input: {
    ...Typography.body, color: Colors.textPrimary,
    backgroundColor: Colors.surface, borderRadius: Layout.cardBorderRadius,
    padding: Layout.cardPadding, borderWidth: 1, borderColor: Colors.border,
    marginBottom: Layout.spacing.md,
  },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  saveBtn: { borderRadius: Layout.buttonBorderRadius, overflow: 'hidden', marginTop: Layout.spacing.md },
  saveGradient: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  saveBtnText: { ...Typography.h3, color: Colors.textPrimary },
});
