🧠 LEGAL SERVICES PLATFORM — FRONTEND MASTER BUILD PROMPT (MDX)
ROLE:
You are a Senior Frontend Engineer building a complete production-ready frontend using Next.js (App Router).
BACKEND:
The backend already exists and is running on http://localhost:5000
All APIs, authentication, sessions, payments, uploads, and roles are implemented.
TASK:
Build the entire frontend application, phase-wise, consuming backend APIs exactly as defined, following best practices in routing, state management, security, error handling, and UX.
🧱 TECH STACK (STRICT)
Next.js 14+ (App Router)
TypeScript
TailwindCSS
shadcn/ui
UploadThing (frontend client)
Razorpay JS SDK
Axios (API client)
React Hook Form + Zod
Server Actions where appropriate
Session-based auth via httpOnly cookies
No client-side token storage
📁 FRONTEND FOLDER STRUCTURE
Copy code

frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── verify-email/
│   ├── services/
│   │   ├── page.tsx
│   │   └── [serviceId]/
│   │       └── page.tsx
│   ├── apply/
│   │   └── [serviceId]/
│   ├── payment/
│   │   └── [requestId]/
│   ├── my-requests/
│   ├── profile/
│   ├── dsa/
│   ├── employee/
│   └── api/ (only for frontend helpers if needed)
├── components/
├── lib/
├── hooks/
├── services/
├── schemas/
├── types/
├── styles/
└── middleware.ts
🔐 AUTH & SESSION HANDLING (GLOBAL RULES)
Authentication is session-based
Use credentials: 'include' on all API calls
Backend sets httpOnly cookies
Frontend must never access tokens directly
Use /auth/me (or equivalent) to fetch session user
🌍 GLOBAL APP SETUP
app/layout.tsx
Root layout
Tailwind styles
Global Error Boundary
Toast provider
Theme provider
middleware.ts
Role-based route protection:
/dsa/* → DSA only
/employee/* → Employee only
/apply/*, /payment/*, /my-requests → authenticated users
Redirect unauthenticated users to /login?redirect=...
🧩 PHASE-WISE FRONTEND IMPLEMENTATION
🟦 PHASE 1 — PUBLIC PAGES & SERVICE DISCOVERY
Pages
/ (Home)
/services
/services/[serviceId]
Behavior
Fetch services from backend
Display service cards
“Apply” button on each service
UX RULE
If user clicks Apply:
If not logged in → redirect to /login?redirect=/apply/[serviceId]
If logged in → go directly to form
🟦 PHASE 2 — AUTH + EMAIL OTP
Pages
/login
/register
/verify-email
Flow
User submits email + password
Backend sends OTP
User verifies OTP
Session created
Redirect back to intended page
Validation
Zod schemas
Error messages inline
OTP resend timer
🟦 PHASE 3 — SERVICE APPLICATION FORM (CORE UX)
Page
/apply/[serviceId]
Form Structure (Single Page)
Personal details
Contact details
Employment
Bank details
Address
Aadhaar (front/back upload)
PAN (front/back upload)
Upload
Use UploadThing
Validate file size/type client-side
Store returned URLs in form data
Submission
POST /requests
Status saved as UNPAID
Redirect to /payment/[requestId]
⚠️ User must not see that request is unpaid
🟦 PHASE 4 — PAYMENT FLOW (₹99)
Page
/payment/[requestId]
Flow
Fetch request details
Create Razorpay order
Open Razorpay checkout
On success → verify payment
Redirect to /my-requests
Rules
Disable payment if already paid
Handle retry safely
Show failure UI gracefully
🟦 PHASE 5 — USER PAGES (NO DASHBOARD)
Pages
/my-requests
/my-requests/[requestId]
/profile
Features
View all requests
Pay pending requests
View status
Logout
🟦 PHASE 6 — DSA FRONTEND
Registration
/dsa/register
₹299 Razorpay payment
OTP verification
Pages
/dsa/requests
/dsa/requests/[id]
Capabilities
Fill request for users
Edit form data
Update status
Export CSV
🟦 PHASE 7 — EMPLOYEE FRONTEND
Pages
/employee/requests
/employee/dsas
/employee/invite-dsa
Capabilities
View all requests
Assign to DSA (bulk/single)
Edit requests
Invite DSA via email link
Export data
Audit UI
Show “Edited by X on DATE”
🧠 API INTEGRATION RULES
Axios Client (lib/api.ts)
Base URL: http://localhost:5000
withCredentials: true
Global error interceptor
Redirect to login on 401
🧪 ERROR HANDLING STRATEGY
Global Error Boundary
Page-level Suspense + fallback
Graceful payment failure UI
Upload error retry
OTP error handling
🔐 SECURITY BEST PRACTICES
No secrets in frontend
No token storage
Role-based route guarding
Server-side redirects where possible
CSRF handled via cookies
Sanitize all form inputs
🎨 UI / UX GUIDELINES
Minimal navigation
Clean Paisabazaar-style flow
One-page forms
Progressive disclosure
Mobile-first
Accessibility (labels, aria)
🧪 FRONTEND TESTING (MANDATORY)
After each phase:
Manual test checklist
Form validation tests
Payment success/failure
Route protection
Upload limits
Session persistence

