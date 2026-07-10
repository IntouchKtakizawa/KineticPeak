import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/HomeStack';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { sessionVolumeLoadKg, sessionWorkCapacity } from '../../models/workout';
import { findExerciseById } from '../../data/exercises';
import { LiveMetricsBar } from '../../components/LiveMetricsBar';
import { ExerciseLogCard } from '../../components/ExerciseLogCard';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<HomeStackParamList, 'SessionActive'>;

export function SessionActiveScreen({ navigation }: Props) {
  const activeSession = useWorkoutStore((s) => s.activeSession);
  const history = useWorkoutStore((s) => s.history);
  const endActiveSession = useWorkoutStore((s) => s.endActiveSession);
  const discardActiveSession = useWorkoutStore((s) => s.discardActiveSession);

  const [prBanner, setPrBanner] = useState<string | null>(null);
  const prBannerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (prBannerTimeout.current) clearTimeout(prBannerTimeout.current);
    };
  }, []);

  if (!activeSession) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>No active session.</Text>
      </SafeAreaView>
    );
  }

  const handlePRHit = (count: number) => {
    setPrBanner(`🏆 New PR${count > 1 ? 's' : ''}!`);
    if (prBannerTimeout.current) clearTimeout(prBannerTimeout.current);
    prBannerTimeout.current = setTimeout(() => setPrBanner(null), 2500);
  };

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

      {prBanner ? (
        <View style={styles.prBanner}>
          <Text style={styles.prBannerText}>{prBanner}</Text>
        </View>
      ) : null}

      <FlatList
        style={styles.list}
        data={activeSession.exerciseIds}
        keyExtractor={(id) => id}
        contentContainerStyle={{ paddingVertical: spacing.md }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tap "+ Add Exercise" to start logging.</Text>
        }
        renderItem={({ item }) => {
          const exercise = findExerciseById(item);
          if (!exercise) return null;
          return (
            <ExerciseLogCard
              exercise={exercise}
              session={activeSession}
              history={history}
              onPRHit={handlePRHit}
            />
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
  prBanner: {
    alignSelf: 'center',
    backgroundColor: colors.accentMuted,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  prBannerText: {
    color: colors.accent,
    fontWeight: '800',
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
