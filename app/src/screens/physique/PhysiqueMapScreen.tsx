import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PhysiqueStackParamList } from '../../navigation/PhysiqueStack';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { computeMuscleFreshness } from '../../services/physique/decay';
import { MuscleMapSvg } from '../../components/MuscleMapSvg';
import { MUSCLE_GROUP_LABELS } from '../../models/exercise';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<PhysiqueStackParamList, 'PhysiqueMap'>;

export function PhysiqueMapScreen({ navigation }: Props) {
  const history = useWorkoutStore((s) => s.history);
  const [view, setView] = useState<'front' | 'back'>('front');

  const freshness = useMemo(() => computeMuscleFreshness(history), [history]);
  const freshnessByMuscle = useMemo(
    () => new Map(freshness.map((f) => [f.muscleGroup, f.freshness])),
    [freshness]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Physique Map</Text>
      <Text style={styles.subheading}>
        Brighter zones were trained more recently and haven't fully recovered yet.
      </Text>

      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggle, view === 'front' && styles.toggleActive]}
          onPress={() => setView('front')}
        >
          <Text style={[styles.toggleText, view === 'front' && styles.toggleTextActive]}>Front</Text>
        </Pressable>
        <Pressable
          style={[styles.toggle, view === 'back' && styles.toggleActive]}
          onPress={() => setView('back')}
        >
          <Text style={[styles.toggleText, view === 'back' && styles.toggleTextActive]}>Back</Text>
        </Pressable>
      </View>

      <MuscleMapSvg
        view={view}
        freshnessByMuscle={freshnessByMuscle}
        onSelectMuscle={(muscle) => navigation.navigate('MuscleDetail', { muscleGroup: muscle })}
      />

      <View style={styles.legend}>
        <View style={[styles.legendDot, { backgroundColor: colors.freshnessLow }]} />
        <Text style={styles.legendText}>Recovered</Text>
        <View style={[styles.legendDot, { backgroundColor: colors.freshnessHigh }]} />
        <Text style={styles.legendText}>Recently trained</Text>
      </View>

      <Text style={styles.helper}>Tap a muscle group to see recent training detail.</Text>
      <View style={styles.chipsWrap}>
        {freshness
          .filter((f) => f.lastTrainedAt)
          .map((f) => (
            <Pressable
              key={f.muscleGroup}
              style={styles.chip}
              onPress={() => navigation.navigate('MuscleDetail', { muscleGroup: f.muscleGroup })}
            >
              <Text style={styles.chipText}>{MUSCLE_GROUP_LABELS[f.muscleGroup]}</Text>
            </Pressable>
          ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  subheading: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  toggle: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleActive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accent,
  },
  toggleText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.accent,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginRight: spacing.md,
  },
  helper: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
