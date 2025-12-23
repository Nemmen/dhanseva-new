// Service Form Configuration
// Maps service IDs to their specific form fields

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'file' | 'email' | 'tel';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ServiceFormConfig {
  serviceId: string;
  serviceName: string;
  extraFields: FormField[];
}

// Base form fields - common for ALL services
export const BASE_FORM_FIELDS: FormField[] = [
  { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter first name', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name', required: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '10-digit mobile number', required: true },
  { name: 'whatsapp', label: 'WhatsApp Number', type: 'tel', placeholder: 'WhatsApp number (optional)' },
  { 
    name: 'employmentType', 
    label: 'Employment Status', 
    type: 'select', 
    required: true,
    options: [
      { value: 'salaried', label: 'Salaried' },
      { value: 'self-employed', label: 'Self Employed' },
      { value: 'business', label: 'Business Owner' },
      { value: 'unemployed', label: 'Unemployed' },
      { value: 'student', label: 'Student' },
      { value: 'retired', label: 'Retired' },
    ]
  },
  { name: 'companyName', label: 'Company/Business Name', type: 'text', placeholder: 'Enter company name' },
  { name: 'monthlyIncome', label: 'Monthly Income (₹)', type: 'number', placeholder: 'Enter monthly income' },
  { name: 'bankName', label: 'Bank Name', type: 'text', placeholder: 'Enter bank name' },
  { name: 'accountHolderName', label: 'Account Holder Name', type: 'text', placeholder: 'Name as per bank account' },
  { name: 'address', label: 'Full Address', type: 'textarea', placeholder: 'Enter complete address', required: true },
  { 
    name: 'state', 
    label: 'State', 
    type: 'select', 
    required: true,
    options: [
      { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
      { value: 'delhi', label: 'Delhi' },
      { value: 'gujarat', label: 'Gujarat' },
      { value: 'karnataka', label: 'Karnataka' },
      { value: 'kerala', label: 'Kerala' },
      { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
      { value: 'maharashtra', label: 'Maharashtra' },
      { value: 'rajasthan', label: 'Rajasthan' },
      { value: 'tamil-nadu', label: 'Tamil Nadu' },
      { value: 'telangana', label: 'Telangana' },
      { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
      { value: 'west-bengal', label: 'West Bengal' },
      { value: 'other', label: 'Other' },
    ]
  },
  { name: 'city', label: 'City', type: 'text', placeholder: 'Enter city', required: true },
  { name: 'pincode', label: 'PIN Code', type: 'text', placeholder: '6-digit PIN code', required: true },
];

// Document upload fields - common for ALL services
export const DOCUMENT_FIELDS: FormField[] = [
  { name: 'aadhaarFront', label: 'Aadhaar Card (Front)', type: 'file', required: true },
  { name: 'aadhaarBack', label: 'Aadhaar Card (Back)', type: 'file', required: true },
  { name: 'panFront', label: 'PAN Card (Front)', type: 'file', required: true },
  { name: 'panBack', label: 'PAN Card (Back)', type: 'file' },
];

// Service-specific form configurations
export const SERVICE_FORM_CONFIGS: Record<string, ServiceFormConfig> = {
  // ============ PERSONAL LEGAL SERVICES ============
  'online-legal-consultation': {
    serviceId: 'online-legal-consultation',
    serviceName: 'Online Legal Consultation',
    extraFields: [
      { 
        name: 'consultationType', 
        label: 'Consultation Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'civil', label: 'Civil Matter' },
          { value: 'criminal', label: 'Criminal Matter' },
          { value: 'property', label: 'Property Dispute' },
          { value: 'family', label: 'Family Law' },
          { value: 'corporate', label: 'Corporate/Business' },
          { value: 'consumer', label: 'Consumer Rights' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'briefIssueDescription', label: 'Brief Issue Description', type: 'textarea', required: true, placeholder: 'Describe your legal issue briefly' },
      { 
        name: 'preferredLanguage', 
        label: 'Preferred Language', 
        type: 'select',
        options: [
          { value: 'english', label: 'English' },
          { value: 'hindi', label: 'Hindi' },
          { value: 'regional', label: 'Regional Language' },
        ]
      },
      { 
        name: 'preferredConsultationMode', 
        label: 'Consultation Mode', 
        type: 'select',
        options: [
          { value: 'video', label: 'Video Call' },
          { value: 'phone', label: 'Phone Call' },
          { value: 'chat', label: 'Chat/Message' },
        ]
      },
      { 
        name: 'urgencyLevel', 
        label: 'Urgency Level', 
        type: 'select',
        options: [
          { value: 'low', label: 'Low - Can wait' },
          { value: 'medium', label: 'Medium - Within a week' },
          { value: 'high', label: 'High - Urgent' },
        ]
      },
    ]
  },

  'affidavit-drafting': {
    serviceId: 'affidavit-drafting',
    serviceName: 'Affidavit Drafting',
    extraFields: [
      { 
        name: 'affidavitPurpose', 
        label: 'Purpose of Affidavit', 
        type: 'select', 
        required: true,
        options: [
          { value: 'name-change', label: 'Name Change' },
          { value: 'address-proof', label: 'Address Proof' },
          { value: 'income', label: 'Income Declaration' },
          { value: 'identity', label: 'Identity Verification' },
          { value: 'court', label: 'Court Purpose' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'deponentName', label: 'Deponent Name', type: 'text', required: true, placeholder: 'Name of person making affidavit' },
      { name: 'deponentRelation', label: 'Relation (if applicable)', type: 'text', placeholder: 'S/o, D/o, W/o' },
      { name: 'affidavitState', label: 'State for Notarization', type: 'text', required: true },
      { name: 'affidavitContentSummary', label: 'Content Summary', type: 'textarea', required: true, placeholder: 'What should the affidavit state?' },
      { 
        name: 'requiredNotary', 
        label: 'Notarization Required?', 
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes, with notary' },
          { value: 'no', label: 'No, plain affidavit' },
        ]
      },
    ]
  },

  'power-of-attorney': {
    serviceId: 'power-of-attorney',
    serviceName: 'Power of Attorney',
    extraFields: [
      { 
        name: 'poaType', 
        label: 'Type of POA', 
        type: 'select', 
        required: true,
        options: [
          { value: 'general', label: 'General POA' },
          { value: 'special', label: 'Special/Limited POA' },
          { value: 'property', label: 'Property POA' },
          { value: 'medical', label: 'Medical POA' },
          { value: 'financial', label: 'Financial POA' },
        ]
      },
      { name: 'principalName', label: 'Principal Name (Grantor)', type: 'text', required: true },
      { name: 'attorneyName', label: 'Attorney Name (Grantee)', type: 'text', required: true },
      { name: 'relationship', label: 'Relationship', type: 'text', placeholder: 'Relationship between parties' },
      { name: 'poaPurpose', label: 'Purpose of POA', type: 'textarea', required: true, placeholder: 'Describe the powers being granted' },
      { name: 'stateOfExecution', label: 'State of Execution', type: 'text', required: true },
      { 
        name: 'validityPeriod', 
        label: 'Validity Period', 
        type: 'select',
        options: [
          { value: '1-year', label: '1 Year' },
          { value: '2-years', label: '2 Years' },
          { value: '5-years', label: '5 Years' },
          { value: 'lifetime', label: 'Until Revoked' },
        ]
      },
    ]
  },

  'rental-lease-agreement': {
    serviceId: 'rental-lease-agreement',
    serviceName: 'Rental / Lease Agreement',
    extraFields: [
      { 
        name: 'propertyType', 
        label: 'Property Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'residential-flat', label: 'Residential Flat' },
          { value: 'residential-house', label: 'Residential House' },
          { value: 'commercial-shop', label: 'Commercial Shop' },
          { value: 'commercial-office', label: 'Commercial Office' },
          { value: 'warehouse', label: 'Warehouse/Godown' },
        ]
      },
      { name: 'propertyAddress', label: 'Property Address', type: 'textarea', required: true },
      { name: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
      { name: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
      { name: 'rentAmount', label: 'Monthly Rent (₹)', type: 'number', required: true },
      { name: 'securityDeposit', label: 'Security Deposit (₹)', type: 'number', required: true },
      { 
        name: 'leaseDuration', 
        label: 'Lease Duration', 
        type: 'select', 
        required: true,
        options: [
          { value: '6-months', label: '6 Months' },
          { value: '11-months', label: '11 Months' },
          { value: '1-year', label: '1 Year' },
          { value: '2-years', label: '2 Years' },
          { value: '3-years', label: '3 Years' },
        ]
      },
      { name: 'stateJurisdiction', label: 'State Jurisdiction', type: 'text', required: true },
    ]
  },

  'will-succession-planning': {
    serviceId: 'will-succession-planning',
    serviceName: 'Will / Succession Planning',
    extraFields: [
      { name: 'testatorName', label: 'Testator Name', type: 'text', required: true, placeholder: 'Name of person making will' },
      { 
        name: 'maritalStatus', 
        label: 'Marital Status', 
        type: 'select', 
        required: true,
        options: [
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married' },
          { value: 'divorced', label: 'Divorced' },
          { value: 'widowed', label: 'Widowed' },
        ]
      },
      { name: 'numberOfHeirs', label: 'Number of Heirs', type: 'number', required: true },
      { 
        name: 'assetTypes', 
        label: 'Types of Assets', 
        type: 'select',
        options: [
          { value: 'property', label: 'Property/Real Estate' },
          { value: 'bank-accounts', label: 'Bank Accounts' },
          { value: 'investments', label: 'Investments/Stocks' },
          { value: 'business', label: 'Business Assets' },
          { value: 'multiple', label: 'Multiple Asset Types' },
        ]
      },
      { name: 'executorName', label: 'Executor Name', type: 'text', placeholder: 'Person to execute the will' },
      { name: 'stateJurisdiction', label: 'State Jurisdiction', type: 'text', required: true },
    ]
  },

  'noc-drafting': {
    serviceId: 'noc-drafting',
    serviceName: 'NOC Drafting',
    extraFields: [
      { 
        name: 'nocPurpose', 
        label: 'NOC Purpose', 
        type: 'select', 
        required: true,
        options: [
          { value: 'vehicle-transfer', label: 'Vehicle Transfer' },
          { value: 'property-sale', label: 'Property Sale' },
          { value: 'employment', label: 'Employment Change' },
          { value: 'education', label: 'Education/College' },
          { value: 'bank', label: 'Bank Related' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'issuingAuthority', label: 'Issuing Authority', type: 'text', required: true },
      { name: 'recipientName', label: 'Recipient Name', type: 'text', required: true },
      { name: 'propertyOrSubjectDetails', label: 'Subject Details', type: 'textarea', required: true, placeholder: 'Details of property/vehicle/subject' },
    ]
  },

  'legal-notice': {
    serviceId: 'legal-notice',
    serviceName: 'Legal Notice',
    extraFields: [
      { 
        name: 'noticeType', 
        label: 'Notice Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'cheque-bounce', label: 'Cheque Bounce' },
          { value: 'recovery', label: 'Money Recovery' },
          { value: 'property', label: 'Property Dispute' },
          { value: 'defamation', label: 'Defamation' },
          { value: 'employment', label: 'Employment Related' },
          { value: 'consumer', label: 'Consumer Complaint' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'oppositePartyName', label: 'Opposite Party Name', type: 'text', required: true },
      { name: 'oppositePartyAddress', label: 'Opposite Party Address', type: 'textarea', required: true },
      { name: 'issueSummary', label: 'Issue Summary', type: 'textarea', required: true, placeholder: 'Describe the issue in detail' },
      { name: 'amountInvolved', label: 'Amount Involved (₹)', type: 'number', placeholder: 'If monetary dispute' },
    ]
  },

  'property-land-dispute': {
    serviceId: 'property-land-dispute',
    serviceName: 'Property / Land Dispute Advisory',
    extraFields: [
      { 
        name: 'propertyType', 
        label: 'Property Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'residential', label: 'Residential' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'agricultural', label: 'Agricultural Land' },
          { value: 'industrial', label: 'Industrial' },
        ]
      },
      { 
        name: 'disputeNature', 
        label: 'Nature of Dispute', 
        type: 'select', 
        required: true,
        options: [
          { value: 'ownership', label: 'Ownership Dispute' },
          { value: 'boundary', label: 'Boundary Dispute' },
          { value: 'encroachment', label: 'Encroachment' },
          { value: 'tenant', label: 'Tenant Issues' },
          { value: 'inheritance', label: 'Inheritance Dispute' },
        ]
      },
      { name: 'propertyLocation', label: 'Property Location', type: 'textarea', required: true },
      { 
        name: 'ownershipStatus', 
        label: 'Your Ownership Status', 
        type: 'select',
        options: [
          { value: 'owner', label: 'Full Owner' },
          { value: 'co-owner', label: 'Co-Owner' },
          { value: 'claimant', label: 'Claimant' },
          { value: 'tenant', label: 'Tenant' },
        ]
      },
      { name: 'opposingPartyDetails', label: 'Opposing Party Details', type: 'textarea', placeholder: 'Name and details of opposing party' },
    ]
  },

  'family-dispute-divorce': {
    serviceId: 'family-dispute-divorce',
    serviceName: 'Divorce / Family Dispute',
    extraFields: [
      { 
        name: 'disputeType', 
        label: 'Dispute Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'mutual-divorce', label: 'Mutual Divorce' },
          { value: 'contested-divorce', label: 'Contested Divorce' },
          { value: 'maintenance', label: 'Maintenance/Alimony' },
          { value: 'custody', label: 'Child Custody' },
          { value: 'domestic-violence', label: 'Domestic Violence' },
        ]
      },
      { name: 'marriageDate', label: 'Marriage Date', type: 'date', required: true },
      { name: 'childrenCount', label: 'Number of Children', type: 'number' },
      { 
        name: 'currentStatus', 
        label: 'Current Status', 
        type: 'select',
        options: [
          { value: 'living-together', label: 'Living Together' },
          { value: 'separated', label: 'Separated' },
          { value: 'case-filed', label: 'Case Already Filed' },
        ]
      },
      { name: 'courtLocation', label: 'Preferred Court Location', type: 'text' },
    ]
  },

  'cybercrime-fraud': {
    serviceId: 'cybercrime-fraud',
    serviceName: 'Cybercrime / Online Fraud',
    extraFields: [
      { 
        name: 'fraudType', 
        label: 'Type of Fraud', 
        type: 'select', 
        required: true,
        options: [
          { value: 'banking', label: 'Banking/UPI Fraud' },
          { value: 'investment', label: 'Investment Scam' },
          { value: 'job', label: 'Job Fraud' },
          { value: 'shopping', label: 'Online Shopping Fraud' },
          { value: 'identity', label: 'Identity Theft' },
          { value: 'phishing', label: 'Phishing/Hacking' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'fraudAmount', label: 'Amount Lost (₹)', type: 'number', required: true },
      { name: 'dateOfIncident', label: 'Date of Incident', type: 'date', required: true },
      { name: 'platformUsed', label: 'Platform Used', type: 'text', placeholder: 'App/Website name' },
      { 
        name: 'hasFIR', 
        label: 'FIR Filed?', 
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'planning', label: 'Planning to file' },
        ]
      },
      { name: 'evidenceDescription', label: 'Evidence Available', type: 'textarea', placeholder: 'Screenshots, transaction IDs, etc.' },
    ]
  },

  // ============ BUSINESS LEGAL SERVICES ============
  'partnership-deed': {
    serviceId: 'partnership-deed',
    serviceName: 'Partnership Deed Drafting',
    extraFields: [
      { name: 'firmName', label: 'Firm Name', type: 'text', required: true },
      { name: 'numberOfPartners', label: 'Number of Partners', type: 'number', required: true },
      { name: 'businessNature', label: 'Nature of Business', type: 'text', required: true },
      { name: 'capitalContribution', label: 'Total Capital', type: 'number', required: true },
      { name: 'profitSharingRatio', label: 'Profit Sharing Ratio', type: 'text', placeholder: 'e.g., 50:50, 60:40' },
      { name: 'businessAddress', label: 'Business Address', type: 'textarea', required: true },
    ]
  },

  'mou-drafting': {
    serviceId: 'mou-drafting',
    serviceName: 'MoU Drafting',
    extraFields: [
      { name: 'party1Name', label: 'First Party Name', type: 'text', required: true },
      { name: 'party2Name', label: 'Second Party Name', type: 'text', required: true },
      { name: 'mouPurpose', label: 'Purpose of MoU', type: 'textarea', required: true },
      { 
        name: 'mouType', 
        label: 'MoU Type', 
        type: 'select',
        options: [
          { value: 'business', label: 'Business Collaboration' },
          { value: 'joint-venture', label: 'Joint Venture' },
          { value: 'service', label: 'Service Agreement' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g., 1 year, 2 years' },
    ]
  },

  'business-contracts': {
    serviceId: 'business-contracts',
    serviceName: 'Business Contracts',
    extraFields: [
      { 
        name: 'contractType', 
        label: 'Contract Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'service', label: 'Service Agreement' },
          { value: 'vendor', label: 'Vendor Agreement' },
          { value: 'client', label: 'Client Agreement' },
          { value: 'franchise', label: 'Franchise Agreement' },
          { value: 'distribution', label: 'Distribution Agreement' },
        ]
      },
      { name: 'party1Name', label: 'First Party', type: 'text', required: true },
      { name: 'party2Name', label: 'Second Party', type: 'text', required: true },
      { name: 'contractValue', label: 'Contract Value (₹)', type: 'number' },
      { name: 'contractTerms', label: 'Key Terms', type: 'textarea', required: true },
    ]
  },

  'employment-contracts': {
    serviceId: 'employment-contracts',
    serviceName: 'Employment Contracts',
    extraFields: [
      { name: 'employerName', label: 'Employer/Company Name', type: 'text', required: true },
      { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'salary', label: 'CTC/Salary (₹)', type: 'number', required: true },
      { name: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
      { name: 'noticePeriod', label: 'Notice Period', type: 'text', placeholder: 'e.g., 30 days, 60 days' },
      { name: 'probationPeriod', label: 'Probation Period', type: 'text', placeholder: 'e.g., 3 months, 6 months' },
    ]
  },

  'nda-drafting': {
    serviceId: 'nda-drafting',
    serviceName: 'NDA Drafting',
    extraFields: [
      { name: 'disclosingParty', label: 'Disclosing Party', type: 'text', required: true },
      { name: 'receivingParty', label: 'Receiving Party', type: 'text', required: true },
      { name: 'confidentialInfoType', label: 'Type of Confidential Information', type: 'textarea', required: true },
      { 
        name: 'ndaType', 
        label: 'NDA Type', 
        type: 'select',
        options: [
          { value: 'unilateral', label: 'Unilateral (One-way)' },
          { value: 'mutual', label: 'Mutual (Two-way)' },
        ]
      },
      { name: 'validityPeriod', label: 'Validity Period', type: 'text', required: true, placeholder: 'e.g., 2 years' },
    ]
  },

  'trademark-registration': {
    serviceId: 'trademark-registration',
    serviceName: 'Trademark Registration Help',
    extraFields: [
      { name: 'trademarkName', label: 'Trademark Name/Word', type: 'text', required: true },
      { 
        name: 'trademarkType', 
        label: 'Trademark Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'word', label: 'Word Mark' },
          { value: 'logo', label: 'Logo/Device Mark' },
          { value: 'combined', label: 'Word + Logo' },
        ]
      },
      { name: 'businessName', label: 'Business/Applicant Name', type: 'text', required: true },
      { name: 'goodsServices', label: 'Goods/Services Description', type: 'textarea', required: true },
      { name: 'trademarkClass', label: 'Trademark Class (if known)', type: 'text', placeholder: 'e.g., Class 25, Class 35' },
    ]
  },

  'compliance-documents': {
    serviceId: 'compliance-documents',
    serviceName: 'Compliance Documents',
    extraFields: [
      { 
        name: 'documentType', 
        label: 'Document Type Required', 
        type: 'select', 
        required: true,
        options: [
          { value: 'msme', label: 'MSME Registration' },
          { value: 'gst', label: 'GST Related' },
          { value: 'annual-return', label: 'Annual Returns' },
          { value: 'board-resolution', label: 'Board Resolution' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { name: 'companyType', label: 'Company Type', type: 'text', placeholder: 'Pvt Ltd, LLP, Partnership, etc.' },
      { name: 'specificRequirements', label: 'Specific Requirements', type: 'textarea' },
    ]
  },

  'startup-legal-advisory': {
    serviceId: 'startup-legal-advisory',
    serviceName: 'Startup Legal Advisory',
    extraFields: [
      { name: 'startupName', label: 'Startup Name', type: 'text', required: true },
      { 
        name: 'startupStage', 
        label: 'Startup Stage', 
        type: 'select', 
        required: true,
        options: [
          { value: 'idea', label: 'Idea Stage' },
          { value: 'mvp', label: 'MVP Stage' },
          { value: 'growth', label: 'Growth Stage' },
          { value: 'funded', label: 'Funded Startup' },
        ]
      },
      { name: 'industryType', label: 'Industry', type: 'text', required: true },
      { 
        name: 'advisoryNeeded', 
        label: 'Advisory Needed For', 
        type: 'select',
        options: [
          { value: 'incorporation', label: 'Company Incorporation' },
          { value: 'funding', label: 'Funding Documents' },
          { value: 'compliance', label: 'Compliance' },
          { value: 'contracts', label: 'Contracts' },
          { value: 'all', label: 'Multiple Areas' },
        ]
      },
      { name: 'founderCount', label: 'Number of Founders', type: 'number' },
    ]
  },

  // ============ FINANCIAL LEGAL SERVICES ============
  'loan-agreement': {
    serviceId: 'loan-agreement',
    serviceName: 'Loan Agreement Drafting',
    extraFields: [
      { name: 'lenderName', label: 'Lender Name', type: 'text', required: true },
      { name: 'borrowerName', label: 'Borrower Name', type: 'text', required: true },
      { name: 'loanAmount', label: 'Loan Amount (₹)', type: 'number', required: true },
      { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', required: true },
      { name: 'tenure', label: 'Loan Tenure', type: 'text', required: true, placeholder: 'e.g., 12 months, 2 years' },
      { 
        name: 'loanPurpose', 
        label: 'Loan Purpose', 
        type: 'select',
        options: [
          { value: 'personal', label: 'Personal' },
          { value: 'business', label: 'Business' },
          { value: 'property', label: 'Property Purchase' },
          { value: 'education', label: 'Education' },
          { value: 'other', label: 'Other' },
        ]
      },
    ]
  },

  'ca-certificate': {
    serviceId: 'ca-certificate',
    serviceName: 'CA Certificate Assistance',
    extraFields: [
      { 
        name: 'certificateType', 
        label: 'Certificate Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'net-worth', label: 'Net Worth Certificate' },
          { value: 'income', label: 'Income Certificate' },
          { value: 'turnover', label: 'Turnover Certificate' },
          { value: 'gst', label: 'GST Certificate' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
      { name: 'purpose', label: 'Purpose of Certificate', type: 'textarea', required: true },
      { name: 'financialYear', label: 'Financial Year', type: 'text', placeholder: 'e.g., 2023-24' },
    ]
  },

  'dsa-verification': {
    serviceId: 'dsa-verification',
    serviceName: 'DSA Verification',
    extraFields: [
      { name: 'dsaName', label: 'DSA Name', type: 'text', required: true },
      { name: 'dsaCompany', label: 'DSA Company', type: 'text' },
      { name: 'dsaCode', label: 'DSA Code (if any)', type: 'text' },
      { name: 'bankAssociated', label: 'Bank/NBFC Associated', type: 'text', required: true },
      { name: 'verificationReason', label: 'Reason for Verification', type: 'textarea' },
    ]
  },

  'debt-recovery': {
    serviceId: 'debt-recovery',
    serviceName: 'Debt Recovery Notice',
    extraFields: [
      { name: 'debtorName', label: 'Debtor Name', type: 'text', required: true },
      { name: 'debtorAddress', label: 'Debtor Address', type: 'textarea', required: true },
      { name: 'debtAmount', label: 'Debt Amount (₹)', type: 'number', required: true },
      { name: 'debtDate', label: 'Date of Debt', type: 'date' },
      { 
        name: 'debtType', 
        label: 'Type of Debt', 
        type: 'select',
        options: [
          { value: 'personal-loan', label: 'Personal Loan' },
          { value: 'business-loan', label: 'Business Loan' },
          { value: 'cheque', label: 'Cheque Bounce' },
          { value: 'service-due', label: 'Service Dues' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'evidenceDetails', label: 'Evidence Available', type: 'textarea', placeholder: 'Agreements, cheques, invoices, etc.' },
    ]
  },

  'guarantee-deed': {
    serviceId: 'guarantee-deed',
    serviceName: 'Guarantee Deed Drafting',
    extraFields: [
      { name: 'guarantorName', label: 'Guarantor Name', type: 'text', required: true },
      { name: 'beneficiaryName', label: 'Beneficiary Name', type: 'text', required: true },
      { name: 'principalDebtor', label: 'Principal Debtor Name', type: 'text', required: true },
      { name: 'guaranteeAmount', label: 'Guarantee Amount (₹)', type: 'number', required: true },
      { name: 'guaranteePurpose', label: 'Purpose of Guarantee', type: 'textarea', required: true },
    ]
  },

  'rbi-banking-complaint': {
    serviceId: 'rbi-banking-complaint',
    serviceName: 'RBI / Banking Complaint',
    extraFields: [
      { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
      { name: 'branchName', label: 'Branch Name', type: 'text' },
      { name: 'accountNumber', label: 'Account Number', type: 'text' },
      { 
        name: 'complaintType', 
        label: 'Complaint Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'fraud', label: 'Fraud/Unauthorized Transaction' },
          { value: 'service', label: 'Poor Service' },
          { value: 'charges', label: 'Wrong Charges' },
          { value: 'loan', label: 'Loan Related' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'complaintDescription', label: 'Complaint Description', type: 'textarea', required: true },
      { name: 'amountInvolved', label: 'Amount Involved (₹)', type: 'number' },
    ]
  },

  // ============ GOVT COMPLIANCE SERVICES ============
  'court-case-filing': {
    serviceId: 'court-case-filing',
    serviceName: 'Court Case Filing Assistance',
    extraFields: [
      { 
        name: 'caseType', 
        label: 'Case Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'civil', label: 'Civil Case' },
          { value: 'criminal', label: 'Criminal Case' },
          { value: 'consumer', label: 'Consumer Case' },
          { value: 'family', label: 'Family Court' },
          { value: 'labour', label: 'Labour Court' },
        ]
      },
      { name: 'petitionerName', label: 'Petitioner Name', type: 'text', required: true },
      { name: 'respondentName', label: 'Respondent Name', type: 'text', required: true },
      { name: 'courtName', label: 'Court Name/Location', type: 'text' },
      { name: 'caseSummary', label: 'Case Summary', type: 'textarea', required: true },
    ]
  },

  'rti-application': {
    serviceId: 'rti-application',
    serviceName: 'RTI Application Drafting',
    extraFields: [
      { name: 'publicAuthority', label: 'Public Authority Name', type: 'text', required: true },
      { name: 'informationRequired', label: 'Information Required', type: 'textarea', required: true },
      { name: 'timePeriod', label: 'Time Period for Information', type: 'text', placeholder: 'e.g., Last 5 years' },
      { name: 'specificQuestions', label: 'Specific Questions', type: 'textarea' },
    ]
  },

  'license-documentation': {
    serviceId: 'license-documentation',
    serviceName: 'License Documentation',
    extraFields: [
      { 
        name: 'licenseType', 
        label: 'License Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'trade', label: 'Trade License' },
          { value: 'shop-act', label: 'Shop Act License' },
          { value: 'fssai', label: 'FSSAI License' },
          { value: 'factory', label: 'Factory License' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'businessName', label: 'Business Name', type: 'text', required: true },
      { name: 'businessAddress', label: 'Business Address', type: 'textarea', required: true },
      { name: 'ownerName', label: 'Owner Name', type: 'text', required: true },
    ]
  },

  'e-notary-service': {
    serviceId: 'e-notary-service',
    serviceName: 'E-Notary Service',
    extraFields: [
      { 
        name: 'documentType', 
        label: 'Document to Notarize', 
        type: 'select', 
        required: true,
        options: [
          { value: 'affidavit', label: 'Affidavit' },
          { value: 'agreement', label: 'Agreement' },
          { value: 'declaration', label: 'Declaration' },
          { value: 'poa', label: 'Power of Attorney' },
          { value: 'other', label: 'Other Document' },
        ]
      },
      { name: 'documentDescription', label: 'Document Description', type: 'textarea', required: true },
      { name: 'urgency', label: 'Urgency Level', type: 'select', options: [
        { value: 'normal', label: 'Normal (3-5 days)' },
        { value: 'urgent', label: 'Urgent (1-2 days)' },
      ]},
    ]
  },

  'stamp-paper-service': {
    serviceId: 'stamp-paper-service',
    serviceName: 'Stamp Paper Procurement',
    extraFields: [
      { name: 'stampPaperValue', label: 'Stamp Paper Value (₹)', type: 'number', required: true },
      { name: 'quantity', label: 'Quantity Required', type: 'number', required: true },
      { name: 'purpose', label: 'Purpose', type: 'text', required: true },
      { name: 'state', label: 'State for Stamp Paper', type: 'text', required: true },
    ]
  },

  // ============ SPECIALIZED LEGAL SERVICES ============
  'mediation-service': {
    serviceId: 'mediation-service',
    serviceName: 'Mediation Service',
    extraFields: [
      { 
        name: 'disputeType', 
        label: 'Dispute Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'commercial', label: 'Commercial Dispute' },
          { value: 'property', label: 'Property Dispute' },
          { value: 'family', label: 'Family Dispute' },
          { value: 'employment', label: 'Employment Dispute' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'party1Name', label: 'First Party Name', type: 'text', required: true },
      { name: 'party2Name', label: 'Second Party Name', type: 'text', required: true },
      { name: 'disputeSummary', label: 'Dispute Summary', type: 'textarea', required: true },
    ]
  },

  'corporate-legal-audit': {
    serviceId: 'corporate-legal-audit',
    serviceName: 'Corporate Legal Audit',
    extraFields: [
      { name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { name: 'companyType', label: 'Company Type', type: 'text', required: true },
      { 
        name: 'auditScope', 
        label: 'Audit Scope', 
        type: 'select',
        options: [
          { value: 'full', label: 'Full Audit' },
          { value: 'compliance', label: 'Compliance Only' },
          { value: 'contracts', label: 'Contracts Review' },
          { value: 'specific', label: 'Specific Areas' },
        ]
      },
      { name: 'employeeCount', label: 'Employee Count', type: 'number' },
      { name: 'specificConcerns', label: 'Specific Concerns', type: 'textarea' },
    ]
  },

  'compliance-advisory': {
    serviceId: 'compliance-advisory',
    serviceName: 'Compliance Advisory',
    extraFields: [
      { 
        name: 'complianceArea', 
        label: 'Compliance Area', 
        type: 'select', 
        required: true,
        options: [
          { value: 'labour', label: 'Labour Laws' },
          { value: 'tax', label: 'Tax Compliance' },
          { value: 'corporate', label: 'Corporate Compliance' },
          { value: 'environmental', label: 'Environmental' },
          { value: 'industry', label: 'Industry Specific' },
        ]
      },
      { name: 'companyName', label: 'Company Name', type: 'text', required: true },
      { name: 'industryType', label: 'Industry Type', type: 'text', required: true },
      { name: 'currentIssues', label: 'Current Issues/Concerns', type: 'textarea' },
    ]
  },

  'cyber-law-advisory': {
    serviceId: 'cyber-law-advisory',
    serviceName: 'Cyber Law Advisory',
    extraFields: [
      { 
        name: 'advisoryType', 
        label: 'Advisory Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'data-protection', label: 'Data Protection' },
          { value: 'it-contracts', label: 'IT Contracts' },
          { value: 'cyber-security', label: 'Cyber Security Policy' },
          { value: 'social-media', label: 'Social Media Issues' },
          { value: 'other', label: 'Other' },
        ]
      },
      { name: 'businessName', label: 'Business Name', type: 'text', required: true },
      { name: 'specificRequirement', label: 'Specific Requirement', type: 'textarea', required: true },
    ]
  },

  'digital-signature': {
    serviceId: 'digital-signature',
    serviceName: 'Digital Signature Certificate',
    extraFields: [
      { 
        name: 'dscClass', 
        label: 'DSC Class', 
        type: 'select', 
        required: true,
        options: [
          { value: 'class-2', label: 'Class 2' },
          { value: 'class-3', label: 'Class 3' },
        ]
      },
      { 
        name: 'dscType', 
        label: 'DSC Type', 
        type: 'select', 
        required: true,
        options: [
          { value: 'sign', label: 'Signature Only' },
          { value: 'sign-encrypt', label: 'Signature + Encryption' },
        ]
      },
      { 
        name: 'validity', 
        label: 'Validity Period', 
        type: 'select', 
        required: true,
        options: [
          { value: '1-year', label: '1 Year' },
          { value: '2-years', label: '2 Years' },
          { value: '3-years', label: '3 Years' },
        ]
      },
      { name: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
      { name: 'organization', label: 'Organization (if applicable)', type: 'text' },
    ]
  },
};

// Helper function to get form config by service ID
export function getServiceFormConfig(serviceId: string): ServiceFormConfig | null {
  return SERVICE_FORM_CONFIGS[serviceId] || null;
}

// Get all service IDs
export function getAllServiceIds(): string[] {
  return Object.keys(SERVICE_FORM_CONFIGS);
}
