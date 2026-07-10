import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useProfileStore } from '../../store/useProfileStore';
import { Sex } from '../../models/profile';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Biometrics'>;

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unspecified', label: 'Prefer not to say' },
];

export function BiometricsScreen({ navigation }: Props) {
  const completeBiometrics = useProfileStore((s) => s.completeBiometrics);
  const [displayName, setDisplayName] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [sex, setSex] = useState<Sex>('unspecified');

  const heightValue = parseFloat(heightCm);
  const weightValue = parseFloat(weightKg);
  const canContinue =
    displayName.trim().length > 0 &&
    Number.isFinite(heightValue) &&
    heightValue > 0 &&
    Number.isFinite(weightValue) &&
    weightValue > 0;

  const handleContinue = () => {
    completeBiometrics({
      displayName: displayName.trim(),
      heightCm: heightValue,
      weightKg: weightValue,
      sex,
      dateOfBirth: null,
    });
    navigation.navigate('AthletesCode');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Tell us about you</Text>
        <Text style={styles.helper}>
          We use this to scale relative intensity and league scoring to your profile.
        </Text>

        <Text style={styles.fieldLabel}>Display name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="e.g. Alex"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.fieldLabel}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={heightCm}
          onChangeText={setHeightCm}
          keyboardType="numeric"
          placeholder="175"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.fieldLabel}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={weightKg}
          onChangeText={setWeightKg}
          keyboardType="numeric"
          placeholder="75"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.fieldLabel}>Sex</Text>
        <View style={styles.segmented}>
          {SEX_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[styles.segment, sex === option.value && styles.segmentActive]}
              onPress={() => setSex(option.value)}
            >
              <Text style={[styles.segmentText, sex === option.value && styles.segmentTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Pressable
        style={[styles.cta, !canContinue && styles.ctaDisabled]}
        onPress={handleContinue}
        disabled={!canContinue}
      >
        <Text style={styles.ctaText}>Continue</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  helper: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
  },
  segmented: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accent,
  },
  segmentText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  segmentTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
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
