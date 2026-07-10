import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/HomeStack';
import { findExerciseById } from '../../data/exercises';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { useProfileStore } from '../../store/useProfileStore';
import { evaluateRelativeIntensity } from '../../services/relativeIntensity';
import { evaluateSetForPRs } from '../../services/prEngine';
import { RELATIVE_INTENSITY_LABELS } from '../../models/intensity';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<HomeStackParamList, 'SetLogger'>;

export function SetLoggerScreen({ route, navigation }: Props) {
  const exercise = findExerciseById(route.params.exerciseId);
  const logSet = useWorkoutStore((s) => s.logSet);
  const bodyweightKg = useProfileStore((s) => s.profile.weightKg);

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [isWarmup, setIsWarmup] = useState(false);
  const [justHitPR, setJustHitPR] = useState(false);

  const weightValue = parseFloat(weight);
  const repsValue = parseInt(reps, 10);
  const canLog = Number.isFinite(weightValue) && weightValue > 0 && Number.isFinite(repsValue) && repsValue > 0;

  const intensity = useMemo(() => {
    if (!exercise || !canLog) return null;
    return evaluateRelativeIntensity(exercise, weightValue, repsValue, bodyweightKg);
  }, [exercise, canLog, weightValue, repsValue, bodyweightKg]);

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.helper}>Exercise not found.</Text>
      </SafeAreaView>
    );
  }

  const handleLog = () => {
    const entry = logSet({
      exerciseId: exercise.id,
      weightKg: weightValue,
      reps: repsValue,
      isWarmup,
    });

    const { newRecords } = evaluateSetForPRs(entry);
    if (newRecords.length > 0) {
      setJustHitPR(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    setWeight('');
    setReps('');
    setIsWarmup(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.heading}>{exercise.name}</Text>

        {justHitPR ? <Text style={styles.prBadge}>🏆 New PR!</Text> : null}

        <Text style={styles.fieldLabel}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="60"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.fieldLabel}>Reps</Text>
        <TextInput
          style={styles.input}
          value={reps}
          onChangeText={setReps}
          keyboardType="numeric"
          placeholder="8"
          placeholderTextColor={colors.textMuted}
        />

        <View style={styles.warmupRow}>
          <Text style={styles.fieldLabel}>Warm-up set</Text>
          <Switch value={isWarmup} onValueChange={setIsWarmup} />
        </View>

        {intensity ? (
          <View style={styles.intensityCard}>
            <Text style={styles.intensityLabel}>
              {RELATIVE_INTENSITY_LABELS[intensity.label]} · {Math.round(intensity.percent1RM)}% e1RM
            </Text>
            <Text style={styles.intensityMessage}>{intensity.message}</Text>
          </View>
        ) : null}
      </View>

      <Pressable style={[styles.cta, !canLog && styles.ctaDisabled]} onPress={handleLog} disabled={!canLog}>
        <Text style={styles.ctaText}>Log Set</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  content: {
    padding: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  helper: {
    color: colors.textSecondary,
    padding: spacing.lg,
  },
  prBadge: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: 18,
  },
  warmupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  intensityCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  intensityLabel: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  intensityMessage: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 13,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  ctaDisabled: {
    opacity: 0.4,
  },
  ctaText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
  },
});
