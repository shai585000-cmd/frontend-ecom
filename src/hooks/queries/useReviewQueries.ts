import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apInstance, { publicApi } from '../../services/api';
import { queryKeys } from '../../lib/queryClient';
import type { Review } from '../../types';

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution?: Record<number, number>;
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useProductReviews(productId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId!),
    queryFn: async () => {
      const res = await publicApi.get<Review[]>(`/reviews/product/${productId}/`);
      return res.data;
    },
    enabled: !!productId,
    staleTime: 3 * 60 * 1000, // 3 min
  });
}

export function useReviewStats(productId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.reviews.stats(productId!),
    queryFn: async () => {
      const res = await publicApi.get<ReviewStats>(
        `/reviews/product/${productId}/stats/`
      );
      return res.data;
    },
    enabled: !!productId,
    staleTime: 3 * 60 * 1000,
  });
}

export function useMyReviews(enabled = true) {
  return useQuery({
    queryKey: queryKeys.reviews.mine(),
    queryFn: async () => {
      const res = await apInstance.get<Review[]>('/reviews/my_reviews/');
      return res.data;
    },
    enabled,
    staleTime: 3 * 60 * 1000,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreateReview(productId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { rating: number; comment: string; title?: string }) => {
      const res = await apInstance.post('/reviews/', { ...data, product: productId });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(productId) });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.stats(productId) });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.mine() });
    },
  });
}

export function useUpdateReview(productId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reviewId,
      data,
    }: {
      reviewId: number;
      data: Partial<{ rating: number; comment: string; title?: string }>;
    }) => {
      const res = await apInstance.patch(`/reviews/${reviewId}/`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(productId) });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.stats(productId) });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.mine() });
    },
  });
}

export function useDeleteReview(productId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: number) => {
      await apInstance.delete(`/reviews/${reviewId}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(productId) });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.stats(productId) });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.mine() });
    },
  });
}
