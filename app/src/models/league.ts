export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LeagueBreakdown {
  volumeScore: number;
  frequencyScore: number;
  relativeStrengthScore: number;
}

export interface LeagueState {
  points: number;
  tier: LeagueTier;
  computedAt: string;
  breakdown: LeagueBreakdown;
}

export const LEAGUE_TIER_LABELS: Record<LeagueTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};
