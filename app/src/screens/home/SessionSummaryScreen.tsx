import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/HomeStack';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { usePRStore } from '../../store/usePRStore';
import { sessionVolumeLoadKg, sessionWorkCapacity } from '../../models/workout';
import { findExerciseById } from '../../data/exercises';
import { PRCelebration } from '../../components/PRCelebration';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<HomeStackParamList, 'SessionSummary'>;

export function SessionSummaryScreen({ navigation }: Props) {
  const session = useWorkoutStore((s) => s.history[0]);
  const prRecords = usePRStore((s) => s.records);

  const sessionPRs = useMemo(() => {
    if (!session) return [];
    const startMs = new Date(session.startedAt).getTime();
    return prRecords.filter((r) => new Date(r.achievedAt).getTime() >= startMs);
  }, [session, prRecords]);

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.helper}>No session to summarize.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Session Complete</Text>

        {sessionPRs.length > 0 ? <PRCelebration count={sessionPRs.length} /> : null}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {Math.round(sessionVolumeLoadKg(session)).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Volume Load (kg)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{sessionWorkCapacity(session)}</Text>
            <Text style={styles.statLabel}>Work Capacity</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sets</Text>
        {session.sets.map((set) => {
          const exercise = findExerciseById(set.exerciseId);
          return (
            <View key={set.id} style={styles.setRow}>
              <Text style={styles.setExercise}>{exercise?.name ?? set.exerciseId}</Text>
              <Text style={styles.setDetail}>
                {set.weightKg} kg × {set.reps}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <Pressable style={styles.cta} onPress={() => navigation.popToTop()}>
        <Text style={styles.ctaText}>Done</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  helper: {
    color: colors.textSecondary,
    padding: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
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
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  ctaText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
  },
});
