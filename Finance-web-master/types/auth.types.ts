// User roles
export type UserRole = 'USER' | 'DSA' | 'EMPLOYEE';

// User interface
export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  dsaProfile?: DsaProfile;
  employeeProfile?: EmployeeProfile;
}

// DSA Profile
export interface DsaProfile {
  id: string;
  userId: string;
  registrationPaid: boolean;
  isActive: boolean;
  fullName: string;
  phone: string;
  whatsapp?: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  createdAt: string;
  updatedAt: string;
}

// Employee Profile
export interface EmployeeProfile {
  id: string;
  userId: string;
  fullName: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth data
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: UserRole;
}

export interface OTPData {
  email: string;
  otp: string;
}

// Auth response
export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}
