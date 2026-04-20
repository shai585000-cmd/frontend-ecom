import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../../services/api';
import { queryKeys } from '../../lib/queryClient';
import type { Product } from '../../types';

interface TopSellingProduct extends Product {
  total_sold: number;
}

// ─── Fetch all products ──────────────────────────────────────────────────────
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: async () => {
      const res = await publicApi.get<Product[]>('/produits/products/');
      return res.data;
    },
  });
}

// ─── Fetch single product by ID ──────────────────────────────────────────────
export function useProductById(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id!),
    queryFn: async () => {
      const res = await publicApi.get<Product>(`/produits/products/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });
}

// ─── Fetch promo products ────────────────────────────────────────────────────
export function usePromoProducts() {
  return useQuery({
    queryKey: queryKeys.products.promo(),
    queryFn: async () => {
      const res = await publicApi.get<Product[]>('/produits/products/promotion/');
      return res.data;
    },
  });
}

// ─── Fetch top-selling products ──────────────────────────────────────────────
export function useTopSellingProducts(days = 30, limit = 10) {
  return useQuery({
    queryKey: queryKeys.products.topSelling(days, limit),
    queryFn: async () => {
      const res = await publicApi.get<{ products: TopSellingProduct[] }>(
        `/produits/products/top-selling/?days=${days}&limit=${limit}`
      );
      return res.data.products;
    },
    staleTime: 2 * 60 * 1000, // 2 min – top selling changes more often
  });
}
