import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/spacing';

interface PRCelebrationProps {
  count: number;
}

const { width } = Dimensions.get('window');

export function PRCelebration({ count }: PRCelebrationProps) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <ConfettiCannon
        count={140}
        origin={{ x: width / 2, y: 0 }}
        fadeOut
        autoStart
        fallSpeed={2600}
      />
      <View style={styles.banner}>
        <Text style={styles.title}>New Personal Record{count > 1 ? 's' : ''}!</Text>
        <Text style={styles.subtitle}>
          {count} PR{count > 1 ? 's' : ''} set this session — keep pushing.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  banner: {
    backgroundColor: colors.accentMuted,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  title: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
