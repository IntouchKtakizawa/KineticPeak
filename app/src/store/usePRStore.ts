import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PRRecord, PRType } from '../models/pr';
import { generateId } from '../services/id';

interface PRStoreState {
  records: PRRecord[];
  bestFor: (exerciseId: string, type: PRType) => PRRecord | undefined;
  recordIfPR: (input: {
    exerciseId: string;
    type: PRType;
    value: number;
    sourceSetId: string;
  }) => PRRecord | null;
}

export const usePRStore = create<PRStoreState>()(
  persist(
    (set, get) => ({
      records: [],
      bestFor: (exerciseId, type) => {
        const matches = get().records.filter(
          (r) => r.exerciseId === exerciseId && r.type === type
        );
        if (matches.length === 0) return undefined;
        return matches.reduce((best, r) => (r.value > best.value ? r : best));
      },
      recordIfPR: ({ exerciseId, type, value, sourceSetId }) => {
        const current = get().bestFor(exerciseId, type);
        if (current && value <= current.value) return null;
        const record: PRRecord = {
          id: generateId('pr'),
          exerciseId,
          type,
          value,
          achievedAt: new Date().toISOString(),
          sourceSetId,
          previousValue: current?.value ?? null,
        };
        set((state) => ({ records: [record, ...state.records] }));
        return record;
      },
    }),
    {
      name: 'kineticpeak.pr',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
