import { WorkoutSession, SetEntry } from '../models/workout';
import { Exercise } from '../models/exercise';
import { epley1RM } from '../models/pr';

export type ProgressionMethod = 'linear' | 'double' | 'deload' | 'maintain';

export interface ProgressionSuggestion {
  weightKg: number;
  reps: number;
  method: ProgressionMethod;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Analyzes recent history for an exercise and suggests the next working set.
 * Designed for dumbbell/barbell progression with practical increments.
 */
export function suggestNextSet(
  exercise: Exercise,
  history: WorkoutSession[],
  currentSessionSets: SetEntry[],
  bodyweightKg: number,
  options: {
    /** Minimum sessions before we trust the trend */
    minSessions?: number;
    /** Dumbbell increment in kg (default 2.5) */
    dumbbellIncrement?: number;
    /** Barbell increment in kg (default 2.5) */
    barbellIncrement?: number;
    /** Target rep range for double progression [min, max] */
    targetRepRange?: [number, number];
  } = {}
): ProgressionSuggestion | null {
  const {
    minSessions = 2,
    dumbbellIncrement = 2.5,
    barbellIncrement = 2.5,
    targetRepRange = [6, 10],
  } = options;

  // Get completed working sets (non-warmup) from recent sessions, newest first
  const recentSets: Array<{ session: WorkoutSession; set: SetEntry }> = [];
  for (const session of history) {
    for (const set of session.sets) {
      if (set.exerciseId === exercise.id && set.completed && !set.isWarmup) {
        recentSets.push({ session, set });
        if (recentSets.length >= 9) break; // 3 sessions × 3 sets max
      }
    }
    if (recentSets.length >= 9) break;
  }

  if (recentSets.length < minSessions) {
    return {
      weightKg: currentSessionSets[0]?.weightKg ?? 0,
      reps: currentSessionSets[0]?.reps ?? targetRepRange[0],
      method: 'maintain',
      reasoning: 'Not enough history yet — stick with current weight/reps.',
      confidence: 'low',
    };
  }

  // Determine increment based on exercise category
  const increment = exercise.category === 'dumbbell' ? dumbbellIncrement : barbellIncrement;

  // Compute e1RM for each recent set
  const e1rms = recentSets.map(({ set }) => epley1RM(set.weightKg, set.reps));

  // --- Detect trend: compare oldest vs newest 3-set block ---
  const blockSize = 3;
  const recentBlock = e1rms.slice(0, blockSize);
  const previousBlock = e1rms.slice(blockSize, blockSize * 2);

  let avgRecent = recentBlock.reduce((a, b) => a + b, 0) / recentBlock.length;
  let avgPrevious = previousBlock.length > 0
    ? previousBlock.reduce((a, b) => a + b, 0) / previousBlock.length
    : avgRecent;

  const e1rmDelta = avgRecent - avgPrevious;
  const e1rmDeltaPct = avgPrevious > 0 ? (e1rmDelta / avgPrevious) * 100 : 0;

  // --- Also check RPE trend if available ---
  const recentRPEs = recentSets
    .slice(0, blockSize)
    .map(({ set }) => set.rpe)
    .filter((r): r is number => r !== undefined);

  let avgRPE: number | null = null;
  if (recentRPEs.length >= 2) {
    avgRPE = recentRPEs.reduce((a, b) => a + b, 0) / recentRPEs.length;
  }

  // --- Current session's last completed set for this exercise ---
  const currentExerciseSets = currentSessionSets
    .filter((s) => s.exerciseId === exercise.id && s.completed && !s.isWarmup)
    .sort((a, b) => a.setIndex - b.setIndex);

  const lastCurrentSet = currentExerciseSets[currentExerciseSets.length - 1];
  const currentWeight = lastCurrentSet?.weightKg ?? recentSets[0].set.weightKg;
  const currentReps = lastCurrentSet?.reps ?? recentSets[0].set.reps;

  // --- Decision logic ---

  // 1. DELLOAD: e1RM declining or stagnant for 2+ blocks (6+ sessions)
  if (e1rmDeltaPct <= -2 || (e1rmDeltaPct < 1 && recentSets.length >= 6)) {
    const deloadWeight = roundToIncrement(currentWeight * 0.9, increment);
    return {
      weightKg: Math.max(deloadWeight, increment),
      reps: targetRepRange[1], // higher reps at lower weight
      method: 'deload',
      reasoning: `e1RM trend ${e1rmDeltaPct >= 0 ? 'flat' : 'down'} (${e1rmDeltaPct.toFixed(1)}%). Deload 10%, rebuild volume.`,
      confidence: recentSets.length >= 6 ? 'high' : 'medium',
    };
  }

  // 2. LINEAR PROGRESSION: e1RM rising steadily, RPE manageable
  const canAddWeight = e1rmDeltaPct > 2 && (avgRPE === null || avgRPE <= 8.5);
  if (canAddWeight) {
    const nextWeight = roundToIncrement(currentWeight + increment, increment);
    return {
      weightKg: nextWeight,
      reps: Math.max(targetRepRange[0], currentReps - 1), // drop 1 rep to accommodate weight jump
      method: 'linear',
      reasoning: `e1RM up ${e1rmDeltaPct.toFixed(1)}% over last ${blockSize} sessions. Add ${increment}kg, target ${targetRepRange[0]}–${targetRepRange[1]} reps.`,
      confidence: 'high',
    };
  }

  // 3. DOUBLE PROGRESSION: add reps until top of range, then add weight
  if (currentReps < targetRepRange[1]) {
    return {
      weightKg: currentWeight,
      reps: currentReps + 1,
      method: 'double',
      reasoning: `Build reps toward ${targetRepRange[1]} before adding weight.`,
      confidence: 'high',
    };
  }

  // 4. At top of rep range — try adding weight if RPE allows
  if (avgRPE === null || avgRPE <= 8) {
    const nextWeight = roundToIncrement(currentWeight + increment, increment);
    return {
      weightKg: nextWeight,
      reps: targetRepRange[0],
      method: 'double',
      reasoning: `Hit ${targetRepRange[1]} reps. Add ${increment}kg, reset to ${targetRepRange[0]} reps.`,
      confidence: 'medium',
    };
  }

  // 5. MAINTAIN: RPE too high, hold weight
  return {
    weightKg: currentWeight,
    reps: currentReps,
    method: 'maintain',
    reasoning: `RPE ${avgRPE?.toFixed(1) ?? 'N/A'} — hold weight, focus on form.`,
    confidence: 'medium',
  };
}

/** Round to nearest increment (e.g., 2.5kg), minimum 1 increment */
function roundToIncrement(value: number, increment: number): number {
  return Math.max(increment, Math.round(value / increment) * increment);
}

/**
 * Suggests a full workout's starting weights based on history.
 * Returns a map of exerciseId -> { weightKg, reps } for first working set.
 */
export function suggestWorkoutStartingWeights(
  exerciseIds: string[],
  exercises: Exercise[],
  history: WorkoutSession[],
  bodyweightKg: number
): Map<string, { weightKg: number; reps: number }> {
  const suggestions = new Map<string, { weightKg: number; reps: number }>();

  for (const exerciseId of exerciseIds) {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise) continue;

    const suggestion = suggestNextSet(exercise, history, [], bodyweightKg);
    if (suggestion) {
      suggestions.set(exerciseId, { weightKg: suggestion.weightKg, reps: suggestion.reps });
    }
  }

  return suggestions;
}