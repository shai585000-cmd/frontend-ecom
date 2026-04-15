import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '../types';

interface WishlistState {
  wishlist: Product[];
  addToLocalWishlist: (product: Product) => void;
  removeFromLocalWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  setWishlist: (products: Product[]) => void;
  getWishlistCount: () => number;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],

      addToLocalWishlist: (product: Product) => {
        set((state) => {
          if (state.wishlist.find(p => p.id === product.id)) {
            return state;
          }
          return { wishlist: [...state.wishlist, product] };
        });
      },
      
      removeFromLocalWishlist: (productId: number) => {
        set((state) => ({
          wishlist: state.wishlist.filter(p => p.id !== productId)
        }));
      },

      isInWishlist: (productId: number) => {
        return get().wishlist.some(p => p.id === productId);
      },
      
      clearWishlist: () => set({ wishlist: [] }),
      
      setWishlist: (products: Product[]) => set({ wishlist: products }),
      
      getWishlistCount: () => get().wishlist.length,
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useWishlistStore;
