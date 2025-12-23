# 📋 Complete API Reference - Legal Services Platform

## 🔐 AUTHENTICATION MODULE
**Base URL:** `/api/auth`

### 1. POST `/auth/register`
**Purpose:** Register a new user (USER, DSA, or EMPLOYEE)

**Request Body:**
```json
{
  "email": "client@example.com",
  "password": "SecurePass123!",
  "role": "USER"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "user-uuid-123",
    "email": "client@example.com",
    "role": "USER",
    "emailVerified": false,
    "createdAt": "2025-12-21T10:30:00Z"
  }
}
```

**Real-World Example:**
A customer in Mumbai wants to register for an Affidavit service. They provide email and password. The system creates their account with USER role and sends OTP verification.

**Rate Limit:** 5 requests per 15 minutes
**Validation:** Email uniqueness, password strength (min 8 chars, uppercase, number, special char)

---

### 2. POST `/auth/login`
**Purpose:** Authenticate user and create session

**Request Body:**
```json
{
  "email": "client@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user-uuid-123",
    "email": "client@example.com",
    "role": "USER",
    "emailVerified": true
  }
}
```

**Headers Set:**
```
Set-Cookie: sessionId=jwt-token-here; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
```

**Real-World Example:**
A user returns to the platform after 2 days to check their Will service request status. They login, and a secure httpOnly cookie is set for 30 days.

**Rate Limit:** 5 requests per 15 minutes
**Validation:** Email exists, password matches

---

### 3. POST `/auth/logout`
**Purpose:** Destroy session and clear authentication cookie

**Request:** No body required

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Headers Cleared:**
```
Set-Cookie: sessionId=; HttpOnly; Secure; SameSite=Strict; Max-Age=0
```

**Real-World Example:**
A user on a shared computer logs out from the platform to prevent others from accessing their legal requests.

**Rate Limit:** No limit
**Auth Required:** Yes

---

## 📱 OTP VERIFICATION MODULE
**Base URL:** `/api/otp`

### 4. POST `/otp/send`
**Purpose:** Generate and send OTP via email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully to user@example.com",
  "data": {
    "expiresIn": 300,
    "message": "OTP valid for 5 minutes"
  }
}
```

**Backend Action:**
- Generate 6-digit random code
- Store in Redis with 5-min TTL
- Send via Nodemailer to provided email

**Real-World Example:**
A DSA (Digital Service Associate) registers for the platform. They receive email:
```
Your OTP for Dhanseva is: 847362
Valid for 5 minutes only.
```

**Rate Limit:** 3 requests per 15 minutes per email
**Max Resends:** 5 per hour
**Storage:** Redis (auto-expire after 5 minutes)

---

### 5. POST `/otp/verify`
**Purpose:** Verify OTP and mark email as verified

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "847362"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "emailVerified": true,
    "verifiedAt": "2025-12-21T10:35:00Z"
  }
}
```

**Real-World Example:**
The DSA enters the OTP in the app and gets verified. Now they can proceed to fill service requests and access paid features.

**Rate Limit:** 5 requests per 15 minutes
**Validation:** OTP exists, not expired, matches email

---

## 🛠️ SERVICES MODULE (Read-Only)
**Base URL:** `/api/services`

### 6. GET `/services`
**Purpose:** List all active legal services

**Query Parameters:**
```
GET /api/services?page=1&limit=10&category=PERSONAL_LEGAL
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Services retrieved successfully",
  "data": [
    {
      "id": "service-uuid-1",
      "name": "Affidavit",
      "category": "PERSONAL_LEGAL",
      "description": "Legal affidavit for personal matters",
      "price": 99,
      "isActive": true
    },
    {
      "id": "service-uuid-2",
      "name": "Power of Attorney",
      "category": "PERSONAL_LEGAL",
      "description": "POA for property and financial matters",
      "price": 99,
      "isActive": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 18,
    "totalPages": 2,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

**Real-World Example:**
A user visits the platform homepage and sees all 18+ legal services available. The page loads with 10 services. They can navigate to page 2 for more.

**Rate Limit:** 100 requests per 15 minutes
**Cache:** 1 hour (HTTP ETag support)
**Auth Required:** No

---

### 7. GET `/services/:id`
**Purpose:** Get details of a specific service

**Request:**
```
GET /api/services/service-uuid-1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Service retrieved successfully",
  "data": {
    "id": "service-uuid-1",
    "name": "Affidavit",
    "category": "PERSONAL_LEGAL",
    "description": "Legal affidavit for personal, property, or financial matters",
    "price": 99,
    "isActive": true,
    "formSchema": {
      "base": {
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phone": "string",
        "address": "string",
        "state": "string",
        "city": "string",
        "pincode": "string"
      },
      "extension": {
        "employmentStatus": "string",
        "purposeDescription": "string"
      }
    }
  }
}
```

**Real-World Example:**
A user clicks on "Affidavit" service to see what information they need to provide. The response includes all form fields required for this service.

**Rate Limit:** 100 requests per 15 minutes
**Cache:** 1 hour
**Auth Required:** No

---

## 📋 SERVICE REQUESTS MODULE (Core)
**Base URL:** `/api/requests`

### 8. POST `/requests`
**Purpose:** Create a new unpaid service request

**Request Body:**
```json
{
  "serviceId": "service-uuid-1",
  "formData": {
    "base": {
      "firstName": "Rajesh",
      "lastName": "Kumar",
      "email": "rajesh@example.com",
      "phone": "+919876543210",
      "whatsapp": "+919876543210",
      "address": "123 MG Road",
      "state": "Karnataka",
      "city": "Bangalore",
      "pincode": "560001",
      "aadhaarFrontUrl": "https://uploadthing.com/aadhaar-front.pdf",
      "aadhaarBackUrl": "https://uploadthing.com/aadhaar-back.pdf",
      "panFrontUrl": "https://uploadthing.com/pan.pdf",
      "panBackUrl": null
    },
    "personal": {
      "employmentStatus": "SALARIED",
      "purposeDescription": "For bank loan application"
    }
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Service request created successfully",
  "data": {
    "id": "request-uuid-123",
    "serviceId": "service-uuid-1",
    "createdById": "user-uuid-123",
    "status": "UNPAID",
    "paid": false,
    "filledByDsaId": null,
    "createdAt": "2025-12-21T11:00:00Z",
    "formData": { ...submitted data }
  }
}
```

**Real-World Example:**
Rajesh Kumar from Bangalore fills out the Affidavit form with his details and uploads required documents. A request is created with status UNPAID. He hasn't paid yet.

**Rate Limit:** 20 requests per 15 minutes
**Auth Required:** Yes (USER or DSA)
**Validation:** Service exists, formData matches schema
**Duplicate Prevention:** Only 1 active UNPAID/ASSIGNED request per service per user

---

### 9. GET `/my-requests`
**Purpose:** Fetch all service requests of logged-in user

**Query Parameters:**
```
GET /api/my-requests?page=1&limit=10&status=UNPAID&serviceId=service-uuid-1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Requests retrieved successfully",
  "data": [
    {
      "id": "request-uuid-123",
      "serviceId": "service-uuid-1",
      "serviceName": "Affidavit",
      "status": "UNPAID",
      "paid": false,
      "filledByDsaId": null,
      "createdAt": "2025-12-21T11:00:00Z"
    },
    {
      "id": "request-uuid-456",
      "serviceId": "service-uuid-2",
      "serviceName": "Power of Attorney",
      "status": "ASSIGNED",
      "paid": true,
      "filledByDsaId": "dsa-uuid-789",
      "createdAt": "2025-12-20T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

**Real-World Example:**
Rajesh logs in and sees his 2 requests:
- 1 Affidavit (UNPAID) - just created, needs payment
- 1 POA (ASSIGNED) - already paid, DSA assigned

**Rate Limit:** 100 requests per 15 minutes
**Auth Required:** Yes
**Filters:** status, serviceId, dateRange

---

### 10. GET `/requests/:id`
**Purpose:** Get detailed information of a specific request

**Request:**
```
GET /api/requests/request-uuid-123
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Request retrieved successfully",
  "data": {
    "id": "request-uuid-123",
    "serviceId": "service-uuid-1",
    "serviceName": "Affidavit",
    "createdById": "user-uuid-123",
    "createdByEmail": "rajesh@example.com",
    "status": "UNPAID",
    "paid": false,
    "filledByDsaId": null,
    "createdAt": "2025-12-21T11:00:00Z",
    "updatedAt": "2025-12-21T11:00:00Z",
    "formData": {
      "base": { ...all fields },
      "personal": { ...all fields }
    },
    "nextAction": "Please proceed to payment to assign a DSA",
    "paymentLink": "https://razorpay.com/order/order_id_here"
  }
}
```

**Real-World Example:**
Rajesh clicks on his Affidavit request to see complete details including a payment link to proceed.

**Rate Limit:** 100 requests per 15 minutes
**Auth Required:** Yes (owner or EMPLOYEE/DSA with access)

---

### 11. PATCH `/requests/:id`
**Purpose:** Update request status (EMPLOYEE/DSA only)

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "notes": "Document review started"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Request updated successfully",
  "data": {
    "id": "request-uuid-123",
    "status": "IN_PROGRESS",
    "updatedAt": "2025-12-21T12:00:00Z",
    "updatedBy": "dsa-uuid-789",
    "notes": "Document review started"
  }
}
```

**Audit Log Created:**
```json
{
  "requestId": "request-uuid-123",
  "userId": "dsa-uuid-789",
  "action": "UPDATE_STATUS",
  "oldValue": "ASSIGNED",
  "newValue": "IN_PROGRESS",
  "timestamp": "2025-12-21T12:00:00Z"
}
```

**Real-World Example:**
A DSA assigned to Rajesh's affidavit request updates the status to IN_PROGRESS after starting document review. An audit log is automatically created.

**Rate Limit:** 50 requests per 15 minutes
**Auth Required:** Yes (EMPLOYEE or assigned DSA)
**Allowed Transitions:**
- UNPAID → ASSIGNED (EMPLOYEE only, after payment)
- ASSIGNED → IN_PROGRESS
- IN_PROGRESS → COMPLETED
- Any → ON_HOLD

---

## 💳 PAYMENT MODULE
**Base URL:** `/api/payments`

### 12. POST `/payments/create-order`
**Purpose:** Create Razorpay payment order

**Request Body:**
```json
{
  "requestId": "request-uuid-123",
  "amount": 99
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "orderId": "order_2NCYZ59UxEAzzd",
    "amount": 9900,
    "currency": "INR",
    "keyId": "rzp_test_Rr5VUBDcqjo2dh",
    "customerId": "user-uuid-123",
    "notes": {
      "requestId": "request-uuid-123",
      "service": "Affidavit"
    },
    "createdAt": "2025-12-21T11:30:00Z"
  }
}
```

**Frontend Integration (Next.js):**
```javascript
const response = await fetch('/api/payments/create-order', {
  method: 'POST',
  body: JSON.stringify({ requestId: 'request-uuid-123', amount: 99 })
});

const { data } = await response.json();

// Initialize Razorpay
const options = {
  key: data.keyId,
  amount: data.amount,
  currency: 'INR',
  name: 'Dhanseva Legal',
  order_id: data.orderId,
  handler: handlePaymentSuccess,
  prefill: {
    email: userEmail,
    contact: userPhone
  }
};

const rzp = new window.Razorpay(options);
rzp.open();
```

**Real-World Example:**
Rajesh clicks "Pay Now" on his ₹99 Affidavit request. Razorpay order is created, and the payment window opens on his phone.

**Rate Limit:** 10 requests per 15 minutes
**Auth Required:** Yes
**Validation:** Request exists, not already paid

---

### 13. POST `/payments/verify`
**Purpose:** Verify Razorpay payment signature and mark request as paid

**Request Body:**
```json
{
  "razorpay_order_id": "order_2NCYZ59UxEAzzd",
  "razorpay_payment_id": "pay_2NCZZ3mD2L7Ykj",
  "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment verified and request marked as paid",
  "data": {
    "requestId": "request-uuid-123",
    "paymentId": "pay_2NCZZ3mD2L7Ykj",
    "amount": 9900,
    "status": "PAID",
    "verifiedAt": "2025-12-21T11:35:00Z",
    "message": "DSA will be assigned within 24 hours"
  }
}
```

**Backend Actions:**
1. Verify Razorpay signature
2. Create Payment record in DB
3. Update ServiceRequest: paid = true, status = ASSIGNED
4. Send confirmation email to user
5. Notify employees to assign DSA

**Real-World Example:**
Razorpay payment succeeds. Signature is verified. Rajesh's request is marked PAID. He gets email: "Payment successful! A DSA will be assigned within 24 hours."

**Rate Limit:** 10 requests per 15 minutes
**Auth Required:** Yes
**Idempotency:** Same orderId verified twice returns success (no duplicate payment)
**Signature Validation:** HMAC-SHA256 with Razorpay secret key

---

## 📤 UPLOAD MODULE
**Base URL:** `/api/uploads`

### 14. POST `/uploads/document`
**Purpose:** Upload document files (Aadhaar, PAN, etc.)

**Request:** FormData
```
Content-Type: multipart/form-data

file: <binary file data>
documentType: AADHAAR_FRONT
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "url": "https://uploadthing-cdn.com/f/abc123-aadhaar-front.pdf",
    "fileKey": "abc123-aadhaar-front",
    "documentType": "AADHAAR_FRONT",
    "fileName": "aadhaar-front.pdf",
    "fileSize": 245600,
    "uploadedAt": "2025-12-21T11:40:00Z"
  }
}
```

**Real-World Example:**
Rajesh uploads his Aadhaar front photo. The file is sent to UploadThing CDN and a URL is returned for storing in the form.

**File Validation:**
- Allowed: PDF, JPG, PNG, JPEG
- Max Size: 10MB per file
- Max Total: 50MB per request

**Rate Limit:** 20 requests per hour
**Auth Required:** Yes
**Storage:** UploadThing (serverless CDN)

---

## 🤝 DSA (Digital Service Associate) MODULE
**Base URL:** `/api/dsa`

### 15. POST `/dsa/register`
**Purpose:** Register a new DSA (requires ₹299 one-time payment)

**Request Body:**
```json
{
  "email": "dsa@example.com",
  "password": "SecurePass456!",
  "firstName": "Arjun",
  "lastName": "Singh",
  "phone": "+919876543211",
  "city": "Delhi",
  "state": "Delhi",
  "experience": "5 years in legal services"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "DSA registration initiated",
  "data": {
    "id": "user-uuid-dsa",
    "email": "dsa@example.com",
    "role": "DSA",
    "profile": {
      "firstName": "Arjun",
      "lastName": "Singh",
      "phone": "+919876543211",
      "city": "Delhi"
    },
    "paymentRequired": true,
    "paymentAmount": 29900,
    "nextStep": "Complete payment to activate DSA account"
  }
}
```

**Real-World Example:**
Arjun wants to become a DSA on Dhanseva. He registers and gets instruction to pay ₹299 for account activation.

**Rate Limit:** 5 requests per 15 minutes
**Next Step:** DSA must verify OTP and complete ₹299 payment

---

### 16. GET `/dsa/requests`
**Purpose:** Fetch all requests assigned to logged-in DSA

**Query Parameters:**
```
GET /api/dsa/requests?page=1&limit=20&status=ASSIGNED&sortBy=createdAt
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "DSA requests retrieved successfully",
  "data": [
    {
      "id": "request-uuid-123",
      "serviceName": "Affidavit",
      "userName": "Rajesh Kumar",
      "userEmail": "rajesh@example.com",
      "userPhone": "+919876543210",
      "status": "ASSIGNED",
      "createdAt": "2025-12-21T11:00:00Z",
      "formSummary": {
        "purpose": "For bank loan application",
        "documents": 3
      }
    },
    {
      "id": "request-uuid-456",
      "serviceName": "Power of Attorney",
      "userName": "Priya Sharma",
      "userEmail": "priya@example.com",
      "userPhone": "+919876543212",
      "status": "IN_PROGRESS",
      "createdAt": "2025-12-20T14:30:00Z",
      "formSummary": {
        "partners": 2,
        "businessName": "Tech Solutions Pvt Ltd"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1,
    "hasNext": false
  },
  "summary": {
    "totalAssigned": 15,
    "inProgress": 8,
    "completed": 3,
    "onHold": 1
  }
}
```

**Real-World Example:**
Arjun logs in as DSA and sees all 15 requests assigned to him. He can filter by status or sort by date to prioritize work.

**Rate Limit:** 100 requests per 15 minutes
**Auth Required:** Yes (DSA only)

---

### 17. PATCH `/dsa/requests/:id`
**Purpose:** Update request status with notes

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "notes": "Affidavit drafted and under review",
  "estimatedCompletion": "2025-12-24"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Request updated successfully",
  "data": {
    "id": "request-uuid-123",
    "status": "IN_PROGRESS",
    "notes": "Affidavit drafted and under review",
    "estimatedCompletion": "2025-12-24",
    "updatedAt": "2025-12-21T12:00:00Z"
  }
}
```

**Email Sent to Customer:**
```
Subject: Update on your Affidavit Request

Hi Rajesh,

Your Affidavit request is now in progress. 
Our legal expert is reviewing your documents.
Expected completion: 24 Dec 2025

Best regards,
Dhanseva Legal
```

**Real-World Example:**
Arjun starts working on Rajesh's affidavit and updates the status to IN_PROGRESS. Rajesh automatically gets an email update.

**Rate Limit:** 50 requests per 15 minutes
**Auth Required:** Yes (assigned DSA or EMPLOYEE)

---

### 18. GET `/dsa/export`
**Purpose:** Export all DSA's completed requests as CSV

**Query Parameters:**
```
GET /api/dsa/export?format=csv&dateFrom=2025-12-01&dateTo=2025-12-31
```

**Response (200 OK):**
```
CSV File Download

id,serviceName,userName,userEmail,status,amount,completedAt,notes
request-123,Affidavit,Rajesh Kumar,rajesh@example.com,COMPLETED,9900,2025-12-23,Approved
request-456,POA,Priya Sharma,priya@example.com,COMPLETED,9900,2025-12-22,Approved
...
```

**Real-World Example:**
Arjun downloads a CSV report of all affidavits he completed in December for accounting purposes.

**Rate Limit:** 5 requests per hour
**Auth Required:** Yes (DSA only)
**Export Formats:** CSV, JSON

---

## 👨‍💼 EMPLOYEE MODULE
**Base URL:** `/api/employee`

### 19. GET `/employee/requests`
**Purpose:** Fetch all service requests (employees can see all)

**Query Parameters:**
```
GET /api/employee/requests?page=1&limit=25&status=UNPAID&assignedDsa=null&city=Bangalore
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All requests retrieved",
  "data": [
    {
      "id": "request-uuid-123",
      "serviceName": "Affidavit",
      "userName": "Rajesh Kumar",
      "userEmail": "rajesh@example.com",
      "userCity": "Bangalore",
      "status": "UNPAID",
      "paid": false,
      "filledByDsaId": null,
      "createdAt": "2025-12-21T11:00:00Z",
      "urgency": "NORMAL",
      "documents": 3
    },
    {
      "id": "request-uuid-789",
      "serviceName": "Will",
      "userName": "Ramesh Patel",
      "userEmail": "ramesh@example.com",
      "userCity": "Mumbai",
      "status": "ASSIGNED",
      "paid": true,
      "filledByDsaId": "dsa-uuid-456",
      "createdAt": "2025-12-20T09:30:00Z",
      "urgency": "HIGH",
      "documents": 4,
      "assignedDsa": {
        "name": "Priya Singh",
        "email": "priya.dsa@example.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 147,
    "totalPages": 6
  },
  "analytics": {
    "totalRequests": 147,
    "unpaid": 32,
    "assigned": 95,
    "inProgress": 15,
    "completed": 5
  }
}
```

**Real-World Example:**
An employee logs in and sees all 147 requests across India. They can filter by city, status, or DSA to manage workflow.

**Rate Limit:** 100 requests per 15 minutes
**Auth Required:** Yes (EMPLOYEE only)

---

### 20. POST `/employee/assign-dsa`
**Purpose:** Assign a DSA to an unpaid or unassigned request

**Request Body:**
```json
{
  "requestId": "request-uuid-123",
  "dsaId": "dsa-uuid-456",
  "assignmentNotes": "Assigned to Priya for Bangalore region"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "DSA assigned successfully",
  "data": {
    "requestId": "request-uuid-123",
    "dsaName": "Priya Singh",
    "dsaEmail": "priya.dsa@example.com",
    "status": "ASSIGNED",
    "assignedAt": "2025-12-21T13:00:00Z"
  }
}
```

**Emails Sent:**
```
To Rajesh:
Subject: Your Affidavit Request is Assigned
Your request has been assigned to Priya Singh, our experienced legal expert.
She will contact you within 24 hours.

To Priya:
Subject: New Request Assigned
You have a new Affidavit request from Rajesh Kumar in Bangalore.
```

**Real-World Example:**
An employee sees Rajesh's unpaid Affidavit request is from Bangalore. They assign it to Priya (DSA) who covers that region. Both get notified.

**Rate Limit:** 50 requests per 15 minutes
**Auth Required:** Yes (EMPLOYEE only)

---

### 21. POST `/employee/invite-dsa`
**Purpose:** Send DSA registration invite link (one-time, expires in 7 days)

**Request Body:**
```json
{
  "email": "newdsa@example.com",
  "firstName": "Vikram",
  "lastName": "Verma",
  "regions": ["Delhi", "NCR"],
  "message": "We need experienced legal professionals in your region"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Invite sent successfully",
  "data": {
    "inviteToken": "dsa-invite-abc123xyz789",
    "sentTo": "newdsa@example.com",
    "expiresAt": "2025-12-28T13:30:00Z",
    "registrationLink": "https://dhanseva.com/dsa/register?token=dsa-invite-abc123xyz789"
  }
}
```

**Email Sent to Newdsa:**
```
Subject: Join Dhanseva as a Legal Expert (DSA)

Hi Vikram,

We'd like to invite you to join our platform as a Digital Service Associate.
Register using this link (valid for 7 days):
https://dhanseva.com/dsa/register?token=dsa-invite-abc123xyz789

Regions: Delhi, NCR
Message: We need experienced legal professionals in your region

Best regards,
Dhanseva Team
```

**Real-World Example:**
An employee identifies talented legal professionals and sends them registration invites. The invite expires in 7 days for security.

**Rate Limit:** 20 requests per 15 minutes
**Auth Required:** Yes (EMPLOYEE only)

---

### 22. PATCH `/employee/requests/:id`
**Purpose:** Update request with audit log

**Request Body:**
```json
{
  "status": "COMPLETED",
  "notes": "Affidavit finalized and ready for delivery",
  "completionNotes": "All documents verified and signed by legal expert"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Request updated successfully",
  "data": {
    "id": "request-uuid-123",
    "status": "COMPLETED",
    "completedAt": "2025-12-23T10:00:00Z",
    "notes": "Affidavit finalized and ready for delivery"
  }
}
```

**Audit Log Created:**
```json
{
  "requestId": "request-uuid-123",
  "userId": "employee-uuid-001",
  "action": "UPDATE_STATUS",
  "oldValue": "IN_PROGRESS",
  "newValue": "COMPLETED",
  "changes": {
    "status": "COMPLETED",
    "notes": "Affidavit finalized and ready for delivery"
  },
  "timestamp": "2025-12-23T10:00:00Z",
  "ipAddress": "192.168.1.1"
}
```

**Email to Customer:**
```
Subject: Your Affidavit is Ready!

Hi Rajesh,

Great news! Your affidavit has been completed and is ready for delivery.

Service: Affidavit
Status: COMPLETED
Prepared by: Priya Singh (Legal Expert)

Next steps: Download your document from your dashboard.

Best regards,
Dhanseva Legal
```

**Real-World Example:**
An employee marks Rajesh's affidavit as COMPLETED. An audit entry is created, and Rajesh receives notification that his document is ready.

**Rate Limit:** 50 requests per 15 minutes
**Auth Required:** Yes (EMPLOYEE only)
**Audit:** All changes logged with user ID, timestamp, and IP address

---

## 🔒 SECURITY & MONITORING

### Rate Limiting Summary
```
Authentication endpoints:    5 req/15min
OTP endpoints:               3 req/15min
General API:                 100 req/15min
Payment endpoints:           10 req/15min
Upload endpoints:            20 req/hour
Export endpoints:            5 req/hour
```

### Response Compression
```
- Gzip enabled for responses >1KB
- Compression ratio: 60-80%
- Client can opt-out via header
```

### Pagination
```
- Default limit: 10 items
- Max limit: 100 items
- Always returns: page, limit, total, totalPages, hasNext, hasPrevious
```

### Request Tracking
```
- Every request gets unique X-Request-ID
- Logged in development mode
- Useful for debugging and support
```

---

## 📊 TOTAL API COUNT: 22 Endpoints

✅ Authentication: 3
✅ OTP: 2
✅ Services: 2
✅ Requests: 4
✅ Payments: 2
✅ Uploads: 1
✅ DSA: 4
✅ Employee: 4

---

## 🚀 Next Steps

All 22 APIs are production-ready with:
- ✅ Rate limiting
- ✅ Compression
- ✅ Pagination
- ✅ Input validation
- ✅ Error handling
- ✅ Security headers
- ✅ Audit logging
- ✅ Email notifications