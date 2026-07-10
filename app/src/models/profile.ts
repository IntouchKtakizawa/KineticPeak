export type Sex = 'male' | 'female' | 'unspecified';

export const PLEDGE_VERSION = 1;

export interface UserProfile {
  userId: string;
  displayName: string;
  heightCm: number;
  weightKg: number;
  sex: Sex;
  dateOfBirth: string | null;
  createdAt: string;
  hasOnboarded: boolean;
  pledge: {
    accepted: boolean;
    acceptedAt: string | null;
    version: number;
  };
  restTimerOverrideSeconds: number | null;
}

export function createDefaultProfile(): UserProfile {
  return {
    userId: '',
    displayName: '',
    heightCm: 0,
    weightKg: 0,
    sex: 'unspecified',
    dateOfBirth: null,
    createdAt: new Date().toISOString(),
    hasOnboarded: false,
    pledge: {
      accepted: false,
      acceptedAt: null,
      version: PLEDGE_VERSION,
    },
    restTimerOverrideSeconds: null,
  };
}
