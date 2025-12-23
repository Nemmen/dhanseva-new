'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '@/services/requestService';
import { RequestStatus } from '@/types/request.types';
import { toast } from 'sonner';

/**
 * Hook to fetch user's requests
 */
export function useMyRequests(page?: number, limit?: number, status?: RequestStatus) {
  return useQuery({
    queryKey: ['my-requests', page, limit, status],
    queryFn: () => requestService.getMyRequests({ page, limit, status }),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch a single request by ID
 */
export function useRequest(requestId: string) {
  return useQuery({
    queryKey: ['request', requestId],
    queryFn: () => requestService.getById(requestId),
    enabled: !!requestId,
  });
}

/**
 * Hook to create a new request
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      toast.success('Request created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create request');
    },
  });
}

/**
 * Hook to update a request
 */
export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: any }) =>
      requestService.update(requestId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['request', variables.requestId] });
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      toast.success('Request updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update request');
    },
  });
}
