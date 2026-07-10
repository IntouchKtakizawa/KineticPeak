import { Exercise, MuscleGroup } from '../../models/exercise';
import { MuscleFreshness } from '../../models/physique';
import { WorkoutSession } from '../../models/workout';
import { findExerciseById } from '../../data/exercises';

const HALF_LIFE_HOURS = 72;
const LOOKBACK_DAYS = 28;
const ALL_MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'front_delts', 'side_delts', 'rear_delts', 'lats', 'traps',
  'lower_back', 'biceps', 'triceps', 'forearms', 'abs', 'obliques',
  'glutes', 'quads', 'hamstrings', 'calves',
];

interface MuscleStimulusEvent {
  volumeKg: number;
  occurredAt: string;
}

function decayFactor(hoursSince: number): number {
  return Math.pow(0.5, hoursSince / HALF_LIFE_HOURS);
}

export function computeMuscleFreshness(
  sessions: WorkoutSession[],
  now: Date = new Date()
): MuscleFreshness[] {
  const cutoff = now.getTime() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const eventsByMuscle = new Map<MuscleGroup, MuscleStimulusEvent[]>();
  const totalSetVolumeByMuscle = new Map<MuscleGroup, number[]>();

  for (const session of sessions) {
    for (const set of session.sets) {
      if (set.isWarmup) continue;
      const completedAtMs = new Date(set.completedAt).getTime();
      if (completedAtMs < cutoff) continue;

      const exercise: Exercise | undefined = findExerciseById(set.exerciseId);
      if (!exercise) continue;

      const setVolume = set.weightKg * set.reps;

      for (const muscle of exercise.primaryMuscles) {
        pushEvent(eventsByMuscle, muscle, setVolume * 1.0, set.completedAt);
        pushVolume(totalSetVolumeByMuscle, muscle, setVolume * 1.0);
      }
      for (const muscle of exercise.secondaryMuscles) {
        pushEvent(eventsByMuscle, muscle, setVolume * 0.5, set.completedAt);
        pushVolume(totalSetVolumeByMuscle, muscle, setVolume * 0.5);
      }
    }
  }

  return ALL_MUSCLE_GROUPS.map((muscleGroup) => {
    const events = eventsByMuscle.get(muscleGroup) ?? [];
    if (events.length === 0) {
      return { muscleGroup, freshness: 0, lastTrainedAt: null };
    }

    const volumes = totalSetVolumeByMuscle.get(muscleGroup) ?? [];
    const avgSetVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length || 1;

    let freshness = 0;
    let lastTrainedAt: string | null = null;

    for (const event of events) {
      const hoursSince = (now.getTime() - new Date(event.occurredAt).getTime()) / (1000 * 60 * 60);
      const stimulus = clamp((event.volumeKg / avgSetVolume) * 20, 0, 40);
      freshness += stimulus * decayFactor(hoursSince);

      if (!lastTrainedAt || new Date(event.occurredAt) > new Date(lastTrainedAt)) {
        lastTrainedAt = event.occurredAt;
      }
    }

    return { muscleGroup, freshness: clamp(freshness, 0, 100), lastTrainedAt };
  });
}

function pushEvent(
  map: Map<MuscleGroup, MuscleStimulusEvent[]>,
  muscle: MuscleGroup,
  volumeKg: number,
  occurredAt: string
) {
  const list = map.get(muscle) ?? [];
  list.push({ volumeKg, occurredAt });
  map.set(muscle, list);
}

function pushVolume(map: Map<MuscleGroup, number[]>, muscle: MuscleGroup, volume: number) {
  const list = map.get(muscle) ?? [];
  list.push(volume);
  map.set(muscle, list);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
