// Called on logout — clears user-specific data while keeping
// product and home caches intact (no unnecessary re-fetches).
import useWishlistStore from '../useWishlistStore';
import useReviewStore from '../useReviewStore';

export function clearUserStores(): void {
  useWishlistStore.getState().clearWishlist();
  useReviewStore.getState().clearUserData();
}
