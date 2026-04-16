import { create } from 'zustand';
import apInstance, { publicApi } from '../services/api';
import { makeEntry, isFresh, TTL } from './lib/cache';
import type { CacheEntry } from './lib/cache';
import type { Review } from '../types';

// ─── Review stats shape (also exported for use in components) ─────────────────

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
}

// ─── State interface ──────────────────────────────────────────────────────────

interface ReviewStoreState {
  // Per-product caches (keyed by product id)
  reviewsByProduct: Partial<Record<number, CacheEntry<Review[]>>>;
  statsByProduct: Partial<Record<number, CacheEntry<ReviewStats>>>;

  // Authenticated user's own reviews
  myReviews: Review[];
  myReviewsCache: CacheEntry<Review[]> | null;

  // Per-action loading flags
  loadingReviews: Partial<Record<number, boolean>>;
  loadingStats: Partial<Record<number, boolean>>;
  loadingMyReviews: boolean;
  error: string | null;

  // Actions
  fetchReviews: (productId: number) => Promise<Review[]>;
  fetchStats: (productId: number) => Promise<ReviewStats | null>;
  fetchMyReviews: () => Promise<void>;
  createReview: (
    productId: number,
    data: { rating: number; comment: string; title?: string }
  ) => Promise<void>;
  updateReview: (
    reviewId: number,
    productId: number,
    data: Partial<{ rating: number; comment: string; title?: string }>
  ) => Promise<void>;
  deleteReview: (reviewId: number, productId: number) => Promise<void>;
  invalidateProduct: (productId: number) => void;
  clearUserData: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const useReviewStore = create<ReviewStoreState>((set, get) => ({
  reviewsByProduct: {},
  statsByProduct: {},
  myReviews: [],
  myReviewsCache: null,
  loadingReviews: {},
  loadingStats: {},
  loadingMyReviews: false,
  error: null,

  // ─── fetchReviews ───────────────────────────────────────────────────────────
  fetchReviews: async (productId: number) => {
    const { reviewsByProduct, loadingReviews } = get();
    const cached = reviewsByProduct[productId];

    if (isFresh(cached)) return cached.data;
    if (loadingReviews[productId]) return reviewsByProduct[productId]?.data ?? [];

    set((s) => ({ loadingReviews: { ...s.loadingReviews, [productId]: true } }));
    try {
      const res = await publicApi.get<Review[]>(`/reviews/product/${productId}/`);
      const data = res.data;
      set((s) => ({
        reviewsByProduct: {
          ...s.reviewsByProduct,
          [productId]: makeEntry(data, TTL.REVIEWS),
        },
        loadingReviews: { ...s.loadingReviews, [productId]: false },
      }));
      return data;
    } catch {
      set((s) => ({
        loadingReviews: { ...s.loadingReviews, [productId]: false },
      }));
      return [];
    }
  },

  // ─── fetchStats ─────────────────────────────────────────────────────────────
  fetchStats: async (productId: number) => {
    const { statsByProduct, loadingStats } = get();
    const cached = statsByProduct[productId];

    if (isFresh(cached)) return cached.data;
    if (loadingStats[productId]) return statsByProduct[productId]?.data ?? null;

    set((s) => ({ loadingStats: { ...s.loadingStats, [productId]: true } }));
    try {
      const res = await publicApi.get<ReviewStats>(
        `/reviews/product/${productId}/stats/`
      );
      const data = res.data;
      set((s) => ({
        statsByProduct: {
          ...s.statsByProduct,
          [productId]: makeEntry(data, TTL.REVIEWS),
        },
        loadingStats: { ...s.loadingStats, [productId]: false },
      }));
      return data;
    } catch {
      set((s) => ({
        loadingStats: { ...s.loadingStats, [productId]: false },
      }));
      return null;
    }
  },

  // ─── fetchMyReviews ─────────────────────────────────────────────────────────
  fetchMyReviews: async () => {
    const { myReviewsCache, loadingMyReviews } = get();
    if (loadingMyReviews || isFresh(myReviewsCache)) return;

    set({ loadingMyReviews: true });
    try {
      const res = await apInstance.get<Review[]>('/reviews/my_reviews/');
      const data = res.data;
      set({
        myReviews: data,
        myReviewsCache: makeEntry(data, TTL.REVIEWS),
        loadingMyReviews: false,
      });
    } catch {
      set({ loadingMyReviews: false });
    }
  },

  // ─── createReview ───────────────────────────────────────────────────────────
  // After write, invalidate product cache so the next fetch re-syncs from server
  createReview: async (
    productId: number,
    data: { rating: number; comment: string }
  ) => {
    await apInstance.post('/reviews/', { ...data, product: productId });
    get().invalidateProduct(productId);
    set({ myReviewsCache: null });
  },

  // ─── updateReview ───────────────────────────────────────────────────────────
  updateReview: async (
    reviewId: number,
    productId: number,
    data: Partial<{ rating: number; comment: string }>
  ) => {
    await apInstance.patch(`/reviews/${reviewId}/`, data);
    get().invalidateProduct(productId);
    set({ myReviewsCache: null });
  },

  // ─── deleteReview ───────────────────────────────────────────────────────────
  deleteReview: async (reviewId: number, productId: number) => {
    await apInstance.delete(`/reviews/${reviewId}/`);
    get().invalidateProduct(productId);
    set({ myReviewsCache: null });
  },

  // ─── invalidateProduct ──────────────────────────────────────────────────────
  invalidateProduct: (productId: number) => {
    set((s) => {
      const reviews = { ...s.reviewsByProduct };
      const stats = { ...s.statsByProduct };
      delete reviews[productId];
      delete stats[productId];
      return { reviewsByProduct: reviews, statsByProduct: stats };
    });
  },

  // ─── clearUserData ──────────────────────────────────────────────────────────
  // Called on logout: keeps public review/stats cache but drops user-specific data
  clearUserData: () => {
    set({ myReviews: [], myReviewsCache: null });
  },
}));

export default useReviewStore;
