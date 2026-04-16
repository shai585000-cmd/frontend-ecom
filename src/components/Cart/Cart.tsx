import useCartStore from "../../hooks/useCartStore";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import Header from "../Common/Hearder";

const Cart = () => {
  const cart = useCartStore((state) => state.getCart());
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // Fonction pour gerer les URLs d'images
  const getImageUrl = (image: string | undefined): string => {
    if (!image) return '/placeholder.svg';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    if (image.includes('https%3A') || image.includes('https:/') || image.includes('http%3A') || image.includes('http:/')) {
      let url = image;
      if (url.startsWith('/media/')) url = url.substring(7);
      url = decodeURIComponent(url);
      if (url.startsWith('https:/') && !url.startsWith('https://')) url = url.replace('https:/', 'https://');
      if (url.startsWith('http:/') && !url.startsWith('http://')) url = url.replace('http:/', 'http://');
      return url;
    }
    return `${import.meta.env.VITE_API_URL}${image}`;
  };


  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="text-center">
          <div>
            <FaShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">
            Votre panier est vide
          </h1>
          <p className="text-gray-500 mb-8">
            Découvrez nos produits et commencez votre shopping
          </p>
          <div>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-black text-white rounded-full hover:from-red-600 hover:to-black transition-all duration-300 shadow-lg"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 md:p-8"
    >
      <Header />
      <div className="max-w-4xl mx-auto">
        {/* Bouton retour */}
        <div 
          className="mb-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour a l&apos;accueil
          </Link>
        </div>

        <h1
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
        >
          Mon Panier{" "}
          <span className="text-red-600">({cart.length} articles)</span>
        </h1>
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          {cart.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 mb-4 border-b last:border-b-0 hover:bg-gray-50 rounded-xl"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100">
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-1 hidden sm:block">{product.description}</p>
                <div className="mt-1 sm:mt-2">
                  <span className="text-lg sm:text-xl font-bold text-red-600">
                    {product.price.toLocaleString()} Fcfa
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-full px-2 py-1">
                  <button
                    onClick={() => decrementQuantity(product.id)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200"
                  >
                    <FaMinus className="text-gray-500 text-xs sm:text-sm" />
                  </button>
                  <span className="font-semibold w-6 text-center">{product.quantity}</span>
                  <button
                    onClick={() => incrementQuantity(product.id)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200"
                  >
                    <FaPlus className="text-gray-500 text-xs sm:text-sm" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-2xl font-bold text-red-600">
              {getTotalPrice()} Fcfa
            </span>
          </div>

          <div className="flex flex-col gap-4">
              <Link
                to="/checkout"
                className="block w-full py-4 bg-red-600 text-white rounded-xl text-center font-semibold hover:bg-red-700 shadow-md"
              >
                Procéder au paiement
              </Link>
              <Link
                to="/"
                className="block w-full py-4 border-2 border-gray-200 text-gray-600 rounded-xl text-center font-semibold hover:bg-gray-50"
              >
                Continuer mes achats
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
