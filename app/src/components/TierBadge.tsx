import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LeagueTier, LEAGUE_TIER_LABELS } from '../models/league';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';

const TIER_COLORS: Record<LeagueTier, string> = {
  bronze: colors.tierBronze,
  silver: colors.tierSilver,
  gold: colors.tierGold,
  platinum: colors.tierPlatinum,
};

interface TierBadgeProps {
  tier: LeagueTier;
  size?: 'sm' | 'lg';
}

export function TierBadge({ tier, size = 'sm' }: TierBadgeProps) {
  const color = TIER_COLORS[tier];
  return (
    <View
      style={[
        styles.badge,
        { borderColor: color, backgroundColor: `${color}22` },
        size === 'lg' && styles.badgeLg,
      ]}
    >
      <Text style={[styles.text, { color }, size === 'lg' && styles.textLg]}>
        {LEAGUE_TIER_LABELS[tier]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  badgeLg: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  text: {
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  textLg: {
    fontSize: 18,
  },
});
