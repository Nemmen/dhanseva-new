# 🎨 FRONTEND IMPLEMENTATION GUIDE - DHANSEVA LEGAL SERVICES
## Complete Vite + React Refactoring Roadmap

---

## 📑 TABLE OF CONTENTS
1. [Backend Analysis Summary](#backend-analysis-summary)
2. [Frontend Architecture Overview](#frontend-architecture-overview)
3. [Tech Stack & Dependencies](#tech-stack--dependencies)
4. [Project Structure](#project-structure)
5. [Phase-wise Implementation](#phase-wise-implementation)
6. [API Integration Strategy](#api-integration-strategy)
7. [State Management](#state-management)
8. [Routing Structure](#routing-structure)
9. [Component Architecture](#component-architecture)
10. [Form Handling Strategy](#form-handling-strategy)

---

## 🔍 BACKEND ANALYSIS SUMMARY

### API Endpoints (22 Total)

#### Authentication (4 endpoints)
```
POST   /api/auth/register          - Register user/DSA/employee
POST   /api/auth/login             - Login with email & password
POST   /api/auth/logout            - Logout user
GET    /api/auth/me                - Get current user profile
```

#### OTP Verification (2 endpoints)
```
POST   /api/otp/send               - Send OTP to email (5 min TTL)
POST   /api/otp/verify             - Verify OTP code
```

#### Services (3 endpoints)
```
GET    /api/services               - List all services (paginated)
GET    /api/services/:id           - Get single service details
GET    /api/services/category/:cat - Filter by category
```

#### Service Requests (4 endpoints)
```
POST   /api/requests               - Create new service request
GET    /api/my-requests            - Get user's requests (paginated)
GET    /api/requests/:id           - Get request details
PATCH  /api/requests/:id           - Update request status
```

#### Payments (2 endpoints)
```
POST   /api/payments/create-order  - Create Razorpay order
POST   /api/payments/verify        - Verify payment signature
```

#### DSA Module (4 endpoints)
```
POST   /api/dsa/register           - Register as DSA (₹299 payment)
GET    /api/dsa/requests           - Get assigned requests
PATCH  /api/dsa/requests/:id       - Update request status
GET    /api/dsa/export             - Export requests as CSV
```

#### Employee Module (4 endpoints)
```
GET    /api/employee/requests      - Get all requests
POST   /api/employee/assign-dsa    - Assign DSA to request
POST   /api/employee/invite-dsa    - Send DSA invitation
PATCH  /api/employee/requests/:id  - Update request status
```

### Key Backend Features
- ✅ JWT + httpOnly cookie authentication
- ✅ 3 user roles: USER, DSA, EMPLOYEE
- ✅ Rate limiting per endpoint
- ✅ Comprehensive error handling
- ✅ Audit logging for critical operations
- ✅ Email notifications (7 templates)
- ✅ File uploads via UploadThing
- ✅ Razorpay payment integration
- ✅ Redis OTP storage (5 min TTL)
- ✅ Service categories (5 types)

### Data Models

```typescript
// User Roles
enum Role {
  USER      // Customer accessing legal services
  DSA       // Digital Service Associate (freelancer)
  EMPLOYEE  // Platform employee (admin)
}

// Service Categories
enum ServiceCategory {
  PERSONAL_LEGAL       // Affidavit, POA, Will, etc.
  BUSINESS_LEGAL       // Partnership, MoU, Contracts
  FINANCIAL_LEGAL      // Loan review, CA cert
  GOVT_LEGAL          // RTI, Court filing
  SPECIALIZED_LEGAL   // Mediation, Audit, Cyber law
}

// Request Status Lifecycle
enum RequestStatus {
  UNPAID        // Created but not paid
  ASSIGNED      // Paid, DSA assigned
  IN_PROGRESS   // DSA working on it
  ON_HOLD       // Paused
  COMPLETED     // Done
  CANCELLED     // Cancelled
}

// Payment Status
enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}
```

### Form Schema Structure

**Base Form (All Services):**
```typescript
{
  firstName: string
  lastName: string
  email: string
  phone: string
  whatsapp: string
  address: string
  state: string
  city: string
  pincode: string
  aadhaarFrontUrl: string  // optional
  aadhaarBackUrl: string   // optional
  panFrontUrl: string      // optional
  panBackUrl: string       // optional
}
```

**Service-Specific Extensions:**
- **Personal Legal:** employmentStatus, purposeDescription
- **Business Legal:** businessName, businessType, registrationNumber, partnersCount
- **Financial Legal:** bankName, accountHolder, loanAmount, loanType
- **Govt Legal:** departmentName, applicationPurpose, stateJurisdiction
- **Specialized:** urgencyLevel, consultationType

### Pricing
- All services: **₹99**
- DSA registration: **₹299**

---

## 🎯 FRONTEND ARCHITECTURE OVERVIEW

### Key Design Decisions

1. **User Access Pattern:**
   - ✅ USER role: Access profile & requests via navbar (NO dashboard)
   - ✅ DSA role: Full dashboard + manage requests
   - ✅ EMPLOYEE role: Full dashboard + analytics + DSA management

2. **Navigation Structure:**
   - **Public:** Home, Services, Contact, Auth
   - **After Login:** Navbar → Profile, My Requests, Logout
   - **DSA Dashboard:** Requests, Export, Profile
   - **Employee Dashboard:** All Requests, DSA Management, Analytics

3. **State Management:**
   - Authentication: Zustand (global auth state)
   - Queries: React Query (server state)
   - UI State: Zustand (modals, notifications)
   - Form State: React Hook Form (local form state)

4. **API Communication:**
   - Axios client with interceptors
   - React Query for caching
   - Automatic error handling
   - Token refresh on 401

---

## 🛠️ TECH STACK & DEPENDENCIES

### Core Stack
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "vite": "^5.4.0",
  "typescript": "^5.5.0"
}
```

### Routing & Navigation
```json
{
  "react-router-dom": "^6.26.0"
}
```

### State Management & Data Fetching
```json
{
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.50.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.52.0",
  "zod": "^3.23.0",
  "@hookform/resolvers": "^3.9.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "lucide-react": "^0.400.0",
  "sonner": "^1.5.0"
}
```

### API & HTTP
```json
{
  "axios": "^1.7.0"
}
```

### Payment & Upload
```json
{
  "razorpay": "^2.9.0",
  "@uploadthing/react": "^6.7.0"
}
```

### Utilities
```json
{
  "date-fns": "^3.6.0",
  "clsx": "^2.1.0",
  "class-variance-authority": "^0.7.0"
}
```

### Development
```json
{
  "@types/react": "^18.3.3",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.0"
}
```

---

## 📁 PROJECT STRUCTURE

```
frontend/
├── public/
│   ├── favicon.ico
│   └── dhanseva-logo.svg
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   └── hero.jpg
│   │   ├── icons/
│   │   │   └── services/
│   │   │       ├── affidavit.svg
│   │   │       ├── poa.svg
│   │   │       └── ...
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── alert.tsx
│   │   │   └── separator.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top navbar
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx         # Dashboard sidebar
│   │   │   └── MobileMenu.tsx      # Mobile nav
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── OTPVerification.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceGrid.tsx
│   │   │   ├── ServiceFilter.tsx
│   │   │   └── ServiceDetailsModal.tsx
│   │   │
│   │   ├── requests/
│   │   │   ├── RequestCard.tsx
│   │   │   ├── RequestList.tsx
│   │   │   ├── RequestStatusBadge.tsx
│   │   │   ├── RequestTimeline.tsx
│   │   │   └── forms/
│   │   │       ├── BaseFormFields.tsx
│   │   │       ├── PersonalLegalFields.tsx
│   │   │       ├── BusinessLegalFields.tsx
│   │   │       ├── FinancialLegalFields.tsx
│   │   │       ├── GovtLegalFields.tsx
│   │   │       └── SpecializedFields.tsx
│   │   │
│   │   ├── payment/
│   │   │   ├── RazorpayCheckout.tsx
│   │   │   ├── PaymentSummary.tsx
│   │   │   └── PaymentHistory.tsx
│   │   │
│   │   ├── upload/
│   │   │   ├── DocumentUploader.tsx
│   │   │   ├── DocumentPreview.tsx
│   │   │   └── UploadProgress.tsx
│   │   │
│   │   ├── dsa/
│   │   │   ├── DsaRequestCard.tsx
│   │   │   ├── DsaRequestList.tsx
│   │   │   ├── DsaStatsCard.tsx
│   │   │   └── ExportButton.tsx
│   │   │
│   │   ├── employee/
│   │   │   ├── EmployeeRequestTable.tsx
│   │   │   ├── DsaAssignmentModal.tsx
│   │   │   ├── DsaInviteForm.tsx
│   │   │   ├── AnalyticsCard.tsx
│   │   │   └── AuditLog.tsx
│   │   │
│   │   └── shared/
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── SearchBar.tsx
│   │       └── NotificationBell.tsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   ├── ServiceDetailPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── OTPPage.tsx
│   │   │   └── UnauthorizedPage.tsx
│   │   │
│   │   ├── user/
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── MyRequestsPage.tsx
│   │   │   ├── RequestDetailPage.tsx
│   │   │   ├── CreateRequestPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   │
│   │   ├── dsa/
│   │   │   ├── DsaDashboard.tsx
│   │   │   ├── DsaRequestsPage.tsx
│   │   │   ├── DsaRequestDetailPage.tsx
│   │   │   ├── DsaProfilePage.tsx
│   │   │   └── DsaEarningsPage.tsx
│   │   │
│   │   └── employee/
│   │       ├── EmployeeDashboard.tsx
│   │       ├── AllRequestsPage.tsx
│   │       ├── DsaManagementPage.tsx
│   │       ├── AnalyticsPage.tsx
│   │       └── AuditLogsPage.tsx
│   │
│   ├── layouts/
│   │   ├── RootLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── DsaDashboardLayout.tsx
│   │   └── EmployeeDashboardLayout.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts          # Axios instance
│   │   │   ├── endpoints.ts       # API endpoint constants
│   │   │   └── interceptors.ts    # Request/response interceptors
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useServices.ts
│   │   │   ├── useRequests.ts
│   │   │   ├── usePayment.ts
│   │   │   ├── useDsa.ts
│   │   │   ├── useEmployee.ts
│   │   │   ├── useOtp.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useFetch.ts
│   │   │   └── useLocalStorage.ts
│   │   │
│   │   ├── queries/
│   │   │   ├── auth.queries.ts
│   │   │   ├── services.queries.ts
│   │   │   ├── requests.queries.ts
│   │   │   ├── payment.queries.ts
│   │   │   ├── dsa.queries.ts
│   │   │   └── employee.queries.ts
│   │   │
│   │   ├── razorpay/
│   │   │   ├── razorpay.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── uploadthing/
│   │   │   ├── uploadthing.ts
│   │   │   └── types.ts
│   │   │
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── formatters.ts
│   │       ├── validators.ts
│   │       └── constants.ts
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── service.ts
│   │   ├── request.ts
│   │   ├── payment.ts
│   │   ├── dsa.ts
│   │   └── api.ts
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── request.schema.ts
│   │   ├── payment.schema.ts
│   │   └── dsa.schema.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── themes.css
│   │
│   └── config/
│       ├── env.ts
│       ├── routes.ts
│       └── site.ts
│
├── .env.local
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── components.json
└── README.md
```

---

## 🎯 PHASE-WISE IMPLEMENTATION

---

## **PHASE 0: PROJECT SETUP & CONFIGURATION**

### Objectives
- Set up Vite + React + TypeScript
- Install all dependencies
- Configure environment variables
- Set up API client
- Configure Tailwind CSS

### Implementation Steps

#### Step 1: Initialize Project
```bash
# If starting fresh
npm create vite@latest frontend -- --template react-ts
cd frontend

# If refactoring existing project
cd frontend
npm install
```

#### Step 2: Install Dependencies
```bash
# Core dependencies
npm install react-router-dom zustand @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install axios date-fns clsx class-variance-authority
npm install sonner

# UI & Styling
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react

# Payment & Upload
npm install razorpay @uploadthing/react

# Development
npm install -D @types/react @types/react-dom
npm install -D typescript @vitejs/plugin-react
```

#### Step 3: Configure Tailwind CSS
```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F2937",
        secondary: "#6366F1",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### Step 4: Set Up shadcn/ui
```bash
npx shadcn-ui@latest init

# Install components
npx shadcn-ui@latest add button input card dialog dropdown-menu
npx shadcn-ui@latest add table badge toast form select tabs
npx shadcn-ui@latest add pagination skeleton alert separator
```

#### Step 5: Environment Variables

Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_Rr5VUBDcqjo2dh
VITE_UPLOADTHING_APP_ID=uo8jfbje4b
VITE_APP_NAME=Dhanseva
VITE_APP_URL=http://localhost:5173
```

#### Step 6: Create Configuration Files

**`src/config/env.ts`:**
```typescript
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  uploadthingAppId: import.meta.env.VITE_UPLOADTHING_APP_ID,
  appName: import.meta.env.VITE_APP_NAME,
  appUrl: import.meta.env.VITE_APP_URL,
} as const;
```

**`src/config/site.ts`:**
```typescript
export const siteConfig = {
  name: "Dhanseva",
  description: "Professional Legal Services Platform for India",
  email: "support@dhanseva.com",
  phone: "+91-1234567890",
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
} as const;
```

**`src/config/routes.ts`:**
```typescript
export const routes = {
  // Public
  home: "/",
  services: "/services",
  serviceDetail: (id: string) => `/services/${id}`,
  contact: "/contact",
  
  // Auth
  login: "/login",
  register: "/register",
  verifyOtp: "/verify-otp",
  
  // User (logged in via navbar)
  profile: "/profile",
  myRequests: "/my-requests",
  requestDetail: (id: string) => `/requests/${id}`,
  createRequest: (serviceId: string) => `/create-request/${serviceId}`,
  settings: "/settings",
  
  // DSA Dashboard
  dsa: {
    root: "/dsa",
    dashboard: "/dsa/dashboard",
    requests: "/dsa/requests",
    requestDetail: (id: string) => `/dsa/requests/${id}`,
    profile: "/dsa/profile",
    earnings: "/dsa/earnings",
  },
  
  // Employee Dashboard
  employee: {
    root: "/employee",
    dashboard: "/employee/dashboard",
    requests: "/employee/requests",
    dsaManagement: "/employee/dsa-management",
    analytics: "/employee/analytics",
    auditLogs: "/employee/audit-logs",
  },
  
  // Error
  notFound: "/404",
  unauthorized: "/unauthorized",
} as const;
```

#### Step 7: Create Base API Client

**`src/lib/api/client.ts`:**
```typescript
import axios, { AxiosInstance, AxiosError } from "axios";
import { env } from "@/config/env";

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Step 8: Create Types

**`src/types/index.ts`:**
```typescript
export enum Role {
  USER = "USER",
  DSA = "DSA",
  EMPLOYEE = "EMPLOYEE",
}

export enum RequestStatus {
  UNPAID = "UNPAID",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ServiceCategory {
  PERSONAL_LEGAL = "PERSONAL_LEGAL",
  BUSINESS_LEGAL = "BUSINESS_LEGAL",
  FINANCIAL_LEGAL = "FINANCIAL_LEGAL",
  GOVT_LEGAL = "GOVT_LEGAL",
  SPECIALIZED_LEGAL = "SPECIALIZED_LEGAL",
}

export interface User {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description?: string;
  price: number;
  isActive: boolean;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName?: string;
  status: RequestStatus;
  paid: boolean;
  filledByDsaId?: string;
  createdAt: string;
  formData: Record<string, any>;
}
```

#### Step 9: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write src"
  }
}
```

### Deliverables
- ✅ Vite project initialized with all dependencies
- ✅ Tailwind CSS configured
- ✅ shadcn/ui set up
- ✅ Environment variables configured
- ✅ API client created
- ✅ Types defined
- ✅ Routes config created

**Status:** Ready for Phase 1

---

## **PHASE 1: AUTHENTICATION SYSTEM**

### Objectives
- Implement login/register forms
- OTP verification flow
- Session management
- Protected routes
- Global auth state

### Implementation Steps

#### Step 1: Create Auth Store (Zustand)

**`src/store/authStore.ts`:**
```typescript
import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
  }),
}));
```

#### Step 2: Create React Query Hooks

**`src/lib/queries/auth.queries.ts`:**
```typescript
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { User } from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  role: "USER" | "DSA" | "EMPLOYEE";
}

interface OtpPayload {
  email: string;
  otp: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: OtpPayload) => {
      const response = await apiClient.post("/otp/verify", data);
      return response.data;
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post("/otp/send", { email });
      return response.data;
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return response.data.data;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
  });
};
```

#### Step 3: Create Login Form Component

**`src/components/auth/LoginForm.tsx`:**
```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/queries/auth.queries";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password too short"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { mutate: login, isPending } = useLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: (response) => {
        setUser(response.data.user);
        toast.success("Login successful");
        navigate("/");
      },
      onError: () => {
        toast.error("Login failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Email"
          {...register("email")}
          type="email"
        />
        {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
      </div>
      
      <div>
        <Input
          placeholder="Password"
          {...register("password")}
          type="password"
        />
        {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
      </div>
      
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
```

#### Step 4: Create Register Form Component

**`src/components/auth/RegisterForm.tsx`:**
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegister } from "@/lib/queries/auth.queries";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  role: z.enum(["USER", "DSA", "EMPLOYEE"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();
  
  const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" },
  });

  const onSubmit = (data: RegisterForm) => {
    register(data, {
      onSuccess: () => {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      },
      onError: () => {
        toast.error("Registration failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Email"
          {...formRegister("email")}
          type="email"
        />
        {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
      </div>
      
      <div>
        <Input
          placeholder="Password"
          {...formRegister("password")}
          type="password"
        />
        {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <Select defaultValue="USER" onValueChange={(value) => {
          formRegister("role").onChange({ target: { value } });
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">Customer</SelectItem>
            <SelectItem value="DSA">Legal Expert (DSA)</SelectItem>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-error text-sm">{errors.role.message}</p>}
      </div>
      
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
```

#### Step 5: Create OTP Verification Component

**`src/components/auth/OTPVerification.tsx`:**
```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyOtp, useSendOtp } from "@/lib/queries/auth.queries";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpForm = z.infer<typeof otpSchema>;

interface OTPVerificationProps {
  email: string;
  onSuccess: () => void;
}

export function OTPVerification({ email, onSuccess }: OTPVerificationProps) {
  const [step, setStep] = useState<"send" | "verify">("send");
  const [timer, setTimer] = useState(0);
  
  const { mutate: sendOtp, isPending: isSending } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  
  const { register, handleSubmit, formState: { errors } } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email },
  });

  const handleSendOtp = () => {
    sendOtp(email, {
      onSuccess: () => {
        toast.success("OTP sent to your email");
        setStep("verify");
        setTimer(300); // 5 minutes
      },
      onError: () => {
        toast.error("Failed to send OTP");
      },
    });
  };

  const onSubmit = (data: OtpForm) => {
    verifyOtp(data, {
      onSuccess: () => {
        toast.success("Email verified!");
        onSuccess();
      },
      onError: () => {
        toast.error("Invalid OTP");
      },
    });
  };

  return (
    <div className="space-y-4">
      {step === "send" ? (
        <Button onClick={handleSendOtp} disabled={isSending} className="w-full">
          {isSending ? "Sending..." : "Send OTP"}
        </Button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Enter 6-digit OTP"
              {...register("otp")}
              maxLength={6}
            />
            {errors.otp && <p className="text-error text-sm">{errors.otp.message}</p>}
          </div>
          
          <Button type="submit" disabled={isVerifying} className="w-full">
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            {timer > 0 && `Resend OTP in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`}
          </div>
        </form>
      )}
    </div>
  );
}
```

#### Step 6: Create Protected Route Component

**`src/components/auth/ProtectedRoute.tsx`:**
```typescript
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Role } from "@/types";
import { Loading } from "@/components/shared/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role as Role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
```

#### Step 7: Create Auth Pages

**`src/pages/auth/LoginPage.tsx`:**
```typescript
import { LoginForm } from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <LoginForm />
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-secondary">Register</Link>
        </p>
      </Card>
    </div>
  );
}
```

**`src/pages/auth/RegisterPage.tsx`:**
```typescript
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <RegisterForm />
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-secondary">Login</Link>
        </p>
      </Card>
    </div>
  );
}
```

#### Step 8: Create Header/Navigation Component

**`src/components/layout/Header.tsx`:**
```typescript
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/lib/queries/auth.queries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User } from "lucide-react";
import { toast } from "sonner";

export function Header() {
  const navigate = useNavigate();
  const { user, logout: logoutStore } = useAuthStore();
  const { mutate: logout } = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        logoutStore();
        toast.success("Logged out");
        navigate("/");
      },
    });
  };

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-secondary">
          Dhanseva
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/services" className="text-gray-600 hover:text-secondary">
            Services
          </Link>
          
          {!user ? (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <User className="w-4 h-4 mr-2" />
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-requests">My Requests</Link>
                </DropdownMenuItem>
                
                {user.role === "DSA" && (
                  <DropdownMenuItem asChild>
                    <Link to="/dsa/dashboard">DSA Dashboard</Link>
                  </DropdownMenuItem>
                )}
                
                {user.role === "EMPLOYEE" && (
                  <DropdownMenuItem asChild>
                    <Link to="/employee/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Content */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-50 px-4 py-4 space-y-2">
          <Link to="/services" className="block py-2">Services</Link>
          {!user ? (
            <>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <>
              <Link to="/profile" className="block py-2">Profile</Link>
              <Link to="/my-requests" className="block py-2">My Requests</Link>
              {user.role === "DSA" && (
                <Link to="/dsa/dashboard" className="block py-2">DSA Dashboard</Link>
              )}
              {user.role === "EMPLOYEE" && (
                <Link to="/employee/dashboard" className="block py-2">Dashboard</Link>
              )}
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
```

#### Step 9: Create App.tsx with Routing

**`src/App.tsx`:**
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useCurrentUser } from "@/lib/queries/auth.queries";
import { useAuthStore } from "@/store/authStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Loading } from "@/components/shared/Loading";

// Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { HomePage } from "@/pages/public/HomePage";
import { ServicesPage } from "@/pages/public/ServicesPage";
import { NotFound } from "@/pages/error/NotFound";

export default function App() {
  const { data: user, isLoading } = useCurrentUser();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Profile Page - Coming Soon</div>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
```

### Deliverables
- ✅ Auth store (Zustand) created
- ✅ React Query hooks for auth
- ✅ Login form with validation
- ✅ Register form with role selection
- ✅ OTP verification component
- ✅ Protected routes
- ✅ Header/navigation with auth state
- ✅ Auth pages (login, register)
- ✅ Basic routing structure

**Status:** Ready for Phase 2

---

## **PHASE 2: SERVICES MODULE**

### Objectives
- Display all services
- Filter by category
- Show service details
- Service category badges

### Implementation Steps

#### Step 1: Create Services Query Hook

**`src/lib/queries/services.queries.ts`:**
```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Service, ServiceCategory } from "@/types";

export const useServices = (page = 1, limit = 10, category?: ServiceCategory) => {
  return useQuery({
    queryKey: ["services", page, limit, category],
    queryFn: async () => {
      const response = await apiClient.get("/services", {
        params: {
          page,
          limit,
          ...(category && { category }),
        },
      });
      return response.data.data;
    },
  });
};

export const useServiceById = (id: string) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const response = await apiClient.get(`/services/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};
```

#### Step 2: Create Service Card Component

**`src/components/services/ServiceCard.tsx`:**
```typescript
import { Service } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition">
      <div className="p-6 flex-1">
        <Badge className="mb-3" variant="secondary">
          {service.category.replace(/_/g, " ")}
        </Badge>
        
        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-secondary">
              ₹{service.price}
            </span>
            <Button asChild size="sm">
              <Link to={`/services/${service.id}`}>
                View <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

#### Step 3: Create Service Filter Component

**`src/components/services/ServiceFilter.tsx`:**
```typescript
import { ServiceCategory } from "@/types";
import { Button } from "@/components/ui/button";

const categories = [
  { value: undefined, label: "All Services" },
  { value: ServiceCategory.PERSONAL_LEGAL, label: "Personal Legal" },
  { value: ServiceCategory.BUSINESS_LEGAL, label: "Business Legal" },
  { value: ServiceCategory.FINANCIAL_LEGAL, label: "Financial Legal" },
  { value: ServiceCategory.GOVT_LEGAL, label: "Government Legal" },
  { value: ServiceCategory.SPECIALIZED_LEGAL, label: "Specialized Legal" },
];

interface ServiceFilterProps {
  selectedCategory?: ServiceCategory;
  onCategoryChange: (category?: ServiceCategory) => void;
}

export function ServiceFilter({ selectedCategory, onCategoryChange }: ServiceFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <Button
          key={cat.value || "all"}
          variant={selectedCategory === cat.value ? "default" : "outline"}
          onClick={() => onCategoryChange(cat.value)}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
```

#### Step 4: Create Services Page

**`src/pages/public/ServicesPage.tsx`:**
```typescript
import { useState } from "react";
import { useServices } from "@/lib/queries/services.queries";
import { ServiceCategory } from "@/types";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFilter } from "@/components/services/ServiceFilter";
import { Loading } from "@/components/shared/Loading";
import { EmptyState } from "@/components/shared/EmptyState";

export function ServicesPage() {
  const [category, setCategory] = useState<ServiceCategory>();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useServices(page, 12, category);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-8 text-error">Failed to load services</div>;
  if (!data?.data?.length) return <EmptyState title="No services found" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Legal Services</h1>
      
      <ServiceFilter selectedCategory={category} onCategoryChange={setCategory} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((service: any) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Pagination */}
      {data.pagination && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            disabled={!data.pagination.hasPrevious}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {data.pagination.totalPages}
          </span>
          <button
            disabled={!data.pagination.hasNext}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

### Deliverables
- ✅ Services query hook
- ✅ Service card component
- ✅ Service filter by category
- ✅ Services listing page
- ✅ Pagination support

**Status:** Ready for Phase 3

---

## **PHASE 3: SERVICE REQUESTS MODULE (USER)**

### Objectives
- Create service requests
- View user's requests
- Request detail page
- Status tracking
- Form handling for 5 service types

### Implementation Steps

#### Step 1: Create Request Schemas

**`src/schemas/request.schema.ts`:**
```typescript
import { z } from "zod";

// Base form schema
export const baseFormSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone"),
  whatsapp: z.string().regex(/^[0-9]{10}$/, "Invalid whatsapp"),
  address: z.string().min(5, "Enter full address"),
  state: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid pincode"),
  aadhaarFrontUrl: z.string().optional(),
  aadhaarBackUrl: z.string().optional(),
  panFrontUrl: z.string().optional(),
  panBackUrl: z.string().optional(),
});

// Personal Legal extension
export const personalLegalSchema = baseFormSchema.extend({
  employmentStatus: z.enum(["SALARIED", "SELF_EMPLOYED", "BUSINESS", "UNEMPLOYED"]),
  purposeDescription: z.string().min(10, "Describe the purpose"),
});

// Business Legal extension
export const businessLegalSchema = baseFormSchema.extend({
  businessName: z.string().min(1, "Required"),
  businessType: z.enum(["PARTNERSHIP", "PRIVATE_LIMITED", "PUBLIC_LIMITED", "SOLE_PROPRIETOR"]),
  registrationNumber: z.string().optional(),
  partnersCount: z.number().min(1),
});

// Financial Legal extension
export const financialLegalSchema = baseFormSchema.extend({
  bankName: z.string().min(1, "Required"),
  accountHolder: z.string().min(1, "Required"),
  loanAmount: z.number().min(1),
  loanType: z.enum(["HOME", "AUTO", "PERSONAL", "BUSINESS", "EDUCATION"]),
});

// Govt Legal extension
export const govtLegalSchema = baseFormSchema.extend({
  departmentName: z.string().min(1, "Required"),
  applicationPurpose: z.string().min(10, "Describe purpose"),
  stateJurisdiction: z.string().min(1, "Required"),
});

// Specialized Legal extension
export const specializedSchema = baseFormSchema.extend({
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  consultationType: z.string().min(1, "Required"),
});
```

#### Step 2: Create Request Queries

**`src/lib/queries/requests.queries.ts`:**
```typescript
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

export const useCreateRequest = () => {
  return useMutation({
    mutationFn: async (data: {
      serviceId: string;
      formData: Record<string, any>;
    }) => {
      const response = await apiClient.post("/requests", data);
      return response.data.data;
    },
  });
};

export const useMyRequests = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["myRequests", page, limit],
    queryFn: async () => {
      const response = await apiClient.get("/my-requests", {
        params: { page, limit },
      });
      return response.data.data;
    },
  });
};

export const useRequestById = (id: string) => {
  return useQuery({
    queryKey: ["request", id],
    queryFn: async () => {
      const response = await apiClient.get(`/requests/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useUpdateRequest = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(`/requests/${id}`, { status });
      return response.data.data;
    },
  });
};
```

#### Step 3: Create Base Form Fields Component

**`src/components/requests/forms/BaseFormFields.tsx`:**
```typescript
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentUploader } from "@/components/upload/DocumentUploader";
import { UseFormReturn } from "react-hook-form";

const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", /* ... more states */];

interface BaseFormFieldsProps {
  form: UseFormReturn<any>;
}

export function BaseFormFields({ form }: BaseFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name# 🎨 FRONTEND IMPLEMENTATION GUIDE - DHANSEVA LEGAL SERVICES
## Complete Vite + React Refactoring Roadmap

---

## 📑 TABLE OF CONTENTS
1. [Backend Analysis Summary](#backend-analysis-summary)
2. [Frontend Architecture Overview](#frontend-architecture-overview)
3. [Tech Stack & Dependencies](#tech-stack--dependencies)
4. [Project Structure](#project-structure)
5. [Phase-wise Implementation](#phase-wise-implementation)
6. [API Integration Strategy](#api-integration-strategy)
7. [State Management](#state-management)
8. [Routing Structure](#routing-structure)
9. [Component Architecture](#component-architecture)
10. [Form Handling Strategy](#form-handling-strategy)

---

## 🔍 BACKEND ANALYSIS SUMMARY

### API Endpoints (22 Total)

#### Authentication (4 endpoints)
```
POST   /api/auth/register          - Register user/DSA/employee
POST   /api/auth/login             - Login with email & password
POST   /api/auth/logout            - Logout user
GET    /api/auth/me                - Get current user profile
```

#### OTP Verification (2 endpoints)
```
POST   /api/otp/send               - Send OTP to email (5 min TTL)
POST   /api/otp/verify             - Verify OTP code
```

#### Services (3 endpoints)
```
GET    /api/services               - List all services (paginated)
GET    /api/services/:id           - Get single service details
GET    /api/services/category/:cat - Filter by category
```

#### Service Requests (4 endpoints)
```
POST   /api/requests               - Create new service request
GET    /api/my-requests            - Get user's requests (paginated)
GET    /api/requests/:id           - Get request details
PATCH  /api/requests/:id           - Update request status
```

#### Payments (2 endpoints)
```
POST   /api/payments/create-order  - Create Razorpay order
POST   /api/payments/verify        - Verify payment signature
```

#### DSA Module (4 endpoints)
```
POST   /api/dsa/register           - Register as DSA (₹299 payment)
GET    /api/dsa/requests           - Get assigned requests
PATCH  /api/dsa/requests/:id       - Update request status
GET    /api/dsa/export             - Export requests as CSV
```

#### Employee Module (4 endpoints)
```
GET    /api/employee/requests      - Get all requests
POST   /api/employee/assign-dsa    - Assign DSA to request
POST   /api/employee/invite-dsa    - Send DSA invitation
PATCH  /api/employee/requests/:id  - Update request status
```

### Key Backend Features
- ✅ JWT + httpOnly cookie authentication
- ✅ 3 user roles: USER, DSA, EMPLOYEE
- ✅ Rate limiting per endpoint
- ✅ Comprehensive error handling
- ✅ Audit logging for critical operations
- ✅ Email notifications (7 templates)
- ✅ File uploads via UploadThing
- ✅ Razorpay payment integration
- ✅ Redis OTP storage (5 min TTL)
- ✅ Service categories (5 types)

### Data Models

```typescript
// User Roles
enum Role {
  USER      // Customer accessing legal services
  DSA       // Digital Service Associate (freelancer)
  EMPLOYEE  // Platform employee (admin)
}

// Service Categories
enum ServiceCategory {
  PERSONAL_LEGAL       // Affidavit, POA, Will, etc.
  BUSINESS_LEGAL       // Partnership, MoU, Contracts
  FINANCIAL_LEGAL      // Loan review, CA cert
  GOVT_LEGAL          // RTI, Court filing
  SPECIALIZED_LEGAL   // Mediation, Audit, Cyber law
}

// Request Status Lifecycle
enum RequestStatus {
  UNPAID        // Created but not paid
  ASSIGNED      // Paid, DSA assigned
  IN_PROGRESS   // DSA working on it
  ON_HOLD       // Paused
  COMPLETED     // Done
  CANCELLED     // Cancelled
}

// Payment Status
enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}
```

### Form Schema Structure

**Base Form (All Services):**
```typescript
{
  firstName: string
  lastName: string
  email: string
  phone: string
  whatsapp: string
  address: string
  state: string
  city: string
  pincode: string
  aadhaarFrontUrl: string  // optional
  aadhaarBackUrl: string   // optional
  panFrontUrl: string      // optional
  panBackUrl: string       // optional
}
```

**Service-Specific Extensions:**
- **Personal Legal:** employmentStatus, purposeDescription
- **Business Legal:** businessName, businessType, registrationNumber, partnersCount
- **Financial Legal:** bankName, accountHolder, loanAmount, loanType
- **Govt Legal:** departmentName, applicationPurpose, stateJurisdiction
- **Specialized:** urgencyLevel, consultationType

### Pricing
- All services: **₹99**
- DSA registration: **₹299**

---

## 🎯 FRONTEND ARCHITECTURE OVERVIEW

### Key Design Decisions

1. **User Access Pattern:**
   - ✅ USER role: Access profile & requests via navbar (NO dashboard)
   - ✅ DSA role: Full dashboard + manage requests
   - ✅ EMPLOYEE role: Full dashboard + analytics + DSA management

2. **Navigation Structure:**
   - **Public:** Home, Services, Contact, Auth
   - **After Login:** Navbar → Profile, My Requests, Logout
   - **DSA Dashboard:** Requests, Export, Profile
   - **Employee Dashboard:** All Requests, DSA Management, Analytics

3. **State Management:**
   - Authentication: Zustand (global auth state)
   - Queries: React Query (server state)
   - UI State: Zustand (modals, notifications)
   - Form State: React Hook Form (local form state)

4. **API Communication:**
   - Axios client with interceptors
   - React Query for caching
   - Automatic error handling
   - Token refresh on 401

---

## 🛠️ TECH STACK & DEPENDENCIES

### Core Stack
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "vite": "^5.4.0",
  "typescript": "^5.5.0"
}
```

### Routing & Navigation
```json
{
  "react-router-dom": "^6.26.0"
}
```

### State Management & Data Fetching
```json
{
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.50.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.52.0",
  "zod": "^3.23.0",
  "@hookform/resolvers": "^3.9.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "lucide-react": "^0.400.0",
  "sonner": "^1.5.0"
}
```

### API & HTTP
```json
{
  "axios": "^1.7.0"
}
```

### Payment & Upload
```json
{
  "razorpay": "^2.9.0",
  "@uploadthing/react": "^6.7.0"
}
```

### Utilities
```json
{
  "date-fns": "^3.6.0",
  "clsx": "^2.1.0",
  "class-variance-authority": "^0.7.0"
}
```

### Development
```json
{
  "@types/react": "^18.3.3",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.3.0"
}
```

---

## 📁 PROJECT STRUCTURE

```
frontend/
├── public/
│   ├── favicon.ico
│   └── dhanseva-logo.svg
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   └── hero.jpg
│   │   ├── icons/
│   │   │   └── services/
│   │   │       ├── affidavit.svg
│   │   │       ├── poa.svg
│   │   │       └── ...
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── alert.tsx
│   │   │   └── separator.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top navbar
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx         # Dashboard sidebar
│   │   │   └── MobileMenu.tsx      # Mobile nav
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── OTPVerification.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceGrid.tsx
│   │   │   ├── ServiceFilter.tsx
│   │   │   └── ServiceDetailsModal.tsx
│   │   │
│   │   ├── requests/
│   │   │   ├── RequestCard.tsx
│   │   │   ├── RequestList.tsx
│   │   │   ├── RequestStatusBadge.tsx
│   │   │   ├── RequestTimeline.tsx
│   │   │   └── forms/
│   │   │       ├── BaseFormFields.tsx
│   │   │       ├── PersonalLegalFields.tsx
│   │   │       ├── BusinessLegalFields.tsx
│   │   │       ├── FinancialLegalFields.tsx
│   │   │       ├── GovtLegalFields.tsx
│   │   │       └── SpecializedFields.tsx
│   │   │
│   │   ├── payment/
│   │   │   ├── RazorpayCheckout.tsx
│   │   │   ├── PaymentSummary.tsx
│   │   │   └── PaymentHistory.tsx
│   │   │
│   │   ├── upload/
│   │   │   ├── DocumentUploader.tsx
│   │   │   ├── DocumentPreview.tsx
│   │   │   └── UploadProgress.tsx
│   │   │
│   │   ├── dsa/
│   │   │   ├── DsaRequestCard.tsx
│   │   │   ├── DsaRequestList.tsx
│   │   │   ├── DsaStatsCard.tsx
│   │   │   └── ExportButton.tsx
│   │   │
│   │   ├── employee/
│   │   │   ├── EmployeeRequestTable.tsx
│   │   │   ├── DsaAssignmentModal.tsx
│   │   │   ├── DsaInviteForm.tsx
│   │   │   ├── AnalyticsCard.tsx
│   │   │   └── AuditLog.tsx
│   │   │
│   │   └── shared/
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── SearchBar.tsx
│   │       └── NotificationBell.tsx
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   ├── ServiceDetailPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── OTPPage.tsx
│   │   │   └── UnauthorizedPage.tsx
│   │   │
│   │   ├── user/
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── MyRequestsPage.tsx
│   │   │   ├── RequestDetailPage.tsx
│   │   │   ├── CreateRequestPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   │
│   │   ├── dsa/
│   │   │   ├── DsaDashboard.tsx
│   │   │   ├── DsaRequestsPage.tsx
│   │   │   ├── DsaRequestDetailPage.tsx
│   │   │   ├── DsaProfilePage.tsx
│   │   │   └── DsaEarningsPage.tsx
│   │   │
│   │   └── employee/
│   │       ├── EmployeeDashboard.tsx
│   │       ├── AllRequestsPage.tsx
│   │       ├── DsaManagementPage.tsx
│   │       ├── AnalyticsPage.tsx
│   │       └── AuditLogsPage.tsx
│   │
│   ├── layouts/
│   │   ├── RootLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── DsaDashboardLayout.tsx
│   │   └── EmployeeDashboardLayout.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts          # Axios instance
│   │   │   ├── endpoints.ts       # API endpoint constants
│   │   │   └── interceptors.ts    # Request/response interceptors
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useServices.ts
│   │   │   ├── useRequests.ts
│   │   │   ├── usePayment.ts
│   │   │   ├── useDsa.ts
│   │   │   ├── useEmployee.ts
│   │   │   ├── useOtp.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useFetch.ts
│   │   │   └── useLocalStorage.ts
│   │   │
│   │   ├── queries/
│   │   │   ├── auth.queries.ts
│   │   │   ├── services.queries.ts
│   │   │   ├── requests.queries.ts
│   │   │   ├── payment.queries.ts
│   │   │   ├── dsa.queries.ts
│   │   │   └── employee.queries.ts
│   │   │
│   │   ├── razorpay/
│   │   │   ├── razorpay.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── uploadthing/
│   │   │   ├── uploadthing.ts
│   │   │   └── types.ts
│   │   │
│   │   └── utils/
│   │       ├── cn.ts
│   │       ├── formatters.ts
│   │       ├── validators.ts
│   │       └── constants.ts
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── uiStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── service.ts
│   │   ├── request.ts
│   │   ├── payment.ts
│   │   ├── dsa.ts
│   │   └── api.ts
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── request.schema.ts
│   │   ├── payment.schema.ts
│   │   └── dsa.schema.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── themes.css
│   │
│   └── config/
│       ├── env.ts
│       ├── routes.ts
│       └── site.ts
│
├── .env.local
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── components.json
└── README.md
```

---

## 🎯 PHASE-WISE IMPLEMENTATION

---

## **PHASE 0: PROJECT SETUP & CONFIGURATION**

### Objectives
- Set up Vite + React + TypeScript
- Install all dependencies
- Configure environment variables
- Set up API client
- Configure Tailwind CSS

### Implementation Steps

#### Step 1: Initialize Project
```bash
# If starting fresh
npm create vite@latest frontend -- --template react-ts
cd frontend

# If refactoring existing project
cd frontend
npm install
```

#### Step 2: Install Dependencies
```bash
# Core dependencies
npm install react-router-dom zustand @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install axios date-fns clsx class-variance-authority
npm install sonner

# UI & Styling
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react

# Payment & Upload
npm install razorpay @uploadthing/react

# Development
npm install -D @types/react @types/react-dom
npm install -D typescript @vitejs/plugin-react
```

#### Step 3: Configure Tailwind CSS
```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F2937",
        secondary: "#6366F1",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### Step 4: Set Up shadcn/ui
```bash
npx shadcn-ui@latest init

# Install components
npx shadcn-ui@latest add button input card dialog dropdown-menu
npx shadcn-ui@latest add table badge toast form select tabs
npx shadcn-ui@latest add pagination skeleton alert separator
```

#### Step 5: Environment Variables

Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_Rr5VUBDcqjo2dh
VITE_UPLOADTHING_APP_ID=uo8jfbje4b
VITE_APP_NAME=Dhanseva
VITE_APP_URL=http://localhost:5173
```

#### Step 6: Create Configuration Files

**`src/config/env.ts`:**
```typescript
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  uploadthingAppId: import.meta.env.VITE_UPLOADTHING_APP_ID,
  appName: import.meta.env.VITE_APP_NAME,
  appUrl: import.meta.env.VITE_APP_URL,
} as const;
```

**`src/config/site.ts`:**
```typescript
export const siteConfig = {
  name: "Dhanseva",
  description: "Professional Legal Services Platform for India",
  email: "support@dhanseva.com",
  phone: "+91-1234567890",
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
} as const;
```

**`src/config/routes.ts`:**
```typescript
export const routes = {
  // Public
  home: "/",
  services: "/services",
  serviceDetail: (id: string) => `/services/${id}`,
  contact: "/contact",
  
  // Auth
  login: "/login",
  register: "/register",
  verifyOtp: "/verify-otp",
  
  // User (logged in via navbar)
  profile: "/profile",
  myRequests: "/my-requests",
  requestDetail: (id: string) => `/requests/${id}`,
  createRequest: (serviceId: string) => `/create-request/${serviceId}`,
  settings: "/settings",
  
  // DSA Dashboard
  dsa: {
    root: "/dsa",
    dashboard: "/dsa/dashboard",
    requests: "/dsa/requests",
    requestDetail: (id: string) => `/dsa/requests/${id}`,
    profile: "/dsa/profile",
    earnings: "/dsa/earnings",
  },
  
  // Employee Dashboard
  employee: {
    root: "/employee",
    dashboard: "/employee/dashboard",
    requests: "/employee/requests",
    dsaManagement: "/employee/dsa-management",
    analytics: "/employee/analytics",
    auditLogs: "/employee/audit-logs",
  },
  
  // Error
  notFound: "/404",
  unauthorized: "/unauthorized",
} as const;
```

#### Step 7: Create Base API Client

**`src/lib/api/client.ts`:**
```typescript
import axios, { AxiosInstance, AxiosError } from "axios";
import { env } from "@/config/env";

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Step 8: Create Types

**`src/types/index.ts`:**
```typescript
export enum Role {
  USER = "USER",
  DSA = "DSA",
  EMPLOYEE = "EMPLOYEE",
}

export enum RequestStatus {
  UNPAID = "UNPAID",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ServiceCategory {
  PERSONAL_LEGAL = "PERSONAL_LEGAL",
  BUSINESS_LEGAL = "BUSINESS_LEGAL",
  FINANCIAL_LEGAL = "FINANCIAL_LEGAL",
  GOVT_LEGAL = "GOVT_LEGAL",
  SPECIALIZED_LEGAL = "SPECIALIZED_LEGAL",
}

export interface User {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description?: string;
  price: number;
  isActive: boolean;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName?: string;
  status: RequestStatus;
  paid: boolean;
  filledByDsaId?: string;
  createdAt: string;
  formData: Record<string, any>;
}
```

#### Step 9: Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write src"
  }
}
```

### Deliverables
- ✅ Vite project initialized with all dependencies
- ✅ Tailwind CSS configured
- ✅ shadcn/ui set up
- ✅ Environment variables configured
- ✅ API client created
- ✅ Types defined
- ✅ Routes config created

**Status:** Ready for Phase 1

---

## **PHASE 1: AUTHENTICATION SYSTEM**

### Objectives
- Implement login/register forms
- OTP verification flow
- Session management
- Protected routes
- Global auth state

### Implementation Steps

#### Step 1: Create Auth Store (Zustand)

**`src/store/authStore.ts`:**
```typescript
import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
  }),
}));
```

#### Step 2: Create React Query Hooks

**`src/lib/queries/auth.queries.ts`:**
```typescript
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { User } from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  role: "USER" | "DSA" | "EMPLOYEE";
}

interface OtpPayload {
  email: string;
  otp: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: OtpPayload) => {
      const response = await apiClient.post("/otp/verify", data);
      return response.data;
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.post("/otp/send", { email });
      return response.data;
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return response.data.data;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },
  });
};
```

#### Step 3: Create Login Form Component

**`src/components/auth/LoginForm.tsx`:**
```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/queries/auth.queries";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password too short"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { mutate: login, isPending } = useLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: (response) => {
        setUser(response.data.user);
        toast.success("Login successful");
        navigate("/");
      },
      onError: () => {
        toast.error("Login failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Email"
          {...register("email")}
          type="email"
        />
        {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
      </div>
      
      <div>
        <Input
          placeholder="Password"
          {...register("password")}
          type="password"
        />
        {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
      </div>
      
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
```

#### Step 4: Create Register Form Component

**`src/components/auth/RegisterForm.tsx`:**
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegister } from "@/lib/queries/auth.queries";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number")
    .regex(/[^A-Za-z0-9]/, "Must contain special character"),
  role: z.enum(["USER", "DSA", "EMPLOYEE"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();
  
  const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "USER" },
  });

  const onSubmit = (data: RegisterForm) => {
    register(data, {
      onSuccess: () => {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      },
      onError: () => {
        toast.error("Registration failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Email"
          {...formRegister("email")}
          type="email"
        />
        {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
      </div>
      
      <div>
        <Input
          placeholder="Password"
          {...formRegister("password")}
          type="password"
        />
        {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <Select defaultValue="USER" onValueChange={(value) => {
          formRegister("role").onChange({ target: { value } });
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">Customer</SelectItem>
            <SelectItem value="DSA">Legal Expert (DSA)</SelectItem>
            <SelectItem value="EMPLOYEE">Employee</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-error text-sm">{errors.role.message}</p>}
      </div>
      
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
```

#### Step 5: Create OTP Verification Component

**`src/components/auth/OTPVerification.tsx`:**
```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyOtp, useSendOtp } from "@/lib/queries/auth.queries";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpForm = z.infer<typeof otpSchema>;

interface OTPVerificationProps {
  email: string;
  onSuccess: () => void;
}

export function OTPVerification({ email, onSuccess }: OTPVerificationProps) {
  const [step, setStep] = useState<"send" | "verify">("send");
  const [timer, setTimer] = useState(0);
  
  const { mutate: sendOtp, isPending: isSending } = useSendOtp();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  
  const { register, handleSubmit, formState: { errors } } = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email },
  });

  const handleSendOtp = () => {
    sendOtp(email, {
      onSuccess: () => {
        toast.success("OTP sent to your email");
        setStep("verify");
        setTimer(300); // 5 minutes
      },
      onError: () => {
        toast.error("Failed to send OTP");
      },
    });
  };

  const onSubmit = (data: OtpForm) => {
    verifyOtp(data, {
      onSuccess: () => {
        toast.success("Email verified!");
        onSuccess();
      },
      onError: () => {
        toast.error("Invalid OTP");
      },
    });
  };

  return (
    <div className="space-y-4">
      {step === "send" ? (
        <Button onClick={handleSendOtp} disabled={isSending} className="w-full">
          {isSending ? "Sending..." : "Send OTP"}
        </Button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Enter 6-digit OTP"
              {...register("otp")}
              maxLength={6}
            />
            {errors.otp && <p className="text-error text-sm">{errors.otp.message}</p>}
          </div>
          
          <Button type="submit" disabled={isVerifying} className="w-full">
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center text-sm text-gray-500">
            {timer > 0 && `Resend OTP in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`}
          </div>
        </form>
      )}
    </div>
  );
}
```

#### Step 6: Create Protected Route Component

**`src/components/auth/ProtectedRoute.tsx`:**
```typescript
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Role } from "@/types";
import { Loading } from "@/components/shared/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role as Role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
```

#### Step 7: Create Auth Pages

**`src/pages/auth/LoginPage.tsx`:**
```typescript
import { LoginForm } from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <LoginForm />
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-secondary">Register</Link>
        </p>
      </Card>
    </div>
  );
}
```

**`src/pages/auth/RegisterPage.tsx`:**
```typescript
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        <RegisterForm />
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-secondary">Login</Link>
        </p>
      </Card>
    </div>
  );
}
```

#### Step 8: Create Header/Navigation Component

**`src/components/layout/Header.tsx`:**
```typescript
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/lib/queries/auth.queries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User } from "lucide-react";
import { toast } from "sonner";

export function Header() {
  const navigate = useNavigate();
  const { user, logout: logoutStore } = useAuthStore();
  const { mutate: logout } = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        logoutStore();
        toast.success("Logged out");
        navigate("/");
      },
    });
  };

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl text-secondary">
          Dhanseva
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/services" className="text-gray-600 hover:text-secondary">
            Services
          </Link>
          
          {!user ? (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <User className="w-4 h-4 mr-2" />
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-requests">My Requests</Link>
                </DropdownMenuItem>
                
                {user.role === "DSA" && (
                  <DropdownMenuItem asChild>
                    <Link to="/dsa/dashboard">DSA Dashboard</Link>
                  </DropdownMenuItem>
                )}
                
                {user.role === "EMPLOYEE" && (
                  <DropdownMenuItem asChild>
                    <Link to="/employee/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Content */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-50 px-4 py-4 space-y-2">
          <Link to="/services" className="block py-2">Services</Link>
          {!user ? (
            <>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <>
              <Link to="/profile" className="block py-2">Profile</Link>
              <Link to="/my-requests" className="block py-2">My Requests</Link>
              {user.role === "DSA" && (
                <Link to="/dsa/dashboard" className="block py-2">DSA Dashboard</Link>
              )}
              {user.role === "EMPLOYEE" && (
                <Link to="/employee/dashboard" className="block py-2">Dashboard</Link>
              )}
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
```

#### Step 9: Create App.tsx with Routing

**`src/App.tsx`:**
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useCurrentUser } from "@/lib/queries/auth.queries";
import { useAuthStore } from "@/store/authStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Loading } from "@/components/shared/Loading";

// Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { HomePage } from "@/pages/public/HomePage";
import { ServicesPage } from "@/pages/public/ServicesPage";
import { NotFound } from "@/pages/error/NotFound";

export default function App() {
  const { data: user, isLoading } = useCurrentUser();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div>Profile Page - Coming Soon</div>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
```

### Deliverables
- ✅ Auth store (Zustand) created
- ✅ React Query hooks for auth
- ✅ Login form with validation
- ✅ Register form with role selection
- ✅ OTP verification component
- ✅ Protected routes
- ✅ Header/navigation with auth state
- ✅ Auth pages (login, register)
- ✅ Basic routing structure

**Status:** Ready for Phase 2

---

## **PHASE 2: SERVICES MODULE**

### Objectives
- Display all services
- Filter by category
- Show service details
- Service category badges

### Implementation Steps

#### Step 1: Create Services Query Hook

**`src/lib/queries/services.queries.ts`:**
```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Service, ServiceCategory } from "@/types";

export const useServices = (page = 1, limit = 10, category?: ServiceCategory) => {
  return useQuery({
    queryKey: ["services", page, limit, category],
    queryFn: async () => {
      const response = await apiClient.get("/services", {
        params: {
          page,
          limit,
          ...(category && { category }),
        },
      });
      return response.data.data;
    },
  });
};

export const useServiceById = (id: string) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      const response = await apiClient.get(`/services/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};
```

#### Step 2: Create Service Card Component

**`src/components/services/ServiceCard.tsx`:**
```typescript
import { Service } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition">
      <div className="p-6 flex-1">
        <Badge className="mb-3" variant="secondary">
          {service.category.replace(/_/g, " ")}
        </Badge>
        
        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        
        <div className="mt-auto pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-secondary">
              ₹{service.price}
            </span>
            <Button asChild size="sm">
              <Link to={`/services/${service.id}`}>
                View <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

#### Step 3: Create Service Filter Component

**`src/components/services/ServiceFilter.tsx`:**
```typescript
import { ServiceCategory } from "@/types";
import { Button } from "@/components/ui/button";

const categories = [
  { value: undefined, label: "All Services" },
  { value: ServiceCategory.PERSONAL_LEGAL, label: "Personal Legal" },
  { value: ServiceCategory.BUSINESS_LEGAL, label: "Business Legal" },
  { value: ServiceCategory.FINANCIAL_LEGAL, label: "Financial Legal" },
  { value: ServiceCategory.GOVT_LEGAL, label: "Government Legal" },
  { value: ServiceCategory.SPECIALIZED_LEGAL, label: "Specialized Legal" },
];

interface ServiceFilterProps {
  selectedCategory?: ServiceCategory;
  onCategoryChange: (category?: ServiceCategory) => void;
}

export function ServiceFilter({ selectedCategory, onCategoryChange }: ServiceFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <Button
          key={cat.value || "all"}
          variant={selectedCategory === cat.value ? "default" : "outline"}
          onClick={() => onCategoryChange(cat.value)}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
```

#### Step 4: Create Services Page

**`src/pages/public/ServicesPage.tsx`:**
```typescript
import { useState } from "react";
import { useServices } from "@/lib/queries/services.queries";
import { ServiceCategory } from "@/types";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFilter } from "@/components/services/ServiceFilter";
import { Loading } from "@/components/shared/Loading";
import { EmptyState } from "@/components/shared/EmptyState";

export function ServicesPage() {
  const [category, setCategory] = useState<ServiceCategory>();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useServices(page, 12, category);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-8 text-error">Failed to load services</div>;
  if (!data?.data?.length) return <EmptyState title="No services found" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Legal Services</h1>
      
      <ServiceFilter selectedCategory={category} onCategoryChange={setCategory} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((service: any) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Pagination */}
      {data.pagination && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            disabled={!data.pagination.hasPrevious}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {data.pagination.totalPages}
          </span>
          <button
            disabled={!data.pagination.hasNext}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

### Deliverables
- ✅ Services query hook
- ✅ Service card component
- ✅ Service filter by category
- ✅ Services listing page
- ✅ Pagination support

**Status:** Ready for Phase 3

---

## **PHASE 3: SERVICE REQUESTS MODULE (USER)**

### Objectives
- Create service requests
- View user's requests
- Request detail page
- Status tracking
- Form handling for 5 service types

### Implementation Steps

#### Step 1: Create Request Schemas

**`src/schemas/request.schema.ts`:**
```typescript
import { z } from "zod";

// Base form schema
export const baseFormSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone"),
  whatsapp: z.string().regex(/^[0-9]{10}$/, "Invalid whatsapp"),
  address: z.string().min(5, "Enter full address"),
  state: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid pincode"),
  aadhaarFrontUrl: z.string().optional(),
  aadhaarBackUrl: z.string().optional(),
  panFrontUrl: z.string().optional(),
  panBackUrl: z.string().optional(),
});

// Personal Legal extension
export const personalLegalSchema = baseFormSchema.extend({
  employmentStatus: z.enum(["SALARIED", "SELF_EMPLOYED", "BUSINESS", "UNEMPLOYED"]),
  purposeDescription: z.string().min(10, "Describe the purpose"),
});

// Business Legal extension
export const businessLegalSchema = baseFormSchema.extend({
  businessName: z.string().min(1, "Required"),
  businessType: z.enum(["PARTNERSHIP", "PRIVATE_LIMITED", "PUBLIC_LIMITED", "SOLE_PROPRIETOR"]),
  registrationNumber: z.string().optional(),
  partnersCount: z.number().min(1),
});

// Financial Legal extension
export const financialLegalSchema = baseFormSchema.extend({
  bankName: z.string().min(1, "Required"),
  accountHolder: z.string().min(1, "Required"),
  loanAmount: z.number().min(1),
  loanType: z.enum(["HOME", "AUTO", "PERSONAL", "BUSINESS", "EDUCATION"]),
});

// Govt Legal extension
export const govtLegalSchema = baseFormSchema.extend({
  departmentName: z.string().min(1, "Required"),
  applicationPurpose: z.string().min(10, "Describe purpose"),
  stateJurisdiction: z.string().min(1, "Required"),
});

// Specialized Legal extension
export const specializedSchema = baseFormSchema.extend({
  urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  consultationType: z.string().min(1, "Required"),
});
```

#### Step 2: Create Request Queries

**`src/lib/queries/requests.queries.ts`:**
```typescript
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

export const useCreateRequest = () => {
  return useMutation({
    mutationFn: async (data: {
      serviceId: string;
      formData: Record<string, any>;
    }) => {
      const response = await apiClient.post("/requests", data);
      return response.data.data;
    },
  });
};

export const useMyRequests = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["myRequests", page, limit],
    queryFn: async () => {
      const response = await apiClient.get("/my-requests", {
        params: { page, limit },
      });
      return response.data.data;
    },
  });
};

export const useRequestById = (id: string) => {
  return useQuery({
    queryKey: ["request", id],
    queryFn: async () => {
      const response = await apiClient.get(`/requests/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useUpdateRequest = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(`/requests/${id}`, { status });
      return response.data.data;
    },
  });
};
```

#### Step 3: Create Base Form Fields Component

**`src/components/requests/forms/BaseFormFields.tsx`:**
```typescript
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentUploader } from "@/components/upload/DocumentUploader";
import { UseFormReturn } from "react-hook-form";

const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", /* ... more states */];

interface BaseFormFieldsProps {
  form: UseFormReturn<any>;
}

export function BaseFormFields({ form }: BaseFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="10-digit number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="10-digit number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input placeholder="6-digit pincode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-4">Document Upload (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentUploader
            label="Aadhaar Front"
            onUpload={(url) => form.setValue("aadhaarFrontUrl", url)}
          />
          <DocumentUploader
            label="Aadhaar Back"
            onUpload={(url) => form.setValue("aadhaarBackUrl", url)}
          />
          <DocumentUploader
            label="PAN Front"
            onUpload={(url) => form.setValue("panFrontUrl", url)}
          />
          <DocumentUploader
            label="PAN Back"
            onUpload={(url) => form.setValue("panBackUrl", url)}
          />
        </div>
      </div>
    </div>
  );
}
