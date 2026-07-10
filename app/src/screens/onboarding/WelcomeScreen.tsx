import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>KineticPeak</Text>
        <Text style={styles.subtitle}>Elevating Your Performance, One Set at a Time.</Text>
      </View>
      <Pressable style={styles.cta} onPress={() => navigation.navigate('Biometrics')}>
        <Text style={styles.ctaText}>Get Started</Text>
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
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'flex-start',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: spacing.sm,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaText: {
    color: colors.background,
    fontSize: 17,
    fontWeight: '700',
  },
});
