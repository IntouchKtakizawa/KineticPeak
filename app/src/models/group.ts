import { LeagueTier } from './league';

export interface GroupMember {
  userId: string;
  displayName: string;
  points: number;
  tier: LeagueTier;
  computedAt: string;
}

export interface GroupInfo {
  groupId: string;
  inviteCode: string;
  name?: string;
  members: GroupMember[];
}
