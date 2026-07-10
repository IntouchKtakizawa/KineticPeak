import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db/client';
import { generateUniqueInviteCode } from '../services/inviteCode';
import { validateBody } from '../middleware/validate';

export const groupsRouter = Router();

interface GroupMemberRow {
  group_id: string;
  user_id: string;
  display_name: string;
  points: number;
  tier: string;
  stats_updated_at: string | null;
  joined_at: string;
}

interface GroupRow {
  id: string;
  invite_code: string;
  name: string | null;
  created_at: string;
}

function toMember(row: GroupMemberRow) {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    points: row.points,
    tier: row.tier,
    computedAt: row.stats_updated_at,
  };
}

function loadGroupWithMembers(groupId: string) {
  const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(groupId) as GroupRow | undefined;
  if (!group) return null;
  const members = db
    .prepare('SELECT * FROM group_members WHERE group_id = ? ORDER BY points DESC')
    .all(groupId) as GroupMemberRow[];
  return {
    groupId: group.id,
    inviteCode: group.invite_code,
    name: group.name ?? undefined,
    members: members.map(toMember),
  };
}

const createGroupSchema = z.object({
  userId: z.string().min(1),
  displayName: z.string().min(1),
  groupName: z.string().optional(),
});

groupsRouter.post('/', validateBody(createGroupSchema), (req, res) => {
  const { userId, displayName, groupName } = req.body as z.infer<typeof createGroupSchema>;

  const groupId = `group_${Date.now()}_${Math.round(Math.random() * 1e6)}`;
  const inviteCode = generateUniqueInviteCode();
  const now = new Date().toISOString();

  db.prepare('INSERT INTO groups (id, invite_code, name, created_at) VALUES (?, ?, ?, ?)').run(
    groupId,
    inviteCode,
    groupName ?? null,
    now
  );
  db.prepare(
    'INSERT INTO group_members (group_id, user_id, display_name, points, tier, joined_at) VALUES (?, ?, ?, 0, ?, ?)'
  ).run(groupId, userId, displayName, 'bronze', now);

  res.status(201).json(loadGroupWithMembers(groupId));
});

const joinGroupSchema = z.object({
  inviteCode: z.string().min(1),
  userId: z.string().min(1),
  displayName: z.string().min(1),
});

groupsRouter.post('/join', validateBody(joinGroupSchema), (req, res) => {
  const { inviteCode, userId, displayName } = req.body as z.infer<typeof joinGroupSchema>;

  const group = db.prepare('SELECT * FROM groups WHERE invite_code = ?').get(inviteCode) as
    | GroupRow
    | undefined;
  if (!group) {
    res.status(404).json({ error: 'Invite code not found' });
    return;
  }

  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO group_members (group_id, user_id, display_name, points, tier, joined_at)
     VALUES (?, ?, ?, 0, 'bronze', ?)
     ON CONFLICT(group_id, user_id) DO UPDATE SET display_name = excluded.display_name`
  ).run(group.id, userId, displayName, now);

  res.json(loadGroupWithMembers(group.id));
});

const pushStatsSchema = z.object({
  userId: z.string().min(1),
  points: z.number().min(0),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum']),
  computedAt: z.string().min(1),
});

groupsRouter.post('/:groupId/stats', validateBody(pushStatsSchema), (req, res) => {
  const { groupId } = req.params;
  const { userId, points, tier, computedAt } = req.body as z.infer<typeof pushStatsSchema>;

  const result = db
    .prepare(
      'UPDATE group_members SET points = ?, tier = ?, stats_updated_at = ? WHERE group_id = ? AND user_id = ?'
    )
    .run(points, tier, computedAt, groupId, userId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Group membership not found' });
    return;
  }

  res.json({ ok: true });
});

groupsRouter.get('/:groupId/leaderboard', (req, res) => {
  const { groupId } = req.params;
  const group = loadGroupWithMembers(groupId);
  if (!group) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  res.json({ groupId: group.groupId, members: group.members });
});
