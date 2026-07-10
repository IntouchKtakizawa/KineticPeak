import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PhysiqueStackParamList } from '../../navigation/PhysiqueStack';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { computeMuscleFreshness } from '../../services/physique/decay';
import { findExerciseById } from '../../data/exercises';
import { MUSCLE_GROUP_LABELS } from '../../models/exercise';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<PhysiqueStackParamList, 'MuscleDetail'>;

export function MuscleDetailScreen({ route, navigation }: Props) {
  const { muscleGroup } = route.params;
  const history = useWorkoutStore((s) => s.history);

  const freshness = useMemo(
    () => computeMuscleFreshness(history).find((f) => f.muscleGroup === muscleGroup),
    [history, muscleGroup]
  );

  const recentSets = useMemo(() => {
    const items: { exerciseName: string; weightKg: number; reps: number; completedAt: string }[] = [];
    for (const session of history) {
      for (const set of session.sets) {
        const exercise = findExerciseById(set.exerciseId);
        if (!exercise) continue;
        if (
          exercise.primaryMuscles.includes(muscleGroup) ||
          exercise.secondaryMuscles.includes(muscleGroup)
        ) {
          items.push({
            exerciseName: exercise.name,
            weightKg: set.weightKg,
            reps: set.reps,
            completedAt: set.completedAt,
          });
        }
      }
    }
    return items
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 20);
  }, [history, muscleGroup]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.heading}>{MUSCLE_GROUP_LABELS[muscleGroup]}</Text>
      <Text style={styles.freshness}>
        Freshness: {Math.round(freshness?.freshness ?? 0)} / 100
      </Text>
      {freshness?.lastTrainedAt ? (
        <Text style={styles.lastTrained}>
          Last trained {new Date(freshness.lastTrainedAt).toDateString()}
        </Text>
      ) : (
        <Text style={styles.lastTrained}>No recent training data.</Text>
      )}

      <Text style={styles.sectionTitle}>Recent sets</Text>
      <FlatList
        data={recentSets}
        keyExtractor={(_, index) => `${index}`}
        contentContainerStyle={{ gap: spacing.sm }}
        renderItem={({ item }) => (
          <View style={styles.setRow}>
            <Text style={styles.setExercise}>{item.exerciseName}</Text>
            <Text style={styles.setDetail}>
              {item.weightKg} kg × {item.reps} · {new Date(item.completedAt).toDateString()}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  back: {
    color: colors.accent,
    marginBottom: spacing.md,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  freshness: {
    color: colors.textPrimary,
    marginTop: spacing.sm,
    fontSize: 16,
  },
  lastTrained: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  setRow: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  setExercise: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  setDetail: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 12,
  },
});
