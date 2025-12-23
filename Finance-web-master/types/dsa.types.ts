import { RequestStatus } from './request.types';

// Re-export for convenience
export type { RequestStatus };

// DSA Dashboard Summary
export interface DsaSummary {
  totalAssigned: number;
  inProgress: number;
  completed: number;
  onHold: number;
}

// DSA Request (from backend)
export interface DsaRequest {
  id: string;
  serviceName: string;
  userName: string;
  userEmail: string;
  status: RequestStatus;
  createdAt: string;
  formSummary: {
    purpose?: string;
    businessName?: string;
    documents?: number;
  };
}

// DSA Requests Response
export interface DsaRequestsResponse {
  requests: DsaRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
  };
  summary: DsaSummary;
}

// DSA Request Detail (full request with form data)
export interface DsaRequestDetail {
  id: string;
  serviceId: string;
  service: {
    id: string;
    name: string;
    category: string;
    description?: string;
    price: number;
  };
  createdBy: {
    id: string;
    email: string;
  };
  status: RequestStatus;
  paid: boolean;
  formData: {
    base?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      whatsapp?: string;
      address?: string;
      state?: string;
      city?: string;
      pincode?: string;
      aadhaarFrontUrl?: string;
      aadhaarBackUrl?: string;
      panFrontUrl?: string;
      panBackUrl?: string;
    };
    personal?: {
      employmentStatus?: string;
      purposeDescription?: string;
    };
    business?: {
      businessName?: string;
      businessType?: string;
      registrationNumber?: string;
      partnersCount?: number;
    };
    financial?: {
      bankName?: string;
      accountHolder?: string;
      loanAmount?: number;
      loanType?: string;
    };
    govt?: {
      departmentName?: string;
      applicationNumber?: string;
    };
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  auditLogs?: AuditLogEntry[];
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  oldValue?: any;
  newValue?: any;
  createdAt: string;
}

// Status Update Payload
export interface StatusUpdatePayload {
  status: RequestStatus;
  notes?: string;
  estimatedCompletion?: string;
}

// DSA Filters
export interface DsaFilters {
  status?: RequestStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'status';
  page?: number;
  limit?: number;
}
