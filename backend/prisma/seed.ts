import { PrismaClient, ServiceCategory, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Test Users - All with verified accounts and password: Test@123
const testUsers = [
  // Regular Users
  {
    email: 'user@test.com',
    password: 'Test@123',
    role: Role.USER,
    emailVerified: true,
  },
  {
    email: 'user2@test.com',
    password: 'Test@123',
    role: Role.USER,
    emailVerified: true,
  },
  // DSA Agents
  {
    email: 'dsa@test.com',
    password: 'Test@123',
    role: Role.DSA,
    emailVerified: true,
    dsaProfile: {
      fullName: 'Rahul Kumar',
      phone: '9876543210',
      whatsapp: '9876543210',
      address: '123 MG Road, Sector 15',
      state: 'Maharashtra',
      city: 'Mumbai',
      pincode: '400001',
      registrationPaid: true,
      isActive: true,
    },
  },
  {
    email: 'dsa2@test.com',
    password: 'Test@123',
    role: Role.DSA,
    emailVerified: true,
    dsaProfile: {
      fullName: 'Priya Sharma',
      phone: '9876543211',
      whatsapp: '9876543211',
      address: '456 Park Street',
      state: 'Delhi',
      city: 'New Delhi',
      pincode: '110001',
      registrationPaid: true,
      isActive: true,
    },
  },
  // Employees
  {
    email: 'employee@test.com',
    password: 'Test@123',
    role: Role.EMPLOYEE,
    emailVerified: true,
    employeeProfile: {
      fullName: 'Admin User',
      department: 'Operations',
      isActive: true,
    },
  },
  {
    email: 'employee2@test.com',
    password: 'Test@123',
    role: Role.EMPLOYEE,
    emailVerified: true,
    employeeProfile: {
      fullName: 'Support Staff',
      department: 'Customer Support',
      isActive: true,
    },
  },
];

// All 32 services matching frontend data/services.ts
const services = [
  // PERSONAL_LEGAL (10 services)
  {
    id: 'online-legal-consultation',
    name: 'Online Legal Consultation',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'Get expert legal advice from qualified advocates through video or phone consultation. Our experienced lawyers provide guidance on all legal matters.',
    price: 99,
  },
  {
    id: 'affidavit-drafting',
    name: 'Affidavit Drafting',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'Professional drafting of affidavits for various purposes including name change, address proof, and court submissions. Legally compliant documents.',
    price: 99,
  },
  {
    id: 'power-of-attorney',
    name: 'Power of Attorney',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'Draft and register Power of Attorney documents for property, financial, or general purposes. Both Special and General POA services available.',
    price: 99,
  },
  {
    id: 'rental-lease-agreement',
    name: 'Rental / Lease Agreement',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'Legally binding rental and lease agreements for residential and commercial properties. State-specific documentation with registration assistance.',
    price: 99,
  },
  {
    id: 'will-succession-planning',
    name: 'Will / Succession Planning',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'Draft your will and plan succession to ensure your assets are distributed as per your wishes. Expert guidance on inheritance laws.',
    price: 99,
  },
  {
    id: 'noc-drafting',
    name: 'NOC Drafting',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'No Objection Certificate drafting for various purposes including vehicle transfer, property sale, and employment changes.',
    price: 99,
  },
  {
    id: 'legal-notice',
    name: 'Legal Notice',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'Draft and send legal notices for recovery, cheque bounce, property disputes, defamation, and other civil matters.',
    price: 99,
  },
  {
    id: 'property-land-dispute',
    name: 'Property / Land Dispute Advisory',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'Expert legal advisory for property and land disputes including boundary issues, ownership claims, and encroachment matters.',
    price: 99,
  },
  {
    id: 'family-dispute-divorce',
    name: 'Divorce / Family Dispute',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'Legal assistance for divorce proceedings, maintenance, custody matters, and family disputes. Confidential consultation available.',
    price: 99,
  },
  {
    id: 'cybercrime-fraud',
    name: 'Cybercrime / Online Fraud',
    category: ServiceCategory.PERSONAL_LEGAL,
    description: 'Legal assistance for cybercrime victims including online fraud, identity theft, phishing, and unauthorized transactions.',
    price: 99,
  },

  // BUSINESS_LEGAL (8 services)
  {
    id: 'partnership-deed',
    name: 'Partnership Deed Drafting',
    category: ServiceCategory.BUSINESS_LEGAL,
    description: 'Draft comprehensive partnership deeds with clear profit-sharing ratios, responsibilities, and exit clauses for your business.',
    price: 99,
  },
  {
    id: 'mou-drafting',
    name: 'MoU Drafting',
    category: ServiceCategory.BUSINESS_LEGAL,
    description: 'Memorandum of Understanding for business collaborations, joint ventures, and partnership agreements.',
    price: 99,
  },
  {
    id: 'business-contracts',
    name: 'Business Contracts',
    category: ServiceCategory.BUSINESS_LEGAL,
    description: 'Draft and review business contracts including service agreements, vendor contracts, and client agreements.',
    price: 99,
  },
  {
    id: 'employment-contracts',
    name: 'Employment Contracts',
    category: ServiceCategory.BUSINESS_LEGAL,
    description: 'Employment agreement drafting with proper terms, conditions, NDA clauses, and compliance with labor laws.',
    price: 99,
  },
  {
    id: 'nda-drafting',
    name: 'NDA Drafting',
    category: ServiceCategory.BUSINESS_LEGAL,
    description: 'Non-Disclosure Agreement drafting for protecting confidential business information and trade secrets.',
    price: 99,
  },
  {
    id: 'trademark-registration',
    name: 'Trademark Registration Help',
    category: ServiceCategory.BUSINESS_LEGAL,
    description: 'Assistance with trademark search, application filing, and registration process for brand protection.',
    price: 99,
  },
  {
    id: 'compliance-documents',
    name: 'Compliance Documents',
    category: ServiceCategory.BUSINESS_LEGAL,
    description: 'Prepare essential compliance documents including MSME registration, GST documentation, and annual returns.',
    price: 99,
  },
  {
    id: 'startup-legal-advisory',
    name: 'Startup Legal Advisory',
    category: ServiceCategory.BUSINESS_LEGAL,
    description: 'Comprehensive legal advisory for startups covering incorporation, funding documents, and regulatory compliance.',
    price: 99,
  },

  // FINANCIAL_LEGAL (6 services)
  {
    id: 'loan-agreement',
    name: 'Loan Agreement Drafting',
    category: ServiceCategory.FINANCIAL_LEGAL,
    description: 'Draft legally binding loan agreements with clear terms for interest, repayment schedule, and security.',
    price: 99,
  },
  {
    id: 'ca-certificate',
    name: 'CA Certificate Assistance',
    category: ServiceCategory.FINANCIAL_LEGAL,
    description: 'Assistance in obtaining CA certificates for net worth, income, turnover, and other financial certifications.',
    price: 99,
  },
  {
    id: 'dsa-verification',
    name: 'DSA Verification',
    category: ServiceCategory.FINANCIAL_LEGAL,
    description: 'Verify Direct Selling Agent credentials and authenticity before engaging in financial transactions.',
    price: 99,
  },
  {
    id: 'debt-recovery',
    name: 'Debt Recovery Notice',
    category: ServiceCategory.FINANCIAL_LEGAL,
    description: 'Legal notices and assistance for debt recovery including cheque bounce cases and loan defaults.',
    price: 99,
  },
  {
    id: 'guarantee-deed',
    name: 'Guarantee Deed Drafting',
    category: ServiceCategory.FINANCIAL_LEGAL,
    description: 'Draft personal and corporate guarantee deeds for loans and financial transactions.',
    price: 99,
  },
  {
    id: 'rbi-banking-complaint',
    name: 'RBI / Banking Complaint',
    category: ServiceCategory.FINANCIAL_LEGAL,
    description: 'File complaints with RBI Banking Ombudsman for unresolved banking disputes and grievances.',
    price: 99,
  },

  // GOVT_COMPLIANCE (5 services)
  {
    id: 'court-case-filing',
    name: 'Court Case Filing Assistance',
    category: ServiceCategory.GOVT_COMPLIANCE,
    description: 'Assistance in filing court cases including documentation, petition drafting, and procedural guidance.',
    price: 99,
  },
  {
    id: 'rti-application',
    name: 'RTI Application Drafting',
    category: ServiceCategory.GOVT_COMPLIANCE,
    description: 'Draft and file RTI applications to obtain information from government departments and public authorities.',
    price: 99,
  },
  {
    id: 'license-documentation',
    name: 'License Documentation',
    category: ServiceCategory.GOVT_COMPLIANCE,
    description: 'Documentation assistance for various licenses including trade license, FSSAI, and shop act registration.',
    price: 99,
  },
  {
    id: 'e-notary-service',
    name: 'E-Notary Service',
    category: ServiceCategory.GOVT_COMPLIANCE,
    description: 'Online notarization services for documents requiring notary attestation with digital convenience.',
    price: 99,
  },
  {
    id: 'stamp-paper-service',
    name: 'Stamp Paper Procurement',
    category: ServiceCategory.GOVT_COMPLIANCE,
    description: 'Procure stamp papers of required denomination for legal documents and agreements.',
    price: 99,
  },

  // SPECIALIZED_LEGAL (5 services)
  {
    id: 'mediation-service',
    name: 'Mediation Service',
    category: ServiceCategory.SPECIALIZED_LEGAL,
    description: 'Professional mediation services for dispute resolution without court intervention. Save time and costs.',
    price: 99,
  },
  {
    id: 'corporate-legal-audit',
    name: 'Corporate Legal Audit',
    category: ServiceCategory.SPECIALIZED_LEGAL,
    description: 'Comprehensive legal audit of your business to identify compliance gaps and legal risks.',
    price: 99,
  },
  {
    id: 'compliance-advisory',
    name: 'Compliance Advisory',
    category: ServiceCategory.SPECIALIZED_LEGAL,
    description: 'Expert advisory on regulatory compliance including labor laws, tax compliance, and industry-specific regulations.',
    price: 99,
  },
  {
    id: 'cyber-law-advisory',
    name: 'Cyber Law Advisory',
    category: ServiceCategory.SPECIALIZED_LEGAL,
    description: 'Legal advisory on IT Act compliance, data protection, privacy policies, and cyber security matters.',
    price: 99,
  },
  {
    id: 'digital-signature',
    name: 'Digital Signature Certificate',
    category: ServiceCategory.SPECIALIZED_LEGAL,
    description: 'Obtain Class 2 or Class 3 Digital Signature Certificates for e-filing and online transactions.',
    price: 99,
  },
];

async function main() {
  //console.log('🌱 Starting database seed...');

  // Seed test users
  //console.log('\n👥 Seeding test users...');
  for (const userData of testUsers) {
    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      //console.log(`  ⏭️  ${userData.email} (already exists)`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        role: userData.role,
        emailVerified: userData.emailVerified,
      },
    });

    // Create DSA Profile if DSA role
    if (userData.role === Role.DSA && userData.dsaProfile) {
      await prisma.dsaProfile.create({
        data: {
          userId: user.id,
          ...userData.dsaProfile,
        },
      });
    }

    // Create Employee Profile if Employee role
    if (userData.role === Role.EMPLOYEE && userData.employeeProfile) {
      await prisma.employeeProfile.create({
        data: {
          userId: user.id,
          ...userData.employeeProfile,
        },
      });
    }

    //console.log(`  ✓ ${userData.email} (${userData.role})`);
  }

  // Upsert all services (create if not exists, update if exists)
  //console.log('\n📦 Seeding services...');
  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {
        name: service.name,
        category: service.category,
        description: service.description,
        price: service.price,
        isActive: true,
      },
      create: {
        id: service.id,
        name: service.name,
        category: service.category,
        description: service.description,
        price: service.price,
        isActive: true,
      },
    });
    //console.log(`  ✓ ${service.name}`);
  }

  //console.log(`\n✅ Seeded ${services.length} services successfully!`);
  
  //console.log('\n📋 Test Login Credentials:');
  //console.log('═══════════════════════════════════════════════');
  //console.log('🔹 USER accounts:');
  //console.log('   Email: user@test.com    | Password: Test@123');
  //console.log('   Email: user2@test.com   | Password: Test@123');
  //console.log('');
  //console.log('🔹 DSA accounts:');
  //console.log('   Email: dsa@test.com     | Password: Test@123');
  //console.log('   Email: dsa2@test.com    | Password: Test@123');
  //console.log('');
  //console.log('🔹 EMPLOYEE accounts:');
  //console.log('   Email: employee@test.com  | Password: Test@123');
  //console.log('   Email: employee2@test.com | Password: Test@123');
  //console.log('═══════════════════════════════════════════════');
}

main()
  .catch((e) => {
    //console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
