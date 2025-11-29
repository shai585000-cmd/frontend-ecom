import { useState, useEffect } from 'react';
import { Star, User, CheckCircle, Send } from 'lucide-react';
import { getProductReviews, getProductReviewStats, canReview, createReview } from '../../services/reviewService';
import useAuthStore from '../../hooks/authStore';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canUserReview, setCanUserReview] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      const [reviewsData, statsData] = await Promise.all([
        getProductReviews(productId),
        getProductReviewStats(productId)
      ]);
      setReviews(reviewsData);
      setStats(statsData);

      if (isAuthenticated) {
        const canReviewData = await canReview(productId);
        setCanUserReview(canReviewData.can_review);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      setError('Le commentaire est requis');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createReview({
        product: productId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment
      });
      setSuccess(true);
      setShowForm(false);
      setFormData({ rating: 5, title: '', comment: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, interactive = false, onRate }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onRate(star) : undefined}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          disabled={!interactive}
        >
          <Star
            size={interactive ? 24 : 16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );

  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-3">{rating}</span>
        <Star size={14} className="text-yellow-400 fill-yellow-400" />
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400 rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-8 text-gray-500">{count}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-6">Avis clients</h2>

      {/* Stats */}
      {stats && (
        <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b">
          <div className="text-center sm:text-left">
            <div className="text-4xl font-bold text-gray-800">{stats.average_rating}</div>
            <StarRating rating={Math.round(stats.average_rating)} />
            <p className="text-sm text-gray-500 mt-1">{stats.total_reviews} avis</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={stats.rating_distribution[rating] || 0}
                total={stats.total_reviews}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bouton pour laisser un avis */}
      {isAuthenticated && canUserReview && !showForm && !success && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto mb-6 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
        >
          Laisser un avis
        </button>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="text-green-500" size={20} />
          <span className="text-green-700">Merci pour votre avis!</span>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-4">Votre avis</h3>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Note</label>
            <StarRating 
              rating={formData.rating} 
              interactive 
              onRate={(r) => setFormData(prev => ({ ...prev, rating: r }))} 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Titre (optionnel)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Resumez votre avis"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Commentaire *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Partagez votre experience..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Envoi...' : (
                <>
                  <Send size={16} />
                  Publier
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Liste des avis */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Aucun avis pour ce produit</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium">{review.user_name}</span>
                    {review.is_verified_purchase && (
                      <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                        <CheckCircle size={12} />
                        Achat verifie
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {review.title && (
                    <p className="font-medium text-sm mb-1">{review.title}</p>
                  )}
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
