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
          <h1 className="text-3xl font-bold text-gray-700 mb-4">
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
                className="flex items-center gap-4 p-4 mb-4 border-b last:border-b-0 hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 rounded-lg overflow-hidden"
                >
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `${import.meta.env.VITE_API_URL}${product.image}`
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">{product.description}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-xl font-bold text-blue-600">
                      {product.price} Fcfa
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => decrementQuantity(product.id)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <FaMinus className="text-gray-500" />
                    </motion.button>
                    <span className="font-semibold">{product.quantity}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => incrementQuantity(product.id)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <FaPlus className="text-gray-500" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, color: "#EF4444" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 transition-colors duration-300"
                  >
                    <FaTrash />
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