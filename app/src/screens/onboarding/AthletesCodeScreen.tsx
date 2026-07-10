import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useProfileStore } from '../../store/useProfileStore';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'AthletesCode'>;

export function AthletesCodeScreen({}: Props) {
  const acceptPledge = useProfileStore((s) => s.acceptPledge);
  const finishOnboarding = useProfileStore((s) => s.finishOnboarding);
  const [checked, setChecked] = useState(false);

  const handleConfirm = () => {
    acceptPledge();
    finishOnboarding();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>The Athlete's Code</Text>
        <Text style={styles.body}>
          KineticPeak's leaderboards and PRs only mean something if the numbers behind them are
          real. Before you log your first set, make one commitment to yourself and the community.
        </Text>

        <Pressable style={styles.pledgeRow} onPress={() => setChecked((v) => !v)}>
          <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.pledgeText}>I'm in, I'll train and log with honesty</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.cta, !checked && styles.ctaDisabled]}
        onPress={handleConfirm}
        disabled={!checked}
      >
        <Text style={styles.ctaText}>Confirm</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  body: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  pledgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkmark: {
    color: colors.background,
    fontWeight: '900',
  },
  pledgeText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
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
