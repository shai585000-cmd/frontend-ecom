import apInstance from './api';


// Créer une commande à partir du panier
export const createOrder = async (orderData) => {
    const response = await apInstance.post('/orders/', orderData);
    return response.data;
};

// Récupérer toutes les commandes de l'utilisateur
export const getOrders = async () => {
    const response = await apInstance.get('/orders/');
    return response.data;
};

// Récupérer les détails d'une commande
export const getOrderById = async (orderId) => {
    const response = await apInstance.get(`/orders/${orderId}/`);
    return response.data;
};

// Annuler une commande
export const cancelOrder = async (orderId) => {
    const response = await apInstance.post(`/orders/${orderId}/cancel/`);
    return response.data;
};

export default {
    createOrder,
    getOrders,
    getOrderById,
    cancelOrder,
};
