// Re-export the existing authStore unchanged.
// All improvements (logout-triggered cleanup) are wired in stores/index.ts
// via a Zustand subscription, avoiding circular dependencies.
export { default } from '../hooks/authStore';
export type { AuthState } from '../hooks/authStore';
