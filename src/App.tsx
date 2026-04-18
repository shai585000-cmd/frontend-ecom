import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WhatsAppButton from "./components/Common/WhatsAppButton";
import { ProtectedRoute } from "./core/components";

// Auth
const LoginPage        = lazy(() => import("./features/auth/pages/LoginPage"));
const RegisterPage     = lazy(() => import("./features/auth/pages/RegisterPage"));
const GoogleCallbackPage = lazy(() => import("./features/auth/pages/GoogleCallbackPage"));

// Home & Catalogue
const HomePage         = lazy(() => import("./features/home/pages/HomePage"));
const CataloguePage    = lazy(() => import("./features/catalogue/pages/CataloguePage"));
const ProductPage      = lazy(() => import("./features/product/pages/ProductPage"));

// Commerce
const CartPage         = lazy(() => import("./features/cart/pages/CartPage"));
const CheckoutPage     = lazy(() => import("./features/checkout/pages/CheckoutPage"));
const WishlistPage     = lazy(() => import("./features/wishlist/pages/WishlistPage"));

// Compte
const UserProfilePage  = lazy(() => import("./features/profile/pages/UserProfilePage"));
const OrdersPage       = lazy(() => import("./features/orders/pages/OrdersPage"));
const OrderDetailPage  = lazy(() => import("./features/orders/pages/OrderDetailPage"));
const Dashboard        = lazy(() => import("./features/dashboard/pages/Dashboard"));

// Static
const AboutPage        = lazy(() => import("./features/static/pages/AboutPage"));
const BlogPage         = lazy(() => import("./features/static/pages/BlogPage"));
const ContactPage      = lazy(() => import("./features/static/pages/ContactPage"));
const ActualitesPage   = lazy(() => import("./pages/ActualitesPage"));
const NotFoundPage     = lazy(() => import("./features/static/pages/NotFoundPage"));

const PageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="app">
        <main>
          <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/actualites" element={<ActualitesPage />} />
            <Route path="/produit" element={<CataloguePage />} />
            <Route path="/auth/callback" element={<GoogleCallbackPage />} />

            {/* Checkout accessible sans connexion (commande guest autorisée) */}
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Routes protégées (authentification requise) */}
            <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/dashboard/:id" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

            {/* Route 404 - Doit être en dernier */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
        </main>

        <WhatsAppButton phoneNumber={import.meta.env.VITE_WHATSAPP_NUMBER || "2250170629746"} />
      </div>
    </Router>
  );
};

export default App;
