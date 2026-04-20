import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Layout } from '@/constants/Layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.cardBorderRadius,
    padding: Layout.cardPadding,
    borderWidth: 1,
  },
});
