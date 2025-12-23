import app from './app';
import { config } from './config';
// import { prisma } from './config/database';
import { connectRedis } from './config/redis';

// Only start the server if NOT running on Vercel and executed directly
if (require.main === module && process.env.VERCEL !== '1') {
  (async () => {
    try {
      // Prisma connection is handled automatically by singleton
      await connectRedis();
      app.listen(config.port, () => {
        console.log(`\n🚀 Server running on port ${config.port}`);
        console.log(`📝 Environment: ${config.nodeEnv}`);
        console.log(`🔗 Health check: http://localhost:${config.port}/health`);
        console.log(`🔗 API: http://localhost:${config.port}/api\n`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  })();
}

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

