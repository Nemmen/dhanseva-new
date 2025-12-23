import app from './app';
import { config } from './config';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';

// Initialize connections
const initializeServer = async () => {
  try {
    // Connect to Database
    await connectDatabase();

    // Connect to Redis
    await connectRedis();
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    throw error;
  }
};

const startServer = async () => {
  try {
    await initializeServer();

    // Start Express Server
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
};

// Initialize for serverless
initializeServer().then(() => {
  // Export the app for Vercel serverless functions
  export default app;
}).catch((error) => {
  console.error('Failed to initialize:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

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

// Start server only when run directly (not in serverless)
if (require.main === module) {
  startServer();
}
