import axios from 'axios';
import useAuthStore from '../hooks/authStore';
import logger from '../utils/logger';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Cache mémoire pour les requêtes GET publiques
const TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: unknown; expiresAt: number }>();

export function clearApiCache(urlPattern?: string) {
  if (!urlPattern) { cache.clear(); return; }
  for (const key of cache.keys()) {
    if (key.includes(urlPattern)) cache.delete(key);
  }
}

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

// Intercepteur requête : retourner depuis le cache si dispo
publicApi.interceptors.request.use((config) => {
    if (config.method?.toLowerCase() !== 'get') return config;
    const key = (config.baseURL ?? '') + (config.url ?? '') + JSON.stringify(config.params ?? '');
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
        // Annuler la vraie requête et retourner le cache
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort();
        // Stocker la clé pour l'intercepteur de réponse
        config.headers['x-cache-key'] = key;
        config.headers['x-cache-hit'] = 'true';
    }
    return config;
});

// Intercepteur réponse : mettre en cache + gérer les hits
publicApi.interceptors.response.use(
    (response) => {
        if (response.config.method?.toLowerCase() === 'get') {
            const key = (response.config.baseURL ?? '') + (response.config.url ?? '') + JSON.stringify(response.config.params ?? '');
            cache.set(key, { data: response.data, expiresAt: Date.now() + TTL_MS });
        }
        return response;
    },
    (error) => {
        // Si abort causé par un cache hit, retourner les données du cache
        if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
            const key = error.config?.headers?.['x-cache-key'];
            if (key) {
                const cached = cache.get(key);
                if (cached) {
                    return Promise.resolve({ data: cached.data, status: 200, headers: {}, config: error.config });
                }
            }
        }
        return Promise.reject(error);
    }
);

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

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = ['/orders/'];

// Intercepteur de réponse pour gérer le refresh du token
apInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Vérifier si c'est une route publique (ne pas rediriger vers login)
        const isPublicRoute = publicRoutes.some(route => originalRequest.url?.includes(route));
        
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
                    useAuthStore.getState().setAuth(state.user!, {
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
                    // Si le refresh échoue et ce n'est pas une route publique, déconnecter
                    if (!isPublicRoute) {
                        logger.error('Refresh token expiré, déconnexion...');
                        useAuthStore.getState().clearAuth();
                        localStorage.removeItem('auth-storage');
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            } else if (!isPublicRoute) {
                // Pas de refresh token et pas une route publique, rediriger vers login
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default apInstance;
