import api from '@/lib/api';
import {
  EmployeeRequestsResponse,
  EmployeeRequestDetail,
  EmployeeDsaResponse,
  EmployeeFilters,
  AssignDsaPayload,
  UpdateRequestPayload,
  InviteDsaPayload,
  EmployeeAnalytics,
} from '@/types/employee.types';

class EmployeeService {
  /**
   * Get all requests with filters
   */
  async getRequests(filters: EmployeeFilters = {}): Promise<EmployeeRequestsResponse> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.paid !== undefined) params.append('paid', String(filters.paid));
    if (filters.assignedDsa) params.append('assignedDsa', filters.assignedDsa);
    if (filters.serviceId) params.append('serviceId', filters.serviceId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const queryString = params.toString();
    const response = await api.get(`/employee/requests${queryString ? `?${queryString}` : ''}`);
    return response.data;
  }

  /**
   * Get request details by ID
   */
  async getRequestById(id: string): Promise<EmployeeRequestDetail> {
    const response = await api.get(`/employee/requests/${id}`);
    return response.data;
  }

  /**
   * Get analytics/KPIs
   */
  async getAnalytics(): Promise<EmployeeAnalytics> {
    const response = await api.get('/employee/analytics');
    return response.data;
  }

  /**
   * Assign DSA to request
   */
  async assignDsa(payload: AssignDsaPayload): Promise<{ requestId: string; dsaName: string; status: string }> {
    const response = await api.post('/employee/assign-dsa', payload);
    return response.data;
  }

  /**
   * Update request status
   */
  async updateRequest(id: string, payload: UpdateRequestPayload): Promise<{ id: string; status: string }> {
    const response = await api.patch(`/employee/requests/${id}`, payload);
    return response.data;
  }

  /**
   * Get all DSAs
   */
  async getDsas(filters: { page?: number; limit?: number; isActive?: boolean } = {}): Promise<EmployeeDsaResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

    const queryString = params.toString();
    const response = await api.get(`/employee/dsas${queryString ? `?${queryString}` : ''}`);
    return response.data;
  }

  /**
   * Send DSA invitation
   */
  async inviteDsa(payload: InviteDsaPayload): Promise<{ inviteToken: string; sentTo: string; expiresAt: string }> {
    const response = await api.post('/employee/invite-dsa', payload);
    return response.data;
  }

  /**
   * Get active DSAs for assignment dropdown
   */
  async getActiveDsas(): Promise<{ id: string; name: string; email: string; city: string; assignedCount: number }[]> {
    const response = await api.get('/employee/dsas/active');
    return response.data;
  }
}

export const employeeService = new EmployeeService();
