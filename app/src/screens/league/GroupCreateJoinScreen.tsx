import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LeagueStackParamList } from '../../navigation/LeagueStack';
import { useProfileStore } from '../../store/useProfileStore';
import { useGroupStore } from '../../store/useGroupStore';
import { createGroup, isGroupSyncAvailable, joinGroup } from '../../services/sync/groupClient';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<LeagueStackParamList, 'GroupCreateJoin'>;

export function GroupCreateJoinScreen({ navigation }: Props) {
  const profile = useProfileStore((s) => s.profile);
  const setGroup = useGroupStore((s) => s.setGroup);

  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connected = isGroupSyncAvailable();

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const group = await createGroup({
        userId: profile.userId,
        displayName: profile.displayName,
        groupName: groupName.trim() || undefined,
      });
      setGroup(group);
      navigation.replace('GroupLeaderboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      const group = await joinGroup({
        inviteCode: inviteCode.trim().toUpperCase(),
        userId: profile.userId,
        displayName: profile.displayName,
      });
      setGroup(group);
      navigation.replace('GroupLeaderboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group.');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.heading}>Group Leaderboard</Text>
        <Text style={styles.helper}>
          Not connected to a server. Groups let you compare league tiers with friends, but this is
          fully optional — everything else in KineticPeak keeps working single-player without it.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Start or Join a Group</Text>
      <Text style={styles.helper}>
        Only your league tier and points are shared — your workout logs stay on your device.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create a group</Text>
        <TextInput
          style={styles.input}
          placeholder="Group name (optional)"
          placeholderTextColor={colors.textMuted}
          value={groupName}
          onChangeText={setGroupName}
        />
        <Pressable style={styles.cta} onPress={handleCreate} disabled={loading}>
          <Text style={styles.ctaText}>Create Group</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Join with an invite code</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. AB23CD"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="characters"
          value={inviteCode}
          onChangeText={setInviteCode}
        />
        <Pressable style={styles.cta} onPress={handleJoin} disabled={loading || !inviteCode.trim()}>
          <Text style={styles.ctaText}>Join Group</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  helper: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  ctaText: {
    color: colors.background,
    fontWeight: '700',
  },
  error: {
    color: colors.danger,
    marginTop: spacing.sm,
  },
});
