import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import type { CartItem } from '../types';

interface CartState {
  cart: CartItem[];
  getCart: () => CartItem[];
  getCartLength: () => number;
  addToCart: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  incrementQuantity: (productId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      getCart: () => get().cart,
      getCartLength: () => get().cart.reduce((total, product) => total + product.quantity, 0),

      addToCart: (product) => {
        set((state) => {
          const cart = [...state.cart];
          const productIndex = cart.findIndex((item) => item.id === product.id);

          if (productIndex >= 0) {
            cart[productIndex].quantity += 1;
            toast.success(`Quantité mise à jour : ${cart[productIndex].quantity}`);
          } else {
            cart.push({ ...product, quantity: product.quantity ?? 1 });
            toast.success('Produit ajouté au panier !');
          }
          return { cart };
        });
      },

      removeFromCart: (productId: number) => {
        set((state) => ({
          cart: state.cart.filter((product) => product.id !== productId),
        }));
        toast.success('Produit retiré du panier');
      },

      decrementQuantity: (productId: number) => {
        set((state) => {
          const cart = [...state.cart];
          const productIndex = cart.findIndex((item) => item.id === productId);

          if (productIndex >= 0) {
            if (cart[productIndex].quantity > 1) {
              cart[productIndex].quantity -= 1;
            } else {
              toast.success('Produit retiré du panier');
              return { cart: cart.filter((product) => product.id !== productId) };
            }
          }

          return { cart };
        });
      },

      incrementQuantity: (productId: number) => {
        set((state) => {
          const cart = [...state.cart];
          const productIndex = cart.findIndex((item) => item.id === productId);

          if (productIndex >= 0) {
            cart[productIndex].quantity += 1;
          }

          return { cart };
        });
      },

      clearCart: () => {
        set({ cart: [] });
        toast.success('Panier vidé');
      },

      getTotalPrice: () => {
        const cart = get().cart || [];
        return cart
          .map((product) => (product.price || 0) * product.quantity)
          .reduce((total, price) => total + price, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export type { CartState };
export default useCartStore;
