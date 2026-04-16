import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Header from '../components/Common/Hearder';
import Footer from '../components/Common/Footer';
import useWishlistStore from '../stores/useWishlistStore';
import useCartStore from '../hooks/useCartStore';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const wishlist = useWishlistStore((s) => s.wishlist);
  const loading = useWishlistStore((s) => s.loading);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const { addToCart } = useCartStore();

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (productId: number) => {
    try {
      await removeFromWishlist(productId);
      toast.success('Produit retiré des favoris');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAddToCart = (product: unknown) => {
    addToCart(product as never);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="h-12 w-64 bg-gray-200 rounded mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
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
              {wishlist.length} produit{wishlist.length > 1 ? 's' : ''} dans votre liste de souhaits
            </p>
          </div>

          {/* Liste des produits */}
          {wishlist.length === 0 ? (
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
              {wishlist.map((product) => (
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
