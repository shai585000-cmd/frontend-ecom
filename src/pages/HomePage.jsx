import { useEffect, useState } from "react";
import Banniere from "../components/Home/Banniere";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../components/Common/Footer";
import Hearder from "../components/Common/Hearder";
import { publicApi } from "../services/api";
import useCartStore from "../hooks/useCartStore";
import { Link } from "react-router-dom";
import WishlistButton from "../components/Common/WishlistButton";

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

  // Fonction pour gerer les URLs d'images
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
    AOS.init({
      duration: 100,
      once: true,
      offset: 30,
    });

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get("/produits/products/");
        const response1 = await publicApi.get("/home/categories/");
        const response2 = await publicApi.get("/produits/products/promotion/");
        setProducts(response.data);
        setCategories(response1.data);
        setPromotions(response2.data);
        setError(null);
        console.log(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    console.log(products);
    console.log(categories);
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500">
          <div className="h-full w-full rounded-full border-t-4 border-b-4 border-blue-200 animate-ping"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-50 to-pink-50">
        <div
          className="text-red-500 text-center p-8 bg-white rounded-lg shadow-xl"
          data-aos="zoom-in-left"
        >
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Hearder />
      </div>
      <div className="flex-grow relative bg-gradient-to-r from-blue-50 to-indigo-50">
        <div data-aos="fade-down">
          <Banniere />
        </div>
        <div className="container mx-auto">
          <h2
            className="text-4xl font-bold text-center text-gray-800 mb-12"
            data-aos="fade-up"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Catégories
            </span>
          </h2>
        </div>
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-16 px-4 container mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className="transform hover:-translate-y-2 transition-all duration-200"
              data-aos="fade-up"
            >
              <Link to={`/produit?category=${category.id}`}>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 transition-all duration-200 border border-gray-100 cursor-pointer">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
                    {category.name}
                  </h2>
                  <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mt-4 rounded"></div>
                </div>
              </Link>
            </div>
          ))}
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2
              className="text-4xl font-bold text-center text-gray-800 mb-12"
              data-aos="fade-up"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Produits en promotion
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {promotions.map((promo, index) => (
                <div
                  key={promo.id}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                    {promo.image && (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={getImageUrl(promo.image)}
                          alt={promo.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                        {promo.promotion && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-lg transform -rotate-12">
                            Promo
                          </div>
                        )}
                      </div>
                    )}
                
                  <div className="p-6">
                   <Link to={`/products/${promo.id}`}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {promo.name}
                    </h3>
                    </Link>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 hover:line-clamp-none transition-all duration-200">
                      {promo.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        {promo.promotion ? (
                          <div className="space-x-2">
                            <span className="text-xl font-bold text-red-500">
                              {promo.promotion_price}Fcfa
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {promo.price}Fcfa
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-gray-800">
                            {promo.price}Fcfa
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(promo)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div>
            <h2></h2>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2
              className="text-4xl font-bold text-center text-gray-800 mb-12"
              data-aos="fade-up"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Produits phares
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                    {product.image && (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                        {product.promotion && (
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full shadow-lg transform -rotate-12">
                            Promo
                          </div>
                        )}
                        {/* Bouton Wishlist */}
                        <div className="absolute top-3 left-3">
                          <WishlistButton product={product} size={20} />
                        </div>
                      </div>
                    )}
                  <div className="p-6">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    </Link>


                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 hover:line-clamp-none transition-all duration-200">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        {product.promotion ? (
                          <div className="space-x-2">
                            <span className="text-xl font-bold text-red-500">
                              {product.promotion_price}Fcfa
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {product.price}Fcfa
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-gray-800">
                            {product.price}Fcfa
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
