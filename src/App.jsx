import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
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

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Le Header est affiché sur toutes les pages */}

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/actualites" element={<ActualitesPage />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/produit" element={<CataloguePage />} />
          </Routes>
        </main>
        {/* Le Footer est affiché sur toutes les pages */}
      </div>
    </Router>
  );
};

export default App;
