import axios from 'axios';
import logger from '../utils/logger';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Intervalle de ping en millisecondes (10 minutes = 600000ms)
// Render met en veille après 15 minutes d'inactivité, donc on ping toutes les 10 minutes pour plus de sécurité
const PING_INTERVAL = 10 * 60 * 1000;

let intervalId = null;

const pingBackend = async () => {
    try {
        // Utilise un endpoint léger - on peut utiliser /api/products/ ou créer un endpoint /health
        await axios.get(`${API_URL}/api/products/`, {
            timeout: 30000, // 30 secondes de timeout car le cold start peut prendre du temps
        });
        logger.log('[KeepAlive] Backend ping successful:', new Date().toLocaleTimeString());
    } catch (error) {
        // On ne log pas les erreurs réseau car c'est normal si le backend est en train de démarrer
        logger.log('[KeepAlive] Backend ping attempt:', new Date().toLocaleTimeString());
    }
};

export const startKeepAlive = () => {
    if (intervalId) {
        logger.log('[KeepAlive] Already running');
        return;
    }

    // Ping immédiatement au démarrage pour réveiller le backend
    pingBackend();

    // Puis ping toutes les 14 minutes
    intervalId = setInterval(pingBackend, PING_INTERVAL);
    logger.log('[KeepAlive] Service started - pinging every 14 minutes');
};

export const stopKeepAlive = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        logger.log('[KeepAlive] Service stopped');
    }
};

export default {
    start: startKeepAlive,
    stop: stopKeepAlive,
    ping: pingBackend,
};
