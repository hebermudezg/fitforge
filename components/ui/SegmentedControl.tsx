import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function SegmentedControl({ options, selectedIndex, onSelect }: SegmentedControlProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {options.map((option, index) => (
        <Pressable
          key={option}
          onPress={() => onSelect(index)}
          style={[
            styles.option,
            index === selectedIndex && { backgroundColor: colors.accent },
          ]}
        >
          <Text style={[
            styles.optionText,
            { color: colors.textMuted },
            index === selectedIndex && { color: '#0D0D0D', fontWeight: '600' },
          ]}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Layout.chipBorderRadius,
    padding: 3,
    borderWidth: 1,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Layout.chipBorderRadius - 3,
  },
  optionText: {
    ...Typography.bodySmall,
  },
});
