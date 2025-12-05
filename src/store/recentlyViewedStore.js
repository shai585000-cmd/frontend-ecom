import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_RECENTLY_VIEWED = 10; // Nombre maximum de produits à garder

const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      
      // Ajouter un produit à la liste des produits vus récemment
      addRecentlyViewed: (product) => {
        set((state) => {
          // Vérifier si le produit existe déjà
          const existingIndex = state.recentlyViewed.findIndex(
            (p) => p.id === product.id
          );
          
          let newRecentlyViewed;
          
          if (existingIndex !== -1) {
            // Si le produit existe déjà, le retirer de sa position actuelle
            newRecentlyViewed = state.recentlyViewed.filter(
              (p) => p.id !== product.id
            );
          } else {
            newRecentlyViewed = [...state.recentlyViewed];
          }
          
          // Ajouter le produit au début de la liste
          newRecentlyViewed.unshift({
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
            viewedAt: new Date().toISOString(),
          });
          
          // Limiter la taille de la liste
          if (newRecentlyViewed.length > MAX_RECENTLY_VIEWED) {
            newRecentlyViewed = newRecentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
          }
          
          return { recentlyViewed: newRecentlyViewed };
        });
      },
      
      // Retirer un produit de la liste
      removeRecentlyViewed: (productId) => {
        set((state) => ({
          recentlyViewed: state.recentlyViewed.filter((p) => p.id !== productId),
        }));
      },
      
      // Vider toute la liste
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
      
      // Obtenir le nombre de produits vus récemment
      getRecentlyViewedCount: () => get().recentlyViewed.length,
      
      // Obtenir les N derniers produits vus
      getLastViewed: (count = 5) => {
        return get().recentlyViewed.slice(0, count);
      },
    }),
    {
      name: 'recently-viewed-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useRecentlyViewedStore;
