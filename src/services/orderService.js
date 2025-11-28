import api from './api';

// Créer une commande à partir du panier
export const createOrder = async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
};

// Récupérer toutes les commandes de l'utilisateur
export const getOrders = async () => {
    const response = await api.get('/orders/');
    return response.data;
};

// Récupérer les détails d'une commande
export const getOrderById = async (orderId) => {
    const response = await api.get(`/orders/${orderId}/`);
    return response.data;
};

// Annuler une commande
export const cancelOrder = async (orderId) => {
    const response = await api.post(`/orders/${orderId}/cancel/`);
    return response.data;
};

export default {
    createOrder,
    getOrders,
    getOrderById,
    cancelOrder,
};
