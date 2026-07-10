import { MuscleGroup } from './exercise';

export interface MuscleFreshness {
  muscleGroup: MuscleGroup;
  freshness: number;
  lastTrainedAt: string | null;
}
