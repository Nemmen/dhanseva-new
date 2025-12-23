# 🎯 DhanSeva Legal Services Platform - Complete Frontend Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Folder Structure](#architecture)
4. [Phase-wise Implementation](#phases)
5. [Module Documentation](#modules)
6. [API Integration](#api-integration)
7. [Security & Best Practices](#security)

---

## 🎯 Project Overview

### Platform Description

DhanSeva is a legal services platform connecting users with legal service providers through a streamlined digital interface. The platform facilitates:

- Service discovery and application
- Document management and uploads
- Payment processing
- Request tracking and status updates
- Multi-role access (User, DSA, Employee)

### User Types

1. **Regular User** - Applies for services, tracks requests, makes payments
2. **DSA (Digital Service Associate)** - Fills forms for users, manages assigned requests
3. **Employee** - Manages all requests, assigns DSAs, performs admin tasks

### Core User Flow

```
Guest/User → Browse Services → Select Service → Login/Register → OTP Verification
→ Fill Form → Upload Documents → Submit → Payment (₹99) → Track Request
```

---

## 🧱 Tech Stack (Production-Ready)

### Frontend Core

- **Next.js 14.2+** - App Router (Server Components + Client Components)
- **TypeScript 5.3+** - Type safety across entire application
- **React 18+** - Latest React features

### Styling & UI

- **TailwindCSS 3.4+** - Utility-first CSS framework
- **shadcn/ui** - Accessible, customizable component library
- **React Icons** - Icon library (as per reference design)
- **Framer Motion** - Animations and transitions

### Form & Validation

- **React Hook Form 7.5+** - Performant form management
- **Zod 3.22+** - TypeScript-first schema validation
- **Server-side validation** - Duplicate validation on backend

### State Management

- **React Context** - Auth state
- **TanStack Query (React Query)** - Server state, caching
- **Zustand** (optional) - Client state if needed

### API & Data Fetching

- **Axios 1.6+** - HTTP client with interceptors
- **credentials: 'include'** - Session cookie handling
- **SWR/React Query** - Data fetching, caching, revalidation

### File Uploads

- **UploadThing Client** - File upload to CDN
- **Client-side validation** - File type, size checks
- **Progress tracking** - Upload progress UI

### Payment Integration

- **Razorpay JS SDK** - Payment gateway integration
- **Razorpay Checkout** - Hosted payment UI
- **Webhook verification** - Backend payment verification

### Authentication

- **Session-based auth** - httpOnly cookies
- **OTP verification** - Email OTP via Nodemailer
- **Role-based access** - Middleware protection

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Husky** - Git hooks (optional)

---

## 📁 Architecture & Folder Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Homepage
│   ├── error.tsx                # Global error boundary
│   ├── loading.tsx              # Global loading state
│   │
│   ├── (auth)/                  # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── verify-email/
│   │       └── page.tsx
│   │
│   ├── (main)/                  # Main public pages
│   │   ├── about/
│   │   ├── contact/
│   │   ├── terms/
│   │   ├── privacy/
│   │   └── refund/
│   │
│   ├── services/                # Service discovery
│   │   ├── page.tsx            # All services list
│   │   └── [serviceId]/
│   │       └── page.tsx        # Service details
│   │
│   ├── apply/                   # Service application
│   │   └── [serviceId]/
│   │       └── page.tsx        # Application form
│   │
│   ├── payment/                 # Payment processing
│   │   └── [requestId]/
│   │       ├── page.tsx        # Payment page
│   │       └── success/
│   │           └── page.tsx    # Payment success
│   │
│   ├── (user)/                  # User protected routes
│   │   ├── my-requests/
│   │   │   ├── page.tsx        # All requests
│   │   │   └── [requestId]/
│   │   │       └── page.tsx    # Request details
│   │   └── profile/
│   │       └── page.tsx        # User profile
│   │
│   ├── (dsa)/                   # DSA protected routes
│   │   └── dsa/
│   │       ├── register/
│   │       ├── requests/
│   │       └── requests/[id]/
│   │
│   └── (employee)/              # Employee protected routes
│       └── employee/
│           ├── requests/
│           ├── dsas/
│           └── invite-dsa/
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── auth/                    # Auth components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── OTPInput.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── services/                # Service components
│   │   ├── ServiceCard.tsx
│   │   ├── ServiceGrid.tsx
│   │   ├── ServiceDetails.tsx
│   │   └── CategoryFilter.tsx
│   │
│   ├── forms/                   # Form components
│   │   ├── ServiceApplicationForm.tsx
│   │   ├── PersonalDetailsSection.tsx
│   │   ├── ContactDetailsSection.tsx
│   │   ├── DocumentUploadSection.tsx
│   │   └── AddressSection.tsx
│   │
│   ├── payment/                 # Payment components
│   │   ├── PaymentButton.tsx
│   │   ├── PaymentStatus.tsx
│   │   └── RazorpayCheckout.tsx
│   │
│   ├── requests/                # Request components
│   │   ├── RequestCard.tsx
│   │   ├── RequestList.tsx
│   │   ├── RequestDetails.tsx
│   │   └── StatusBadge.tsx
│   │
│   └── shared/                  # Shared components
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       ├── SuccessMessage.tsx
│       ├── ConfirmDialog.tsx
│       └── Toast.tsx
│
├── lib/                         # Core utilities
│   ├── api.ts                  # Axios client configuration
│   ├── auth.ts                 # Auth utilities
│   ├── razorpay.ts             # Razorpay integration
│   ├── uploadthing.ts          # UploadThing configuration
│   ├── utils.ts                # General utilities
│   └── cn.ts                   # Class name utility
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useUser.ts              # User data hook
│   ├── useServices.ts          # Services data hook
│   ├── useRequests.ts          # Requests data hook
│   ├── usePayment.ts           # Payment hook
│   ├── useUpload.ts            # File upload hook
│   └── useToast.ts             # Toast notification hook
│
├── services/                    # API service layer
│   ├── authService.ts          # Auth API calls
│   ├── otpService.ts           # OTP API calls
│   ├── serviceService.ts       # Services API calls
│   ├── requestService.ts       # Requests API calls
│   ├── paymentService.ts       # Payment API calls
│   ├── dsaService.ts           # DSA API calls
│   └── employeeService.ts      # Employee API calls
│
├── schemas/                     # Zod validation schemas
│   ├── authSchemas.ts          # Auth validation
│   ├── serviceSchemas.ts       # Service form validation
│   ├── requestSchemas.ts       # Request validation
│   └── profileSchemas.ts       # Profile validation
│
├── types/                       # TypeScript types
│   ├── auth.types.ts           # Auth types
│   ├── service.types.ts        # Service types
│   ├── request.types.ts        # Request types
│   ├── payment.types.ts        # Payment types
│   ├── user.types.ts           # User types
│   └── api.types.ts            # API response types
│
├── context/                     # React Context providers
│   ├── AuthContext.tsx         # Auth state management
│   └── ToastContext.tsx        # Toast notifications
│
├── middleware.ts                # Route protection middleware
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

## 🔄 Phase-wise Implementation

### Phase 1: Foundation & Public Pages (Week 1)

**Status**: ✅ Ready to implement

#### 1.1 Project Setup

- Initialize Next.js 14+ with App Router
- Install and configure dependencies
- Setup TailwindCSS and shadcn/ui
- Configure TypeScript

#### 1.2 Global Configuration

- Root layout with providers
- Middleware for route protection
- Axios client with interceptors
- Error boundary setup

#### 1.3 Public Pages

- Homepage with hero section
- Services grid display
- About page
- Terms & Conditions
- Privacy Policy
- Refund Policy
- Contact page

#### 1.4 Layout Components

- Header with navigation
- Footer with links
- Responsive mobile menu

**Deliverables**:

- ✅ Responsive homepage
- ✅ All static pages
- ✅ Global navigation
- ✅ API client configured

---

### Phase 2: Authentication & OTP (Week 1-2)

**Status**: 🔶 Implementation phase

#### 2.1 Authentication Pages

- Login page with form validation
- Register page with role selection
- OTP verification page
- Password reset flow (future)

#### 2.2 Auth Components

- Login form component
- Register form component
- OTP input component (6 digits)
- Auth error handling

#### 2.3 Auth State Management

- AuthContext for global state
- useAuth custom hook
- Session persistence
- Auto-redirect logic

#### 2.4 API Integration

```typescript
// Auth Service APIs
POST / api / auth / register;
POST / api / auth / login;
POST / api / auth / logout;
GET / api / auth / me;
POST / api / otp / send;
POST / api / otp / verify;
```

#### 2.5 User Flow

```
1. User clicks "Login" or "Register"
2. Fills form → validates with Zod
3. Submits → API call with credentials: 'include'
4. Backend sends OTP via email
5. User enters OTP
6. Verification → Session created
7. Redirect to intended page or homepage
```

**Deliverables**:

- ✅ Login/Register pages
- ✅ OTP verification
- ✅ Session management
- ✅ Protected routes

---

### Phase 3: Service Discovery & Details (Week 2)

**Status**: 🔶 Implementation phase

#### 3.1 Service Listing Page

- Fetch all services from API
- Display in grid layout
- Category filters
- Search functionality
- Pagination

#### 3.2 Service Detail Page

- Individual service details
- Service description
- Required documents list
- Pricing (₹99)
- "Apply Now" CTA

#### 3.3 Components

- ServiceCard component
- ServiceGrid component
- CategoryFilter component
- ServiceDetails component

#### 3.4 API Integration

```typescript
GET /api/services?page=1&limit=10&category=PERSONAL_LEGAL
GET /api/services/:serviceId
```

#### 3.5 UX Rules

- If user clicks "Apply" and NOT logged in:
  - Redirect to `/login?redirect=/apply/[serviceId]`
- If user IS logged in:
  - Redirect to `/apply/[serviceId]`

**Deliverables**:

- ✅ Service listing page
- ✅ Service detail pages
- ✅ Category filtering
- ✅ Auth-aware CTAs

---

### Phase 4: Service Application Form (Week 2-3)

**Status**: 🔶 Core UX implementation

#### 4.1 Form Structure (Single Page)

**Section 1: Personal Details**

- First Name \*
- Last Name \*
- Email \* (pre-filled from auth)
- Phone \* (10 digits)
- WhatsApp Number (optional)

**Section 2: Employment Details**

- Employment Status \* (dropdown)
- Company/Business Name (optional)
- Monthly Income (optional)

**Section 3: Bank Details**

- Bank Name \*
- Account Holder Name \*
- Account Number (optional for some services)

**Section 4: Address**

- Address Line \*
- State \* (dropdown)
- City \*
- Pincode \* (6 digits)

**Section 5: Document Uploads**

- Aadhaar Front \* (PDF/JPG, max 10MB)
- Aadhaar Back \* (PDF/JPG, max 10MB)
- PAN Card Front \* (PDF/JPG, max 10MB)
- PAN Card Back (optional)

**Section 6: Service-Specific Fields**

- Dynamic fields based on service category
- Personal Legal: Purpose description
- Business Legal: Business type, partners
- Financial Legal: Loan amount, loan type

#### 4.2 Form Implementation

```typescript
// React Hook Form + Zod validation
const form = useForm({
  resolver: zodResolver(serviceApplicationSchema),
  defaultValues: {
    firstName: user?.firstName || "",
    email: user?.email || "",
    // ...
  },
});

// Submit handler
const onSubmit = async (data) => {
  // 1. Upload documents to UploadThing
  // 2. Create request with UNPAID status
  // 3. Redirect to payment page
};
```

#### 4.3 File Upload Flow

```typescript
// Using UploadThing
1. User selects file
2. Client validates (type, size)
3. Upload to UploadThing CDN
4. Get URL
5. Store URL in form state
6. Display preview with remove option
```

#### 4.4 API Integration

```typescript
POST /api/requests
{
  serviceId: "uuid",
  formData: {
    base: { ...personalDetails, ...contact, ...address },
    extension: { ...serviceSpecificFields }
  }
}

// Response
{
  success: true,
  data: {
    id: "request-uuid",
    status: "UNPAID", // Hidden from user
    paid: false
  }
}
```

#### 4.5 Form Validation

- Client-side: Zod schemas
- Server-side: Backend validation
- Real-time field validation
- Error messages below fields
- Disable submit until valid

#### 4.6 UX Considerations

⚠️ **Critical**: User must NOT see "UNPAID" status

- Submit button says "Proceed to Payment"
- Loading state during submission
- Smooth redirect to payment page
- No status shown on form page

**Deliverables**:

- ✅ Multi-section form
- ✅ File upload with UploadThing
- ✅ Real-time validation
- ✅ Request creation
- ✅ Smooth payment redirect

---

### Phase 5: Payment Integration (Week 3)

**Status**: 🔶 Critical implementation

#### 5.1 Payment Page

- Request summary
- Service name and description
- Amount breakdown: ₹99
- Razorpay payment button

#### 5.2 Razorpay Integration Flow

```typescript
// Step 1: Create Razorpay order
POST /api/payments/create-order
{
  requestId: "request-uuid",
  amount: 99
}

// Response
{
  orderId: "order_xyz",
  amount: 9900, // in paise
  currency: "INR",
  keyId: "rzp_test_xxx"
}

// Step 2: Open Razorpay Checkout
const options = {
  key: data.keyId,
  amount: data.amount,
  currency: 'INR',
  name: 'DhanSeva',
  description: service.name,
  order_id: data.orderId,
  handler: function(response) {
    // Step 3: Verify payment
    verifyPayment(response);
  },
  prefill: {
    email: user.email,
    contact: user.phone
  },
  theme: {
    color: '#3B82F6' // Brand blue
  }
};

const rzp = new Razorpay(options);
rzp.open();

// Step 3: Verify payment signature
POST /api/payments/verify
{
  razorpay_order_id: "order_xyz",
  razorpay_payment_id: "pay_abc",
  razorpay_signature: "signature_hash"
}

// Step 4: Redirect to success page
→ /my-requests?payment=success
```

#### 5.3 Payment States

- **Pending**: Show payment button
- **Processing**: Loading state
- **Success**: Redirect to requests
- **Failed**: Show retry button
- **Already Paid**: Show success message

#### 5.4 Error Handling

```typescript
// Payment failures
- Card declined → Show error, allow retry
- Network error → Show error, allow retry
- Signature mismatch → Contact support
- Already paid → Redirect to requests
```

#### 5.5 Security

- Backend signature verification (HMAC-SHA256)
- Idempotency (same order_id = same result)
- No client-side payment confirmation
- Server validates before marking as paid

**Deliverables**:

- ✅ Payment page with Razorpay
- ✅ Payment verification
- ✅ Success/failure handling
- ✅ Retry mechanism

---

### Phase 6: User Request Management (Week 3-4)

**Status**: 🔶 User dashboard alternative

#### 6.1 My Requests Page

- List all user's requests
- Filter by status (All, Unpaid, Paid, In Progress, Completed)
- Filter by service
- Sort by date
- Pagination

#### 6.2 Request Details Page

- Full request information
- Service details
- Submitted form data
- Uploaded documents (view/download)
- Current status
- Payment status
- "Pay Now" button (if unpaid)
- Status timeline (future)

#### 6.3 Unpaid Request Handling

```typescript
// User can view and pay unpaid requests
GET /api/requests/my-requests?status=UNPAID

// Show payment button
if (!request.paid) {
  <PaymentButton requestId={request.id} />
}
```

#### 6.4 Components

- RequestCard component
- RequestList component
- RequestDetails component
- StatusBadge component
- PaymentButton component

#### 6.5 API Integration

```typescript
GET /api/requests/my-requests?page=1&status=PAID
GET /api/requests/:requestId
```

**Deliverables**:

- ✅ Request listing page
- ✅ Request detail page
- ✅ Pay unpaid requests
- ✅ Status tracking

---

### Phase 7: User Profile (Week 4)

**Status**: 🔶 Account management

#### 7.1 Profile Page

- Display user information
- Email (read-only)
- Role (read-only)
- Edit profile (future)
- Change password (future)
- Logout button

#### 7.2 Profile Components

- ProfileHeader component
- ProfileInfo component
- LogoutButton component

#### 7.3 Logout Flow

```typescript
// Logout handler
const handleLogout = async () => {
  await api.post("/auth/logout");
  clearAuth(); // Clear context
  router.push("/"); // Redirect to homepage
};
```

**Deliverables**:

- ✅ Profile page
- ✅ Logout functionality
- ✅ Session cleanup

---

### Phase 8: DSA Frontend (Week 5) - FUTURE

**Status**: ⏳ Not in current scope

#### 8.1 DSA Registration

- ₹299 one-time payment
- OTP verification
- Profile creation

#### 8.2 DSA Request Management

- View assigned requests
- Fill requests for users
- Update request status
- Edit request data
- Export to CSV

#### 8.3 DSA Components

- DSA dashboard
- Request form (same as user)
- Status update modal
- Export functionality

---

### Phase 9: Employee Frontend (Week 6) - FUTURE

**Status**: ⏳ Not in current scope

#### 9.1 Employee Dashboard

- View all requests
- View all DSAs
- Assign requests to DSAs
- Bulk assign
- View audit logs

#### 9.2 DSA Management

- Invite DSA via email
- Generate unique invite link
- View DSA list
- Activate/deactivate DSAs

#### 9.3 Request Management

- View all requests
- Edit requests
- Assign to DSA
- Bulk operations
- Export data

---

## 🔌 API Integration Layer

### API Client Configuration

```typescript
// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Include cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any request modifications
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data, // Return only data
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Layer Pattern

```typescript
// services/authService.ts
import api from "@/lib/api";

export const authService = {
  register: async (data: RegisterData) => {
    return api.post("/auth/register", data);
  },

  login: async (data: LoginData) => {
    return api.post("/auth/login", data);
  },

  logout: async () => {
    return api.post("/auth/logout");
  },

  getCurrentUser: async () => {
    return api.get("/auth/me");
  },
};
```

### API Endpoints Map

#### Authentication APIs

```
POST /auth/register          - Register new user
POST /auth/login             - Login user
POST /auth/logout            - Logout user
GET  /auth/me                - Get current user
```

#### OTP APIs

```
POST /otp/send               - Send OTP to email
POST /otp/verify             - Verify OTP code
```

#### Services APIs

```
GET  /services               - List all services
GET  /services/:id           - Get service details
```

#### Requests APIs

```
POST /requests               - Create new request
GET  /requests/my-requests   - Get user's requests
GET  /requests/:id           - Get request details
PATCH /requests/:id          - Update request (DSA/Employee)
```

#### Payment APIs

```
POST /payments/create-order  - Create Razorpay order
POST /payments/verify        - Verify payment signature
```

#### Upload APIs

```
POST /uploads/document       - Upload document file
```

#### DSA APIs (Future)

```
POST /dsa/register           - Register as DSA
GET  /dsa/requests           - Get DSA requests
PATCH /dsa/requests/:id      - Update request status
```

#### Employee APIs (Future)

```
GET  /employee/requests      - Get all requests
POST /employee/assign-dsa    - Assign request to DSA
POST /employee/invite-dsa    - Invite new DSA
GET  /employee/dsas          - Get all DSAs
```

---

## 🎨 Component Library & Design System

### shadcn/ui Components to Install

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add alert
```

### Color Palette (Based on Reference Design)

```typescript
// tailwind.config.ts
colors: {
  primary: {
    DEFAULT: '#2563EB', // Blue from design
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#2563EB',
    600: '#1D4ED8',
    700: '#1E40AF',
  },
  secondary: {
    DEFAULT: '#7C3AED', // Purple accent
    500: '#7C3AED',
  },
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
}
```

### Typography

```css
/* Headings */
h1: text-4xl font-bold
h2: text-3xl font-semibold
h3: text-2xl font-semibold
h4: text-xl font-medium

/* Body */
body: text-base font-normal
small: text-sm
```

### Responsive Breakpoints

```typescript
screens: {
  'sm': '640px',   // Mobile
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

---

## 🔐 Security Best Practices

### 1. Authentication Security

```typescript
// ✅ DO: Session-based auth with httpOnly cookies
// ❌ DON'T: Store JWT in localStorage

// ✅ DO: Use credentials: 'include'
axios.create({
  withCredentials: true,
});

// ❌ DON'T: Store tokens client-side
localStorage.setItem("token", token); // NEVER
```

### 2. Route Protection

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/apply", "/payment", "/my-requests", "/profile"];
  const dsaRoutes = ["/dsa"];
  const employeeRoutes = ["/employee"];

  // Check session via API call or cookie
  const hasSession = request.cookies.get("sessionId");

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!hasSession) {
      return NextResponse.redirect("/login?redirect=" + pathname);
    }
  }

  return NextResponse.next();
}
```

### 3. Input Sanitization

```typescript
// Always validate and sanitize inputs
import DOMPurify from "isomorphic-dompurify";

const sanitizedInput = DOMPurify.sanitize(userInput);
```

### 4. XSS Prevention

```typescript
// ✅ DO: Use React's built-in escaping
<div>{userInput}</div>

// ❌ DON'T: Use dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 5. CSRF Protection

- Backend handles via session cookies
- Frontend uses withCredentials
- No manual token management needed

### 6. File Upload Security

```typescript
// Validate file types
const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
if (!allowedTypes.includes(file.type)) {
  throw new Error("Invalid file type");
}

// Validate file size
const maxSize = 10 * 1024 * 1024; // 10MB
if (file.size > maxSize) {
  throw new Error("File too large");
}
```

---

## 🧪 Testing Strategy

### Unit Testing

- Component tests with Jest + React Testing Library
- Hook tests
- Utility function tests

### Integration Testing

- Form submission flows
- Authentication flows
- Payment flows

### E2E Testing (Optional)

- Cypress or Playwright
- Critical user journeys

### Manual Testing Checklist

#### Phase 1: Public Pages ✅

- [ ] Homepage loads correctly
- [ ] All services displayed
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Footer links work

#### Phase 2: Authentication ✅

- [ ] Register with valid data
- [ ] OTP sent to email
- [ ] OTP verification works
- [ ] Login successful
- [ ] Session persists
- [ ] Logout works
- [ ] Invalid credentials rejected

#### Phase 3: Service Application ✅

- [ ] Form loads with service data
- [ ] All fields validate correctly
- [ ] File uploads work
- [ ] Form submission successful
- [ ] Redirect to payment

#### Phase 4: Payment ✅

- [ ] Razorpay modal opens
- [ ] Payment success flow
- [ ] Payment failure handling
- [ ] Already paid check
- [ ] Redirect after payment

#### Phase 5: Request Management ✅

- [ ] All requests displayed
- [ ] Filters work
- [ ] Request details load
- [ ] Pay unpaid requests
- [ ] Status updates

---

## 📦 Deployment Checklist

### Pre-deployment

- [ ] Environment variables set
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All images optimized

### Production Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.dhanseva.com
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
NEXT_PUBLIC_UPLOADTHING_APP_ID=xxx
```

### Deployment Platforms

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker + VPS**

---

## 🚀 Performance Optimization

### 1. Code Splitting

```typescript
// Dynamic imports for heavy components
const PaymentModal = dynamic(() => import("@/components/PaymentModal"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

### 2. Image Optimization

```typescript
// Use Next.js Image component
import Image from "next/image";

<Image src="/logo.png" alt="DhanSeva" width={200} height={60} priority />;
```

### 3. Caching Strategy

```typescript
// React Query caching
const { data: services } = useQuery({
  queryKey: ["services"],
  queryFn: () => serviceService.getAll(),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### 4. Bundle Size

- Tree shaking enabled
- Remove unused dependencies
- Analyze bundle with `@next/bundle-analyzer`

---

## 📚 Development Guidelines

### Code Style

```typescript
// Use TypeScript strictly
// Use functional components
// Use arrow functions
// Use async/await over promises
// Use destructuring
// Use optional chaining

// ✅ Good
const { data, isLoading, error } = useQuery(...);
const user = data?.user;

// ❌ Bad
const data = useQuery(...).data;
const user = data && data.user ? data.user : null;
```

### Naming Conventions

```typescript
// Components: PascalCase
export const ServiceCard = () => {};

// Functions: camelCase
export const fetchServices = () => {};

// Constants: UPPER_SNAKE_CASE
export const API_BASE_URL = "...";

// Types/Interfaces: PascalCase
export interface UserData {}
export type ServiceType = "...";
```

### File Naming

```
// Components: PascalCase
ServiceCard.tsx
PaymentButton.tsx

// Utilities: camelCase
authUtils.ts
formatters.ts

// Pages: kebab-case
my-requests/page.tsx
verify-email/page.tsx
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. CORS Errors

```typescript
// Backend must allow credentials
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Frontend must send credentials
axios.create({
  withCredentials: true,
});
```

#### 2. Session Not Persisting

```typescript
// Check cookie settings
- httpOnly: true
- sameSite: 'lax' or 'none'
- secure: true (production only)
```

#### 3. Razorpay Not Loading

```typescript
// Add to _document.tsx or layout.tsx
<Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="lazyOnload"
/>
```

#### 4. File Upload Failing

```typescript
// Check UploadThing configuration
// Verify API keys
// Check file size limits
// Verify CORS settings
```

---

## 📖 Additional Resources

### Documentation Links

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Razorpay Docs](https://razorpay.com/docs)
- [UploadThing](https://docs.uploadthing.com)

### Backend API Documentation

- Located at: `backend/API_Doc.MD`
- Postman collection available
- Swagger UI: `http://localhost:5000/api-docs`

---

## ✅ Implementation Checklist

### Project Setup ✅

- [x] Initialize Next.js project
- [x] Install dependencies
- [x] Configure TailwindCSS
- [x] Setup shadcn/ui
- [x] Configure TypeScript

### Phase 1: Foundation ✅

- [x] Root layout
- [x] Middleware
- [x] API client
- [x] Homepage
- [x] Static pages
- [x] Header/Footer

### Phase 2: Authentication 🔶

- [ ] Login page
- [ ] Register page
- [ ] OTP verification
- [ ] Auth context
- [ ] Protected routes

### Phase 3: Services 🔶

- [ ] Service listing
- [ ] Service details
- [ ] Category filters

### Phase 4: Application Form 🔶

- [ ] Form layout
- [ ] Form validation
- [ ] File uploads
- [ ] Form submission

### Phase 5: Payment 🔶

- [ ] Payment page
- [ ] Razorpay integration
- [ ] Payment verification
- [ ] Success handling

### Phase 6: User Pages 🔶

- [ ] My requests page
- [ ] Request details
- [ ] Profile page
- [ ] Logout

### Phase 7: DSA (Future) ⏳

- [ ] DSA registration
- [ ] DSA dashboard
- [ ] Request management
- [ ] Export functionality

### Phase 8: Employee (Future) ⏳

- [ ] Employee dashboard
- [ ] Request management
- [ ] DSA management
- [ ] Invite DSA

---

## 📝 Notes

### Current Focus

**Building**: User flow (Phases 1-6)
**Timeline**: Week 1-4
**Priority**: Core functionality, clean UX

### Future Enhancements

- Advanced analytics dashboard
- Real-time notifications (WebSocket)
- Document e-signing
- Chat support
- Mobile app (React Native)
- Admin panel
- Advanced reporting
- Bulk operations
- API rate limiting UI

---

**Document Version**: 1.0.0  
**Last Updated**: December 22, 2025  
**Author**: Senior Frontend Engineer  
**Status**: Implementation Ready ✅
