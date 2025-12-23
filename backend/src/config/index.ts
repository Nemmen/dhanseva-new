import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),

  // Database
  databaseUrl: process.env.DATABASE_URL!,

  // Redis
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || '16585', 10),
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_PASSWORD!,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET!,
    name: 'dhanseva.sid',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID!,
    keySecret: process.env.RAZORPAY_KEY_SECRET!,
  },

  // UploadThing
  uploadthing: {
    token: process.env.UPLOADTHING_TOKEN!,
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER!,
    password: process.env.EMAIL_PASSWORD!,
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'https://dhanseva-web.vercel.app',

  // Service Pricing
  pricing: {
    servicePrice: 9900, // ₹99 in paise
    dsaRegistrationPrice: 29900, // ₹299 in paise
  },

  // OTP
  otp: {
    expiryMinutes: 5,
    maxResendAttempts: 3,
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_HOST',
  'REDIS_PASSWORD',
  'JWT_SECRET',
  'SESSION_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'UPLOADTHING_TOKEN',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
