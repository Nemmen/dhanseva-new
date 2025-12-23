import { Service } from './service.types';
import { User } from './auth.types';

// Request status
export type RequestStatus =
  | 'UNPAID'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

// Base form data (common to all services)
export interface BaseFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  aadhaarFrontUrl: string;
  aadhaarBackUrl: string;
  panFrontUrl: string;
  panBackUrl?: string;
}

// Service-specific extensions
export interface PersonalLegalExtension {
  employmentStatus: string;
  purposeDescription: string;
}

export interface BusinessLegalExtension {
  businessName: string;
  businessType: string;
  registrationNumber?: string;
  partnersCount?: number;
}

export interface FinancialLegalExtension {
  bankName: string;
  accountHolder: string;
  loanAmount?: number;
  loanType?: string;
}

export interface GovtLegalExtension {
  departmentName: string;
  applicationPurpose: string;
  stateJurisdiction: string;
}

export interface SpecializedLegalExtension {
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  consultationType: 'ONLINE' | 'OFFLINE' | 'BOTH';
}

// Full form data
export interface ServiceFormData {
  base: BaseFormData;
  extension:
    | PersonalLegalExtension
    | BusinessLegalExtension
    | FinancialLegalExtension
    | GovtLegalExtension
    | SpecializedLegalExtension;
}

// Service request
export interface ServiceRequest {
  id: string;
  serviceId: string;
  service?: Service;
  createdById: string;
  createdBy?: User;
  filledByDsaId?: string;
  filledByDsa?: User;
  status: RequestStatus;
  formData: ServiceFormData;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request status labels
export const requestStatusLabels: Record<RequestStatus, string> = {
  UNPAID: 'Pending Payment',
  PAID: 'Payment Successful',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

// Request status colors
export const requestStatusColors: Record<RequestStatus, string> = {
  UNPAID: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
