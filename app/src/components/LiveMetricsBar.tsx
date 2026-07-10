import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radii } from '../theme/spacing';

interface LiveMetricsBarProps {
  volumeLoadKg: number;
  workCapacity: number;
}

export function LiveMetricsBar({ volumeLoadKg, workCapacity }: LiveMetricsBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.metric}>
        <Text style={styles.value}>{Math.round(volumeLoadKg).toLocaleString()}</Text>
        <Text style={styles.label}>Volume Load (kg)</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.metric}>
        <Text style={styles.value}>{workCapacity}</Text>
        <Text style={styles.label}>Work Capacity</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
