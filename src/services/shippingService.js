import apInstance from './api';
import { publicApi } from './api';

// ==================== ADRESSES ====================

// Récupérer toutes les adresses de l'utilisateur
export const getAddresses = async () => {
    const response = await apInstance.get('/shipping/addresses/');
    return response.data;
};

// Récupérer l'adresse par défaut
export const getDefaultAddress = async () => {
    const response = await apInstance.get('/shipping/addresses/default/');
    return response.data;
};

// Créer une nouvelle adresse
export const createAddress = async (addressData) => {
    const response = await apInstance.post('/shipping/addresses/', addressData);
    return response.data;
};

// Modifier une adresse
export const updateAddress = async (addressId, addressData) => {
    const response = await apInstance.put(`/shipping/addresses/${addressId}/`, addressData);
    return response.data;
};

// Supprimer une adresse
export const deleteAddress = async (addressId) => {
    const response = await apInstance.delete(`/shipping/addresses/${addressId}/`);
    return response.data;
};

// Définir une adresse comme par défaut
export const setDefaultAddress = async (addressId) => {
    const response = await apInstance.post(`/shipping/addresses/${addressId}/set_default/`);
    return response.data;
};

// ==================== ZONES DE LIVRAISON ====================

// Récupérer toutes les zones de livraison
export const getShippingZones = async () => {
    const response = await publicApi.get('/shipping/zones/');
    return response.data;
};

// Récupérer les frais de livraison pour une ville
export const getShippingFeeByCity = async (city) => {
    const response = await publicApi.get(`/shipping/zones/by_city/?city=${encodeURIComponent(city)}`);
    return response.data;
};

export default {
    getAddresses,
    getDefaultAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getShippingZones,
    getShippingFeeByCity,
};
