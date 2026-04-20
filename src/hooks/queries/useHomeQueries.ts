import { useQuery, useQueries } from '@tanstack/react-query';
import { publicApi } from '../../services/api';
import { queryKeys } from '../../lib/queryClient';
import type { Category, HeroSection, Feature, SolutionCard, Banner } from '../../types';

interface Announcement {
  id: number;
  text: string;
  emoji: string;
}

const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, text: 'Livraison GRATUITE pour toute commande supérieure à 50 000 FCFA', emoji: '🔥' },
  { id: 2, text: 'Nouveaux iPhone 15 disponibles !', emoji: '📱' },
  { id: 3, text: 'Garantie 12 mois sur tous nos produits', emoji: '⚡' },
];

// ─── Individual hooks ────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.home.categories(),
    queryFn: async () => {
      const res = await publicApi.get<Category[]>('/home/categories/');
      return res.data;
    },
    staleTime: 10 * 60 * 1000, // 10 min – categories rarely change
  });
}

export function useHero() {
  return useQuery({
    queryKey: queryKeys.home.hero(),
    queryFn: async () => {
      const res = await publicApi.get<HeroSection>('/home/hero/');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useFeatures() {
  return useQuery({
    queryKey: queryKeys.home.features(),
    queryFn: async () => {
      const res = await publicApi.get<Feature[]>('/home/features/');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useSolutions() {
  return useQuery({
    queryKey: queryKeys.home.solutions(),
    queryFn: async () => {
      const res = await publicApi.get<SolutionCard[]>('/home/solutions/');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useBanner() {
  return useQuery({
    queryKey: queryKeys.home.banner(),
    queryFn: async () => {
      const res = await publicApi.get<Banner>('/home/banner');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: queryKeys.home.announcements(),
    queryFn: async () => {
      const res = await publicApi.get<Announcement[]>('/home/announcements/');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    placeholderData: FALLBACK_ANNOUNCEMENTS,
  });
}

// ─── Fetch all home data in parallel ─────────────────────────────────────────
export function useHomeData() {
  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.home.categories(),
        queryFn: async () => {
          const res = await publicApi.get<Category[]>('/home/categories/');
          return res.data;
        },
        staleTime: 10 * 60 * 1000,
      },
      {
        queryKey: queryKeys.home.hero(),
        queryFn: async () => {
          const res = await publicApi.get<HeroSection>('/home/hero/');
          return res.data;
        },
        staleTime: 10 * 60 * 1000,
      },
      {
        queryKey: queryKeys.home.features(),
        queryFn: async () => {
          const res = await publicApi.get<Feature[]>('/home/features/');
          return res.data;
        },
        staleTime: 10 * 60 * 1000,
      },
      {
        queryKey: queryKeys.home.solutions(),
        queryFn: async () => {
          const res = await publicApi.get<SolutionCard[]>('/home/solutions/');
          return res.data;
        },
        staleTime: 10 * 60 * 1000,
      },
      {
        queryKey: queryKeys.home.banner(),
        queryFn: async () => {
          const res = await publicApi.get<Banner>('/home/banner');
          return res.data;
        },
        staleTime: 10 * 60 * 1000,
      },
      {
        queryKey: queryKeys.home.announcements(),
        queryFn: async () => {
          const res = await publicApi.get<Announcement[]>('/home/announcements/');
          return res.data;
        },
        staleTime: 10 * 60 * 1000,
        placeholderData: FALLBACK_ANNOUNCEMENTS,
      },
    ],
  });

  const [categories, hero, features, solutions, banner, announcements] = results;

  return {
    categories: categories.data ?? [],
    hero: hero.data ?? null,
    features: features.data ?? [],
    solutions: solutions.data ?? [],
    banner: banner.data ?? null,
    announcements: announcements.data ?? FALLBACK_ANNOUNCEMENTS,
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
  };
}
