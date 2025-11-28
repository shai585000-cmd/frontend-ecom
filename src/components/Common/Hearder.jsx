import "animate.css";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import useAuthStore from "../../hooks/authStore";
import { logoutUser } from "../../services/authService";
import useCartStore from "../../hooks/useCartStore";

const Hearder = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Modification ici : séparer les sélecteurs
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.getCartLength());

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
    { name: "A propos", path: "/a-propos" },
    { name: "Produit", path: "/produit" },
    { name: "Blog", path: "/blog" },
    { name: "Actualités", path: "/actualites" },
  ];

  const transitionStyle =
    "transition-all transform hover:scale-110 hover:text-green-500 duration-300 ease-in-out";

  // Condition simplifiée pour le dashboard
  const showDashboard = user?.commerçant;
  console.log(cartItems);




  return (
    <header className="flex flex-wrap justify-between sticky top-0 items-center px-2 sm:px-4 md:px-8 py-2 sm:py-4 bg-gray-100 animate__animated animate__fadeIn">
      {/* Logo */}
      <Link to="/">
        <div className="text-base sm:text-lg md:text-xl font-semibold transition-all transform hover:scale-105 duration-300 ease-in-out">
          <span className="text-green-600">IVOIRE</span> MARKET
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

        {/* Panier */}
        <Link to="/cart">
          <div className="relative inline-block">
            <CiShoppingCart
              size={24}
              className="hover:text-green-500 cursor-pointer transition-colors duration-300"
            />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              {cartItems}
            </span>
          </div>
        </Link>

        {/* Auth section */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-gray-700 text-sm sm:text-base hidden sm:block">
              Bonjour {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-red-600 transition-colors"
            >
              <Link to="/">Déconnexion</Link>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-green-300 text-white py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg transform transition-all hover:scale-105 hover:bg-green-500 duration-300 ease-in-out"
          >
            LOGIN
          </Link>
        )}

        {/* Dashboard section */}
        {showDashboard ? (
          <Link
            to={`/dashboard/${user?.id}`}
            className="bg-blue-500 text-white py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-blue-600 transition-colors"
          >
            Dashboard
          </Link>
        ) : null}
      </div>

      {/* Navigation mobile */}
      {isOpen && (
        <nav className="block md:hidden w-full mt-4 bg-white rounded-lg shadow-lg p-4">
          <ul className="flex flex-col space-y-3">
            {navigationLinks.map((item) => (
              <li
                key={item.name}
                className="text-center transition-all transform hover:scale-105 hover:text-green-500 duration-300 ease-in-out"
                onClick={() => setIsOpen(false)}
              >
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Hearder;
