// ─── Store re-exports ─────────────────────────────────────────────────────────
export { default as useProductStore } from './useProductStore';
export { default as useHomeStore } from './useHomeStore';
export { default as useWishlistStore } from './useWishlistStore';
export { default as useReviewStore } from './useReviewStore';
export { default as useAuthStore } from '../hooks/authStore';

// Type re-exports
export type { ReviewStats } from './useReviewStore';
export type { AuthState } from '../hooks/authStore';

// ─── Cross-store subscriptions ────────────────────────────────────────────────
// Wired here (not inside individual stores) to avoid circular imports.
// Rule: when the user logs out, clear all user-specific data while keeping
//       public caches (products, home) intact.

import useAuthStore from '../hooks/authStore';
import useWishlistStore from './useWishlistStore';
import useReviewStore from './useReviewStore';

let _prevAuth = useAuthStore.getState().isAuthenticated;

useAuthStore.subscribe((state) => {
  const justLoggedOut = _prevAuth && !state.isAuthenticated;
  _prevAuth = state.isAuthenticated;

  if (justLoggedOut) {
    useWishlistStore.getState().clearWishlist();
    useReviewStore.getState().clearUserData();
  }
});
