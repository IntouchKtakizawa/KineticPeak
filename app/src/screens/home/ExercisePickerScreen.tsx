import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/HomeStack';
import { EXERCISES } from '../../data/exercises';
import { MUSCLE_GROUP_LABELS, MuscleGroup } from '../../models/exercise';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

type Props = NativeStackScreenProps<HomeStackParamList, 'ExercisePicker'>;

const MUSCLE_FILTERS = Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[];

export function ExercisePickerScreen({ navigation }: Props) {
  const addExerciseToSession = useWorkoutStore((s) => s.addExerciseToSession);
  const [query, setQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | null>(null);

  const results = useMemo(() => {
    return EXERCISES.filter((exercise) => {
      const matchesQuery = exercise.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesMuscle = !muscleFilter || exercise.primaryMuscles.includes(muscleFilter);
      return matchesQuery && matchesMuscle;
    });
  }, [query, muscleFilter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TextInput
          style={styles.search}
          placeholder="Search exercises"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
        data={MUSCLE_FILTERS}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.chip, muscleFilter === item && styles.chipActive]}
            onPress={() => setMuscleFilter(muscleFilter === item ? null : item)}
          >
            <Text style={[styles.chipText, muscleFilter === item && styles.chipTextActive]}>
              {MUSCLE_GROUP_LABELS[item]}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.exerciseRow}
            onPress={() => {
              addExerciseToSession(item.id);
              navigation.goBack();
            }}
          >
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseMuscles}>
              {item.primaryMuscles.map((m) => MUSCLE_GROUP_LABELS[m]).join(', ')}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
  },
  chipsRow: {
    marginTop: spacing.sm,
    flexGrow: 0,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  exerciseRow: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  exerciseName: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  exerciseMuscles: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 12,
  },
});
