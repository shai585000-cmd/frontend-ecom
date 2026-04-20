import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apInstance, { publicApi } from '../../services/api';
import useAuthStore from '../authStore';
import { queryKeys } from '../../lib/queryClient';

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useOrders() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: async () => {
      const res = await apInstance.get('/orders/');
      return res.data;
    },
    enabled: isAuthenticated,
  });
}

export function useOrderById(orderId: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(Number(orderId)),
    queryFn: async () => {
      const res = await apInstance.get(`/orders/${orderId}/`);
      return res.data;
    },
    enabled: !!orderId,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export function useCreateOrder() {
  const qc = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useMutation({
    mutationFn: async (orderData: unknown) => {
      const api = isAuthenticated ? apInstance : publicApi;
      const res = await api.post('/orders/', orderData);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await apInstance.post(`/orders/${orderId}/cancel/`);
      return res.data;
    },
    onSuccess: (_data, orderId) => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.all });
      qc.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },
  });
}
