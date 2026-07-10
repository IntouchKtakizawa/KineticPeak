import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSession, findMostRecentSet, SetEntry, WorkoutSession } from '../models/workout';
import { generateId } from '../services/id';

interface WorkoutStoreState {
  activeSession: WorkoutSession | null;
  history: WorkoutSession[];
  startSession: () => WorkoutSession;
  addExerciseToSession: (exerciseId: string) => void;
  addSetRow: (exerciseId: string) => void;
  updateSetValues: (setId: string, values: { weightKg?: number; reps?: number }) => void;
  toggleSetCompleted: (setId: string) => SetEntry | null;
  removeSet: (setId: string) => void;
  removeExercise: (exerciseId: string) => void;
  updateExerciseNotes: (exerciseId: string, notes: string) => void;
  recordRestTaken: (setId: string, seconds: number) => void;
  endActiveSession: () => WorkoutSession | null;
  discardActiveSession: () => void;
}

function nextSetIndexFor(session: WorkoutSession, exerciseId: string): number {
  return session.sets.filter((s) => s.exerciseId === exerciseId).length;
}

function reindexExerciseSets(sets: SetEntry[], exerciseId: string): SetEntry[] {
  let cursor = 0;
  return sets.map((s) => (s.exerciseId === exerciseId ? { ...s, setIndex: cursor++ } : s));
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
      addExerciseToSession: (exerciseId) => {
        const state = get();
        if (!state.activeSession) return;
        const alreadyAdded = state.activeSession.exerciseIds.includes(exerciseId);

        const previous = findMostRecentSet(state.history, exerciseId, 0);
        const draft: SetEntry = {
          id: generateId('set'),
          exerciseId,
          setIndex: 0,
          weightKg: previous?.weightKg ?? 0,
          reps: previous?.reps ?? 0,
          isWarmup: false,
          completed: false,
          completedAt: new Date().toISOString(),
        };

        set((s) => {
          if (!s.activeSession) return s;
          return {
            activeSession: {
              ...s.activeSession,
              exerciseIds: alreadyAdded
                ? s.activeSession.exerciseIds
                : [...s.activeSession.exerciseIds, exerciseId],
              sets: alreadyAdded ? s.activeSession.sets : [...s.activeSession.sets, draft],
            },
          };
        });
      },
      addSetRow: (exerciseId) => {
        const state = get();
        if (!state.activeSession) return;
        const setIndex = nextSetIndexFor(state.activeSession, exerciseId);
        const previous = findMostRecentSet(state.history, exerciseId, setIndex);
        const lastRowInSession = [...state.activeSession.sets]
          .reverse()
          .find((s) => s.exerciseId === exerciseId);

        const draft: SetEntry = {
          id: generateId('set'),
          exerciseId,
          setIndex,
          weightKg: previous?.weightKg ?? lastRowInSession?.weightKg ?? 0,
          reps: previous?.reps ?? lastRowInSession?.reps ?? 0,
          isWarmup: false,
          completed: false,
          completedAt: new Date().toISOString(),
        };

        set((s) => {
          if (!s.activeSession) return s;
          return { activeSession: { ...s.activeSession, sets: [...s.activeSession.sets, draft] } };
        });
      },
      updateSetValues: (setId, values) =>
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              sets: state.activeSession.sets.map((s) => (s.id === setId ? { ...s, ...values } : s)),
            },
          };
        }),
      toggleSetCompleted: (setId) => {
        let toggled: SetEntry | null = null;
        set((state) => {
          if (!state.activeSession) return state;
          const sets = state.activeSession.sets.map((s) => {
            if (s.id !== setId) return s;
            toggled = { ...s, completed: !s.completed, completedAt: new Date().toISOString() };
            return toggled;
          });
          return { activeSession: { ...state.activeSession, sets } };
        });
        return toggled;
      },
      removeSet: (setId) =>
        set((state) => {
          if (!state.activeSession) return state;
          const target = state.activeSession.sets.find((s) => s.id === setId);
          if (!target) return state;
          const remaining = state.activeSession.sets.filter((s) => s.id !== setId);
          return {
            activeSession: {
              ...state.activeSession,
              sets: reindexExerciseSets(remaining, target.exerciseId),
            },
          };
        }),
      removeExercise: (exerciseId) =>
        set((state) => {
          if (!state.activeSession) return state;
          const { [exerciseId]: _removed, ...restNotes } = state.activeSession.exerciseNotes;
          return {
            activeSession: {
              ...state.activeSession,
              exerciseIds: state.activeSession.exerciseIds.filter((id) => id !== exerciseId),
              sets: state.activeSession.sets.filter((s) => s.exerciseId !== exerciseId),
              exerciseNotes: restNotes,
            },
          };
        }),
      updateExerciseNotes: (exerciseId, notes) =>
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exerciseNotes: { ...state.activeSession.exerciseNotes, [exerciseId]: notes },
            },
          };
        }),
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
        const finished: WorkoutSession = {
          ...active,
          endedAt: new Date().toISOString(),
          sets: active.sets.filter((s) => s.completed),
        };
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
