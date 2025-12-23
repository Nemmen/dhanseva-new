// Employee Dashboard Types

// Analytics/KPIs
export interface EmployeeAnalytics {
  totalRequests: number;
  unpaid: number;
  assigned: number;
  inProgress: number;
  completed: number;
  overdue?: number;
}

// Request in list view
export interface EmployeeRequest {
  id: string;
  serviceName: string;
  userName: string;
  userEmail: string;
  userCity: string;
  status: RequestStatus;
  paid: boolean;
  filledByDsaId: string | null;
  createdAt: string;
  urgency: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  documents: number;
  assignedDsa: {
    name: string;
    email: string;
  } | null;
}

// Request status type
export type RequestStatus = 
  | 'UNPAID'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// Request detail for control center
export interface EmployeeRequestDetail {
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
  filledByDsa: {
    id: string;
    email: string;
    dsaProfile?: {
      fullName: string;
      phone: string;
    };
  } | null;
  status: RequestStatus;
  paid: boolean;
  formData: {
    base?: {
      fullName?: string;
      email?: string;
      phone?: string;
      whatsapp?: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      aadhaarFrontUrl?: string;
      aadhaarBackUrl?: string;
      panFrontUrl?: string;
      panBackUrl?: string;
    };
    personal?: Record<string, any>;
    business?: Record<string, any>;
    financial?: Record<string, any>;
    govt?: Record<string, any>;
  };
  payments: EmployeePayment[];
  auditLogs: AuditLog[];
  createdAt: string;
  updatedAt: string;
}

// Payment information
export interface EmployeePayment {
  id: string;
  amount: number;
  currency: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

// Audit log entry
export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  oldValue: any;
  newValue: any;
  createdAt: string;
}

// DSA in directory
export interface EmployeeDsa {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  dsaProfile: {
    id: string;
    fullName: string;
    phone: string;
    whatsapp?: string;
    city: string;
    state: string;
    isActive: boolean;
    registrationPaid: boolean;
  };
  assignedCount: number;
  completedCount: number;
}

// Request list response
export interface EmployeeRequestsResponse {
  requests: EmployeeRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  analytics: EmployeeAnalytics;
}

// DSA list response
export interface EmployeeDsaResponse {
  dsas: EmployeeDsa[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Filters for requests
export interface EmployeeFilters {
  status?: RequestStatus;
  paid?: boolean;
  assignedDsa?: string | 'null';
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Assign DSA payload
export interface AssignDsaPayload {
  requestId: string;
  dsaId: string;
  reason?: string;
}

// Update request payload
export interface UpdateRequestPayload {
  status?: RequestStatus;
  notes?: string;
  completionNotes?: string;
}

// Invite DSA payload
export interface InviteDsaPayload {
  email: string;
  firstName: string;
  lastName: string;
  regions: string[];
  message?: string;
}
