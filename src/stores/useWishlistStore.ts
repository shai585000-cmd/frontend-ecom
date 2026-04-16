import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';
import apInstance from '../services/api';
import useAuthStore from '../hooks/authStore';
import { makeEntry, isFresh, TTL } from './lib/cache';
import type { CacheEntry } from './lib/cache';
import type { Product, WishlistItem } from '../types';

// ─── State interface ──────────────────────────────────────────────────────────

interface WishlistStoreState {
  wishlist: Product[];
  // Cache tracks freshness of the server-side wishlist
  wishlistCache: CacheEntry<Product[]> | null;
  loading: boolean;
  error: string | null;

  // ── Server-aware actions ──
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;

  // ── Selector helpers ──
  isInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;

  // ── Shared primitives (used by WishlistButton for local / server paths) ──
  clearWishlist: () => void;
  setWishlist: (products: Product[]) => void;
  addToLocalWishlist: (product: Product) => void;
  removeFromLocalWishlist: (productId: number) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      wishlistCache: null,
      loading: false,
      error: null,

      // ─── fetchWishlist ────────────────────────────────────────────────────
      // Only runs when: authenticated + cache is stale + not already loading.
      // Maps WishlistItem[] or Product[] from the API to Product[].
      fetchWishlist: async () => {
        const { wishlistCache, loading } = get();
        if (loading || isFresh(wishlistCache)) return;

        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        set({ loading: true, error: null });
        try {
          const res = await apInstance.get('/wishlist/');
          const rawData = res.data as WishlistItem[] | Product[];

          // Handle both response shapes: {id, product} or plain product objects
          let products: Product[];
          if (
            Array.isArray(rawData) &&
            rawData.length > 0 &&
            'product' in rawData[0]
          ) {
            products = (rawData as WishlistItem[]).map((item) => item.product);
          } else {
            products = rawData as Product[];
          }

          set({
            wishlist: products,
            wishlistCache: makeEntry(products, TTL.SHORT),
            loading: false,
          });
        } catch (e: unknown) {
          set({
            error: e instanceof Error ? e.message : 'Erreur chargement favoris',
            loading: false,
          });
        }
      },

      // ─── addToWishlist ────────────────────────────────────────────────────
      // Optimistic local update + server POST when authenticated.
      addToWishlist: async (product: Product) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          // Optimistic update
          set((s) => ({
            wishlist: s.wishlist.find((p) => p.id === product.id)
              ? s.wishlist
              : [...s.wishlist, product],
            wishlistCache: null, // invalidate so next fetch re-syncs
          }));
          try {
            await apInstance.post(`/wishlist/add/${product.id}/`);
            toast.success('Ajouté aux favoris');
          } catch {
            // Rollback on failure
            set((s) => ({
              wishlist: s.wishlist.filter((p) => p.id !== product.id),
            }));
            toast.error("Erreur lors de l'ajout aux favoris");
          }
        } else {
          get().addToLocalWishlist(product);
        }
      },

      // ─── removeFromWishlist ───────────────────────────────────────────────
      removeFromWishlist: async (productId: number) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          // Optimistic update
          const snapshot = get().wishlist;
          set((s) => ({
            wishlist: s.wishlist.filter((p) => p.id !== productId),
            wishlistCache: null,
          }));
          try {
            await apInstance.delete(`/wishlist/remove/${productId}/`);
            toast.success('Retiré des favoris');
          } catch {
            // Rollback
            set({ wishlist: snapshot });
            toast.error('Erreur lors de la suppression');
          }
        } else {
          get().removeFromLocalWishlist(productId);
        }
      },

      isInWishlist: (productId: number) =>
        get().wishlist.some((p) => p.id === productId),

      getWishlistCount: () => get().wishlist.length,

      clearWishlist: () => set({ wishlist: [], wishlistCache: null }),

      setWishlist: (products: Product[]) => set({ wishlist: products }),

      // ─── Local-only helpers (used directly by WishlistButton) ─────────────

      addToLocalWishlist: (product: Product) => {
        set((s) => {
          if (s.wishlist.find((p) => p.id === product.id)) return s;
          return { wishlist: [...s.wishlist, product] };
        });
        toast.success('Ajouté aux favoris');
      },

      removeFromLocalWishlist: (productId: number) => {
        set((s) => ({
          wishlist: s.wishlist.filter((p) => p.id !== productId),
        }));
        toast.success('Retiré des favoris');
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the list itself – cache TTL is volatile by nature
      partialize: (state) => ({ wishlist: state.wishlist }),
    }
  )
);

export default useWishlistStore;
