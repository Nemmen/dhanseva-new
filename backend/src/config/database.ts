import { PrismaClient } from '@prisma/client';

// Lazy, singleton PrismaClient for serverless safety
let prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    const globalAny = globalThis as any;
    if (!globalAny._prisma) {
      globalAny._prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    prisma = globalAny._prisma as PrismaClient;
  }
  // prisma is always set here
  return prisma!;
}

export async function connectDatabase() {
  // Only connect if not already connected
  const client = getPrisma();
  try {
    await client.$connect();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  const client = getPrisma();
  await client.$disconnect();
}

export { prisma };
