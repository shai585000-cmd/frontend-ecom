import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      
      // Pour utilisateurs non connectes (localStorage)
      addToLocalWishlist: (product) => {
        set((state) => {
          if (state.wishlist.find(p => p.id === product.id)) {
            return state;
          }
          return { wishlist: [...state.wishlist, product] };
        });
      },
      
      removeFromLocalWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter(p => p.id !== productId)
        }));
      },
      
      isInWishlist: (productId) => {
        return get().wishlist.some(p => p.id === productId);
      },
      
      clearWishlist: () => set({ wishlist: [] }),
      
      setWishlist: (products) => set({ wishlist: products }),
      
      getWishlistCount: () => get().wishlist.length,
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;
