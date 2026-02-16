import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

const useCartStore = create(
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
            toast.success(`Quantite mise a jour: ${cart[productIndex].quantity}`);
          } else {
            cart.push({ ...product, quantity: 1 });
            toast.success('Produit ajoute au panier!');
          }
          return { cart };
        });
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((product) => product.id !== productId),
        }));
        toast.success('Produit retire du panier');
      },
      
      decrementQuantity: (productId) => {
        set((state) => {
          const cart = [...state.cart];
          const productIndex = cart.findIndex((item) => item.id === productId);
          
          if (productIndex >= 0) {
            if (cart[productIndex].quantity > 1) {
              cart[productIndex].quantity -= 1;
            } else {
              toast.success('Produit retire du panier');
              return { cart: cart.filter((product) => product.id !== productId) };
            }
          }
          
          return { cart };
        });
      },
      
      incrementQuantity: (productId) => {
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
        toast.success('Panier vide');
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
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
