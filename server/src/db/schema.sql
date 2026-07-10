CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  invite_code TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS group_members (
  group_id TEXT NOT NULL REFERENCES groups(id),
  user_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  points REAL NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'bronze',
  stats_updated_at TEXT,
  joined_at TEXT NOT NULL,
  PRIMARY KEY (group_id, user_id)
);
