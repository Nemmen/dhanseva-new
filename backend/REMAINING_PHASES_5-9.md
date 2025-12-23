# REMAINING PHASES 5-9 - FRONTEND IMPLEMENTATION GUIDE

## 📋 Overview

This document outlines Phases 5 through 9 of the Dhanseva frontend implementation. These phases focus on file uploads, DSA dashboard, employee dashboard, shared components, and complete routing setup.

---

## **PHASE 5: FILE UPLOAD COMPONENT**

### Objectives

- Create document uploader with drag-drop
- Validate file types and size
- Show preview and remove options
- Integration with UploadThing

### Key Files

- `src/components/upload/DocumentUploader.tsx` - Main upload component
- `src/lib/uploadthing/uploadthing.ts` - UploadThing configuration
- `src/components/upload/DocumentPreview.tsx` - Preview display

### Features

- Drag-and-drop interface
- PDF/JPG/PNG validation
- 10MB file size limit
- Preview thumbnails
- Remove functionality
- Progress indicators

### Deliverables

- ✅ Document uploader component
- ✅ File validation
- ✅ UploadThing integration
- ✅ Preview functionality
- ✅ Error handling

---

## **PHASE 6: DSA DASHBOARD**

### Objectives

- Create DSA-exclusive dashboard
- Display assigned requests
- Filter by status
- Track earnings
- Export to CSV
- Dashboard analytics

### Key Components

- `src/components/dsa/DsaRequestCard.tsx` - Request card display
- `src/components/dsa/DsaRequestList.tsx` - Filtered list
- `src/components/dsa/DsaStatsCard.tsx` - Analytics cards
- `src/components/dsa/ExportButton.tsx` - CSV export

### Key Pages

- `src/pages/dsa/DsaDashboard.tsx` - Main dashboard with stats
- `src/pages/dsa/DsaRequestsPage.tsx` - Requests with filters
- `src/pages/dsa/DsaProfilePage.tsx` - DSA profile view
- `src/pages/dsa/DsaEarningsPage.tsx` - Earnings tracking

### Query Hooks

```typescript
- useDsaRequests(page, limit, status, sort)
- useUpdateDsaRequest(requestId, status)
- useDsaExport() - Download CSV
- useDsaStats()
```

### Features

- Request status filtering (ASSIGNED, IN_PROGRESS, COMPLETED, ON_HOLD)
- Earnings calculation and display
- CSV export functionality
- Request assignment details
- Performance metrics
- Dashboard layout with sidebar

### Deliverables

- ✅ DSA dashboard with statistics
- ✅ Request management interface
- ✅ Status filtering and sorting
- ✅ CSV export capability
- ✅ Earnings tracking
- ✅ Dashboard layout

---

## **PHASE 7: EMPLOYEE DASHBOARD**

### Objectives

- Create employee-exclusive dashboard
- Manage all platform requests
- Assign DSA to requests
- Invite new DSA members
- Analytics and reporting

### Key Components

- `src/components/employee/EmployeeRequestTable.tsx` - All requests table
- `src/components/employee/DsaAssignmentModal.tsx` - Assign modal
- `src/components/employee/DsaInviteForm.tsx` - DSA invitation
- `src/components/employee/AnalyticsCard.tsx` - Stats display

### Key Pages

- `src/pages/employee/EmployeeDashboard.tsx` - Main dashboard
- `src/pages/employee/AllRequestsPage.tsx` - Requests table
- `src/pages/employee/DsaManagementPage.tsx` - Invite & manage DSAs
- `src/pages/employee/AnalyticsPage.tsx` - Platform analytics
- `src/pages/employee/AuditLogsPage.tsx` - Activity logs

### Query Hooks

```typescript
-useEmployeeRequests(page, limit, filters) -
  useAssignDsa(requestId, dsaId) -
  useInviteDsa(email, regions) -
  useUpdateEmployeeRequest(requestId, status) -
  useEmployeeAnalytics();
```

### Features

- View all platform requests in table format
- Assign available DSAs to requests
- Send DSA invitations with region-specific access
- Platform-wide analytics dashboard
- Audit trail of all actions
- Revenue tracking
- Performance metrics

### Deliverables

- ✅ Employee dashboard
- ✅ Request management table
- ✅ DSA assignment system
- ✅ DSA invitation system
- ✅ Analytics dashboard
- ✅ Audit logs

---

## **PHASE 8: SHARED COMPONENTS & UTILITIES**

### Objectives

- Create reusable components
- Utility functions for formatting
- Validation helpers
- Custom hooks
- Constants and configurations

### Shared Components (8)

1. **`src/components/shared/Loading.tsx`**

   - Loading skeleton or spinner
   - Consistent loading state

2. **`src/components/shared/EmptyState.tsx`**

   - Empty state display
   - Helpful messaging

3. **`src/components/shared/ErrorBoundary.tsx`**

   - Error boundary wrapper
   - Error recovery

4. **`src/components/shared/ConfirmDialog.tsx`**

   - Confirmation dialog
   - Delete/action confirmation

5. **`src/components/shared/Sidebar.tsx`**

   - Navigation sidebar
   - Role-based menu items

6. **`src/components/shared/Footer.tsx`**

   - Footer component
   - Links and branding

7. **`src/components/shared/SearchBar.tsx`**

   - Search functionality
   - Debounced input

8. **`src/components/shared/NotificationBell.tsx`**
   - Notification indicator
   - Activity feed preview

### Utility Functions (4 files)

1. **`src/lib/utils/formatters.ts`**

   ```typescript
   - formatPrice(amount) -> "₹99"
   - formatDate(date) -> "21 Dec 2024"
   - formatDateTime(date) -> "21 Dec 2024 10:30 AM"
   - formatPhoneNumber(phone) -> "XXXXX-XXXXX"
   ```

2. **`src/lib/utils/validators.ts`**

   ```typescript
   - isValidEmail(email) -> boolean
   - isValidPhone(phone) -> boolean
   - isValidPincode(pincode) -> boolean
   - isValidUrl(url) -> boolean
   ```

3. **`src/lib/utils/constants.ts`**

   ```typescript
   - STATES (28 Indian states)
   - SERVICE_CATEGORIES
   - REQUEST_STATUS_LABELS
   - PAYMENT_STATUS
   - USER_ROLES
   ```

4. **`src/lib/utils/cn.ts`**
   - Class name utility function
   - shadcn/ui integration

### Custom Hooks (3)

1. **`src/lib/hooks/useAuth.ts`**

   - Access auth store
   - Simplified auth state

2. **`src/lib/hooks/useDebounce.ts`**

   - Debounce input values
   - Search optimization

3. **`src/lib/hooks/useLocalStorage.ts`**
   - Persist state to localStorage
   - Sync with state

### Deliverables

- ✅ 8 Reusable shared components
- ✅ 4 Utility files (formatters, validators, constants, cn)
- ✅ 3 Custom hooks (auth, debounce, localStorage)
- ✅ Consistent error handling
- ✅ Loading and empty states

---

## **PHASE 9: COMPLETE ROUTING & APP SETUP**

### Objectives

- Set up complete routing structure
- Configure React Query client
- Implement role-based access control
- Create main pages
- Error page handling

### Main Files

**`src/App.tsx`** - Main router setup

```typescript
- Public routes: /, /services, /contact
- Auth routes: /login, /register, /verify-otp
- User routes: /profile, /my-requests, /requests/:id, /create-request/:serviceId
- DSA routes: /dsa/dashboard, /dsa/requests, /dsa/profile
- Employee routes: /employee/dashboard, /employee/requests, /employee/dsa-management
- Error routes: 404, unauthorized
```

**`src/lib/queryClient.ts`** - React Query configuration

```typescript
- 5 minute stale time
- 30 minute cache time
- Retry logic (3 retries)
- Error handling
```

### Route Structure

```
Public Routes:
├── / (HomePage)
├── /services (ServicesPage)
├── /login (LoginPage)
├── /register (RegisterPage)
└── /contact (ContactPage)

User Routes (Protected):
├── /profile (ProfilePage)
├── /my-requests (MyRequestsPage)
├── /requests/:id (RequestDetailPage)
└── /create-request/:serviceId (CreateRequestPage)

DSA Routes (Protected + Role):
├── /dsa/dashboard (DsaDashboard)
├── /dsa/requests (DsaRequestsPage)
├── /dsa/requests/:id (DsaRequestDetailPage)
├── /dsa/profile (DsaProfilePage)
└── /dsa/earnings (DsaEarningsPage)

Employee Routes (Protected + Role):
├── /employee/dashboard (EmployeeDashboard)
├── /employee/requests (AllRequestsPage)
├── /employee/dsa-management (DsaManagementPage)
├── /employee/analytics (AnalyticsPage)
└── /employee/audit-logs (AuditLogsPage)

Error Routes:
├── /404 (NotFoundPage)
└── /unauthorized (UnauthorizedPage)
```

### Key Pages

1. **`src/pages/public/HomePage.tsx`**

   - Landing page
   - Hero section
   - Feature highlights

2. **`src/pages/error/NotFound.tsx`**

   - 404 page
   - Navigation help

3. **`src/pages/error/UnauthorizedPage.tsx`**
   - 401/403 page
   - Access denied message

### Features

- Role-based route protection
- Automatic redirects for unauthorized access
- Loading states during auth check
- Error boundaries on routes
- Query client persistence
- Automatic token refresh on 401

### Deliverables

- ✅ Complete routing structure
- ✅ Role-based access control
- ✅ Protected routes
- ✅ React Query client configuration
- ✅ Error page handling
- ✅ Loading states
- ✅ Main pages (home, error pages)

---

## 📊 IMPLEMENTATION CHECKLIST

### Phase 5: File Upload

- [ ] Create DocumentUploader component
- [ ] Set up UploadThing integration
- [ ] Add file validation
- [ ] Create preview component
- [ ] Test drag-drop functionality
- [ ] Add error handling

### Phase 6: DSA Dashboard

- [ ] Create DSA request card
- [ ] Build request list with filtering
- [ ] Create stats cards
- [ ] Implement CSV export
- [ ] Build dashboard layout
- [ ] Add earnings calculation
- [ ] Test status filtering

### Phase 7: Employee Dashboard

- [ ] Create request table
- [ ] Build DSA assignment modal
- [ ] Create DSA invite form
- [ ] Build analytics cards
- [ ] Implement all employee pages
- [ ] Add audit logging
- [ ] Test dashboard features

### Phase 8: Shared Components

- [ ] Create 8 shared components
- [ ] Write utility functions
- [ ] Create constants file
- [ ] Build custom hooks
- [ ] Add error boundaries
- [ ] Test component reusability

### Phase 9: Routing & Setup

- [ ] Configure App.tsx router
- [ ] Set up React Query client
- [ ] Create all page files
- [ ] Implement role-based guards
- [ ] Add error pages
- [ ] Test all routes
- [ ] Verify auth flow

---

## 🔗 INTEGRATION POINTS

### Phase 5 Integration

- Used in Phase 3 (Request forms)
- Used in Phase 6 & 7 (Document management)

### Phase 6 Integration

- Uses Phase 1 (Auth context)
- Uses Phase 4 (Payment status)
- Displayed in Phase 9 (Routing)

### Phase 7 Integration

- Uses Phase 6 (DSA data)
- Uses Phase 1 (Auth)
- Displayed in Phase 9 (Routing)

### Phase 8 Integration

- Used in all phases
- Components shared across entire app
- Utilities used everywhere

### Phase 9 Integration

- Brings all phases together
- Sets up complete routing
- Configures data fetching

---

## 📈 TIMELINE

- **Phase 5**: 2-3 days (File upload integration)
- **Phase 6**: 3-4 days (DSA dashboard features)
- **Phase 7**: 4-5 days (Employee dashboard, analytics)
- **Phase 8**: 2-3 days (Components & utilities)
- **Phase 9**: 2-3 days (Routing setup)

**Total: 13-18 days** for complete frontend

---

## ✅ VALIDATION & TESTING

### Phase 5

- [ ] Upload files successfully
- [ ] Validate file types
- [ ] Check file size limits
- [ ] Test preview display
- [ ] Verify removal

### Phase 6

- [ ] Load requests correctly
- [ ] Filter by status works
- [ ] Export CSV downloads
- [ ] Stats calculate correctly
- [ ] Pagination works

### Phase 7

- [ ] View all requests
- [ ] Assign DSAs successfully
- [ ] Send invitations
- [ ] Analytics load correctly
- [ ] Audit logs record actions

### Phase 8

- [ ] Components render properly
- [ ] Utilities format data correctly
- [ ] Hooks work in components
- [ ] Constants are accessible
- [ ] Error boundaries catch errors

### Phase 9

- [ ] All routes accessible
- [ ] Protected routes work
- [ ] Auth redirects properly
- [ ] Role-based access enforced
- [ ] Error pages display

---

## 🎯 NEXT STEPS

1. **Complete Phase 3 & 4**: Use PHASE_3_4_COMPLETION.md
2. **Implement Phase 5**: File upload with validation
3. **Build Phase 6**: DSA dashboard and management
4. **Create Phase 7**: Employee dashboard and controls
5. **Add Phase 8**: Shared components and utilities
6. **Setup Phase 9**: Complete routing and app initialization

---

**Documentation Complete!** Ready for phase-by-phase implementation.
