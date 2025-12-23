import api, { ApiResponse, PaginatedResponse } from '@/lib/api';
import { ServiceRequest, RequestStatus } from '@/types/request.types';

interface GetRequestsParams {
  page?: number;
  limit?: number;
  status?: RequestStatus;
  serviceId?: string;
}

interface CreateRequestData {
  serviceId: string;
  formData: {
    base: any;
    extension: any;
  };
}

export const requestService = {
  /**
   * Create a new service request
   */
  create: async (data: CreateRequestData): Promise<ServiceRequest> => {
    const response: ApiResponse<ServiceRequest> = await api.post('/requests', data);
    return response.data!;
  },

  /**
   * Get all user's requests
   */
  getMyRequests: async (params?: GetRequestsParams): Promise<PaginatedResponse<ServiceRequest>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.serviceId) queryParams.append('serviceId', params.serviceId);

    return api.get(`/requests/my-requests?${queryParams.toString()}`);
  },

  /**
   * Get request by ID
   */
  getById: async (requestId: string): Promise<ServiceRequest> => {
    const response: ApiResponse<ServiceRequest> = await api.get(`/requests/${requestId}`);
    return response.data!;
  },

  /**
   * Update request (for DSA/Employee)
   */
  update: async (requestId: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> => {
    const response: ApiResponse<ServiceRequest> = await api.patch(`/requests/${requestId}`, data);
    return response.data!;
  },
};
