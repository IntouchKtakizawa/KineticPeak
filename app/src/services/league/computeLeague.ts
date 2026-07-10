import { WorkoutSession } from '../../models/workout';
import { LeagueState } from '../../models/league';
import { epley1RM } from '../../models/pr';
import {
  CORE_LIFT_EXERCISE_IDS,
  FREQUENCY_SCORE_MAX,
  FREQUENCY_SESSIONS_FOR_MAX,
  LEAGUE_WINDOW_DAYS,
  RELATIVE_STRENGTH_RATIO_FOR_MAX,
  RELATIVE_STRENGTH_SCORE_MAX,
  tierForPoints,
  VOLUME_BODYWEIGHT_MULTIPLIER_FOR_MAX,
  VOLUME_SCORE_MAX,
} from './leagueConfig';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function computeLeagueState(
  sessions: WorkoutSession[],
  bodyweightKg: number,
  now: Date = new Date()
): LeagueState {
  const cutoff = now.getTime() - LEAGUE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const windowSessions = sessions.filter((s) => new Date(s.startedAt).getTime() >= cutoff);

  const totalVolumeKg = windowSessions.reduce(
    (sum, session) =>
      sum +
      session.sets
        .filter((s) => !s.isWarmup)
        .reduce((setSum, s) => setSum + s.weightKg * s.reps, 0),
    0
  );

  const volumeScore =
    bodyweightKg > 0
      ? clamp(
          (totalVolumeKg / (bodyweightKg * VOLUME_BODYWEIGHT_MULTIPLIER_FOR_MAX)) * VOLUME_SCORE_MAX,
          0,
          VOLUME_SCORE_MAX
        )
      : 0;

  const frequencyScore = clamp(
    (windowSessions.length / FREQUENCY_SESSIONS_FOR_MAX) * FREQUENCY_SCORE_MAX,
    0,
    FREQUENCY_SCORE_MAX
  );

  const bestE1RMByExercise = new Map<string, number>();
  for (const session of windowSessions) {
    for (const set of session.sets) {
      if (set.isWarmup) continue;
      if (!CORE_LIFT_EXERCISE_IDS.includes(set.exerciseId)) continue;
      const e1rm = epley1RM(set.weightKg, set.reps);
      const current = bestE1RMByExercise.get(set.exerciseId) ?? 0;
      if (e1rm > current) bestE1RMByExercise.set(set.exerciseId, e1rm);
    }
  }

  let relativeStrengthScore = 0;
  if (bodyweightKg > 0 && bestE1RMByExercise.size > 0) {
    const ratios = Array.from(bestE1RMByExercise.values()).map((e1rm) => e1rm / bodyweightKg);
    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    relativeStrengthScore = clamp(
      (avgRatio / RELATIVE_STRENGTH_RATIO_FOR_MAX) * RELATIVE_STRENGTH_SCORE_MAX,
      0,
      RELATIVE_STRENGTH_SCORE_MAX
    );
  }

  const points = volumeScore + frequencyScore + relativeStrengthScore;

  return {
    points,
    tier: tierForPoints(points),
    computedAt: now.toISOString(),
    breakdown: { volumeScore, frequencyScore, relativeStrengthScore },
  };
}
