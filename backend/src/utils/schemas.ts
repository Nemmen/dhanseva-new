import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
    role: z.enum(['USER', 'DSA', 'EMPLOYEE']).default('USER'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// OTP Schemas
export const sendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

// Base Form Schema (Common to all services)
export const baseFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  whatsapp: z.string().regex(/^[0-9]{10}$/, 'WhatsApp must be 10 digits').optional(),
  address: z.string().min(1, 'Address is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  aadhaarFrontUrl: z.string().url('Invalid Aadhaar front URL'),
  aadhaarBackUrl: z.string().url('Invalid Aadhaar back URL'),
  panFrontUrl: z.string().url('Invalid PAN front URL'),
  panBackUrl: z.string().url('Invalid PAN back URL'),
});

// Personal Legal Extension
export const personalLegalExtension = z.object({
  employmentStatus: z.string().min(1, 'Employment status is required'),
  purposeDescription: z.string().min(10, 'Purpose description must be at least 10 characters'),
});

// Business Legal Extension
export const businessLegalExtension = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  registrationNumber: z.string().optional(),
  partnersCount: z.number().int().positive().optional(),
});

// Financial Legal Extension
export const financialLegalExtension = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountHolder: z.string().min(1, 'Account holder name is required'),
  loanAmount: z.number().positive('Loan amount must be positive').optional(),
  loanType: z.string().optional(),
});

// Government Compliance Extension
export const govtLegalExtension = z.object({
  departmentName: z.string().min(1, 'Department name is required'),
  applicationPurpose: z.string().min(10, 'Application purpose is required'),
  stateJurisdiction: z.string().min(1, 'State jurisdiction is required'),
});

// Specialized Legal Extension
export const specializedLegalExtension = z.object({
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  consultationType: z.enum(['ONLINE', 'OFFLINE', 'BOTH']),
});

export type BaseForm = z.infer<typeof baseFormSchema>;
export type PersonalLegalExtension = z.infer<typeof personalLegalExtension>;
export type BusinessLegalExtension = z.infer<typeof businessLegalExtension>;
export type FinancialLegalExtension = z.infer<typeof financialLegalExtension>;
export type GovtLegalExtension = z.infer<typeof govtLegalExtension>;
export type SpecializedLegalExtension = z.infer<typeof specializedLegalExtension>;
