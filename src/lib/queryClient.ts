import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min – pas de refetch si données fraîches
      gcTime: 30 * 60 * 1000,         // 30 min – garde en cache mémoire
      refetchOnWindowFocus: true,      // Refresh quand l'utilisateur revient
      refetchOnReconnect: true,        // Refresh après coupure réseau
      retry: 1,                        // 1 retry sur erreur
    },
  },
});

// ─── Query Keys Factory ─────────────────────────────────────────────────────
// Centralized keys prevent typos and make invalidation easy.

export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    list: () => [...queryKeys.products.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.products.all, 'detail', id] as const,
    promo: () => [...queryKeys.products.all, 'promo'] as const,
    topSelling: (days: number, limit: number) =>
      [...queryKeys.products.all, 'top-selling', days, limit] as const,
  },

  // Home
  home: {
    all: ['home'] as const,
    categories: () => [...queryKeys.home.all, 'categories'] as const,
    hero: () => [...queryKeys.home.all, 'hero'] as const,
    features: () => [...queryKeys.home.all, 'features'] as const,
    solutions: () => [...queryKeys.home.all, 'solutions'] as const,
    banner: () => [...queryKeys.home.all, 'banner'] as const,
    announcements: () => [...queryKeys.home.all, 'announcements'] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: number) =>
      [...queryKeys.reviews.all, 'product', productId] as const,
    stats: (productId: number) =>
      [...queryKeys.reviews.all, 'stats', productId] as const,
    mine: () => [...queryKeys.reviews.all, 'mine'] as const,
  },

  // Wishlist
  wishlist: {
    all: ['wishlist'] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    detail: (id: number) => [...queryKeys.orders.all, 'detail', id] as const,
  },

  // User profile
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
} as const;
