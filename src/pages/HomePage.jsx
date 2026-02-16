import { useEffect, useState } from "react";
import Footer from "../components/Common/Footer";
import Hearder from "../components/Common/Hearder";
import { publicApi } from "../services/api";
import useCartStore from "../hooks/useCartStore";
import { Link } from "react-router-dom";
import WishlistButton from "../components/Common/WishlistButton";
import { ShoppingCart, ChevronRight, Truck, Shield, Headphones, CreditCard, Smartphone, Monitor, Flame, Gift } from "lucide-react";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const getImageUrl = (image) => {
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
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, promotionsRes] = await Promise.all([
          publicApi.get("/produits/products/"),
          publicApi.get("/home/categories/"),
          publicApi.get("/produits/products/promotion/")
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setPromotions(promotionsRes.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des produits:", err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Solutions/Categories cards data
  const solutionCards = [
    { title: "Smartphones Premium", desc: "Les derniers modèles iPhone & Samsung", icon: <Smartphone className="w-8 h-8 text-white" />, link: "/produit?category=1", bg: "from-gray-800 to-gray-900" },
    { title: "Accessoires Tech", desc: "Coques, chargeurs, écouteurs...", icon: <Headphones className="w-8 h-8 text-white" />, link: "/produit?category=3", bg: "from-purple-500 to-purple-600" },
    { title: "Ordinateurs", desc: "Laptops et PC performants", icon: <Monitor className="w-8 h-8 text-white" />, link: "/produit?category=2", bg: "from-green-500 to-green-600" },
    { title: "Promotions", desc: "Jusqu'à -50% sur une sélection", icon: <Flame className="w-8 h-8 text-white" />, link: "/produit?promo=true", bg: "from-red-500 to-red-600" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Hearder />
        <div className="flex-grow flex justify-center items-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Hearder />
        <div className="flex-grow flex justify-center items-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Hearder />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
                Nouveautés 2024
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Découvrez les meilleurs
                <span className="text-red-500"> smartphones</span> du marché
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
                iPhone 15, Samsung Galaxy S24, et bien plus encore. Livraison gratuite et garantie 12 mois.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/produit"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Explorer les produits
                  <ChevronRight size={20} />
                </Link>
                <Link
                  to="/produit?promo=true"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 text-sm sm:text-base"
                >
                  Voir les promos
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0">
                  <Truck className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">Livraison Gratuite</p>
                  <p className="text-xs sm:text-sm text-gray-500">Dès 50 000 FCFA</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0">
                  <Shield className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">Garantie 12 mois</p>
                  <p className="text-xs sm:text-sm text-gray-500">Sur tous les produits</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0">
                  <Headphones className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">Support 24/7</p>
                  <p className="text-xs sm:text-sm text-gray-500">Assistance dédiée</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-red-100 rounded-full flex-shrink-0">
                  <CreditCard className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">Paiement Sécurisé</p>
                  <p className="text-xs sm:text-sm text-gray-500">Mobile Money & CB</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Navigation */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/produit?category=${cat.id}`}
                  className="flex-shrink-0 px-6 py-3 bg-gray-100 hover:bg-red-600 hover:text-white rounded-full font-medium transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Vente Chaude / Hot Sales */}
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Flame className="w-6 h-6 text-red-500" /> Vente Chaude
              </h2>
              <Link to="/produit" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                Voir tout <ChevronRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.slice(0, 10).map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/products/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "/placeholder.svg"; }}
                      />
                      {product.promotion && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          PROMO
                        </span>
                      )}
                      <div className="absolute top-2 right-2">
                        <WishlistButton product={product} size={18} />
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-2 sm:p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-medium text-gray-800 text-xs sm:text-sm line-clamp-2 hover:text-red-600 transition-colors mb-1 sm:mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {product.promotion && product.promotion_price ? (
                          <div className="flex flex-col">
                            <span className="text-red-600 font-bold text-xs sm:text-sm">
                              {parseInt(product.promotion_price).toLocaleString()} Fcfa
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                              {parseInt(product.price).toLocaleString()} Fcfa
                            </span>
                          </div>
                        ) : (
                          <span className="text-red-600 font-bold text-xs sm:text-sm">
                            {parseInt(product.price).toLocaleString()} Fcfa
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="p-1.5 sm:p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-8 sm:py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
              Nos Solutions
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {solutionCards.map((card, index) => (
                <Link
                  key={index}
                  to={card.link}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${card.bg} p-4 sm:p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">{card.icon}</div>
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">{card.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2">{card.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold">
                    ACHETER <ChevronRight size={16} />
                  </span>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Promotions Section */}
        {promotions.length > 0 && (
          <section className="py-8 sm:py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-red-500" /> Offres Spéciales
                </h2>
                <Link to="/produit?promo=true" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                  Voir tout <ChevronRight size={18} />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {promotions.slice(0, 8).map((promo) => (
                  <div
                    key={promo.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-red-100"
                  >
                    <Link to={`/products/${promo.id}`}>
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(promo.image)}
                          alt={promo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = "/placeholder.svg"; }}
                        />
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{Math.round(((promo.price - promo.promotion_price) / promo.price) * 100)}%
                        </span>
                      </div>
                    </Link>
                    
                    <div className="p-2 sm:p-4">
                      <Link to={`/products/${promo.id}`}>
                        <h3 className="font-medium text-gray-800 text-xs sm:text-sm line-clamp-2 hover:text-red-600 transition-colors mb-1 sm:mb-2">
                          {promo.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">
                          {parseInt(promo.promotion_price).toLocaleString()} Fcfa
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                          {parseInt(promo.price).toLocaleString()} Fcfa
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-gray-900 to-red-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Abonnez-vous à notre newsletter
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Recevez nos offres exclusives et les dernières nouveautés directement dans votre boîte mail.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-grow px-6 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                S&apos;abonner
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
