import useAuthStore from '../auth/authStore';
import { logoutUser } from '../auth/authService';
import type { User, AuthTokens } from '../types';

const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);

  const login = (user: User, tokens: AuthTokens) => {
    setAuth(user, tokens);
  };

  const logout = () => {
    logoutUser();
  };

  return { user, isAuthenticated, isLoading, login, logout };
};

export default useAuth;
