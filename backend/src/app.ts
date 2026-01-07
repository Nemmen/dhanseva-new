import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { config } from './config';
import { generalLimiter } from './middleware/rateLimiter';
import { requestLogger, requestId, securityHeaders } from './middleware/apiMiddleware';

const app: Application = express();

// Trust proxy - Required for Render deployment
// This allows Express to trust the X-Forwarded-For header
app.set('trust proxy', 1);

// Request tracking
app.use(requestId);

// Request logging (in development)
if (config.nodeEnv === 'development') {
  app.use(requestLogger);
}

// Security Middleware
app.use(helmet());
app.use(securityHeaders);
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        config.corsOrigin,
        'http://localhost:3000',
        'http://localhost:3001',
      ];
      
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })
);

// Compression Middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (0-9)
}));

// Rate Limiting
app.use('/api/', generalLimiter);

// Body Parsing Middleware (with size limits)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Session Middleware
app.use(
  session({
    secret: config.session.secret,
    name: config.session.name,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      maxAge: config.session.maxAge,
      sameSite: 'lax',
    },
  })
);

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
import authRoutes from './modules/auth/auth.routes';
import otpRoutes from './modules/otp/otp.routes';
import servicesRoutes from './modules/services/services.routes';
import requestsRoutes from './modules/requests/requests.routes';
import paymentRoutes from './modules/payment/payment.routes';
import dsaRoutes from './modules/dsa/dsa.routes';
import employeeRoutes from './modules/employee/employee.routes';
import uploadRoutes from './modules/upload/upload.routes';

app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'Dhanseva Legal Services API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      otp: '/api/otp',
      services: '/api/services',
      requests: '/api/requests',
      payments: '/api/payments',
      dsa: '/api/dsa',
      employee: '/api/employee',
      upload: '/api/upload',
    },
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.isOperational 
    ? err.message 
    : (config.nodeEnv === 'development' ? err.message : 'Internal server error');
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(err.data && { data: err.data }),
  });
});

export default app;
