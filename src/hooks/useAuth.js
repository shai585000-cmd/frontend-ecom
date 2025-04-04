// src/hooks/useAuth.js
import useAuthStore from '../hooks/useAuthStore';

const useAuth = () => {
  // Accès à l'état et aux actions via Zustand
  const { user, login, logout } = useAuthStore(state => ({
    user: state.user,
    login: state.login,
    logout: state.logout,
  }));

  return { user, login, logout };
};

export default useAuth;
