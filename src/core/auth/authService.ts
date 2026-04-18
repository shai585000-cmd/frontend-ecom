import apInstance from '../api/client';
import useAuthStore from './authStore';

export const loginUser = async (nom_cli: string, password: string) => {
    const { setAuth, setLoading, setError } = useAuthStore.getState();

    setLoading(true);
    try {
        const response = await apInstance.post('users/login/', { nom_cli, password });
        const { user, tokens } = response.data;
        setAuth(user, tokens);
        apInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
        return { success: true };
    } catch (error: unknown) {
        const axiosError = error as { response?: { data?: { error?: string | { error?: string } } } };
        const errorData = axiosError.response?.data;
        const rawError = errorData?.error;
        const errorMessage = (typeof rawError === 'object' ? rawError?.error : rawError) ?? 'Erreur de connexion';
        setError(errorMessage);
        return { success: false, error: errorMessage };
    } finally {
        setLoading(false);
    }
};

export const logoutUser = () => {
    const { clearAuth } = useAuthStore.getState();
    delete apInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth-storage');
    clearAuth();
    window.location.reload();
};
