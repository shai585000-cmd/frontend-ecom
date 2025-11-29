import axios from 'axios';
import useAuthStore from '../hooks/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apInstance = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const publicApi = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur pour ajouter le token à chaque requête
apInstance.interceptors.request.use(
    (config) => {
        const state = useAuthStore.getState();
        const token = state.tokens?.access;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur de réponse pour gérer le refresh du token
apInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Si erreur 401 et pas déjà en train de retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const state = useAuthStore.getState();
            const refreshToken = state.tokens?.refresh;
            
            if (refreshToken) {
                try {
                    // Appeler l'endpoint de refresh avec axios brut (pas apInstance)
                    const response = await axios.post(`${API_URL}/api/users/token/refresh/`, {
                        refresh: refreshToken
                    });
                    
                    const newAccessToken = response.data.access;
                    
                    // Mettre à jour le store avec le nouveau token
                    useAuthStore.getState().setAuth(state.user, {
                        access: newAccessToken,
                        refresh: refreshToken
                    });
                    
                    // Réessayer la requête originale avec axios brut et le nouveau token
                    return axios({
                        ...originalRequest,
                        headers: {
                            ...originalRequest.headers,
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    });
                } catch (refreshError) {
                    // Si le refresh échoue, déconnecter l'utilisateur
                    console.error('Refresh token expiré, déconnexion...');
                    useAuthStore.getState().clearAuth();
                    localStorage.removeItem('auth-storage');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // Pas de refresh token, rediriger vers login
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default apInstance;