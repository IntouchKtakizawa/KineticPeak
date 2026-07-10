import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDefaultProfile, PLEDGE_VERSION, Sex, UserProfile } from '../models/profile';
import { generateId } from '../services/id';

interface ProfileStoreState {
  profile: UserProfile;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  completeBiometrics: (input: {
    displayName: string;
    heightCm: number;
    weightKg: number;
    sex: Sex;
    dateOfBirth: string | null;
  }) => void;
  acceptPledge: () => void;
  finishOnboarding: () => void;
  updateBiometrics: (input: { heightCm: number; weightKg: number; sex: Sex }) => void;
  setRestTimerOverride: (seconds: number | null) => void;
  needsPledgeReview: () => boolean;
}

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set, get) => ({
      profile: createDefaultProfile(),
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      completeBiometrics: ({ displayName, heightCm, weightKg, sex, dateOfBirth }) =>
        set((state) => ({
          profile: {
            ...state.profile,
            userId: state.profile.userId || generateId('user'),
            displayName,
            heightCm,
            weightKg,
            sex,
            dateOfBirth,
          },
        })),
      acceptPledge: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            pledge: {
              accepted: true,
              acceptedAt: new Date().toISOString(),
              version: PLEDGE_VERSION,
            },
          },
        })),
      finishOnboarding: () =>
        set((state) => ({ profile: { ...state.profile, hasOnboarded: true } })),
      updateBiometrics: ({ heightCm, weightKg, sex }) =>
        set((state) => ({ profile: { ...state.profile, heightCm, weightKg, sex } })),
      setRestTimerOverride: (seconds) =>
        set((state) => ({ profile: { ...state.profile, restTimerOverrideSeconds: seconds } })),
      needsPledgeReview: () => get().profile.pledge.version < PLEDGE_VERSION,
    }),
    {
      name: 'kineticpeak.profile',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
