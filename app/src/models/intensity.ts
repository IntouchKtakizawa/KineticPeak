export type RelativeIntensityLabel = 'too_light' | 'light' | 'optimal' | 'heavy' | 'too_heavy';

export interface RelativeIntensityResult {
  percent1RM: number;
  label: RelativeIntensityLabel;
  message: string;
  isEstimate: boolean;
}

export const RELATIVE_INTENSITY_LABELS: Record<RelativeIntensityLabel, string> = {
  too_light: 'Too Light',
  light: 'Light',
  optimal: 'Optimal',
  heavy: 'Heavy',
  too_heavy: 'Too Heavy',
};
