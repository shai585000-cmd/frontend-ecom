import axios from 'axios';
import useAuthStore from '../auth/authStore';
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
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort();
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
    (error) => Promise.reject(error)
);

const publicRoutes = ['/orders/'];

// Intercepteur de réponse pour gérer le refresh du token
apInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isPublicRoute = publicRoutes.some(route => originalRequest.url?.includes(route));

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const state = useAuthStore.getState();
            const refreshToken = state.tokens?.refresh;

            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}/api/users/token/refresh/`, {
                        refresh: refreshToken
                    });
                    const newAccessToken = response.data.access;
                    useAuthStore.getState().setAuth(state.user!, {
                        access: newAccessToken,
                        refresh: refreshToken
                    });
                    return axios({
                        ...originalRequest,
                        headers: {
                            ...originalRequest.headers,
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    });
                } catch (refreshError) {
                    if (!isPublicRoute) {
                        logger.error('Refresh token expiré, déconnexion...');
                        useAuthStore.getState().clearAuth();
                        localStorage.removeItem('auth-storage');
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            } else if (!isPublicRoute) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apInstance;
