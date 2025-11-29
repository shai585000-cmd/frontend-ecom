import useCartStore from "../../hooks/useCartStore";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Common/Hearder";

const Cart = () => {
  const cart = useCartStore((state) => state.getCart());
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // Fonction pour gerer les URLs d'images
  const getImageUrl = (image) => {
    if (!image) return '/placeholder.jpg';
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

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  if (!cart || cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="text-center"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 1, delay: 0.5 },
            }}
          >
            <FaShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">
            Votre panier est vide
          </h1>
          <p className="text-gray-500 mb-8">
            Découvrez nos produits et commencez votre shopping
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg"
            >
              Continuer mes achats
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-8"
    >
      <Header />
      <div className="max-w-4xl mx-auto">
        {/* Bouton retour */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour a l&apos;accueil
          </Link>
        </motion.div>

        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
        >
          Mon Panier{" "}
          <span className="text-blue-600">({cart.length} articles)</span>
        </motion.h1>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <AnimatePresence>
            {cart.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 mb-4 border-b last:border-b-0 hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0"
                >
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-1 hidden sm:block">{product.description}</p>
                  <div className="mt-1 sm:mt-2">
                    <span className="text-lg sm:text-xl font-bold text-blue-600">
                      {product.price.toLocaleString()} Fcfa
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 rounded-full px-2 py-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => decrementQuantity(product.id)}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200"
                    >
                      <FaMinus className="text-gray-500 text-xs sm:text-sm" />
                    </motion.button>
                    <span className="font-semibold w-6 text-center">{product.quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => incrementQuantity(product.id)}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-gray-200"
                    >
                      <FaPlus className="text-gray-500 text-xs sm:text-sm" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FaTrash size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold">Total</span>
            <motion.span
              key={getTotalPrice()}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-blue-600"
            >
              {getTotalPrice()} Fcfa
            </motion.span>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                to="/checkout"
                className="block w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-center font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Procéder au paiement
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                to="/"
                className="block w-full py-4 border-2 border-gray-200 text-gray-600 rounded-xl text-center font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Continuer mes achats
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;