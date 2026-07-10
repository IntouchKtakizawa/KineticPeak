import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/HomeStack';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { useProfileStore } from '../../store/useProfileStore';
import { sessionVolumeLoadKg, sessionWorkCapacity } from '../../models/workout';
import { findExerciseById } from '../../data/exercises';
import { LiveMetricsBar } from '../../components/LiveMetricsBar';
import { RestTimerOverlay } from '../../components/RestTimerOverlay';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<HomeStackParamList, 'SessionActive'>;

export function SessionActiveScreen({ navigation }: Props) {
  const activeSession = useWorkoutStore((s) => s.activeSession);
  const recordRestTaken = useWorkoutStore((s) => s.recordRestTaken);
  const endActiveSession = useWorkoutStore((s) => s.endActiveSession);
  const discardActiveSession = useWorkoutStore((s) => s.discardActiveSession);
  const restTimerOverrideSeconds = useProfileStore((s) => s.profile.restTimerOverrideSeconds);

  const previousSetCount = useRef(activeSession?.sets.length ?? 0);
  const [restTimer, setRestTimer] = useState<{ durationSeconds: number; setId: string } | null>(null);

  useEffect(() => {
    const currentCount = activeSession?.sets.length ?? 0;
    if (currentCount > previousSetCount.current && activeSession) {
      const lastSet = activeSession.sets[activeSession.sets.length - 1];
      const exercise = findExerciseById(lastSet.exerciseId);
      const duration = restTimerOverrideSeconds ?? exercise?.defaultRestSeconds ?? 90;
      setRestTimer({ durationSeconds: duration, setId: lastSet.id });
    }
    previousSetCount.current = currentCount;
  }, [activeSession?.sets.length, activeSession]);

  if (!activeSession) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No active session.</Text>
      </SafeAreaView>
    );
  }

  const handleFinish = () => {
    endActiveSession();
    navigation.replace('SessionSummary');
  };

  const handleDiscard = () => {
    discardActiveSession();
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LiveMetricsBar
        volumeLoadKg={sessionVolumeLoadKg(activeSession)}
        workCapacity={sessionWorkCapacity(activeSession)}
      />

      {restTimer ? (
        <RestTimerOverlay
          key={restTimer.setId}
          durationSeconds={restTimer.durationSeconds}
          onDone={(elapsed) => {
            recordRestTaken(restTimer.setId, elapsed);
            setRestTimer(null);
          }}
          onSkip={(elapsed) => {
            recordRestTaken(restTimer.setId, elapsed);
            setRestTimer(null);
          }}
        />
      ) : null}

      <FlatList
        style={styles.list}
        data={[...activeSession.sets].reverse()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        ListEmptyComponent={<Text style={styles.emptyText}>No sets logged yet.</Text>}
        renderItem={({ item }) => {
          const exercise = findExerciseById(item.exerciseId);
          return (
            <View style={styles.setRow}>
              <Text style={styles.setExercise}>{exercise?.name ?? item.exerciseId}</Text>
              <Text style={styles.setDetail}>
                {item.weightKg} kg × {item.reps}
                {item.isWarmup ? ' (warm-up)' : ''}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <Pressable style={styles.secondaryButton} onPress={handleDiscard}>
          <Text style={styles.secondaryButtonText}>Discard</Text>
        </Pressable>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('ExercisePicker')}
        >
          <Text style={styles.addButtonText}>+ Add Exercise</Text>
        </Pressable>
        <Pressable style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
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
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  finishButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonText: {
    color: colors.background,
    fontWeight: '700',
  },
});
