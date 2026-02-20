import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Header from '../components/Common/Hearder';
import Footer from '../components/Common/Footer';
import useAuthStore from '../store/authStore';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../hooks/useCartStore';
import { getWishlist, removeFromWishlist } from '../services/wishlistService';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { wishlist: localWishlist, removeFromLocalWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const data = await getWishlist();
          setProducts(data);
        } else {
          setProducts(localWishlist);
        }
      } catch (error) {
        console.error('Erreur chargement wishlist:', error);
        toast.error('Erreur lors du chargement des favoris');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, localWishlist]);

  const handleRemove = async (productId) => {
    try {
      if (isAuthenticated) {
        await removeFromWishlist(productId);
      } else {
        removeFromLocalWishlist(productId);
      }
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Produit retire des favoris');
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* En-tete */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Heart className="text-red-500 fill-current" size={32} />
              Mes Favoris
            </h1>
            <p className="text-gray-600 mt-2">
              {products.length} produit{products.length > 1 ? 's' : ''} dans votre liste de souhaits
            </p>
          </div>

          {/* Liste des produits */}
          {products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Heart className="mx-auto text-gray-300 mb-4" size={64} />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Votre liste de favoris est vide
              </h2>
              <p className="text-gray-600 mb-6">
                Ajoutez des produits a vos favoris pour les retrouver facilement
              </p>
              <Link
                to="/produit"
                className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Decouvrir nos produits
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.promotion && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Promo
                      </span>
                    )}
                  </Link>

                  {/* Contenu */}
                  <div className="p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 hover:text-red-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Prix */}
                    <div className="mb-4">
                      {product.promotion ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-red-600">
                            {product.promotion_price?.toLocaleString()} FCFA
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {product.price?.toLocaleString()} FCFA
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-gray-800">
                          {product.price?.toLocaleString()} FCFA
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <ShoppingCart size={18} />
                        Ajouter au panier
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                        aria-label="Retirer des favoris"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
