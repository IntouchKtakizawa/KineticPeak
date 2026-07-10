import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LeagueStackParamList } from '../../navigation/LeagueStack';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { useProfileStore } from '../../store/useProfileStore';
import { computeLeagueState } from '../../services/league/computeLeague';
import { TIER_THRESHOLDS, TOTAL_POINTS_MAX } from '../../services/league/leagueConfig';
import { TierBadge } from '../../components/TierBadge';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<LeagueStackParamList, 'LeagueTiers'>;

export function LeagueTiersScreen({ navigation }: Props) {
  const history = useWorkoutStore((s) => s.history);
  const weightKg = useProfileStore((s) => s.profile.weightKg);
  const league = useMemo(() => computeLeagueState(history, weightKg), [history, weightKg]);

  // TIER_THRESHOLDS is sorted highest-first (platinum...bronze); keep that order for the ladder.
  const rows = TIER_THRESHOLDS.map((entry, index) => {
    const maxPoints = index === 0 ? TOTAL_POINTS_MAX : TIER_THRESHOLDS[index - 1].minPoints - 1;
    return { ...entry, maxPoints };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>
        <Text style={styles.heading}>League Ranks</Text>
        <Text style={styles.subheading}>
          {rows.length} ranks total, from Bronze up to Platinum. Your tier is based on a rolling
          28-day blend of volume, frequency, and relative strength.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {rows.map((row) => {
          const isCurrent = row.tier === league.tier;
          return (
            <View key={row.tier} style={[styles.row, isCurrent && styles.rowCurrent]}>
              <TierBadge tier={row.tier} size="lg" />
              <View style={styles.rowInfo}>
                <Text style={styles.rangeText}>
                  {row.minPoints} – {row.maxPoints} pts
                </Text>
                {isCurrent ? <Text style={styles.currentLabel}>You are here</Text> : null}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
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
  subheading: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  rowCurrent: {
    borderColor: colors.accent,
    backgroundColor: colors.accentMuted,
  },
  rowInfo: {
    flex: 1,
  },
  rangeText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  currentLabel: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
});
