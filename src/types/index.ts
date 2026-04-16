// ─── Produit ─────────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

export interface Product {
  id: number;
  name: string;
  title?: string;
  description?: string;
  price: string | number;
  promotion?: boolean;
  promotion_price?: string | number | null;
  image?: string;
  images?: ProductImage[];
  stock?: number;
  categorie?: Category | number;
  category?: Category | number;
  slug?: string;
  rating?: number;
  reviews_count?: number;
}

export interface ProductImage {
  id: number;
  image: string;
}

// ─── Utilisateur ─────────────────────────────────────────────────────────────

export interface User {
  id: number | null;
  username?: string;
  email?: string;
  nom_cli?: string;
  prenom_cli?: string;
  phone?: string;
  address?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// ─── Panier ──────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  description?: string;
}

// ─── Commandes ───────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: string | number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total_price: string | number;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
  shipping_address?: string;
  shipping_zone?: ShippingZone;
  customer_name?: string;
  customer_phone?: string;
  payment_method?: string;
}

// ─── Livraison ───────────────────────────────────────────────────────────────

export interface ShippingZone {
  id: number;
  name: string;
  price: string | number;
  estimated_days?: number;
}

// ─── Avis ────────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  user: User | string;
  user_name?: string;
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
  is_verified_purchase?: boolean;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution?: Record<number, number>;
}

// ─── Bannières / Home ─────────────────────────────────────────────────────────

export interface Banner {
  id: number;
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
  active?: boolean;
}

export interface HeroSection {
  id: number;
  title: string;
  title_highlight?: string;
  description: string;
  badge_text?: string;
  button1_text: string;
  button1_link: string;
  button2_text: string;
  button2_link: string;
}

export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface SolutionCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  bg_gradient: string;
  link: string;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  product: Product;
}

// ─── API Réponses génériques ──────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message?: string;
  error?: string | Record<string, string[]>;
  detail?: string;
}
