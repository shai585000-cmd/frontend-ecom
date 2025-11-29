import apInstance from './api';

// Créer un paiement pour une commande
export const createPayment = async (paymentData) => {
    const response = await apInstance.post('/payments/', paymentData);
    return response.data;
};

// Récupérer tous les paiements de l'utilisateur
export const getPayments = async () => {
    const response = await apInstance.get('/payments/');
    return response.data;
};

// Récupérer les détails d'un paiement
export const getPaymentById = async (paymentId) => {
    const response = await apInstance.get(`/payments/${paymentId}/`);
    return response.data;
};

// Confirmer un paiement Mobile Money
export const confirmPayment = async (paymentId) => {
    const response = await apInstance.post(`/payments/${paymentId}/confirm/`);
    return response.data;
};

// Annuler un paiement
export const cancelPayment = async (paymentId) => {
    const response = await apInstance.post(`/payments/${paymentId}/cancel/`);
    return response.data;
};

export default {
    createPayment,
    getPayments,
    getPaymentById,
    confirmPayment,
    cancelPayment,
};
