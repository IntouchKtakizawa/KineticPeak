export interface SetEntry {
  id: string;
  exerciseId: string;
  setIndex: number;
  weightKg: number;
  reps: number;
  rpe?: number;
  isWarmup: boolean;
  completedAt: string;
  restTakenSeconds?: number;
}

export interface WorkoutSession {
  id: string;
  startedAt: string;
  endedAt: string | null;
  sets: SetEntry[];
  notes?: string;
  bodyweightKg?: number;
}

export function createSession(): WorkoutSession {
  return {
    id: `session_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
    startedAt: new Date().toISOString(),
    endedAt: null,
    sets: [],
  };
}

export function sessionVolumeLoadKg(session: WorkoutSession): number {
  return session.sets
    .filter((s) => !s.isWarmup)
    .reduce((sum, s) => sum + s.weightKg * s.reps, 0);
}

export function sessionWorkCapacity(session: WorkoutSession): number {
  return session.sets.filter((s) => !s.isWarmup).length;
}
