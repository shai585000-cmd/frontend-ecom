import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, LogOut, Package, Settings, ChevronDown, Menu, X, Gift, Smartphone, Monitor, Headphones, Flame } from "lucide-react";
import useAuthStore from "../../hooks/authStore";
import { logoutUser } from "../../services/authService";
import useCartStore from "../../hooks/useCartStore";
import useWishlistStore from "../../store/wishlistStore";
import { publicApi } from "../../services/api";

const Hearder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const profileMenuRef = useRef(null);
  const productsMenuRef = useRef(null);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.getCartLength());
  const wishlistCount = useWishlistStore((state) => state.getWishlistCount());

  // Récupérer les annonces depuis l'API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await publicApi.get("/home/announcements/");
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des annonces:", error);
        // Fallback avec des annonces par défaut
        setAnnouncements([
          { id: 1, text: "Livraison GRATUITE pour toute commande supérieure à 50 000 FCFA", emoji: "🔥" },
          { id: 2, text: "Nouveaux iPhone 15 disponibles !", emoji: "📱" },
          { id: 3, text: "Garantie 12 mois sur tous nos produits", emoji: "⚡" },
        ]);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produit?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const productCategories = [
    { name: "Tous les produits", path: "/produit", icon: null },
    { name: "Nouveautés", path: "/produit?category=new", icon: <Gift size={16} className="text-red-500" /> },
    { name: "Smartphones", path: "/produit?category=1", icon: <Smartphone size={16} className="text-red-500" /> },
    { name: "Ordinateurs", path: "/produit?category=2", icon: <Monitor size={16} className="text-red-500" /> },
    { name: "Accessoires", path: "/produit?category=3", icon: <Headphones size={16} className="text-red-500" /> },
    { name: "Promotions", path: "/produit?promo=true", icon: <Flame size={16} className="text-red-500" /> },
  ];

  const showDashboard = user?.commerçant;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target)) {
        setProductsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Barre d'annonce */}
      <div className="bg-gradient-to-r from-gray-900 to-red-600 text-white text-center py-2 text-sm font-medium overflow-hidden">
        <div className="whitespace-nowrap overflow-hidden">
          <span className="animate-marquee">
            {announcements.length > 0 ? (
              <>
                {announcements.map((ann, index) => (
                  <span key={ann.id || index}>
                    {ann.emoji} {ann.text} {index < announcements.length - 1 ? " | " : ""}
                  </span>
                ))}
                &nbsp;&nbsp;&nbsp;&nbsp;
                {announcements.map((ann, index) => (
                  <span key={`dup-${ann.id || index}`}>
                    {ann.emoji} {ann.text} {index < announcements.length - 1 ? " | " : ""}
                  </span>
                ))}
              </>
            ) : (
              <>🔥 Bienvenue sur INFOTEK 🔥</>
            )}
          </span>
        </div>
      </div>

      {/* Header principal */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="text-2xl md:text-3xl font-bold">
                <span className="text-gray-900">INFO</span>
                <span className="text-red-600">TEK</span>
              </div>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Accueil
              </Link>
              
              {/* Menu Produits avec dropdown */}
              <div className="relative" ref={productsMenuRef}>
                <button
                  onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                  className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  Produits
                  <ChevronDown size={16} className={`transition-transform ${productsMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {productsMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {productCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to={cat.path}
                        onClick={() => setProductsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {cat.icon} {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/a-propos" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                À propos
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-5">
              {/* Recherche */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Search size={22} />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Panier */}
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                <ShoppingCart size={22} />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <User size={22} />
                    <span className="hidden md:inline text-sm font-medium">{user?.nom_cli || 'Mon compte'}</span>
                    <ChevronDown size={16} className={`hidden md:block transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{user?.nom_cli || user?.username}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <User size={18} />
                          Mon profil
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Package size={18} />
                          Mes commandes
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Heart size={18} />
                          Mes favoris
                          {wishlistCount > 0 && (
                            <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>

                        {showDashboard && (
                          <Link
                            to={`/dashboard/${user?.id}`}
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Settings size={18} />
                            Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <User size={18} />
                  Connexion
                </Link>
              )}

              {/* Menu mobile */}
              <button
                className="lg:hidden p-2 text-gray-600"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        {searchOpen && (
          <div className="border-t border-gray-100 py-4 px-4 bg-gray-50">
            <form onSubmit={handleSearch} className="container mx-auto">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-blue-200"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-600 hover:text-red-700"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Navigation mobile */}
        {isOpen && (
          <nav className="lg:hidden border-t border-gray-100 bg-white">
            <div className="container mx-auto px-4 py-4">
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    Accueil
                  </Link>
                </li>
                {productCategories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      to={cat.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/a-propos"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    À propos
                  </Link>
                </li>
                {!isAuthenticated && (
                  <li className="pt-4">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block py-3 px-4 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Connexion
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Hearder;
