# 🚀 DhanSeva Frontend - Setup & Installation Guide

## 📋 Prerequisites

Before starting, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:5000`
- Git (optional, for version control)

## 🛠️ Installation Steps

### Step 1: Navigate to Frontend Directory

```bash
cd c:\Users\amank\OneDrive\Desktop\dhanseva-new\Finance-web-master
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:

- Next.js 14+
- React 18+
- TailwindCSS
- Axios
- React Hook Form
- Zod
- TanStack Query
- Sonner (toast notifications)
- React Icons
- Framer Motion

### Step 3: Verify Environment Variables

Check `.env.local` file (already configured):

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Rr5VUBDcqjo2dh

# UploadThing Configuration
NEXT_PUBLIC_UPLOADTHING_URL=https://uploadthing.com

# App Configuration
NEXT_PUBLIC_APP_NAME=DhanSeva
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENV=development
```

### Step 4: Install shadcn/ui Components (Required)

First, initialize shadcn/ui:

```bash
npx shadcn-ui@latest init
```

When prompted, choose:

- Style: Default
- Base color: Slate
- CSS variables: Yes

Then install required components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
```

### Step 5: Install TailwindCSS Animate Plugin

```bash
npm install tailwindcss-animate
```

### Step 6: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## 📁 Project Structure (Created)

```
Finance-web-master/
├── app/
│   ├── layout.tsx          ✅ Root layout with providers
│   ├── page.tsx            ✅ Homepage
│   ├── globals.css         ✅ Global styles
│   └── ... (to be created)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx      ✅ Navigation header
│   │   ├── Footer.tsx      ✅ Footer component
│   │   └── MainLayout.tsx  ✅ Main layout wrapper
│   ├── providers/
│   │   └── QueryProvider.tsx ✅ React Query provider
│   ├── services/
│   │   └── ServiceCard.tsx  ✅ Service card component
│   └── ui/ (shadcn components)
│
├── context/
│   └── AuthContext.tsx     ✅ Auth state management
│
├── hooks/
│   ├── useAuthGuard.ts     ✅ Route protection hooks
│   ├── useServices.ts      ✅ Services data hooks
│   ├── useRequests.ts      ✅ Requests data hooks
│   └── usePayment.ts       ✅ Payment hooks
│
├── lib/
│   ├── api.ts              ✅ Axios client
│   └── utils.ts            ✅ Utility functions
│
├── schemas/
│   ├── authSchemas.ts      ✅ Auth validation
│   └── serviceSchemas.ts   ✅ Service form validation
│
├── services/
│   ├── authService.ts      ✅ Auth API calls
│   ├── otpService.ts       ✅ OTP API calls
│   ├── serviceService.ts   ✅ Services API calls
│   ├── requestService.ts   ✅ Requests API calls
│   └── paymentService.ts   ✅ Payment API calls
│
├── types/
│   ├── auth.types.ts       ✅ Auth types
│   ├── service.types.ts    ✅ Service types
│   ├── request.types.ts    ✅ Request types
│   └── payment.types.ts    ✅ Payment types
│
├── middleware.ts           ✅ Route protection
├── next.config.mjs         ✅ Next.js config
├── tailwind.config.ts      ✅ Tailwind config
├── tsconfig.json           ✅ TypeScript config
└── package.json            ✅ Dependencies
```

## ✅ What's Implemented

### Phase 1: Foundation (COMPLETE)

- ✅ Project setup and configuration
- ✅ Global layout with Header and Footer
- ✅ Middleware for route protection
- ✅ API client with Axios
- ✅ Auth Context for state management
- ✅ Type definitions for all entities
- ✅ Validation schemas with Zod
- ✅ Service layer for API calls
- ✅ Custom hooks for data fetching
- ✅ Homepage with hero section
- ✅ Service cards display
- ✅ Responsive design

## 🔨 Next Steps to Complete

### Phase 2: Authentication Pages

Create these files:

1. **Login Page**: `app/(auth)/login/page.tsx`
2. **Register Page**: `app/(auth)/register/page.tsx`
3. **OTP Verification**: `app/(auth)/verify-email/page.tsx`
4. **Auth Components**:
   - `components/auth/LoginForm.tsx`
   - `components/auth/RegisterForm.tsx`
   - `components/auth/OTPInput.tsx`

### Phase 3: Services Pages

Create these files:

1. **Services List**: `app/services/page.tsx`
2. **Service Detail**: `app/services/[serviceId]/page.tsx`
3. **Components**:
   - `components/services/ServiceGrid.tsx`
   - `components/services/ServiceDetails.tsx`
   - `components/services/CategoryFilter.tsx`

### Phase 4: Application Form

Create these files:

1. **Application Form**: `app/apply/[serviceId]/page.tsx`
2. **Form Components**:
   - `components/forms/ServiceApplicationForm.tsx`
   - `components/forms/PersonalDetailsSection.tsx`
   - `components/forms/DocumentUploadSection.tsx`
   - `components/forms/AddressSection.tsx`

### Phase 5: Payment

Create these files:

1. **Payment Page**: `app/payment/[requestId]/page.tsx`
2. **Components**:
   - `components/payment/PaymentButton.tsx`
   - `components/payment/RazorpayCheckout.tsx`

### Phase 6: User Pages

Create these files:

1. **My Requests**: `app/my-requests/page.tsx`
2. **Request Detail**: `app/my-requests/[requestId]/page.tsx`
3. **Profile**: `app/profile/page.tsx`
4. **Components**:
   - `components/requests/RequestCard.tsx`
   - `components/requests/RequestList.tsx`
   - `components/requests/StatusBadge.tsx`

### Phase 7: Static Pages

Create these files:

1. **About**: `app/about/page.tsx`
2. **Contact**: `app/contact/page.tsx`
3. **Terms**: `app/terms/page.tsx`
4. **Privacy**: `app/privacy/page.tsx`
5. **Refund**: `app/refund/page.tsx`

## 🧪 Testing the Setup

### 1. Start Backend

```bash
cd c:\Users\amank\OneDrive\Desktop\dhanseva-new\backend
npm run dev
```

Backend should run on `http://localhost:5000`

### 2. Start Frontend

```bash
cd c:\Users\amank\OneDrive\Desktop\dhanseva-new\Finance-web-master
npm run dev
```

Frontend should run on `http://localhost:3000`

### 3. Test Homepage

Visit `http://localhost:3000` and verify:

- Header displays correctly
- Hero section loads
- Services are fetched from API
- Footer displays correctly
- Mobile responsive menu works

### 4. Test API Connection

Open browser //console and check:

- No CORS errors
- API calls to `http://localhost:5000/api/services` succeed
- Data is displayed correctly

## 🐛 Troubleshooting

### Issue: CORS Error

**Solution**: Ensure backend CORS is configured:

```typescript
// backend/src/app.ts
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

### Issue: Module Not Found

**Solution**: Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind Styles Not Working

**Solution**: Ensure `globals.css` is imported in `layout.tsx`:

```typescript
import "./globals.css";
```

### Issue: Port 3000 Already in Use

**Solution**: Use different port:

```bash
npm run dev -- -p 3001
```

## 📚 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type check
npm run type-check
```

## 🎨 UI/UX Guidelines

### Colors (Based on Reference Design)

- Primary Blue: `#2563EB`
- Primary Dark: `#1D4ED8`
- Success Green: `#10B981`
- Warning Yellow: `#F59E0B`
- Error Red: `#EF4444`

### Typography

- Headings: Inter font, bold
- Body: Inter font, regular
- Mobile: Base 16px
- Desktop: Base 16px

### Components

- Use shadcn/ui components for consistency
- Follow TailwindCSS utility-first approach
- Ensure mobile-first responsive design
- Use Framer Motion for animations

## 🔐 Security Checklist

- ✅ Session-based auth (httpOnly cookies)
- ✅ No token storage in localStorage
- ✅ CSRF protection via cookies
- ✅ Input validation with Zod
- ✅ API error handling
- ✅ Route protection with middleware
- ⏳ Rate limiting (backend)
- ⏳ File upload validation

## 📝 Next Development Phase

**Priority**: Implement authentication flow (Phase 2)

1. Create login page with form validation
2. Create register page with role selection
3. Create OTP verification page
4. Test complete auth flow:
   - Register → OTP → Login → Redirect
5. Verify session persistence
6. Test logout functionality

After auth is complete, move to Phase 3 (Services Pages).

## 🆘 Support

If you encounter issues:

1. Check backend is running: `http://localhost:5000/api/services`
2. Verify environment variables
3. Clear browser cache
4. Check browser //console for errors
5. Verify all dependencies installed

## 📖 Documentation References

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [Razorpay Docs](https://razorpay.com/docs/payments/payments/web-integration/)

---

**Status**: ✅ Foundation Complete | 🔶 Ready for Phase 2
**Last Updated**: December 22, 2025
