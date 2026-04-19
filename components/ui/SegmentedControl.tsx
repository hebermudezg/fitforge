import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function SegmentedControl({ options, selectedIndex, onSelect }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <Pressable
          key={option}
          onPress={() => onSelect(index)}
          style={[
            styles.option,
            index === selectedIndex && styles.optionSelected,
          ]}
        >
          <Text
            style={[
              styles.optionText,
              index === selectedIndex && styles.optionTextSelected,
            ]}
          >
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
    backgroundColor: Colors.surface,
    borderRadius: Layout.chipBorderRadius,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Layout.chipBorderRadius - 3,
  },
  optionSelected: {
    backgroundColor: Colors.accent,
  },
  optionText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  optionTextSelected: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
