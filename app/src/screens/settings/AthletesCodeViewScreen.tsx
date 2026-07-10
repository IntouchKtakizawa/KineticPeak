import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../../navigation/SettingsStack';
import { useProfileStore } from '../../store/useProfileStore';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<SettingsStackParamList, 'AthletesCodeView'>;

export function AthletesCodeViewScreen({ navigation }: Props) {
  const profile = useProfileStore((s) => s.profile);
  const acceptPledge = useProfileStore((s) => s.acceptPledge);
  const needsPledgeReview = useProfileStore((s) => s.needsPledgeReview());
  const [reaffirmed, setReaffirmed] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      <Text style={styles.heading}>The Athlete's Code</Text>
      <Text style={styles.body}>
        KineticPeak's leaderboards and PRs only mean something if the numbers behind them are
        real. Before you log your first set, make one commitment to yourself and the community.
      </Text>

      <View style={styles.pledgeCard}>
        <Text style={styles.pledgeText}>"I'm in, I'll train and log with honesty"</Text>
        {profile.pledge.acceptedAt ? (
          <Text style={styles.acceptedAt}>
            Accepted on {new Date(profile.pledge.acceptedAt).toDateString()}
          </Text>
        ) : null}
      </View>

      {needsPledgeReview && !reaffirmed ? (
        <Pressable
          style={styles.cta}
          onPress={() => {
            acceptPledge();
            setReaffirmed(true);
          }}
        >
          <Text style={styles.ctaText}>Re-affirm the Code</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
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
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  pledgeCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  pledgeText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  acceptedAt: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  ctaText: {
    color: colors.background,
    fontWeight: '700',
  },
});
