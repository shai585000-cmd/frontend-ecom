import axios from 'axios';
import useAuthStore from '../hooks/authStore';

const apInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const publicApi = axios.create({
    baseURL: 'http://localhost:8000/api',
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

export default apInstance;