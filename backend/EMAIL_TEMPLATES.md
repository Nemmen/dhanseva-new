# 📧 Email Templates - Dhanseva Legal Services

## Overview

Complete HTML email templates for all user-facing communications. All templates are professionally designed, mobile-responsive, and branded with Dhanseva's color scheme.

---

## 📋 Email Templates List

### 1. **OTP Verification Email**

**File:** `otp-verification.html`  
**Trigger:** When user requests OTP during registration or login

**Variables:**

```typescript
{
  OTP: string; // 6-digit code (e.g., "847362")
  EXPIRY_TIME: string; // ISO timestamp (e.g., "2025-12-21T10:35:00Z")
}
```

**Example Usage:**

```typescript
import { emailTemplate } from "./modules/email/template.service";

await emailTemplate.sendOtpVerification(
  "user@example.com",
  "847362",
  "2025-12-21T10:35:00 IST"
);
```

**Features:**

- ✅ Large, visible OTP code
- ✅ Expiry countdown timer
- ✅ Security warning
- ✅ "Never share this OTP" notice
- ✅ Support contact info

---

### 2. **Registration Success Email**

**File:** `registration-success.html`  
**Trigger:** After successful user registration

**Variables:**

```typescript
{
  USER_NAME: string; // e.g., "Rajesh Kumar"
  EMAIL: string; // e.g., "rajesh@example.com"
  ROLE: string; // "USER", "DSA", or "EMPLOYEE"
  CREATION_DATE: string; // e.g., "Dec 21, 2025 10:30 AM"
  DASHBOARD_URL: string; // Link to user dashboard
}
```

**Example Usage:**

```typescript
await emailTemplate.sendRegistrationSuccess(
  "rajesh@example.com",
  "Rajesh Kumar",
  "USER",
  "https://dhanseva.com/dashboard",
  "Dec 21, 2025 10:30 AM"
);
```

**Features:**

- ✅ Warm welcome message
- ✅ Account details summary
- ✅ Numbered next steps (4 steps)
- ✅ Feature highlights (6 features)
- ✅ Call-to-action button
- ✅ Verification requirement notice

---

### 3. **Payment Success Email**

**File:** `payment-success.html`  
**Trigger:** After Razorpay payment verification

**Variables:**

```typescript
{
  USER_NAME: string; // e.g., "Rajesh Kumar"
  SERVICE_NAME: string; // e.g., "Affidavit"
  TRANSACTION_ID: string; // Razorpay ID
  AMOUNT: string; // e.g., "99"
  PAYMENT_DATE: string; // e.g., "Dec 21, 2025 11:30 AM"
  PAYMENT_METHOD: string; // e.g., "UPI", "Card"
  REFERENCE_CODE: string; // Internal reference
  DASHBOARD_URL: string; // Link to view request
}
```

**Example Usage:**

```typescript
await emailTemplate.sendPaymentSuccess(
  "rajesh@example.com",
  "Rajesh Kumar",
  "Affidavit",
  "pay_2NCZZ3mD2L7Ykj",
  "99",
  "Dec 21, 2025 11:30 AM",
  "UPI",
  "REF-123456",
  "https://dhanseva.com/requests/req-123"
);
```

**Features:**

- ✅ Detailed payment breakdown
- ✅ Transaction confirmation
- ✅ Timeline of next steps (4 steps)
- ✅ Reference code for support
- ✅ 24/7 support contact
- ✅ Professional receipt-style formatting

---

### 4. **Request Status Update Email**

**File:** `request-status-update.html`  
**Trigger:** When request status changes (ASSIGNED, IN_PROGRESS, COMPLETED, ON_HOLD)

**Variables:**

```typescript
{
  USER_NAME: string;           // e.g., "Rajesh Kumar"
  SERVICE_NAME: string;        // e.g., "Affidavit"
  STATUS: string;              // "ASSIGNED", "IN_PROGRESS", "COMPLETED"
  STATUS_LOWER: string;        // lowercase version for styling
  REQUEST_ID: string;          // e.g., "req-123456"
  UPDATE_DATE: string;         // When status changed
  EXPECTED_DATE: string;       // Expected completion
  NOTES?: string;              // Optional update notes
  EXPERT_NAME?: string;        // If assigned
  EXPERT_EMAIL?: string;       // If assigned
  EXPERT_PHONE?: string;       // If assigned
  EXPERT_EXPERIENCE?: string;  // If assigned
  DASHBOARD_URL?: string;      // Link to full details
}
```

**Example Usage:**

```typescript
await emailTemplate.sendRequestStatusUpdate(
  "rajesh@example.com",
  "Rajesh Kumar",
  "Affidavit",
  "ASSIGNED",
  "req-123456",
  "Dec 21, 2025 12:00 PM",
  "Dec 24, 2025",
  "Document review started",
  "Priya Singh",
  "priya@dhanseva.com",
  "+919876543210",
  "5 years",
  "https://dhanseva.com/requests/req-123456"
);
```

**Features:**

- ✅ Dynamic status badge (color-coded)
- ✅ Conditional expert card (if assigned)
- ✅ Optional update notes
- ✅ Progress timeline (animated)
- ✅ Expert contact information
- ✅ Conditional sections based on status

---

### 5. **Request Completion Email**

**File:** `request-completed.html`  
**Trigger:** When request is marked COMPLETED

**Variables:**

```typescript
{
  SERVICE_NAME: string; // e.g., "Affidavit"
  USER_NAME: string; // e.g., "Rajesh Kumar"
  REQUEST_ID: string; // e.g., "req-123456"
  COMPLETION_DATE: string; // When completed
  DURATION: string; // e.g., "3 days 2 hours"
  DOWNLOAD_LINK: string; // URL to download document
  EXPERT_NAME: string; // e.g., "Priya Singh"
  EXPERT_QUALIFICATION: string; // e.g., "B.A. LL.B"
  EXPERT_EXPERIENCE: string; // e.g., "5 years in legal services"
  EXPERT_EMAIL: string; // Expert contact
  RATING_LINK: string; // Link to review
  BROWSE_SERVICES: string; // Link to other services
}
```

**Example Usage:**

```typescript
await emailTemplate.sendRequestCompletion(
  "rajesh@example.com",
  "Rajesh Kumar",
  "Affidavit",
  "req-123456",
  "Dec 23, 2025 10:00 AM",
  "2 days 22 hours",
  "https://dhanseva.com/download/req-123456",
  "Priya Singh",
  "B.A. LL.B",
  "5 years",
  "priya@dhanseva.com",
  "https://dhanseva.com/rate/req-123456",
  "https://dhanseva.com/services"
);
```

**Features:**

- ✅ Completion summary with all details
- ✅ Expert credentials display
- ✅ Direct download link
- ✅ Next steps guide (5 steps)
- ✅ Rating/review request
- ✅ Related services suggestion
- ✅ Legal validity assurance badge

---

### 6. **DSA Invitation Email**

**File:** `dsa-invitation.html`  
**Trigger:** When employee sends DSA registration invitation

**Variables:**

```typescript
{
  FIRST_NAME: string; // e.g., "Arjun"
  REGIONS: string; // e.g., "Delhi, NCR"
  REGISTRATION_LINK: string; // Invitation link with token
  EXPIRY_DATE: string; // e.g., "Dec 28, 2025"
}
```

**Example Usage:**

```typescript
await emailTemplate.sendDsaInvitation(
  "newdsa@example.com",
  "Arjun",
  "Delhi, NCR",
  "https://dhanseva.com/dsa/register?token=abc123xyz789",
  "Dec 28, 2025"
);
```

**Features:**

- ✅ Compelling opportunity description
- ✅ Key benefits highlight (6 benefits)
- ✅ Region assignment display
- ✅ Requirements checklist (5 items)
- ✅ How-it-works numbered list
- ✅ 7-day invitation expiry notice
- ✅ ₹299 registration fee mention

---

### 7. **Password Reset Email**

**File:** `password-reset.html`  
**Trigger:** When user requests password reset

**Variables:**

```typescript
{
  USER_NAME: string; // e.g., "Rajesh Kumar"
  RESET_LINK: string; // Password reset link
  EXPIRY_TIME: string; // e.g., "Dec 22, 2025 10:30 AM IST"
}
```

**Example Usage:**

```typescript
await emailTemplate.sendPasswordReset(
  "rajesh@example.com",
  "Rajesh Kumar",
  "https://dhanseva.com/reset-password?token=token123",
  "Dec 22, 2025 10:30 AM IST"
);
```

**Features:**

- ✅ Clear reset instructions
- ✅ Primary button + link backup
- ✅ 24-hour expiry notice
- ✅ Security warnings
- ✅ Password tips checklist (5 tips)
- ✅ "Didn't request?" section
- ✅ Account security tips
- ✅ Support contact in case of issues

---

## 🎨 Design Features

All templates include:

- **Responsive Design**: Mobile-first approach, works on all devices
- **Color Scheme**:
  - Primary: Purple (#667eea)
  - Success: Green (#28a745)
  - Warning: Yellow (#ffc107)
  - Error: Red (#ff6b6b)
- **Typography**: Segoe UI font, carefully chosen sizes and weights
- **Branding**: Dhanseva logo/name in header
- **Accessibility**: Semantic HTML, proper contrast ratios
- **Security Notices**: Clear warnings on sensitive emails
- **Legal Disclaimers**: Footer with support contact

---

## 📧 Implementation Guide

### Using the Email Template Service

```typescript
import { emailTemplate } from "./modules/email/template.service";

// In your controller/service
try {
  await emailTemplate.sendOtpVerification(user.email, generatedOTP, expiryTime);
} catch (error) {
  //console.error("Email send failed:", error);
  // Handle error appropriately
}
```

### Integration with Auth Module

```typescript
// otp.controller.ts
import { emailTemplate } from './modules/email/template.service';

async sendOTP(req: Request, res: Response) {
  const { email } = req.body;

  // Generate OTP
  const otp = generateOTP();
  const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

  // Store in Redis
  await redisClient.setEx(`otp:${email}`, 300, otp);

  // Send email
  await emailTemplate.sendOtpVerification(
    email,
    otp,
    expiryTime.toISOString()
  );

  return res.json({ success: true, message: 'OTP sent' });
}
```

### Integration with Request Module

```typescript
// requests.controller.ts
async updateRequestStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  const request = await prisma.serviceRequest.update({
    where: { id },
    data: { status }
  });

  // Get service and user details
  const service = await prisma.service.findUnique({
    where: { id: request.serviceId }
  });

  const user = await prisma.user.findUnique({
    where: { id: request.createdById }
  });

  // Send status update email
  await emailTemplate.sendRequestStatusUpdate(
    user.email,
    user.name,
    service.name,
    status,
    request.id,
    new Date().toLocaleString('en-IN'),
    estimatedCompletionDate
  );

  return res.json({ success: true, data: request });
}
```

---

## 🧪 Testing Email Templates

### Manual Testing

1. Create test user accounts
2. Trigger actions that send emails
3. Check inbox and verify HTML rendering
4. Test on multiple email clients (Gmail, Outlook, Apple Mail)

### Email Testing Tools

- **Litmus**: Real device testing
- **Email on Acid**: Cross-client compatibility
- **Mailtrap**: Development/testing inbox
- **Mailhog**: Local email testing

---

## 🚀 Best Practices

1. **Always test in production-like environment**
2. **Use proper variable names** - clear and descriptive
3. **Keep templates in sync** - update all references when changing
4. **Monitor email delivery** - track opens and clicks
5. **A/B test subject lines** - improve open rates
6. **Optimize send time** - consider user timezone
7. **Include unsubscribe link** - compliance requirement
8. **Test on mobile devices** - 60%+ emails opened on mobile

---

## 📊 Email Delivery Checklist

Before sending emails:

- [ ] All variables are properly replaced
- [ ] Links are properly formatted
- [ ] HTML is valid and well-formed
- [ ] Mobile responsive design verified
- [ ] Subject line is clear and compelling
- [ ] Footer has support contact
- [ ] Plain text fallback available
- [ ] SPF/DKIM/DMARC records configured

---

## 🔒 Security Considerations

1. **Rate Limiting**: Max 5 OTP emails per 15 minutes
2. **Template Injection**: Variables are properly escaped
3. **Link Expiry**: Reset links valid for 24 hours max
4. **No Sensitive Data in URLs**: Use POST instead of GET for sensitive data
5. **Secure Token Storage**: Tokens stored in Redis with TTL
6. **HTTPS Links**: All links use HTTPS protocol

---

## 📝 Template Variables Reference

| Template         | Variables                                                                                                    | Required |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| OTP              | OTP, EXPIRY_TIME                                                                                             | ✅       |
| Registration     | USER_NAME, EMAIL, ROLE, CREATION_DATE, DASHBOARD_URL                                                         | ✅       |
| Payment          | USER_NAME, SERVICE_NAME, TRANSACTION_ID, AMOUNT, PAYMENT_DATE, PAYMENT_METHOD, REFERENCE_CODE, DASHBOARD_URL | ✅       |
| Status Update    | USER_NAME, SERVICE_NAME, STATUS, REQUEST_ID, UPDATE_DATE, EXPECTED_DATE                                      | ✅       |
| Request Complete | SERVICE*NAME, USER_NAME, REQUEST_ID, COMPLETION_DATE, DURATION, DOWNLOAD_LINK, EXPERT*\*, RATING_LINK        | ✅       |
| DSA Invite       | FIRST_NAME, REGIONS, REGISTRATION_LINK, EXPIRY_DATE                                                          | ✅       |
| Password Reset   | USER_NAME, RESET_LINK, EXPIRY_TIME                                                                           | ✅       |

---

## 📞 Support

For template customization or issues:

- Email: support@dhanseva.com
- Slack: #backend-team
- Documentation: Wiki
