# Dhanseva Legal Services Platform - Backend

## Phase 0 - Database Foundation ✅

Complete backend foundation with production-ready API design principles:

- PostgreSQL + Prisma ORM
- Redis (OTP, sessions)
- Razorpay (payments)
- UploadThing (documents)
- Nodemailer (email)
- Session-based auth
- **Rate limiting** (protection against abuse)
- **Compression** (60-80% bandwidth reduction)
- **Pagination** (standardized list responses)
- **Request tracking** (debugging and monitoring)
- **Caching** (improved performance)
- **Security headers** (OWASP best practices)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file with your credentials (already provided).

### 3. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Run Tests

```bash
npm test
```

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   ├── config/             # Configuration files
│   │   ├── index.ts        # Main config
│   │   ├── database.ts     # Prisma client
│   │   ├── redis.ts        # Redis client
│   │   ├── razorpay.ts     # Razorpay instance
│   │   └── email.ts        # Nodemailer transporter
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts         # Authentication & authorization
│   │   ├── validate.ts     # Zod validation
│   │   ├── errorHandler.ts # Error handling
│   │   └── rateLimiter.ts  # Rate limiting
│   ├── utils/              # Utility functions
│   │   ├── auth.ts         # Auth utilities
│   │   ├── generators.ts   # ID/OTP generators
│   │   ├── response.ts     # Response helpers
│   │   └── schemas.ts      # Zod schemas
│   ├── modules/            # Feature modules (to be added)
│   └── tests/              # Test setup
├── prisma/
│   └── schema.prisma       # Database schema
├── package.json
├── tsconfig.json
└── jest.config.js
```

## API Design Principles

✅ **Rate Limiting**: Multiple tiers (general, auth, OTP, payment, upload)  
✅ **Compression**: Gzip compression for 60-80% bandwidth savings  
✅ **Pagination**: Standardized with metadata (page, limit, total, hasNext/Previous)  
✅ **Request Size Limits**: 5MB max for JSON/URL-encoded  
✅ **Request Tracking**: Unique IDs for all requests  
✅ **Logging**: Comprehensive request/response logging  
✅ **Caching**: HTTP cache control for static data  
✅ **Security Headers**: Helmet + custom security headers  
✅ **CORS**: Properly configured with credentials support  
✅ **Error Handling**: Consistent error response format

See [API_DESIGN_PRINCIPLES.md](API_DESIGN_PRINCIPLES.md) for detailed documentation.

## Database Models

- User (USER, DSA, EMPLOYEE roles)
- DsaProfile
- EmployeeProfile
- Service
- ServiceRequest
- Payment
- OTP
- DsaInvite
- AuditLog

## Next Steps

Ready to implement Phase 1 - Authentication Module:

- POST /auth/register
- POST /auth/login
- POST /auth/logout

## API Endpoints

- `GET /health` - Health check
- `GET /api` - API info

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
