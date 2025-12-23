import api, { ApiResponse, PaginatedResponse } from '@/lib/api';
import { Service, ServiceCategory } from '@/types/service.types';

interface GetServicesParams {
  page?: number;
  limit?: number;
  category?: ServiceCategory;
}

export const serviceService = {
  /**
   * Get all services with optional filtering and pagination
   */
  getAll: async (params?: GetServicesParams): Promise<PaginatedResponse<Service>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);

    return api.get(`/services?${queryParams.toString()}`);
  },

  /**
   * Get service by ID
   */
  getById: async (serviceId: string): Promise<Service> => {
    const response: ApiResponse<Service> = await api.get(`/services/${serviceId}`);
    return response.data!;
  },

  /**
   * Get services by category
   */
  getByCategory: async (category: ServiceCategory): Promise<Service[]> => {
    const response = await serviceService.getAll({ category, limit: 100 });
    return response.data;
  },
};
