// ─── Store re-exports (Zustand kept for UI-only state) ────────────────────────
export { default as useAuthStore } from '../hooks/authStore';

// Type re-exports
export type { AuthState } from '../hooks/authStore';

// ─── Cross-store subscriptions ────────────────────────────────────────────────
// When the user logs out, clear user-specific React Query cache while keeping
// public caches (products, home) intact.

import useAuthStore from '../hooks/authStore';
import { queryClient, queryKeys } from '../lib/queryClient';

let _prevAuth = useAuthStore.getState().isAuthenticated;

useAuthStore.subscribe((state) => {
  const justLoggedOut = _prevAuth && !state.isAuthenticated;
  _prevAuth = state.isAuthenticated;

  if (justLoggedOut) {
    // Clear user-specific queries from React Query cache
    queryClient.removeQueries({ queryKey: queryKeys.wishlist.all });
    queryClient.removeQueries({ queryKey: queryKeys.reviews.mine() });
    queryClient.removeQueries({ queryKey: queryKeys.orders.all });
    queryClient.removeQueries({ queryKey: queryKeys.user.all });
  }
});
