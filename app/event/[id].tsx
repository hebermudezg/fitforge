import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function EventDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Details</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
});
