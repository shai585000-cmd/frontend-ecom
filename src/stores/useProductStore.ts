import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { publicApi } from '../services/api';
import { makeEntry, isFresh, TTL } from './lib/cache';
import type { CacheEntry } from './lib/cache';
import type { Product } from '../types';

// ─── State interface ──────────────────────────────────────────────────────────

interface ProductStoreState {
  // Lists
  products: Product[];
  productsCache: CacheEntry<Product[]> | null;
  promoProducts: Product[];
  promoCache: CacheEntry<Product[]> | null;

  // Single-product lookup (id → cached entry)
  productById: Partial<Record<number, CacheEntry<Product>>>;

  // Per-action loading flags
  loadingList: boolean;
  loadingPromo: boolean;
  loadingById: Partial<Record<number, boolean>>;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  fetchPromoProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<Product | null>;
  invalidateProduct: (id: number) => void;
  invalidateAll: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const useProductStore = create<ProductStoreState>()(
  persist(
    (set, get) => ({
  products: [],
  productsCache: null,
  promoProducts: [],
  promoCache: null,
  productById: {},
  loadingList: false,
  loadingPromo: false,
  loadingById: {},
  error: null,

  fetchProducts: async () => {
    const { productsCache, loadingList } = get();
    if (loadingList || isFresh(productsCache)) return;

    set({ loadingList: true, error: null });
    try {
      const res = await publicApi.get<Product[]>('/produits/products/');
      const data = res.data;

      // Hydrate per-product cache from the list response → avoids individual fetches
      const byId: Partial<Record<number, CacheEntry<Product>>> = { ...get().productById };
      data.forEach((p) => {
        byId[p.id] = makeEntry(p, TTL.MEDIUM);
      });

      set({
        products: data,
        productsCache: makeEntry(data, TTL.MEDIUM),
        productById: byId,
        loadingList: false,
      });
    } catch (e: unknown) {
      set({
        error: e instanceof Error ? e.message : 'Erreur chargement produits',
        loadingList: false,
      });
    }
  },

  fetchPromoProducts: async () => {
    const { promoCache, loadingPromo } = get();
    if (loadingPromo || isFresh(promoCache)) return;

    set({ loadingPromo: true, error: null });
    try {
      const res = await publicApi.get<Product[]>('/produits/products/promotion/');
      const data = res.data;
      set({
        promoProducts: data,
        promoCache: makeEntry(data, TTL.MEDIUM),
        loadingPromo: false,
      });
    } catch (e: unknown) {
      set({
        error: e instanceof Error ? e.message : 'Erreur chargement promotions',
        loadingPromo: false,
      });
    }
  },

  fetchProductById: async (id: number) => {
    const { productById, loadingById, products } = get();

    // 1. Cache hit
    const cached = productById[id];
    if (isFresh(cached)) return cached.data;

    // 2. Already being fetched
    if (loadingById[id]) return null;

    // 3. Already present in the full list (no extra API call needed)
    const fromList = products.find((p) => p.id === id);
    if (fromList) {
      set((s) => ({
        productById: { ...s.productById, [id]: makeEntry(fromList, TTL.MEDIUM) },
      }));
      return fromList;
    }

    // 4. Fetch individually
    set((s) => ({ loadingById: { ...s.loadingById, [id]: true } }));
    try {
      const res = await publicApi.get<Product>(`/produits/products/${id}/`);
      const data = res.data;
      set((s) => ({
        productById: { ...s.productById, [id]: makeEntry(data, TTL.MEDIUM) },
        loadingById: { ...s.loadingById, [id]: false },
      }));
      return data;
    } catch {
      set((s) => ({ loadingById: { ...s.loadingById, [id]: false } }));
      return null;
    }
  },

  // Call after a product mutation (price update, stock change …)
  invalidateProduct: (id: number) => {
    set((s) => {
      const byId = { ...s.productById };
      delete byId[id];
      return { productById: byId, productsCache: null, promoCache: null };
    });
  },

  // Full invalidation (e.g. after bulk admin action)
  invalidateAll: () => {
    set({ productsCache: null, promoCache: null, productById: {} });
  },
    }),
    {
      name: 'infotek-products',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        promoProducts: state.promoProducts,
        productsCache: state.productsCache,
        promoCache: state.promoCache,
        productById: state.productById,
      }),
    }
  )
);

export default useProductStore;
