import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicApi } from "../services/api";
import useCartStore from "../hooks/useCartStore";
import Header from "../components/Common/Hearder";
import Footer from "../components/Common/Footer";
import ReviewSection from "../components/Reviews/ReviewSection";
import { motion } from "framer-motion";

const ProducPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleAddToCart = useCartStore((state) => state.addToCart);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await publicApi.get(`/produits/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="space-y-8"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src={getImageUrl(product.image)}
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>

          <div className="space-y-8">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-800"
            >
              {product.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg text-gray-600"
            >
              {product.description}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-indigo-600"
            >
              {product.price} Fcfa
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddToCart(product)}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Ajouter au panier
            </motion.button>
          </div>
        </motion.div>

        {/* Section Avis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <ReviewSection productId={parseInt(id)} />
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default ProducPage;
