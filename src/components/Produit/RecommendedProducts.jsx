import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ShoppingCart } from 'lucide-react';
import { publicApi } from '../../services/api';
import useCartStore from '../../hooks/useCartStore';
import WishlistButton from '../Common/WishlistButton';

const RecommendedProducts = ({ productId, limit = 4 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  const getImageUrl = (image) => {
    if (!image) return '/placeholder.svg';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    if (image.includes('https%3A') || image.includes('http%3A')) {
      let url = image;
      if (url.startsWith('/media/')) url = url.substring(7);
      url = decodeURIComponent(url);
      if (url.startsWith('https:/') && !url.startsWith('https://')) url = url.replace('https:/', 'https://');
      if (url.startsWith('http:/') && !url.startsWith('http://')) url = url.replace('http:/', 'http://');
      return url;
    }
    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get(`/produits/products/${productId}/recommended/?limit=${limit}`);
        if (response.data?.recommendations) {
          setRecommendations(response.data.recommendations);
        }
      } catch (err) {
        console.error('Erreur recommandations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchRecommendations();
  }, [productId, limit]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
        Recommandation      
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="bg-gray-50 rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
          >
            <Link to={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name || product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <WishlistButton product={product} size={16} />
                </div>
              </div>
            </Link>

            <div className="p-3">
              <Link to={`/products/${product.id}`}>
                <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-red-600 transition-colors">
                  {product.name || product.title}
                </h3>
              </Link>

              <p className="text-red-600 font-bold mt-1">
                {parseFloat(product.price).toLocaleString()} <span className="text-xs">Fcfa</span>
              </p>

              <button
                onClick={() => addToCart(product)}
                className="w-full mt-2 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
              >
                <ShoppingCart size={14} />
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

RecommendedProducts.propTypes = {
  productId: PropTypes.number.isRequired,
  limit: PropTypes.number,
};

export default RecommendedProducts;
