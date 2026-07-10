import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LeagueStackParamList } from '../../navigation/LeagueStack';
import { useGroupStore } from '../../store/useGroupStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { computeLeagueState } from '../../services/league/computeLeague';
import { fetchGroupLeaderboard, pushGroupStats } from '../../services/sync/groupClient';
import { TierBadge } from '../../components/TierBadge';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<LeagueStackParamList, 'GroupLeaderboard'>;

export function GroupLeaderboardScreen({ navigation }: Props) {
  const group = useGroupStore((s) => s.group);
  const setMembers = useGroupStore((s) => s.setMembers);
  const markSynced = useGroupStore((s) => s.markSynced);
  const leaveGroup = useGroupStore((s) => s.leaveGroup);
  const profile = useProfileStore((s) => s.profile);
  const history = useWorkoutStore((s) => s.history);

  const [refreshing, setRefreshing] = useState(false);

  const league = useMemo(
    () => computeLeagueState(history, profile.weightKg),
    [history, profile.weightKg]
  );

  const refresh = useCallback(async () => {
    if (!group) return;
    setRefreshing(true);
    try {
      await pushGroupStats(group.groupId, { userId: profile.userId, league });
      const result = await fetchGroupLeaderboard(group.groupId);
      setMembers(result.members);
      markSynced();
    } catch {
      // Leave last-known leaderboard state in place if the sync fails.
    } finally {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group?.groupId, profile.userId, league.points]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  if (!group) {
    navigation.replace('GroupCreateJoin');
    return null;
  }

  const sortedMembers = [...group.members].sort((a, b) => b.points - a.points);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>{group.name ?? 'Your Group'}</Text>
        <Text style={styles.inviteCode}>Invite code: {group.inviteCode}</Text>
      </View>

      <FlatList
        data={sortedMembers}
        keyExtractor={(item) => item.userId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        renderItem={({ item, index }) => (
          <View style={styles.memberRow}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>
                {item.displayName}
                {item.userId === profile.userId ? ' (you)' : ''}
              </Text>
              <Text style={styles.memberPoints}>{Math.round(item.points)} pts</Text>
            </View>
            <TierBadge tier={item.tier} />
          </View>
        )}
      />

      <Pressable
        style={styles.leaveButton}
        onPress={() => {
          leaveGroup();
          navigation.replace('GroupCreateJoin');
        }}
      >
        <Text style={styles.leaveButtonText}>Leave Group</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: 0,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  inviteCode: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  rank: {
    color: colors.textMuted,
    fontWeight: '700',
    width: 28,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  memberPoints: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  leaveButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  leaveButtonText: {
    color: colors.danger,
    fontWeight: '600',
  },
});
