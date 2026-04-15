import { create } from 'zustand';
import type { Product } from '../types';

interface ProductStoreState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
}

const useProductStore = create<ProductStoreState>()((set) => ({
  products: [],
  setProducts: (products: Product[]) => set({ products }),
  addProduct: (product: Product) => set((state) => ({ products: [...state.products, product] })),
  removeProduct: (productId: number) => set((state) => ({ products: state.products.filter(p => p.id !== productId) })),
}));

export default useProductStore;
