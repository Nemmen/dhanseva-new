# 🎯 Implementation Roadmap - Remaining Work

## ✅ Completed (Foundation - 40%)

### Core Infrastructure

- ✅ Project setup and configuration
- ✅ TypeScript, TailwindCSS, Next.js 14
- ✅ Package.json with all dependencies
- ✅ Environment variables configured
- ✅ Global layout and styling
- ✅ Middleware for route protection

### API Integration Layer

- ✅ Axios client with interceptors
- ✅ Auth service (register, login, logout)
- ✅ OTP service (send, verify)
- ✅ Service service (getAll, getById)
- ✅ Request service (create, getMyRequests, update)
- ✅ Payment service (createOrder, verifyPayment)

### State Management

- ✅ AuthContext with React Context
- ✅ React Query setup for server state
- ✅ Custom hooks (useAuth, useServices, useRequests, usePayment)
- ✅ useAuthGuard hooks for route protection

### Type Definitions

- ✅ Auth types (User, Role, LoginData, RegisterData)
- ✅ Service types (Service, ServiceCategory)
- ✅ Request types (ServiceRequest, RequestStatus, FormData)
- ✅ Payment types (Payment, RazorpayOrder, PaymentVerification)

### Validation Schemas

- ✅ Auth schemas (register, login, OTP)
- ✅ Service application schemas (base form + extensions)
- ✅ Indian states, employment options, business types

### UI Components

- ✅ Header with navigation and auth state
- ✅ Footer with links and company info
- ✅ MainLayout wrapper
- ✅ ServiceCard component
- ✅ QueryProvider for React Query

### Pages

- ✅ Homepage with hero, stats, services grid, CTA
- ✅ Root layout with providers

---

## 🔶 Remaining Work (60%)

### PHASE 2: Authentication Pages (Priority 1) - Estimated: 4-6 hours

#### Files to Create:

**1. Login Page** (`app/(auth)/login/page.tsx`)

```typescript
- Form with email and password
- Remember me checkbox
- Link to register
- Form validation with Zod
- Error handling
- Redirect after successful login
- "Forgot password" link (future)
```

**2. Register Page** (`app/(auth)/register/page.tsx`)

```typescript
- Email, password, confirm password fields
- Role selection (USER by default, DSA link separate)
- Terms & conditions checkbox
- Form validation
- Submit → OTP verification flow
- Link to login
```

**3. OTP Verification** (`app/(auth)/verify-email/page.tsx`)

```typescript
- 6-digit OTP input
- Resend OTP button with timer
- Auto-submit on 6 digits
- Error handling
- Success → Login or redirect
```

**4. Auth Components**

```typescript
components/auth/
├── LoginForm.tsx       - Reusable login form
├── RegisterForm.tsx    - Reusable register form
├── OTPInput.tsx        - 6-digit OTP input component
└── AuthLayout.tsx      - Layout for auth pages
```

**Implementation Priority:**

1. Create AuthLayout
2. Implement LoginForm component
3. Create login page
4. Implement RegisterForm component
5. Create register page
6. Create OTP input component
7. Create verify-email page
8. Test complete flow: Register → OTP → Login

**Testing Checklist:**

- [ ] Register new user
- [ ] Receive OTP email
- [ ] Verify OTP
- [ ] Login with credentials
- [ ] Session persists on refresh
- [ ] Logout works
- [ ] Invalid credentials rejected
- [ ] Validation errors show correctly

---

### PHASE 3: Services Pages (Priority 2) - Estimated: 3-4 hours

#### Files to Create:

**1. Services List** (`app/services/page.tsx`)

```typescript
- Grid of all services
- Category filter sidebar/tabs
- Search functionality
- Pagination
- Sort options (name, category)
- Loading states
- Empty state
```

**2. Service Detail** (`app/services/[serviceId]/page.tsx`)

```typescript
- Service name and description
- Price display (₹99)
- Required documents list
- "Apply Now" button
- Related services
- Breadcrumbs
- Auth check on Apply button
```

**3. Components**

```typescript
components/services/
├── ServiceGrid.tsx         - Grid layout for services
├── ServiceDetails.tsx      - Detailed view component
├── CategoryFilter.tsx      - Category filter sidebar
├── ServiceSearch.tsx       - Search bar
└── RelatedServices.tsx     - Related services section
```

**Implementation Priority:**

1. Create services list page with grid
2. Add category filter
3. Implement search
4. Create service detail page
5. Add "Apply Now" logic with auth check
6. Test navigation and filtering

**Testing Checklist:**

- [ ] All services load correctly
- [ ] Category filter works
- [ ] Search returns correct results
- [ ] Pagination works
- [ ] Service detail page loads
- [ ] Apply button redirects correctly
- [ ] Auth check works (logged in vs not)

---

### PHASE 4: Service Application Form (Priority 3) - Estimated: 8-10 hours

#### Files to Create:

**1. Application Form Page** (`app/apply/[serviceId]/page.tsx`)

```typescript
- Fetch service details
- Multi-section form (single page)
- Progress indicator
- Form validation
- File uploads
- Auto-save (optional)
- Submit → Redirect to payment
```

**2. Form Components**

```typescript
components/forms/
├── ServiceApplicationForm.tsx      - Main form container
├── PersonalDetailsSection.tsx      - Name, email, phone
├── ContactDetailsSection.tsx       - WhatsApp, address
├── EmploymentSection.tsx           - Employment details
├── BankDetailsSection.tsx          - Bank name, account holder
├── AddressSection.tsx              - Address, state, city, pincode
├── DocumentUploadSection.tsx       - Aadhaar, PAN uploads
├── ServiceSpecificSection.tsx      - Dynamic based on category
└── FormProgress.tsx                - Progress indicator
```

**3. Upload Component** (`components/forms/FileUpload.tsx`)

```typescript
- Drag & drop support
- File type validation (PDF, JPG, PNG)
- File size validation (max 10MB)
- Upload to UploadThing
- Preview uploaded files
- Remove file option
- Error handling
```

**Implementation Priority:**

1. Create form page structure
2. Implement PersonalDetailsSection
3. Implement ContactDetailsSection
4. Implement AddressSection
5. Create FileUpload component
6. Implement DocumentUploadSection
7. Create service-specific sections
8. Integrate UploadThing
9. Add form validation
10. Implement submit handler
11. Test complete flow

**Testing Checklist:**

- [ ] Form loads with correct fields
- [ ] Validation works on all fields
- [ ] File upload works
- [ ] File type validation
- [ ] File size validation
- [ ] Multiple file uploads
- [ ] Form submits successfully
- [ ] Loading states work
- [ ] Error handling works
- [ ] Redirect to payment after submit

---

### PHASE 5: Payment Integration (Priority 4) - Estimated: 4-6 hours

#### Files to Create:

**1. Payment Page** (`app/payment/[requestId]/page.tsx`)

```typescript
- Fetch request details
- Display service name and amount
- User info display
- "Pay Now" button
- Already paid check
- Razorpay integration
- Payment status handling
```

**2. Payment Success** (`app/payment/[requestId]/success/page.tsx`)

```typescript
- Success message
- Payment details
- Request ID
- "View Requests" button
- "Apply for another service" button
```

**3. Components**

```typescript
components/payment/
├── PaymentButton.tsx       - Razorpay integration button
├── PaymentSummary.tsx      - Amount breakdown
├── PaymentStatus.tsx       - Status indicator
└── RazorpayCheckout.tsx    - Razorpay wrapper
```

**Implementation Priority:**

1. Create payment page
2. Integrate Razorpay SDK
3. Implement payment button
4. Add payment verification
5. Create success page
6. Handle payment failures
7. Test payment flow

**Testing Checklist:**

- [ ] Payment page loads correctly
- [ ] Razorpay modal opens
- [ ] Test payment succeeds
- [ ] Payment verification works
- [ ] Success page displays
- [ ] Failed payment handling
- [ ] Already paid check works
- [ ] Retry payment works

---

### PHASE 6: User Request Pages (Priority 5) - Estimated: 4-6 hours

#### Files to Create:

**1. My Requests Page** (`app/my-requests/page.tsx`)

```typescript
- List all user requests
- Status filter (All, Unpaid, Paid, In Progress, Completed)
- Sort options
- Search by service
- Pagination
- "Pay Now" button for unpaid
- View details link
```

**2. Request Detail** (`app/my-requests/[requestId]/page.tsx`)

```typescript
- Full request information
- Service details
- Form data display
- Uploaded documents (view/download)
- Current status with timeline
- Payment status
- "Pay Now" button if unpaid
- Back to requests
```

**3. Components**

```typescript
components/requests/
├── RequestCard.tsx         - Single request card
├── RequestList.tsx         - List of requests
├── RequestDetails.tsx      - Detailed view
├── StatusBadge.tsx         - Status indicator
├── StatusTimeline.tsx      - Request timeline
└── RequestFilters.tsx      - Filter options
```

**Implementation Priority:**

1. Create my-requests page
2. Implement request list
3. Add filters and search
4. Create request detail page
5. Display form data
6. Show uploaded documents
7. Add pay button for unpaid
8. Test complete flow

**Testing Checklist:**

- [ ] All requests display
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Request details load
- [ ] Form data displays correctly
- [ ] Documents are viewable
- [ ] Pay button works for unpaid
- [ ] Status updates reflect
- [ ] Mobile responsive

---

### PHASE 7: User Profile (Priority 6) - Estimated: 2-3 hours

#### Files to Create:

**1. Profile Page** (`app/profile/page.tsx`)

```typescript
- User information display
- Email (read-only)
- Role badge
- Account created date
- Edit profile (future)
- Change password (future)
- Logout button
- Delete account (future)
```

**2. Components**

```typescript
components/profile/
├── ProfileHeader.tsx       - User avatar and name
├── ProfileInfo.tsx         - User details
└── ProfileActions.tsx      - Logout, edit buttons
```

**Implementation Priority:**

1. Create profile page
2. Display user info
3. Add logout button
4. Test profile page

**Testing Checklist:**

- [ ] Profile page loads
- [ ] User info displays correctly
- [ ] Logout works
- [ ] Redirect after logout

---

### PHASE 8: Static Pages (Priority 7) - Estimated: 4-6 hours

#### Files to Create:

**1. About Page** (`app/about/page.tsx`)

- Company information
- Mission and vision
- Team (future)
- Why choose us

**2. Contact Page** (`app/contact/page.tsx`)

- Contact form
- Email, phone, address
- Google Maps (optional)
- Social media links

**3. Terms & Conditions** (`app/terms/page.tsx`)

- Legal terms
- User agreement
- Service terms

**4. Privacy Policy** (`app/privacy/page.tsx`)

- Data collection
- Data usage
- Data protection
- Cookie policy

**5. Refund Policy** (`app/refund/page.tsx`)

- Refund conditions
- Refund process
- Processing time

**Implementation Priority:**

1. Create page templates
2. Add content
3. Style pages
4. Test navigation

---

## 📊 Progress Summary

| Phase                        | Status   | Priority | Estimated Time | Files to Create |
| ---------------------------- | -------- | -------- | -------------- | --------------- |
| ✅ Phase 1: Foundation       | Complete | -        | -              | 30+ files       |
| 🔶 Phase 2: Authentication   | Pending  | P1       | 4-6 hours      | 7 files         |
| 🔶 Phase 3: Services         | Pending  | P2       | 3-4 hours      | 7 files         |
| 🔶 Phase 4: Application Form | Pending  | P3       | 8-10 hours     | 10+ files       |
| 🔶 Phase 5: Payment          | Pending  | P4       | 4-6 hours      | 6 files         |
| 🔶 Phase 6: User Requests    | Pending  | P5       | 4-6 hours      | 8 files         |
| 🔶 Phase 7: Profile          | Pending  | P6       | 2-3 hours      | 4 files         |
| 🔶 Phase 8: Static Pages     | Pending  | P7       | 4-6 hours      | 5 files         |

**Total Remaining Time**: 29-41 hours
**Total Files to Create**: ~47 files

---

## 🎯 Recommended Development Order

1. **Week 1**: Authentication (Phase 2) + Services (Phase 3)
2. **Week 2**: Application Form (Phase 4) + Payment (Phase 5)
3. **Week 3**: User Requests (Phase 6) + Profile (Phase 7) + Static Pages (Phase 8)

---

## 📝 Notes for Implementation

### Code Quality Guidelines

- Use TypeScript strictly (no `any` types)
- Follow React best practices
- Use functional components
- Implement proper error boundaries
- Add loading states everywhere
- Handle edge cases

### Performance Optimization

- Use React Query for caching
- Implement pagination
- Lazy load components
- Optimize images
- Code splitting

### Accessibility

- Add ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

### Testing

- Test each phase before moving to next
- Cross-browser testing
- Mobile responsive testing
- API integration testing

---

**Last Updated**: December 22, 2025
**Current Status**: Foundation Complete (40%) | Ready for Phase 2
