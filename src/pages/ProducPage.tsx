import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProductStore from "../stores/useProductStore";
import useReviewStore from "../stores/useReviewStore";
import useCartStore from "../hooks/useCartStore";
import useRecentlyViewedStore from "../store/recentlyViewedStore";
import Header from "../components/Common/Hearder";
import Footer from "../components/Common/Footer";
import ReviewSection from "../components/Reviews/ReviewSection";
import RecentlyViewedCarousel from "../components/Produit/RecentlyViewedCarousel";
import RecommendedProducts from "../components/Produit/RecommendedProducts";
import { Star, Package, Phone, AlertCircle, Truck, ShoppingCart } from "lucide-react";
import logger from "../utils/logger";
import type { ReviewStats } from "../types";

interface Product {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  images?: { id: number; image: string }[];
  price: number;
  promotion?: boolean;
  promotion_price?: number;
  stock: number;
  brand?: { name?: string } | string;
  categorie?: { name?: string } | string;
  color?: string;
  ram?: string;
  storage?: string;
  screen_size?: string;
  operating_system?: string;
  network?: string;
}

const ProducPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBelow, setShowBelow] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const belowRef = useRef<HTMLDivElement>(null);
  const fetchProductByIdStore = useProductStore((s) => s.fetchProductById);
  const fetchStats = useReviewStore((s) => s.fetchStats);
  const handleAddToCart = useCartStore((state) => state.addToCart);
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addRecentlyViewed);

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

  useEffect(() => {
    const load = async () => {
      try {
        const [p, stats] = await Promise.all([
          fetchProductByIdStore(Number(id)),
          fetchStats(Number(id)),
        ]);
        if (!p) { navigate("/products"); return; }
        setProduct(p as Product);
        setReviewStats(stats);
        addRecentlyViewed(p as never);
        // Set selected image from first available image
        const productImages = (p as Product).images || [];
        const firstImage = productImages.length > 0 ? productImages[0].image : (p as Product).image;
        setSelectedImage(getImageUrl(firstImage));
      } catch (error) {
        logger.error("Erreur lors de la récupération du produit:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate, addRecentlyViewed, fetchProductByIdStore, fetchStats]);

  // Charger les sections basses uniquement quand l'utilisateur scrolle vers elles
  useEffect(() => {
    if (!belowRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShowBelow(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(belowRef.current);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="w-full h-[400px] bg-gray-200 rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-16 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-14 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center text-gray-500">Produit non trouvé</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche - Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <img
                src={selectedImage}
                alt={product.name || product.title}
                className="w-full h-[400px] md:h-[500px] object-contain rounded-xl"
              />
            </div>
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(getImageUrl(img.image))}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImage === getImageUrl(img.image)
                        ? 'border-red-600 ring-2 ring-red-200'
                        : 'border-gray-200 hover:border-red-400'
                    }`}
                  >
                    <img
                      src={getImageUrl(img.image)}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colonne droite - Informations */}
          <div className="space-y-6">
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
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                  <Package size={18} className="text-red-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Marque: <span className="text-red-600 font-semibold">{typeof product.brand === 'object' ? product.brand?.name : product.brand}</span>
                  </span>
                </div>
              )}
              {product.categorie && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <Package size={18} className="text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    Catégorie: <span className="text-gray-800 font-semibold">{typeof product.categorie === 'object' ? product.categorie?.name : product.categorie}</span>
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
            <div className="bg-gradient-to-r from-red-50 to-gray-50 rounded-xl p-6 border border-red-200">
              {product.promotion && product.promotion_price ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-4xl font-bold text-red-600">
                      {parseFloat(String(product.promotion_price)).toLocaleString()} Fcfa
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      -{Math.round(((product.price - Number(product.promotion_price)) / product.price) * 100)}%
                    </span>
                  </div>
                  <div className="text-lg text-gray-500 line-through">
                    {parseFloat(String(product.price)).toLocaleString()} Fcfa
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    Promotion en cours !
                  </div>
                </div>
              ) : (
                <div className="text-3xl md:text-4xl font-bold text-red-600">
                  {parseFloat(String(product.price)).toLocaleString()} Fcfa
                </div>
              )}
            </div>

            {/* Bouton Acheter */}
            <button
              onClick={() => handleAddToCart(product as never)}
              disabled={product.stock === 0}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg shadow-md flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={24} />
              {product.stock === 0 ? "Produit indisponible" : "Ajouter au panier"}
            </button>

            {/* Informations supplémentaires */}
            <div className="space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-red-600 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">Besoin d&apos;aide pour commander ?</span>
                  <br />
                  Appelez-nous au <span className="font-bold text-red-600">25 20 00 61 61</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-red-600 mt-1 flex-shrink-0" />
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
          </div>
        </div>

        {/* Sections chargées en lazy via IntersectionObserver */}
        <div ref={belowRef}>
          {showBelow && (
            <>
              <div className="mt-12">
                <RecommendedProducts productId={parseInt(id ?? '0')} limit={8} />
              </div>
              <div className="mt-12">
                <ReviewSection productId={parseInt(id ?? '0')} />
              </div>
              <div className="mt-12">
                <RecentlyViewedCarousel currentProductId={parseInt(id ?? '0')} />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProducPage;
