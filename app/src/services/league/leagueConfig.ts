import { LeagueTier } from '../../models/league';

export const LEAGUE_WINDOW_DAYS = 28;

export const VOLUME_SCORE_MAX = 40;
export const FREQUENCY_SCORE_MAX = 30;
export const RELATIVE_STRENGTH_SCORE_MAX = 30;
export const TOTAL_POINTS_MAX = VOLUME_SCORE_MAX + FREQUENCY_SCORE_MAX + RELATIVE_STRENGTH_SCORE_MAX;

// Total volume (kg) as a multiple of bodyweight, over the window, that earns full volume score.
export const VOLUME_BODYWEIGHT_MULTIPLIER_FOR_MAX = 100;

// Sessions in the window that earn full frequency score (4x/week for 4 weeks).
export const FREQUENCY_SESSIONS_FOR_MAX = 16;

// Average (best e1RM / bodyweight) across tracked compound lifts that earns full relative-strength score.
export const RELATIVE_STRENGTH_RATIO_FOR_MAX = 6.0;

export const TIER_THRESHOLDS: { tier: LeagueTier; minPoints: number }[] = [
  { tier: 'platinum', minPoints: 85 },
  { tier: 'gold', minPoints: 65 },
  { tier: 'silver', minPoints: 40 },
  { tier: 'bronze', minPoints: 0 },
];

export const CORE_LIFT_EXERCISE_IDS = ['back-squat', 'barbell-bench-press', 'deadlift', 'overhead-press'];

export function tierForPoints(points: number): LeagueTier {
  const match = TIER_THRESHOLDS.find((t) => points >= t.minPoints);
  return match?.tier ?? 'bronze';
}
