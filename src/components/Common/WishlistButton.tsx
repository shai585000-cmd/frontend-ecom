import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import PropTypes from 'prop-types';
import useWishlistStore from '../../stores/useWishlistStore';
import type { Product } from '../../types';

const WishlistButton = ({ product, size = 24, className = '' }: { product: Product; size?: number; className?: string }) => {
  const [loading, setLoading] = useState(false);

  const inWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-all ${
        inWishlist
          ? 'bg-red-50 text-red-500'
          : 'bg-gray-100 text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} ${className}`}
      aria-label={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart size={size} className={inWishlist ? 'fill-current' : ''} />
    </button>
  );
};

WishlistButton.propTypes = {
  product: PropTypes.object.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default WishlistButton;
