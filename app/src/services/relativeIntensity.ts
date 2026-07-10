import { Exercise } from '../models/exercise';
import { RelativeIntensityLabel, RelativeIntensityResult } from '../models/intensity';
import { epley1RM } from '../models/pr';
import { usePRStore } from '../store/usePRStore';

function labelForPercent(percent: number): RelativeIntensityLabel {
  if (percent < 50) return 'too_light';
  if (percent < 70) return 'light';
  if (percent < 85) return 'optimal';
  if (percent < 95) return 'heavy';
  return 'too_heavy';
}

const MESSAGES: Record<RelativeIntensityLabel, string> = {
  too_light: "That's a warm-up load — plenty of room to add weight.",
  light: 'Good volume-building range for extra reps.',
  optimal: 'Solid working weight for strength and hypertrophy.',
  heavy: 'Heavy — you are pushing near your limits today.',
  too_heavy: 'Max-effort territory — make sure your form and spotter are dialed in.',
};

// Suggested starting %-of-bodyweight for compound lifts when no e1RM history exists yet.
const BODYWEIGHT_MULTIPLIER_ESTIMATE: Record<string, number> = {
  'back-squat': 0.75,
  'barbell-bench-press': 0.5,
  deadlift: 1.0,
  'overhead-press': 0.35,
};

export function evaluateRelativeIntensity(
  exercise: Exercise,
  weightKg: number,
  reps: number,
  bodyweightKg: number
): RelativeIntensityResult {
  const best = usePRStore.getState().bestFor(exercise.id, 'e1rm');

  if (best && best.value > 0) {
    const attemptedE1RM = epley1RM(weightKg, reps);
    const percent1RM = (attemptedE1RM / best.value) * 100;
    return {
      percent1RM,
      label: labelForPercent(percent1RM),
      message: MESSAGES[labelForPercent(percent1RM)],
      isEstimate: false,
    };
  }

  const multiplier = BODYWEIGHT_MULTIPLIER_ESTIMATE[exercise.id] ?? 0.4;
  const estimatedE1RM = bodyweightKg > 0 ? bodyweightKg * multiplier : weightKg;
  const attemptedE1RM = epley1RM(weightKg, reps);
  const percent1RM = estimatedE1RM > 0 ? (attemptedE1RM / estimatedE1RM) * 100 : 100;
  const label = labelForPercent(percent1RM);
  return {
    percent1RM,
    label,
    message: `${MESSAGES[label]} (estimated from bodyweight — log a few sessions for a personalized estimate.)`,
    isEstimate: true,
  };
}
