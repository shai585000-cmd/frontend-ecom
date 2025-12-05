import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import PropTypes from 'prop-types';
import useAuthStore from '../../hooks/authStore';
import useWishlistStore from '../../store/wishlistStore';
import { addToWishlist, removeFromWishlist, checkInWishlist } from '../../services/wishlistService';
import toast from 'react-hot-toast';

const WishlistButton = ({ product, size = 24, className = '' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { addToLocalWishlist, removeFromLocalWishlist, isInWishlist: checkLocal } = useWishlistStore();

  useEffect(() => {
    const checkWishlist = async () => {
      if (isAuthenticated) {
        try {
          const result = await checkInWishlist(product.id);
          setIsInWishlist(result.in_wishlist);
        } catch (error) {
          console.error('Erreur verification wishlist:', error);
        }
      } else {
        setIsInWishlist(checkLocal(product.id));
      }
    };
    checkWishlist();
  }, [product.id, isAuthenticated, checkLocal]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    
    try {
      if (isAuthenticated) {
        if (isInWishlist) {
          await removeFromWishlist(product.id);
          toast.success('Retire des favoris');
        } else {
          await addToWishlist(product.id);
          toast.success('Ajoute aux favoris');
        }
      } else {
        if (isInWishlist) {
          removeFromLocalWishlist(product.id);
          toast.success('Retire des favoris');
        } else {
          addToLocalWishlist(product);
          toast.success('Ajoute aux favoris');
        }
      }
      setIsInWishlist(!isInWishlist);
    } catch {
      toast.error('Erreur lors de la mise a jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-all ${
        isInWishlist 
          ? 'bg-red-50 text-red-500' 
          : 'bg-gray-100 text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} ${className}`}
      aria-label={isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart 
        size={size} 
        className={isInWishlist ? 'fill-current' : ''} 
      />
    </button>
  );
};

WishlistButton.propTypes = {
  product: PropTypes.object.isRequired,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default WishlistButton;
