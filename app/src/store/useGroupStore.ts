import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroupInfo, GroupMember } from '../models/group';

interface GroupStoreState {
  group: GroupInfo | null;
  lastSyncedAt: string | null;
  setGroup: (group: GroupInfo | null) => void;
  setMembers: (members: GroupMember[]) => void;
  markSynced: () => void;
  leaveGroup: () => void;
}

export const useGroupStore = create<GroupStoreState>()(
  persist(
    (set) => ({
      group: null,
      lastSyncedAt: null,
      setGroup: (group) => set({ group }),
      setMembers: (members) =>
        set((state) => (state.group ? { group: { ...state.group, members } } : state)),
      markSynced: () => set({ lastSyncedAt: new Date().toISOString() }),
      leaveGroup: () => set({ group: null, lastSyncedAt: null }),
    }),
    {
      name: 'kineticpeak.group',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
