import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LeagueStackParamList } from '../../navigation/LeagueStack';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useGroupStore } from '../../store/useGroupStore';
import { computeLeagueState } from '../../services/league/computeLeague';
import { TIER_THRESHOLDS } from '../../services/league/leagueConfig';
import { TierBadge } from '../../components/TierBadge';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<LeagueStackParamList, 'LeagueHome'>;

function nextTierInfo(points: number) {
  const ascending = [...TIER_THRESHOLDS].sort((a, b) => a.minPoints - b.minPoints);
  const next = ascending.find((t) => t.minPoints > points);
  return next ?? null;
}

export function LeagueHomeScreen({ navigation }: Props) {
  const history = useWorkoutStore((s) => s.history);
  const weightKg = useProfileStore((s) => s.profile.weightKg);
  const group = useGroupStore((s) => s.group);

  const league = useMemo(() => computeLeagueState(history, weightKg), [history, weightKg]);
  const next = nextTierInfo(league.points);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>League</Text>
        <TierBadge tier={league.tier} size="lg" />
        <Text style={styles.points}>{Math.round(league.points)} / 100 points</Text>
        {next ? (
          <Text style={styles.nextTier}>
            {Math.max(0, Math.round(next.minPoints - league.points))} points to {next.tier}
          </Text>
        ) : (
          <Text style={styles.nextTier}>Top tier reached.</Text>
        )}

        <View style={styles.breakdownCard}>
          <BreakdownBar label="Volume" value={league.breakdown.volumeScore} max={40} />
          <BreakdownBar label="Frequency" value={league.breakdown.frequencyScore} max={30} />
          <BreakdownBar
            label="Relative Strength"
            value={league.breakdown.relativeStrengthScore}
            max={30}
          />
        </View>

        <Pressable
          style={styles.groupCard}
          onPress={() => navigation.navigate(group ? 'GroupLeaderboard' : 'GroupCreateJoin')}
        >
          <Text style={styles.groupCardTitle}>{group ? group.name ?? 'Your Group' : 'Join a Group'}</Text>
          <Text style={styles.groupCardSubtitle}>
            {group
              ? `${group.members.length} member${group.members.length === 1 ? '' : 's'} · tap to view leaderboard`
              : 'Create or join a group to compare tiers with friends'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function BreakdownBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percent = Math.max(0, Math.min(1, value / max));
  return (
    <View style={styles.barRow}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>
          {Math.round(value)} / {max}
        </Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${percent * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  points: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: spacing.md,
  },
  nextTier: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  barRow: {
    gap: spacing.xs,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  barValue: {
    color: colors.textMuted,
    fontSize: 12,
  },
  barTrack: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  groupCardTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  groupCardSubtitle: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 12,
  },
});
