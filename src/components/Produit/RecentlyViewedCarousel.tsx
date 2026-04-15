import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useRecentlyViewedStore from '../../store/recentlyViewedStore';
import useCartStore from '../../hooks/useCartStore';
import WishlistButton from '../Common/WishlistButton';

const RecentlyViewedCarousel = ({ currentProductId }) => {
  const recentlyViewed = useRecentlyViewedStore((state) => state.recentlyViewed);
  const addToCart = useCartStore((state) => state.addToCart);

  const filteredProducts = currentProductId 
    ? recentlyViewed.filter(product => product.id !== currentProductId).slice(0, 4)
    : recentlyViewed.slice(0, 4);

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

  if (filteredProducts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
        Vus recemment
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-gray-50 rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
          >
            <Link to={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.title || product.name}
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
                  {product.title || product.name}
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

RecentlyViewedCarousel.propTypes = {
  currentProductId: PropTypes.number,
};

export default RecentlyViewedCarousel;
