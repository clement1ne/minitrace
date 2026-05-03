import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../app/constants/theme';

interface Props {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i < current ? styles.dotActive : null]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
});
