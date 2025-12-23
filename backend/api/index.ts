import app from '../src/app';
import { connectDatabase } from '../src/config/database';
import { connectRedis } from '../src/config/redis';

// Initialize connections for serverless
connectDatabase().catch(console.error);
connectRedis().catch(console.error);

export default app;