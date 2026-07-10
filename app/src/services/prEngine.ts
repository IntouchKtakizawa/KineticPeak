import { SetEntry } from '../models/workout';
import { epley1RM, PRRecord } from '../models/pr';
import { usePRStore } from '../store/usePRStore';

export interface PREvaluationResult {
  newRecords: PRRecord[];
}

export function evaluateSetForPRs(entry: SetEntry): PREvaluationResult {
  if (entry.isWarmup) return { newRecords: [] };

  const { recordIfPR } = usePRStore.getState();
  const newRecords: PRRecord[] = [];

  const e1rm = epley1RM(entry.weightKg, entry.reps);
  const e1rmRecord = recordIfPR({
    exerciseId: entry.exerciseId,
    type: 'e1rm',
    value: e1rm,
    sourceSetId: entry.id,
  });
  if (e1rmRecord) newRecords.push(e1rmRecord);

  const weightRecord = recordIfPR({
    exerciseId: entry.exerciseId,
    type: 'weight',
    value: entry.weightKg,
    sourceSetId: entry.id,
  });
  if (weightRecord) newRecords.push(weightRecord);

  const volumeRecord = recordIfPR({
    exerciseId: entry.exerciseId,
    type: 'volume_single_set',
    value: entry.weightKg * entry.reps,
    sourceSetId: entry.id,
  });
  if (volumeRecord) newRecords.push(volumeRecord);

  return { newRecords };
}
