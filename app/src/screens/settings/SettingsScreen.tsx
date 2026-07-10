import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../../navigation/SettingsStack';
import { useProfileStore } from '../../store/useProfileStore';
import { Sex } from '../../models/profile';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unspecified', label: 'N/A' },
];

export function SettingsScreen({ navigation }: Props) {
  const profile = useProfileStore((s) => s.profile);
  const updateBiometrics = useProfileStore((s) => s.updateBiometrics);
  const setRestTimerOverride = useProfileStore((s) => s.setRestTimerOverride);

  const [heightCm, setHeightCm] = useState(String(profile.heightCm));
  const [weightKg, setWeightKg] = useState(String(profile.weightKg));
  const [sex, setSex] = useState<Sex>(profile.sex);
  const [useCustomRest, setUseCustomRest] = useState(profile.restTimerOverrideSeconds !== null);
  const [customRestSeconds, setCustomRestSeconds] = useState(
    String(profile.restTimerOverrideSeconds ?? 90)
  );

  const handleSaveBiometrics = () => {
    const height = parseFloat(heightCm);
    const weight = parseFloat(weightKg);
    if (Number.isFinite(height) && height > 0 && Number.isFinite(weight) && weight > 0) {
      updateBiometrics({ heightCm: height, weightKg: weight, sex });
    }
  };

  const handleToggleCustomRest = (value: boolean) => {
    setUseCustomRest(value);
    if (!value) {
      setRestTimerOverride(null);
    } else {
      const seconds = parseInt(customRestSeconds, 10);
      setRestTimerOverride(Number.isFinite(seconds) && seconds > 0 ? seconds : 90);
    }
  };

  const handleCustomRestBlur = () => {
    if (!useCustomRest) return;
    const seconds = parseInt(customRestSeconds, 10);
    setRestTimerOverride(Number.isFinite(seconds) && seconds > 0 ? seconds : 90);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Settings</Text>

        <Text style={styles.sectionTitle}>Biometrics</Text>
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={heightCm}
            onChangeText={setHeightCm}
            onBlur={handleSaveBiometrics}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.fieldLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weightKg}
            onChangeText={setWeightKg}
            onBlur={handleSaveBiometrics}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.fieldLabel}>Sex</Text>
          <View style={styles.segmented}>
            {SEX_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[styles.segment, sex === option.value && styles.segmentActive]}
                onPress={() => {
                  setSex(option.value);
                  updateBiometrics({
                    heightCm: parseFloat(heightCm) || profile.heightCm,
                    weightKg: parseFloat(weightKg) || profile.weightKg,
                    sex: option.value,
                  });
                }}
              >
                <Text style={[styles.segmentText, sex === option.value && styles.segmentTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Rest Timer</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.fieldLabel}>Use a custom default</Text>
            <Switch value={useCustomRest} onValueChange={handleToggleCustomRest} />
          </View>
          {useCustomRest ? (
            <TextInput
              style={styles.input}
              value={customRestSeconds}
              onChangeText={setCustomRestSeconds}
              onBlur={handleCustomRestBlur}
              keyboardType="numeric"
              placeholder="Seconds"
              placeholderTextColor={colors.textMuted}
            />
          ) : (
            <Text style={styles.helper}>
              Rest duration defaults to each exercise's recommended rest.
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Community</Text>
        <Pressable style={styles.card} onPress={() => navigation.navigate('AthletesCodeView')}>
          <Text style={styles.linkText}>View the Athlete's Code →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontSize: 13,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helper: {
    color: colors.textMuted,
    fontSize: 12,
  },
  linkText: {
    color: colors.accent,
    fontWeight: '700',
  },
});
