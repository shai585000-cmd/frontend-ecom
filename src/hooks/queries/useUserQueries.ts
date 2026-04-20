import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apInstance from '../../services/api';
import useAuthStore from '../authStore';
import { queryKeys } from '../../lib/queryClient';

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      const res = await apInstance.get('/users/me/');
      return res.data;
    },
    enabled: isAuthenticated,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: unknown) => {
      const res = await apInstance.put('/users/me/', profileData);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (passwordData: unknown) => {
      const res = await apInstance.post('/users/change-password/', passwordData);
      return res.data;
    },
  });
}
