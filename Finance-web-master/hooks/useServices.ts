'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '@/services/serviceService';
import { Service, ServiceCategory } from '@/types/service.types';

/**
 * Hook to fetch all services
 */
export function useServices(page?: number, limit?: number, category?: ServiceCategory) {
  return useQuery({
    queryKey: ['services', page, limit, category],
    queryFn: () => serviceService.getAll({ page, limit, category }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
}

/**
 * Hook to fetch a single service by ID
 */
export function useService(serviceId: string) {
  return useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => serviceService.getById(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch services by category
 */
export function useServicesByCategory(category: ServiceCategory) {
  return useQuery({
    queryKey: ['services', 'category', category],
    queryFn: () => serviceService.getByCategory(category),
    staleTime: 5 * 60 * 1000,
  });
}
