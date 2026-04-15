import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import ProductPage from "./pages/ProducPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserProfilePage from "./pages/UserProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import ActualitesPage from "./pages/ActualitesPage";
import Dashboard from "./pages/Dashboard";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import CataloguePage from "./pages/CataloguePage";
import WhatsAppButton from "./components/Common/WhatsAppButton";
import NotFoundPage from "./pages/NotFoundPage";
import WishlistPage from "./pages/WishlistPage";
import ProtectedRoute from "./components/Common/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <div className="app">
        <main>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/actualites" element={<ActualitesPage />} />
            <Route path="/produit" element={<CataloguePage />} />
            <Route path="/auth/callback" element={<GoogleCallbackPage />} />

            {/* Routes protégées (authentification requise) */}
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/dashboard/:id" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

            {/* Route 404 - Doit être en dernier */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <WhatsAppButton phoneNumber={import.meta.env.VITE_WHATSAPP_NUMBER || "2250170629746"} />
      </div>
    </Router>
  );
};

export default App;
