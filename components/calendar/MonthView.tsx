import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';

interface MonthViewProps {
  year: number;
  month: number;
  selectedDay: number | null;
  eventDays: Set<number>;
  onDayPress: (day: number) => void;
}

export function MonthView({ year, month, selectedDay, eventDays, onDayPress }: MonthViewProps) {
  const { colors } = useTheme();
  const { lang } = useI18n();

  const WEEKDAYS = lang === 'es'
    ? ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDate = isCurrentMonth ? today.getDate() : -1;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((d) => (
          <Text key={d} style={[styles.weekdayText, { color: colors.textMuted }]}>{d}</Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((day, ci) => {
            const isToday = day === todayDate;
            const isSelected = day === selectedDay;
            return (
              <Pressable
                key={ci}
                style={[
                  styles.cell,
                  isToday && { borderWidth: 1, borderColor: colors.accent },
                  isSelected && { backgroundColor: colors.accent },
                ]}
                onPress={() => day && onDayPress(day)}
                disabled={!day}
              >
                {day && (
                  <>
                    <Text style={[
                      styles.dayText,
                      { color: colors.textPrimary },
                      isToday && { color: colors.accent, fontWeight: '700' },
                      isSelected && { color: '#0D0D0D', fontWeight: '700' },
                    ]}>
                      {day}
                    </Text>
                    {eventDays.has(day) && (
                      <View style={[styles.dot, { backgroundColor: isSelected ? '#0D0D0D' : colors.accent }]} />
                    )}
                  </>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  weekdayRow: { flexDirection: 'row', marginBottom: 8 },
  weekdayText: { flex: 1, textAlign: 'center', ...Typography.caption, fontWeight: '600' },
  row: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  dayText: { ...Typography.bodySmall },
  dot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 2 },
});
