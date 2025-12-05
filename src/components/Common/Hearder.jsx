import "animate.css";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { Heart, User, LogOut, Package, Settings, ChevronDown } from "lucide-react";
import useAuthStore from "../../hooks/authStore";
import { logoutUser } from "../../services/authService";
import useCartStore from "../../hooks/useCartStore";
import useWishlistStore from "../../store/wishlistStore";

const Hearder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  // Modification ici : séparer les sélecteurs
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.getCartLength());
  const wishlistCount = useWishlistStore((state) => state.getWishlistCount());

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Liens de navigation
  const navigationLinks = [
    { name: "Accueil", path: "/" },
    { name: "Produit", path: "/produit" },
    { name: "Blog", path: "/blog" },
    { name: "A propos", path: "/a-propos" },
    { name: "Actualités", path: "/actualites" },
  ];

  const transitionStyle =
    "transition-all transform hover:scale-110 hover:text-blue-600 duration-300 ease-in-out";

  // Condition simplifiée pour le dashboard
  const showDashboard = user?.commerçant;

  // Fermer le menu profil quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  return (
    <header className="flex flex-wrap justify-between sticky top-0 items-center px-2 sm:px-4 md:px-8 py-2 sm:py-4 bg-gray-100 animate__animated animate__fadeIn">
      {/* Logo */}
      <Link to="/">
        <div className="text-base sm:text-lg md:text-xl font-semibold transition-all transform hover:scale-105 duration-300 ease-in-out">
          <span className="text-blue-600">TECH</span> <span className="text-indigo-600">STORE</span>
        </div>
      </Link>

      {/* Navigation desktop */}
      <nav className="hidden md:block">
        <ul className="flex space-x-6">
          {navigationLinks.map((item) => (
            <li key={item.name} className={transitionStyle}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Actions groupées */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Menu mobile */}
        <button
          className="md:hidden text-xl sm:text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Wishlist */}
        <Link to="/wishlist">
          <div className="relative inline-block">
            <Heart
              size={24}
              className="hover:text-red-500 cursor-pointer transition-colors duration-300"
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
        </Link>

        {/* Panier */}
        <Link to="/cart">
          <div className="relative inline-block">
            <CiShoppingCart
              size={24}
              className="hover:text-blue-600 cursor-pointer transition-colors duration-300"
            />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              {cartItems}
            </span>
          </div>
        </Link>

        {/* Auth section */}
        {isAuthenticated ? (
          <div className="relative" ref={profileMenuRef}>
            {/* Bouton Profil */}
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 bg-indigo-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <User size={18} />
              <span className="hidden sm:inline">{user?.nom_cli || user?.username}</span>
              <ChevronDown size={16} className={`transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu deroulant */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate__animated animate__fadeIn animate__faster">
                {/* En-tete du menu */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">{user?.nom_cli || user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                {/* Options du menu */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <User size={18} />
                    Mon profil
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <Package size={18} />
                    Mes commandes
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <Heart size={18} />
                    Mes favoris
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Dashboard pour commercants */}
                  {showDashboard && (
                    <Link
                      to={`/dashboard/${user?.id}`}
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <Settings size={18} />
                      Dashboard
                    </Link>
                  )}
                </div>

                {/* Deconnexion */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    Deconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-indigo-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg transform transition-all hover:scale-105 hover:bg-indigo-700 duration-300 ease-in-out"
          >
            LOGIN
          </Link>
        )}
      </div>

      {/* Navigation mobile */}
      {isOpen && (
        <nav className="block md:hidden w-full mt-4 bg-white rounded-lg shadow-lg p-4">
          <ul className="flex flex-col space-y-3">
            {navigationLinks.map((item) => (
              <li
                key={item.name}
                className="text-center transition-all transform hover:scale-105 hover:text-blue-600 duration-300 ease-in-out"
                onClick={() => setIsOpen(false)}
              >
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
            {isAuthenticated && (
              <>
                <li
                  className="text-center transition-all transform hover:scale-105 hover:text-blue-600 duration-300 ease-in-out"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/orders">Mes commandes</Link>
                </li>
                <li
                  className="text-center transition-all transform hover:scale-105 hover:text-red-500 duration-300 ease-in-out"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/wishlist">Mes favoris ({wishlistCount})</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Hearder;
