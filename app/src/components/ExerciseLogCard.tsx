import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { Exercise } from '../models/exercise';
import { SetEntry, WorkoutSession, findMostRecentSet } from '../models/workout';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { useProfileStore } from '../store/useProfileStore';
import { evaluateRelativeIntensity } from '../services/relativeIntensity';
import { evaluateSetForPRs } from '../services/prEngine';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';

interface ExerciseLogCardProps {
  exercise: Exercise;
  session: WorkoutSession;
  history: WorkoutSession[];
  onPRHit: (count: number) => void;
}

const INTENSITY_COLORS: Record<string, string> = {
  too_light: colors.textMuted,
  light: colors.textMuted,
  optimal: colors.success,
  heavy: colors.warning,
  too_heavy: colors.danger,
};

export function ExerciseLogCard({ exercise, session, history, onPRHit }: ExerciseLogCardProps) {
  const updateSetValues = useWorkoutStore((s) => s.updateSetValues);
  const toggleSetCompleted = useWorkoutStore((s) => s.toggleSetCompleted);
  const addSetRow = useWorkoutStore((s) => s.addSetRow);
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const updateExerciseNotes = useWorkoutStore((s) => s.updateExerciseNotes);
  const restTimerOverrideSeconds = useProfileStore((s) => s.profile.restTimerOverrideSeconds);
  const bodyweightKg = useProfileStore((s) => s.profile.weightKg);

  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const notificationIdRef = useRef<string | null>(null);

  const rows = useMemo(
    () =>
      session.sets
        .filter((s) => s.exerciseId === exercise.id)
        .sort((a, b) => a.setIndex - b.setIndex),
    [session.sets, exercise.id]
  );

  useEffect(() => {
    if (restRemaining === null) return;
    if (restRemaining <= 0) {
      setRestRemaining(null);
      return;
    }
    const timeout = setTimeout(() => setRestRemaining((r) => (r ?? 1) - 1), 1000);
    return () => clearTimeout(timeout);
  }, [restRemaining]);

  const startRestTimer = () => {
    const duration = restTimerOverrideSeconds ?? exercise.defaultRestSeconds;
    setRestRemaining(duration);
    Notifications.scheduleNotificationAsync({
      content: { title: 'Rest complete', body: `${exercise.name} — time for the next set.` },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: duration },
    })
      .then((id) => {
        notificationIdRef.current = id;
      })
      .catch(() => {});
  };

  const cancelRestTimer = () => {
    setRestRemaining(null);
    if (notificationIdRef.current) {
      Notifications.cancelScheduledNotificationAsync(notificationIdRef.current).catch(() => {});
      notificationIdRef.current = null;
    }
  };

  const handleToggle = (entry: SetEntry) => {
    const updated = toggleSetCompleted(entry.id);
    if (!updated) return;

    if (updated.completed) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      const { newRecords } = evaluateSetForPRs(updated);
      if (newRecords.length > 0) {
        onPRHit(newRecords.length);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
      startRestTimer();
    } else {
      cancelRestTimer();
    }
  };

  const handleRemoveExercise = () => {
    Alert.alert('Remove exercise?', `This removes ${exercise.name} and its logged sets from this session.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeExercise(exercise.id) },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>🏋️</Text>
        </View>
        <Text style={styles.title}>{exercise.name}</Text>
        <Pressable onPress={handleRemoveExercise} hitSlop={8}>
          <Text style={styles.menu}>⋮</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.notes}
        placeholder="Add notes here..."
        placeholderTextColor={colors.textMuted}
        value={session.exerciseNotes[exercise.id] ?? ''}
        onChangeText={(text) => updateExerciseNotes(exercise.id, text)}
      />

      <Pressable
        style={styles.restRow}
        onPress={() => (restRemaining === null ? startRestTimer() : cancelRestTimer())}
      >
        <Text style={styles.restIcon}>⏱</Text>
        <Text style={styles.restText}>
          Rest Timer: {restRemaining === null ? 'OFF' : formatSeconds(restRemaining)}
        </Text>
      </Pressable>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.colSet]}>SET</Text>
        <Text style={[styles.headerCell, styles.colPrevious]}>PREVIOUS</Text>
        <Text style={[styles.headerCell, styles.colInput]}>KG</Text>
        <Text style={[styles.headerCell, styles.colInput]}>REPS</Text>
        <Text style={[styles.headerCell, styles.colCheck]}>✓</Text>
      </View>

      {rows.map((row) => {
        const previous = findMostRecentSet(history, exercise.id, row.setIndex);
        const intensity =
          row.weightKg > 0 && row.reps > 0
            ? evaluateRelativeIntensity(exercise, row.weightKg, row.reps, bodyweightKg)
            : null;

        return (
          <View
            key={row.id}
            style={[
              styles.row,
              intensity ? { borderLeftColor: INTENSITY_COLORS[intensity.label] } : null,
            ]}
          >
            <Text style={[styles.cellText, styles.colSet]}>{row.setIndex + 1}</Text>
            <Text style={[styles.cellText, styles.colPrevious]}>
              {previous ? `${previous.weightKg}kg × ${previous.reps}` : '—'}
            </Text>
            <TextInput
              style={[styles.cellInput, styles.colInput]}
              keyboardType="numeric"
              value={row.weightKg ? String(row.weightKg) : ''}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              onChangeText={(text) =>
                updateSetValues(row.id, { weightKg: parseFloat(text) || 0 })
              }
            />
            <TextInput
              style={[styles.cellInput, styles.colInput]}
              keyboardType="numeric"
              value={row.reps ? String(row.reps) : ''}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              onChangeText={(text) => updateSetValues(row.id, { reps: parseInt(text, 10) || 0 })}
            />
            <Pressable style={styles.colCheck} onPress={() => handleToggle(row)}>
              <View style={[styles.checkbox, row.completed && styles.checkboxChecked]}>
                {row.completed ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
            </Pressable>
          </View>
        );
      })}

      <Pressable style={styles.addSetButton} onPress={() => addSetRow(exercise.id)}>
        <Text style={styles.addSetText}>+ Add Set</Text>
      </Pressable>
    </View>
  );
}

function formatSeconds(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  title: {
    flex: 1,
    color: colors.accent,
    fontWeight: '800',
    fontSize: 17,
  },
  menu: {
    color: colors.textSecondary,
    fontSize: 20,
    paddingHorizontal: spacing.sm,
  },
  notes: {
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontSize: 14,
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  restIcon: {
    color: colors.accent,
    fontSize: 14,
  },
  restText: {
    color: colors.accent,
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    paddingLeft: spacing.xs,
  },
  colSet: {
    width: 32,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  colPrevious: {
    flex: 1,
    color: colors.textMuted,
  },
  colInput: {
    width: 56,
    textAlign: 'center',
  },
  colCheck: {
    width: 40,
    alignItems: 'center',
  },
  cellText: {
    fontSize: 14,
  },
  cellInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontWeight: '700',
    paddingVertical: spacing.xs,
    marginHorizontal: spacing.xs,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.textSecondary,
  },
  checkmark: {
    color: colors.textPrimary,
    fontWeight: '900',
  },
  addSetButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addSetText: {
    color: colors.textSecondary,
    fontWeight: '700',
  },
});
