const LIMIT = 2;

interface RateLimitEntry {
  count: number;
  month: number;
  year: number;
}

const store = new Map<string, RateLimitEntry>();

const ADMIN_IDS = (process.env.ADMIN_GITHUB_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  if (ADMIN_IDS.includes(userId)) {
    return { allowed: true, remaining: Infinity };
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const entry = store.get(userId);

  if (!entry || entry.month !== currentMonth || entry.year !== currentYear) {
    store.set(userId, { count: 1, month: currentMonth, year: currentYear });
    return { allowed: true, remaining: LIMIT - 1 };
  }

  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: LIMIT - entry.count };
}

export function resetRateLimits(): void {
  store.clear();
}
