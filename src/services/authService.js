import apInstance from './api';
import useAuthStore from '../hooks/authStore';

export const loginUser = async (nom_cli, password) => {
    const { setAuth, setLoading, setError } = useAuthStore.getState();
    
    setLoading(true);
    try {
        const response = await apInstance.post('users/login/', {
            nom_cli,
            password,
        });

        const { user, tokens } = response.data;
        
        // Mettre à jour le store avec les informations de l'utilisateur
        setAuth(user, tokens);
        
        // Mettre à jour le token dans les headers
        apInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

        return { success: true };
    } catch (error) {
        const errorData = error.response?.data;
        const errorMessage = errorData?.error?.error || errorData?.error || 'Erreur de connexion';
        setError(errorMessage);
        return { success: false, error: errorMessage };
    } finally {
        setLoading(false);
    }
};

export const logoutUser = () => {
    const { clearAuth } = useAuthStore.getState();
    
    // Supprimer le token des headers
    delete apInstance.defaults.headers.common['Authorization'];
    
    // Nettoyer le localStorage
    localStorage.removeItem('auth-storage');
    
    // Nettoyer le store
    clearAuth();
    
    // Forcer un rafraîchissement du state
    window.location.reload();
};