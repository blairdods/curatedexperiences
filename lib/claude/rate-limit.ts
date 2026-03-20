/**
 * Simple in-memory rate limiter for the concierge API.
 * 20 requests per IP per hour, with exponential backoff messaging.
 *
 * Note: In-memory works for single-instance Vercel serverless,
 * but resets on cold starts. For production scale, move to Redis/Upstash.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store) {
    if (val.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
} {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, retryAfterMs: 0 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: entry.resetAt - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    retryAfterMs: 0,
  };
}

/**
 * Per-session token budget tracking.
 * Prevents runaway costs from a single conversation.
 */
const sessionBudgets = new Map<
  string,
  { inputTokens: number; outputTokens: number }
>();

const MAX_SESSION_INPUT_TOKENS = 50_000;
const MAX_SESSION_OUTPUT_TOKENS = 20_000;

export function checkSessionBudget(sessionId: string): boolean {
  const budget = sessionBudgets.get(sessionId);
  if (!budget) return true;
  return (
    budget.inputTokens < MAX_SESSION_INPUT_TOKENS &&
    budget.outputTokens < MAX_SESSION_OUTPUT_TOKENS
  );
}

export function trackSessionTokens(
  sessionId: string,
  inputTokens: number,
  outputTokens: number
) {
  const existing = sessionBudgets.get(sessionId) ?? {
    inputTokens: 0,
    outputTokens: 0,
  };
  sessionBudgets.set(sessionId, {
    inputTokens: existing.inputTokens + inputTokens,
    outputTokens: existing.outputTokens + outputTokens,
  });
}
