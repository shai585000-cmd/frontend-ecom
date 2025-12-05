import api from './api';

// Recuperer le profil de l'utilisateur connecte
export const getCurrentUser = async () => {
  const response = await api.get('/users/me/');
  return response.data;
};

// Mettre a jour le profil
export const updateProfile = async (profileData) => {
  const response = await api.put('/users/me/', profileData);
  return response.data;
};

// Changer le mot de passe
export const changePassword = async (passwordData) => {
  const response = await api.post('/users/change-password/', passwordData);
  return response.data;
};

export default {
  getCurrentUser,
  updateProfile,
  changePassword,
};
