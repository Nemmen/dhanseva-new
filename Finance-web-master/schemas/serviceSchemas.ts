import { z } from 'zod';

// Base form schema (common to all services)
export const baseFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number (must be 10 digits starting with 6-9)'),
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, 'Invalid WhatsApp number').optional().or(z.literal('')),
  address: z.string().min(10, 'Address must be at least 10 characters').max(200, 'Address too long'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required').max(50, 'City name too long'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  aadhaarFrontUrl: z.string().url('Invalid Aadhaar front URL'),
  aadhaarBackUrl: z.string().url('Invalid Aadhaar back URL'),
  panFrontUrl: z.string().url('Invalid PAN front URL'),
  panBackUrl: z.string().url('Invalid PAN back URL').optional().or(z.literal('')),
});

// Personal Legal Extension
export const personalLegalExtensionSchema = z.object({
  employmentStatus: z.string().min(1, 'Employment status is required'),
  purposeDescription: z.string().min(10, 'Purpose description must be at least 10 characters'),
});

// Business Legal Extension
export const businessLegalExtensionSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  registrationNumber: z.string().optional().or(z.literal('')),
  partnersCount: z.number().int().positive().optional().or(z.literal('')),
});

// Financial Legal Extension
export const financialLegalExtensionSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountHolder: z.string().min(1, 'Account holder name is required'),
  loanAmount: z.number().positive('Loan amount must be positive').optional().or(z.literal('')),
  loanType: z.string().optional().or(z.literal('')),
});

// Government Compliance Extension
export const govtLegalExtensionSchema = z.object({
  departmentName: z.string().min(1, 'Department name is required'),
  applicationPurpose: z.string().min(10, 'Application purpose must be at least 10 characters'),
  stateJurisdiction: z.string().min(1, 'State jurisdiction is required'),
});

// Specialized Legal Extension
export const specializedLegalExtensionSchema = z.object({
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  consultationType: z.enum(['ONLINE', 'OFFLINE', 'BOTH']),
});

// Full service application schema
export const serviceApplicationSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID'),
  base: baseFormSchema,
  extension: z.union([
    personalLegalExtensionSchema,
    businessLegalExtensionSchema,
    financialLegalExtensionSchema,
    govtLegalExtensionSchema,
    specializedLegalExtensionSchema,
  ]),
});

export type BaseFormData = z.infer<typeof baseFormSchema>;
export type PersonalLegalExtension = z.infer<typeof personalLegalExtensionSchema>;
export type BusinessLegalExtension = z.infer<typeof businessLegalExtensionSchema>;
export type FinancialLegalExtension = z.infer<typeof financialLegalExtensionSchema>;
export type GovtLegalExtension = z.infer<typeof govtLegalExtensionSchema>;
export type SpecializedLegalExtension = z.infer<typeof specializedLegalExtensionSchema>;
export type ServiceApplicationFormData = z.infer<typeof serviceApplicationSchema>;

// Indian states list
export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Puducherry',
] as const;

// Employment status options
export const employmentStatusOptions = [
  'SALARIED',
  'SELF_EMPLOYED',
  'BUSINESS_OWNER',
  'RETIRED',
  'STUDENT',
  'UNEMPLOYED',
  'OTHER',
] as const;

// Business type options
export const businessTypeOptions = [
  'SOLE_PROPRIETORSHIP',
  'PARTNERSHIP',
  'PRIVATE_LIMITED',
  'PUBLIC_LIMITED',
  'LLP',
  'ONE_PERSON_COMPANY',
  'OTHER',
] as const;

// Loan type options
export const loanTypeOptions = [
  'HOME_LOAN',
  'PERSONAL_LOAN',
  'BUSINESS_LOAN',
  'EDUCATION_LOAN',
  'CAR_LOAN',
  'GOLD_LOAN',
  'OTHER',
] as const;
