import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { publicApi } from '../services/api';
import { makeEntry, isFresh, TTL } from './lib/cache';
import type { CacheEntry } from './lib/cache';
import type { Category, HeroSection, Feature, SolutionCard, Banner } from '../types';

// ─── Local types ──────────────────────────────────────────────────────────────

interface Announcement {
  id: number;
  text: string;
  emoji: string;
}

// ─── State interface ──────────────────────────────────────────────────────────

interface HomeStoreState {
  categories: Category[];
  categoriesCache: CacheEntry<Category[]> | null;

  hero: HeroSection | null;
  heroCache: CacheEntry<HeroSection> | null;

  features: Feature[];
  featuresCache: CacheEntry<Feature[]> | null;

  solutions: SolutionCard[];
  solutionsCache: CacheEntry<SolutionCard[]> | null;

  banner: Banner | null;
  bannerCache: CacheEntry<Banner> | null;

  announcements: Announcement[];
  announcementsCache: CacheEntry<Announcement[]> | null;

  // Per-section loading flags
  loadingCategories: boolean;
  loadingHero: boolean;
  loadingFeatures: boolean;
  loadingSolutions: boolean;
  loadingBanner: boolean;
  loadingAnnouncements: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  fetchHero: () => Promise<void>;
  fetchFeatures: () => Promise<void>;
  fetchSolutions: () => Promise<void>;
  fetchBanner: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  fetchAll: () => Promise<void>;
  invalidateAll: () => void;
}

// ─── Fallback announcements when API is unavailable ──────────────────────────

const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, text: 'Livraison GRATUITE pour toute commande supérieure à 50 000 FCFA', emoji: '🔥' },
  { id: 2, text: 'Nouveaux iPhone 15 disponibles !', emoji: '📱' },
  { id: 3, text: 'Garantie 12 mois sur tous nos produits', emoji: '⚡' },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const useHomeStore = create<HomeStoreState>()(
  persist(
    (set, get) => ({
  categories: [],
  categoriesCache: null,
  hero: null,
  heroCache: null,
  features: [],
  featuresCache: null,
  solutions: [],
  solutionsCache: null,
  banner: null,
  bannerCache: null,
  announcements: [],
  announcementsCache: null,
  loadingCategories: false,
  loadingHero: false,
  loadingFeatures: false,
  loadingSolutions: false,
  loadingBanner: false,
  loadingAnnouncements: false,
  error: null,

  fetchCategories: async () => {
    if (get().loadingCategories || isFresh(get().categoriesCache)) return;
    set({ loadingCategories: true });
    try {
      const res = await publicApi.get<Category[]>('/home/categories/');
      set({
        categories: res.data,
        categoriesCache: makeEntry(res.data, TTL.LONG),
        loadingCategories: false,
      });
    } catch {
      set({ loadingCategories: false });
    }
  },

  fetchHero: async () => {
    if (get().loadingHero || isFresh(get().heroCache)) return;
    set({ loadingHero: true });
    try {
      const res = await publicApi.get<HeroSection>('/home/hero/');
      set({
        hero: res.data,
        heroCache: makeEntry(res.data, TTL.LONG),
        loadingHero: false,
      });
    } catch {
      set({ loadingHero: false });
    }
  },

  fetchFeatures: async () => {
    if (get().loadingFeatures || isFresh(get().featuresCache)) return;
    set({ loadingFeatures: true });
    try {
      const res = await publicApi.get<Feature[]>('/home/features/');
      set({
        features: res.data,
        featuresCache: makeEntry(res.data, TTL.LONG),
        loadingFeatures: false,
      });
    } catch {
      set({ loadingFeatures: false });
    }
  },

  fetchSolutions: async () => {
    if (get().loadingSolutions || isFresh(get().solutionsCache)) return;
    set({ loadingSolutions: true });
    try {
      const res = await publicApi.get<SolutionCard[]>('/home/solutions/');
      set({
        solutions: res.data,
        solutionsCache: makeEntry(res.data, TTL.LONG),
        loadingSolutions: false,
      });
    } catch {
      set({ loadingSolutions: false });
    }
  },

  fetchBanner: async () => {
    if (get().loadingBanner || isFresh(get().bannerCache)) return;
    set({ loadingBanner: true });
    try {
      const res = await publicApi.get<Banner>('/home/banner');
      set({
        banner: res.data,
        bannerCache: makeEntry(res.data, TTL.LONG),
        loadingBanner: false,
      });
    } catch {
      set({ loadingBanner: false });
    }
  },

  fetchAnnouncements: async () => {
    if (get().loadingAnnouncements || isFresh(get().announcementsCache)) return;
    set({ loadingAnnouncements: true });
    try {
      const res = await publicApi.get<Announcement[]>('/home/announcements/');
      set({
        announcements: res.data,
        announcementsCache: makeEntry(res.data, TTL.LONG),
        loadingAnnouncements: false,
      });
    } catch {
      // Use fallback so the banner still displays
      set({
        announcements: FALLBACK_ANNOUNCEMENTS,
        announcementsCache: makeEntry(FALLBACK_ANNOUNCEMENTS, TTL.LONG),
        loadingAnnouncements: false,
      });
    }
  },

  // Fetch all home sections in parallel, each guarded by its own cache
  fetchAll: async () => {
    const { fetchCategories, fetchHero, fetchFeatures, fetchSolutions, fetchBanner, fetchAnnouncements } = get();
    await Promise.all([
      fetchCategories(),
      fetchHero(),
      fetchFeatures(),
      fetchSolutions(),
      fetchBanner(),
      fetchAnnouncements(),
    ]);
  },

  invalidateAll: () => {
    set({
      categoriesCache: null,
      heroCache: null,
      featuresCache: null,
      solutionsCache: null,
      bannerCache: null,
      announcementsCache: null,
    });
  },
    }),
    {
      name: 'infotek-home',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        categories: state.categories,
        categoriesCache: state.categoriesCache,
        hero: state.hero,
        heroCache: state.heroCache,
        features: state.features,
        featuresCache: state.featuresCache,
        solutions: state.solutions,
        solutionsCache: state.solutionsCache,
        banner: state.banner,
        bannerCache: state.bannerCache,
        announcements: state.announcements,
        announcementsCache: state.announcementsCache,
      }),
      migrate: (persisted: unknown) => persisted,
      onRehydrateStorage: () => () => { /* silent rehydration */ },
    }
  )
);

export default useHomeStore;
