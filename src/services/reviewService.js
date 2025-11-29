import apInstance, { publicApi } from './api';

// Recuperer les avis d'un produit
export const getProductReviews = async (productId) => {
  const response = await publicApi.get(`/reviews/product/${productId}/`);
  return response.data;
};

// Recuperer les stats d'un produit
export const getProductReviewStats = async (productId) => {
  const response = await publicApi.get(`/reviews/product/${productId}/stats/`);
  return response.data;
};

// Verifier si l'utilisateur peut laisser un avis
export const canReview = async (productId) => {
  const response = await apInstance.get(`/reviews/can-review/${productId}/`);
  return response.data;
};

// Creer un avis
export const createReview = async (reviewData) => {
  const response = await apInstance.post('/reviews/', reviewData);
  return response.data;
};

// Modifier un avis
export const updateReview = async (reviewId, reviewData) => {
  const response = await apInstance.patch(`/reviews/${reviewId}/`, reviewData);
  return response.data;
};

// Supprimer un avis
export const deleteReview = async (reviewId) => {
  const response = await apInstance.delete(`/reviews/${reviewId}/`);
  return response.data;
};

// Recuperer mes avis
export const getMyReviews = async () => {
  const response = await apInstance.get('/reviews/my_reviews/');
  return response.data;
};

export default {
  getProductReviews,
  getProductReviewStats,
  canReview,
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
};
