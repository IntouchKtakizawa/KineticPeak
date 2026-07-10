export interface SetEntry {
  id: string;
  exerciseId: string;
  setIndex: number; // 0-based position among this exercise's sets in the session
  weightKg: number;
  reps: number;
  rpe?: number;
  isWarmup: boolean;
  completed: boolean;
  completedAt: string;
  restTakenSeconds?: number;
}

export interface WorkoutSession {
  id: string;
  startedAt: string;
  endedAt: string | null;
  exerciseIds: string[]; // order exercises were added to the session
  exerciseNotes: Record<string, string>;
  sets: SetEntry[];
  notes?: string;
  bodyweightKg?: number;
}

export function createSession(): WorkoutSession {
  return {
    id: `session_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
    startedAt: new Date().toISOString(),
    endedAt: null,
    exerciseIds: [],
    exerciseNotes: {},
    sets: [],
  };
}

function committedSets(session: WorkoutSession): SetEntry[] {
  return session.sets.filter((s) => s.completed && !s.isWarmup);
}

export function sessionVolumeLoadKg(session: WorkoutSession): number {
  return committedSets(session).reduce((sum, s) => sum + s.weightKg * s.reps, 0);
}

export function sessionWorkCapacity(session: WorkoutSession): number {
  return committedSets(session).length;
}

export function findMostRecentSet(
  history: WorkoutSession[],
  exerciseId: string,
  setIndex: number
): SetEntry | undefined {
  for (const session of history) {
    const match = session.sets
      .filter((s) => s.exerciseId === exerciseId && s.setIndex === setIndex && s.completed)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
    if (match) return match;
  }
  return undefined;
}
