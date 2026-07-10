import { GroupInfo, GroupMember } from '../../models/group';
import { LeagueState } from '../../models/league';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function isGroupSyncAvailable(): boolean {
  return Boolean(API_URL);
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  if (!API_URL) throw new Error('EXPO_PUBLIC_API_URL is not set');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Request to ${path} failed (${response.status}): ${body}`);
  }
  return response.json() as Promise<T>;
}

export function createGroup(input: {
  userId: string;
  displayName: string;
  groupName?: string;
}): Promise<GroupInfo> {
  return request<GroupInfo>('/api/groups', { method: 'POST', body: JSON.stringify(input) });
}

export function joinGroup(input: {
  inviteCode: string;
  userId: string;
  displayName: string;
}): Promise<GroupInfo> {
  return request<GroupInfo>('/api/groups/join', { method: 'POST', body: JSON.stringify(input) });
}

export function pushGroupStats(
  groupId: string,
  input: { userId: string; league: LeagueState }
): Promise<{ ok: true }> {
  return request<{ ok: true }>(`/api/groups/${groupId}/stats`, {
    method: 'POST',
    body: JSON.stringify({
      userId: input.userId,
      points: input.league.points,
      tier: input.league.tier,
      computedAt: input.league.computedAt,
    }),
  });
}

export function fetchGroupLeaderboard(
  groupId: string
): Promise<{ groupId: string; members: GroupMember[] }> {
  return request(`/api/groups/${groupId}/leaderboard`, { method: 'GET' });
}
