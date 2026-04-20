import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apInstance from '../../services/api';
import { queryKeys } from '../../lib/queryClient';
import useAuthStore from '../authStore';
import toast from 'react-hot-toast';
import type { Product, WishlistItem } from '../../types';

// ─── Query ───────────────────────────────────────────────────────────────────

export function useWishlist() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.wishlist.all,
    queryFn: async (): Promise<Product[]> => {
      const res = await apInstance.get('/wishlist/');
      const rawData = res.data as WishlistItem[] | Product[];

      if (
        Array.isArray(rawData) &&
        rawData.length > 0 &&
        'product' in rawData[0]
      ) {
        return (rawData as WishlistItem[]).map((item) => item.product);
      }
      return rawData as Product[];
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 min
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useAddToWishlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      await apInstance.post(`/wishlist/add/${product.id}/`);
      return product;
    },
    // Optimistic update
    onMutate: async (product) => {
      await qc.cancelQueries({ queryKey: queryKeys.wishlist.all });
      const previous = qc.getQueryData<Product[]>(queryKeys.wishlist.all);
      qc.setQueryData<Product[]>(queryKeys.wishlist.all, (old) => {
        if (!old) return [product];
        if (old.find((p) => p.id === product.id)) return old;
        return [...old, product];
      });
      return { previous };
    },
    onSuccess: () => {
      toast.success('Ajouté aux favoris');
    },
    onError: (_err, _product, context) => {
      if (context?.previous) {
        qc.setQueryData(queryKeys.wishlist.all, context.previous);
      }
      toast.error("Erreur lors de l'ajout aux favoris");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (productId: number) => {
      await apInstance.delete(`/wishlist/remove/${productId}/`);
      return productId;
    },
    // Optimistic update
    onMutate: async (productId) => {
      await qc.cancelQueries({ queryKey: queryKeys.wishlist.all });
      const previous = qc.getQueryData<Product[]>(queryKeys.wishlist.all);
      qc.setQueryData<Product[]>(queryKeys.wishlist.all, (old) =>
        old ? old.filter((p) => p.id !== productId) : []
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Retiré des favoris');
    },
    onError: (_err, _productId, context) => {
      if (context?.previous) {
        qc.setQueryData(queryKeys.wishlist.all, context.previous);
      }
      toast.error('Erreur lors de la suppression');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
  });
}
