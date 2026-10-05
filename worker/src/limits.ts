// Daily message quotas, counted in D1 (the rate-limit binding only supports 10s/60s windows).

export type LimitScope = "burst" | "conversation" | "visitor_daily" | "global_daily";

const DAY_MS = 24 * 60 * 60 * 1000;

const utcDay = (now: number) => new Date(now).toISOString().slice(0, 10);

const nextUtcMidnight = (now: number) => {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
};

/**
 * Atomically counts one message for the visitor and globally, then checks both limits.
 * Counting before checking means rejected attempts still count, which is intended: hammering doesn't help.
 */
export const consumeDailyQuota = async (
  db: D1Database,
  ipHash: string,
  limits: { perVisitor: number; global: number },
  now = Date.now(),
): Promise<{ ok: true } | { ok: false; scope: LimitScope; retryAfterSeconds: number }> => {
  const day = utcDay(now);
  const expiresAt = nextUtcMidnight(now) + DAY_MS;
  const upsert = db.prepare(
    `INSERT INTO usage_counters (key, count, expires_at) VALUES (?1, 1, ?2)
     ON CONFLICT (key) DO UPDATE SET count = count + 1
     RETURNING count`,
  );
  const [visitor, global] = await db.batch<{ count: number }>([
    upsert.bind(`visitor:${ipHash}:${day}`, expiresAt),
    upsert.bind(`global:${day}`, expiresAt),
  ]);

  const retryAfterSeconds = Math.ceil((nextUtcMidnight(now) - now) / 1000);
  if ((global.results[0]?.count ?? 0) > limits.global) return { ok: false, scope: "global_daily", retryAfterSeconds };
  if ((visitor.results[0]?.count ?? 0) > limits.perVisitor) {
    return { ok: false, scope: "visitor_daily", retryAfterSeconds };
  }
  return { ok: true };
};

export const pruneExpiredCounters = (db: D1Database, now = Date.now()) =>
  db.prepare("DELETE FROM usage_counters WHERE expires_at < ?1").bind(now).run();
