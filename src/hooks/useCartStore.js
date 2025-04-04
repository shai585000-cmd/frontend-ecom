import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      getCart: () => get().cart,
      getCartLength: () => get().cart.reduce((total, product) => total + product.quantity, 0), // Calcule le nombre total d'articles
      addToCart: (product) => {
        set((state) => {
          const cart = [...state.cart];
          const productIndex = cart.findIndex((item) => item.id === product.id);
          
          if (productIndex >= 0) {
            // Si le produit est déjà dans le panier, on incrémente la quantité
            cart[productIndex].quantity += 1;
          } else {
            // Si le produit n'est pas dans le panier, on l'ajoute avec une quantité de 1
            cart.push({ ...product, quantity: 1 });
          }
          return { cart };
        });
      },
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((product) => product.id !== productId),
        })),
      // Nouvelle fonction pour décrémenter la quantité
      decrementQuantity: (productId) => {
        set((state) => {
          const cart = [...state.cart];
          const productIndex = cart.findIndex((item) => item.id === productId);
          
          if (productIndex >= 0) {
            if (cart[productIndex].quantity > 1) {
              // Si la quantité est supérieure à 1, on la décrémente
              cart[productIndex].quantity -= 1;
            } else {
              // Si la quantité est égale à 1, on supprime le produit
              return { cart: cart.filter((product) => product.id !== productId) };
            }
          }
          
          return { cart };
        });
      },
      // Nouvelle fonction pour incrémenter la quantité
      incrementQuantity: (productId) => {
        set((state) => {
          const cart = [...state.cart];
          const productIndex = cart.findIndex((item) => item.id === productId);
          
          if (productIndex >= 0) {
            // On incrémente la quantité
            cart[productIndex].quantity += 1;
          }
          
          return { cart };
        });
      },
      clearCart: () => set({ cart: [] }),
      getTotalPrice: () => {
        const cart = get().cart || [];
        return cart
          .map((product) => (product.price || 0) * product.quantity) // Calculer le prix total en fonction de la quantité
          .reduce((total, price) => total + price, 0);
      },
    }),
    {
      name: "cart-storage", // Clé dans localStorage
      getStorage: () => localStorage, // Définit le stockage (localStorage par défaut)
    }
  )
);

export default useCartStore;