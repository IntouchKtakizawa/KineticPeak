import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSession, SetEntry, WorkoutSession } from '../models/workout';
import { generateId } from '../services/id';

interface LogSetInput {
  exerciseId: string;
  weightKg: number;
  reps: number;
  rpe?: number;
  isWarmup: boolean;
}

interface WorkoutStoreState {
  activeSession: WorkoutSession | null;
  history: WorkoutSession[];
  startSession: () => WorkoutSession;
  logSet: (input: LogSetInput) => SetEntry;
  recordRestTaken: (setId: string, seconds: number) => void;
  endActiveSession: () => WorkoutSession | null;
  discardActiveSession: () => void;
}

export const useWorkoutStore = create<WorkoutStoreState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      history: [],
      startSession: () => {
        const session = createSession();
        set({ activeSession: session });
        return session;
      },
      logSet: (input) => {
        const entry: SetEntry = {
          id: generateId('set'),
          exerciseId: input.exerciseId,
          setIndex: get().activeSession?.sets.length ?? 0,
          weightKg: input.weightKg,
          reps: input.reps,
          rpe: input.rpe,
          isWarmup: input.isWarmup,
          completedAt: new Date().toISOString(),
        };
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              sets: [...state.activeSession.sets, entry],
            },
          };
        });
        return entry;
      },
      recordRestTaken: (setId, seconds) =>
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              sets: state.activeSession.sets.map((s) =>
                s.id === setId ? { ...s, restTakenSeconds: seconds } : s
              ),
            },
          };
        }),
      endActiveSession: () => {
        const active = get().activeSession;
        if (!active) return null;
        const finished: WorkoutSession = { ...active, endedAt: new Date().toISOString() };
        set((state) => ({
          activeSession: null,
          history: [finished, ...state.history],
        }));
        return finished;
      },
      discardActiveSession: () => set({ activeSession: null }),
    }),
    {
      name: 'kineticpeak.workout',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
