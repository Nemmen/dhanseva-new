// Service categories
export type ServiceCategory =
  | 'PERSONAL_LEGAL'
  | 'BUSINESS_LEGAL'
  | 'FINANCIAL_LEGAL'
  | 'GOVT_COMPLIANCE'
  | 'SPECIALIZED_LEGAL'
  | 'LOAN'
  | 'INSURANCE'
  | 'CREDIT_CARD'
  | 'BANK_ACCOUNT'
  | 'INVESTMENT'
  | 'TAX'
  | 'OTHER';

// Service interface
export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description?: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  requiredDocuments?: string[];
}

// Service category labels
export const serviceCategoryLabels: Record<ServiceCategory, string> = {
  PERSONAL_LEGAL: 'Personal / Individual Legal Services',
  BUSINESS_LEGAL: 'Business / Startup Legal Services',
  FINANCIAL_LEGAL: 'Bank / Loan / Financial Legal Services',
  GOVT_COMPLIANCE: 'Government / Compliance Related Services',
  SPECIALIZED_LEGAL: 'Specialized Online Legal Services',
  LOAN: 'Loan Services',
  INSURANCE: 'Insurance Services',
  CREDIT_CARD: 'Credit Card Services',
  BANK_ACCOUNT: 'Bank Account Services',
  INVESTMENT: 'Investment Services',
  TAX: 'Tax Services',
  OTHER: 'Other Services',
};

// Service icons mapping (using react-icons)
export const serviceCategoryIcons: Record<ServiceCategory, string> = {
  PERSONAL_LEGAL: 'FaUser',
  BUSINESS_LEGAL: 'FaBriefcase',
  FINANCIAL_LEGAL: 'FaUniversity',
  GOVT_COMPLIANCE: 'FaLandmark',
  SPECIALIZED_LEGAL: 'FaGavel',
  LOAN: 'FaMoneyBillWave',
  INSURANCE: 'FaShieldAlt',
  CREDIT_CARD: 'FaCreditCard',
  BANK_ACCOUNT: 'FaUniversity',
  INVESTMENT: 'FaChartLine',
  TAX: 'FaFileInvoice',
  OTHER: 'FaEllipsisH',
};
