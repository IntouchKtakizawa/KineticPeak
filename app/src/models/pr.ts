export type PRType = 'e1rm' | 'weight' | 'reps' | 'volume_single_set';

export interface PRRecord {
  id: string;
  exerciseId: string;
  type: PRType;
  value: number;
  achievedAt: string;
  sourceSetId: string;
  previousValue: number | null;
}

export function epley1RM(weightKg: number, reps: number): number {
  if (reps <= 1) return weightKg;
  return weightKg * (1 + reps / 30);
}
