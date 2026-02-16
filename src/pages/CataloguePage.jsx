import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, ChevronDown, ShoppingCart, Loader } from 'lucide-react';
import { publicApi } from '../services/api';
import useCartStore from '../hooks/useCartStore';
import Header from '../components/Common/Hearder';
import Footer from '../components/Common/Footer';
import WishlistButton from '../components/Common/WishlistButton';

const PRODUCTS_PER_PAGE = 12;

const CataloguePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || '';
  const promoFilter = searchParams.get('promo') === 'true';
  
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [sortBy, setSortBy] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  
  const observerRef = useRef(null);
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          publicApi.get('/produits/products/'),
          publicApi.get('/home/categories/')
        ]);
        setAllProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Synchroniser selectedCategory avec l'URL
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Mettre a jour l'URL quand la categorie change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [searchTerm, selectedCategory, sortBy]);

  // Filtrer et trier les produits
  const filteredProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.title?.toLowerCase().includes(searchTerm.toLowerCase());
      // Verifier categorie (le champ peut etre category ou categorie selon l'API)
      const productCategoryId = product.categorie?.id || product.categorie || product.category;
      const matchesCategory = !selectedCategory || productCategoryId === parseInt(selectedCategory);
      // Filtrer par promotion si promo=true dans l'URL
      const matchesPromo = !promoFilter || product.is_on_sale || product.discount_percentage > 0 || product.old_price > product.price;
      return matchesSearch && matchesCategory && matchesPromo;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name':
          return (a.name || a.title || '').localeCompare(b.name || b.title || '');
        default:
          return 0;
      }
    });

  // Produits visibles (pour le scroll infini)
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Intersection Observer pour le scroll infini
  const lastProductRef = useCallback((node) => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => prev + PRODUCTS_PER_PAGE);
          setLoadingMore(false);
        }, 300);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name || product.title,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1
    });
  };

  // Import de la fonction utilitaire pour les images
  const getImageUrlHelper = (image) => {
    if (!image) return '/placeholder.svg';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    // Gerer les URLs externes stockees dans ImageField Django
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
  const getImageUrl = getImageUrlHelper;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${promoFilter ? 'from-red-600 to-orange-500' : 'from-blue-600 to-indigo-500'} text-white py-12`}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {promoFilter ? 'Offres Promotionnelles' : 'Notre Catalogue Tech'}
          </h1>
          <p className={promoFilter ? 'text-orange-100' : 'text-blue-100'}>
            {promoFilter 
              ? 'Profitez de nos meilleures offres et réductions exceptionnelles !'
              : 'Découvrez notre sélection de smartphones et accessoires de dernière génération'
            }
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bouton filtres mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg"
            >
              <Filter size={20} />
              Filtres
            </button>

            {/* Filtres desktop */}
            <div className="hidden md:flex gap-4">
              {/* Categorie */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Toutes les categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Tri */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Trier par</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix decroissant</option>
                  <option value="name">Nom A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Vue */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Filtres mobile */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t space-y-4">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
              >
                <option value="">Toutes les categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
              >
                <option value="">Trier par</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix decroissant</option>
                <option value="name">Nom A-Z</option>
              </select>
            </div>
          )}
        </div>

        {/* Resultats */}
        <div className="mb-4 text-gray-600">
          {filteredProducts.length} produit(s) trouve(s)
        </div>

        {/* Grille de produits */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500 text-lg">Aucun produit trouve</p>
            <button
              onClick={() => { setSearchTerm(''); handleCategoryChange(''); }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Reinitialiser les filtres
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleProducts.map((product, index) => (
              <div 
                key={product.id} 
                ref={index === visibleProducts.length - 1 ? lastProductRef : null}
                className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Bouton Wishlist */}
                    <div className="absolute top-2 right-2">
                      <WishlistButton product={product} size={20} />
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 hover:text-blue-600">
                      {product.name || product.title}
                    </h3>
                  </Link>
                  <p className="text-indigo-600 font-bold mb-3">
                    {parseFloat(product.price).toLocaleString()} Fcfa
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    <span className="hidden sm:inline">Ajouter</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {visibleProducts.map((product, index) => (
              <div 
                key={product.id} 
                ref={index === visibleProducts.length - 1 ? lastProductRef : null}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex"
              >
                <Link to={`/products/${product.id}`} className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 relative">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Bouton Wishlist */}
                  <div className="absolute top-2 right-2">
                    <WishlistButton product={product} size={18} />
                  </div>
                </Link>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-medium text-gray-800 text-lg hover:text-blue-600">
                        {product.name || product.title}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-indigo-600 font-bold text-lg">
                      {parseFloat(product.price).toLocaleString()} Fcfa
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Indicateur de chargement */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin text-blue-600" size={32} />
          </div>
        )}


      </div>

      <Footer />
    </div>
  );
};

export default CataloguePage;
