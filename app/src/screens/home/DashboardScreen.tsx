import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/HomeStack';
import { useProfileStore } from '../../store/useProfileStore';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { sessionVolumeLoadKg, sessionWorkCapacity } from '../../models/workout';
import { computeLeagueState } from '../../services/league/computeLeague';
import { TierBadge } from '../../components/TierBadge';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<HomeStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const profile = useProfileStore((s) => s.profile);
  const history = useWorkoutStore((s) => s.history);
  const activeSession = useWorkoutStore((s) => s.activeSession);
  const startSession = useWorkoutStore((s) => s.startSession);

  const league = useMemo(() => computeLeagueState(history, profile.weightKg), [history, profile.weightKg]);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklySessions = history.filter((s) => new Date(s.startedAt).getTime() >= weekAgo);
  const weeklyVolume = weeklySessions.reduce((sum, s) => sum + sessionVolumeLoadKg(s), 0);

  const lastSession = history[0];

  const handleStart = () => {
    if (!activeSession) startSession();
    navigation.navigate('SessionActive');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Welcome back, {profile.displayName || 'Athlete'}</Text>
        <TierBadge tier={league.tier} size="lg" />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{Math.round(weeklyVolume).toLocaleString()}</Text>
            <Text style={styles.statLabel}>7-day Volume (kg)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{weeklySessions.length}</Text>
            <Text style={styles.statLabel}>7-day Sessions</Text>
          </View>
        </View>

        {lastSession ? (
          <View style={styles.recapCard}>
            <Text style={styles.recapTitle}>Last session</Text>
            <Text style={styles.recapLine}>
              {Math.round(sessionVolumeLoadKg(lastSession)).toLocaleString()} kg ·{' '}
              {sessionWorkCapacity(lastSession)} sets
            </Text>
            <Text style={styles.recapDate}>{new Date(lastSession.startedAt).toDateString()}</Text>
          </View>
        ) : (
          <View style={styles.recapCard}>
            <Text style={styles.recapTitle}>No sessions yet</Text>
            <Text style={styles.recapLine}>Log your first workout to get started.</Text>
          </View>
        )}
      </ScrollView>

      <Pressable style={styles.cta} onPress={handleStart}>
        <Text style={styles.ctaText}>{activeSession ? 'Resume Workout' : 'Start Workout'}</Text>
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
    gap: spacing.md,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: 24,
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
    textAlign: 'center',
  },
  recapCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  recapTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  recapLine: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: spacing.xs,
  },
  recapDate: {
    color: colors.textMuted,
    fontSize: 12,
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
