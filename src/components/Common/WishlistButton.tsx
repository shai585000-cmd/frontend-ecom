import React from 'react';
import { Heart } from 'lucide-react';
import PropTypes from 'prop-types';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../../hooks/queries/useWishlistQueries';
import type { Product } from '../../types';

const WishlistButton = ({ product, size = 24, className = '' }: { product: Product; size?: number; className?: string }) => {
  const { data: wishlist = [] } = useWishlist();
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const inWishlist = wishlist.some((p) => p.id === product.id);
  const loading = addMutation.isPending || removeMutation.isPending;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeMutation.mutate(product.id);
    } else {
      addMutation.mutate(product);
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
