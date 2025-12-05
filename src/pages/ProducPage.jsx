import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicApi } from "../services/api";
import { getProductReviewStats } from "../services/reviewService";
import useCartStore from "../hooks/useCartStore";
import useRecentlyViewedStore from "../store/recentlyViewedStore";
import Header from "../components/Common/Hearder";
import Footer from "../components/Common/Footer";
import ReviewSection from "../components/Reviews/ReviewSection";
import RecentlyViewedCarousel from "../components/Produit/RecentlyViewedCarousel";
import RecommendedProducts from "../components/Produit/RecommendedProducts";
import { motion } from "framer-motion";
import { Star, Package, Phone, AlertCircle, Truck, ShoppingCart } from "lucide-react";

const ProducPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleAddToCart = useCartStore((state) => state.addToCart);
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addRecentlyViewed);

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
        const [productResponse, statsResponse] = await Promise.all([
          publicApi.get(`/produits/products/${id}/`),
          getProductReviewStats(id).catch(() => ({ average_rating: 0, total_reviews: 0 }))
        ]);
        setProduct(productResponse.data);
        setReviewStats(statsResponse);
        // Ajouter le produit à la liste des produits vus récemment
        addRecentlyViewed(productResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, addRecentlyViewed]);

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
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Colonne gauche - Image */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <img
                src={getImageUrl(product.image)}
                alt={product.name || product.title}
                className="w-full h-[400px] md:h-[500px] object-contain rounded-xl"
              />
            </div>
          </motion.div>

          {/* Colonne droite - Informations */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Titre */}
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              {product.name || product.title}
            </h1>

            {/* Description */}
            {product.description && (
              <div className="text-gray-700 leading-relaxed">
                {product.description}
              </div>
            )}

            {/* Marque et Catégorie */}
            <div className="flex flex-wrap gap-4">
              {product.brand && (
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg">
                  <Package size={18} className="text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Marque: <span className="text-indigo-600 font-semibold">{product.brand.name || product.brand}</span>
                  </span>
                </div>
              )}
              {product.categorie && (
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                  <Package size={18} className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Catégorie: <span className="text-purple-600 font-semibold">{product.categorie.name || product.categorie}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Stock restant */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <Package size={20} className={product.stock > 0 ? "text-green-600" : "text-red-600"} />
              <span className="font-medium">
                {product.stock > 0 ? (
                  <span className="text-green-600">En stock: {product.stock} unité(s) disponible(s)</span>
                ) : (
                  <span className="text-red-600">Rupture de stock</span>
                )}
              </span>
            </div>

            {/* Note moyenne */}
            {reviewStats && reviewStats.total_reviews > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={20}
                      className={index < Math.round(reviewStats.average_rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-900">
                  {reviewStats.average_rating.toFixed(1)}/5
                </span>
                <span className="text-sm text-gray-600">
                  ({reviewStats.total_reviews} avis)
                </span>
              </div>
            )}

            {/* Options du produit (spécifications techniques) */}
            {(product.ram || product.storage || product.color || product.screen_size || product.operating_system) && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">Caractéristiques</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.color && (
                    <div className="text-sm">
                      <span className="text-gray-600">Couleur:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.color}</span>
                    </div>
                  )}
                  {product.ram && (
                    <div className="text-sm">
                      <span className="text-gray-600">RAM:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.ram} Go</span>
                    </div>
                  )}
                  {product.storage && (
                    <div className="text-sm">
                      <span className="text-gray-600">Stockage:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.storage} Go</span>
                    </div>
                  )}
                  {product.screen_size && (
                    <div className="text-sm">
                      <span className="text-gray-600">Écran:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.screen_size}&quot;</span>
                    </div>
                  )}
                  {product.operating_system && (
                    <div className="text-sm">
                      <span className="text-gray-600">OS:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.operating_system}</span>
                    </div>
                  )}
                  {product.network && (
                    <div className="text-sm">
                      <span className="text-gray-600">Réseau:</span>
                      <span className="ml-2 font-medium text-gray-900">{product.network.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Prix et Promotion */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              {product.promotion && product.promotion_price ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-4xl font-bold text-indigo-600">
                      {parseFloat(product.promotion_price).toLocaleString()} Fcfa
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      -{Math.round(((product.price - product.promotion_price) / product.price) * 100)}%
                    </span>
                  </div>
                  <div className="text-lg text-gray-500 line-through">
                    {parseFloat(product.price).toLocaleString()} Fcfa
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    Promotion en cours !
                  </div>
                </div>
              ) : (
                <div className="text-3xl md:text-4xl font-bold text-indigo-600">
                  {parseFloat(product.price).toLocaleString()} Fcfa
                </div>
              )}
            </div>

            {/* Bouton Acheter */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={24} />
              {product.stock === 0 ? "Produit indisponible" : "Ajouter au panier"}
            </motion.button>

            {/* Informations supplémentaires */}
            <div className="space-y-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Besoin d&apos;aide pour commander ?</span>
                  <br />
                  Appelez-nous au <span className="font-bold text-blue-600">25 20 00 61 61</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  Payez moins de frais en choisissant la livraison dans nos agences.
                  <br />
                  <span className="font-semibold text-green-600">Livraison gratuite</span> sur des milliers de produits, commande minimum de 7 500 FCFA.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-orange-600 mt-1 flex-shrink-0" />
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium underline text-left">
                  Signaler des informations incorrectes liées au produit
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Section Recommandations IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <RecommendedProducts productId={parseInt(id)} limit={8} />
        </motion.div>

        {/* Section Avis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <ReviewSection productId={parseInt(id)} />
        </motion.div>

        {/* Section Produits vus récemment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <RecentlyViewedCarousel currentProductId={parseInt(id)} />
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default ProducPage;
