-- One row per chat session (lead insights). No raw IPs are stored.
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  last_message_at INTEGER,
  country TEXT,
  device TEXT,
  page TEXT,
  turns INTEGER NOT NULL DEFAULT 0,
  contact_shown INTEGER NOT NULL DEFAULT 0,
  contact_clicked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX conversations_created_at ON conversations (created_at);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL REFERENCES conversations (id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  model TEXT,
  latency_ms INTEGER,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  error TEXT
);
CREATE INDEX messages_conversation ON messages (conversation_id, id);

-- Daily message counters per visitor (salted IP hash) and globally; pruned by the daily cron.
CREATE TABLE usage_counters (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
