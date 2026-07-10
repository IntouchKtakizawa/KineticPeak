import { db } from '../db/client';

// Excludes ambiguous characters (0/O, 1/I).
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

function randomCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

export function generateUniqueInviteCode(): string {
  const exists = db.prepare('SELECT 1 FROM groups WHERE invite_code = ?');
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode();
    if (!exists.get(code)) return code;
  }
  throw new Error('Failed to generate a unique invite code');
}
