import api from '@/lib/api';
import { 
  DsaRequestsResponse, 
  DsaRequestDetail, 
  DsaFilters, 
  StatusUpdatePayload 
} from '@/types/dsa.types';

interface DocumentUpdatePayload {
  aadhaarFrontUrl?: string;
  aadhaarBackUrl?: string;
  panFrontUrl?: string;
  panBackUrl?: string;
  [key: string]: string | undefined;
}

class DsaService {
  /**
   * Get all requests assigned to the DSA
   */
  async getRequests(filters?: DsaFilters): Promise<DsaRequestsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/dsa/requests?${queryString}` : '/dsa/requests';
    
    const response: any = await api.get(url);
    return response.data;
  }

  /**
   * Get a single request by ID
   */
  async getRequestById(requestId: string): Promise<DsaRequestDetail> {
    const response: any = await api.get(`/service-requests/${requestId}`);
    return response.data;
  }

  /**
   * Update request status
   */
  async updateRequestStatus(
    requestId: string, 
    payload: StatusUpdatePayload
  ): Promise<{ id: string; status: string; updatedAt: string }> {
    const response: any = await api.patch(`/dsa/requests/${requestId}`, payload);
    return response.data;
  }

  /**
   * Update request documents (replace existing documents with new URLs)
   */
  async updateRequestDocuments(
    requestId: string,
    documents: DocumentUpdatePayload
  ): Promise<{ success: boolean; data: DsaRequestDetail }> {
    const response: any = await api.patch(`/service-requests/${requestId}/documents`, documents);
    return response;
  }

  /**
   * Export requests to CSV
   */
  async exportRequests(dateFrom?: string, dateTo?: string): Promise<string> {
    const params = new URLSearchParams({ format: 'csv' });
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const response: any = await api.get(`/dsa/export?${params.toString()}`, {
      responseType: 'text',
    });
    return response;
  }

  /**
   * Add note to request
   */
  async addNote(requestId: string, note: string): Promise<void> {
    await api.post(`/service-requests/${requestId}/notes`, { note });
  }

  /**
   * Get request audit logs
   */
  async getAuditLogs(requestId: string): Promise<any[]> {
    const response: any = await api.get(`/service-requests/${requestId}/audit`);
    return response.data || [];
  }
}

export const dsaService = new DsaService();
