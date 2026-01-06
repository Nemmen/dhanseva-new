import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Function to test database connection
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ [DATABASE] Connected successfully to Supabase');
    console.log(`🔗 [DATABASE] Using connection pooler: ${process.env.DATABASE_URL?.includes('pooler') ? 'YES' : 'NO'}`);
  } catch (error: any) {
    console.error('❌ [DATABASE] Connection failed:', error.message);
    throw error;
  }
}
