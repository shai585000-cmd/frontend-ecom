// ─── TTL constants (milliseconds) ────────────────────────────────────────────
export const TTL = {
  SHORT: 2 * 60 * 1000,    // 2 min  – wishlist (user-specific, mutable)
  REVIEWS: 3 * 60 * 1000,  // 3 min  – reviews (mutable by user actions)
  MEDIUM: 5 * 60 * 1000,   // 5 min  – products (changes occasionally)
  LONG: 10 * 60 * 1000,    // 10 min – categories, home data (quasi-static)
} as const;

// ─── Cache entry shape ────────────────────────────────────────────────────────
export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function makeEntry<T>(data: T, ttl: number): CacheEntry<T> {
  return { data, expiresAt: Date.now() + ttl };
}

export function isFresh<T>(
  entry: CacheEntry<T> | null | undefined
): entry is CacheEntry<T> {
  return !!entry && Date.now() < entry.expiresAt;
}
