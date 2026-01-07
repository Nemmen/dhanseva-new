import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const employees = [
  { email: 'neetude@neetude.com', fullName: 'Payal Kumari', password: 'Payal' },
  { email: 'ojhariya01@ojhariya01.com', fullName: 'Riya ojha', password: '1208' },
  { email: 'soniisingh@soniisingh.com', fullName: 'Soni', password: '9598' },
  { email: 'Neetudev@Neetudev.com', fullName: 'Payal Mukku503', password: 'Payal' },
  { email: 'neetudev@neetudev.com', fullName: 'Payal Naya503', password: 'Payal' },
];

async function createEmployees() {
  console.log('🚀 Starting bulk employee creation...\n');

  for (const emp of employees) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: emp.email },
      });

      if (existingUser) {
        console.log(`⚠️  User already exists: ${emp.email}`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(emp.password, 10);

      // Create user and employee profile
      await prisma.user.create({
        data: {
          email: emp.email,
          passwordHash,
          role: 'EMPLOYEE',
          emailVerified: true,
          employeeProfile: {
            create: {
              fullName: emp.fullName,
            },
          },
        },
      });

      console.log(`✅ Created employee: ${emp.email} (${emp.fullName})`);
    } catch (error: any) {
      console.error(`❌ Failed to create ${emp.email}:`, error.message);
    }
  }

  console.log('\n✨ Bulk employee creation completed!');
  await prisma.$disconnect();
}

createEmployees().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
