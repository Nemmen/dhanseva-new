import '@jest/globals';
import { prisma } from '../config/database';
import { redisClient } from '../config/redis';

// Setup before all tests
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
  
  // Connect to Redis if not already connected
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
});

// Cleanup after each test
afterEach(async () => {
  // Clear all tables in reverse order to handle foreign keys
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
      } catch (error) {
        //console.log(`Error truncating ${tablename}:`, error);
      }
    }
  }

  // Clear Redis
  await redisClient.flushDb();
});

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect();
  await redisClient.quit();
});
