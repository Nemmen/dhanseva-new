const app = require('../dist/app.js');
const { connectDatabase } = require('../dist/config/database.js');
const { connectRedis } = require('../dist/config/redis.js');

// Initialize connections for serverless
connectDatabase().catch(console.error);
connectRedis().catch(console.error);

module.exports = app.default || app;