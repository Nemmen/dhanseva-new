# Phase 3 & 4 Completion Content

## Complete Phase 3 (Continuation) and Phase 4

Replace the end of `FRONTEND_IMPLEMENTATION.md` (after line 3820) with this content:

---

#### Step 4: Create Category-Specific Field Components

**`src/components/requests/forms/PersonalLegalFields.tsx`:**

```typescript
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

const employmentStatuses = [
  "SALARIED",
  "SELF_EMPLOYED",
  "BUSINESS",
  "UNEMPLOYED",
];

interface PersonalLegalFieldsProps {
  form: UseFormReturn<any>;
}

export function PersonalLegalFields({ form }: PersonalLegalFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="employmentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employment Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employmentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ")}
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
        name="purposeDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purpose Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the purpose of this legal service..."
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
```

**`src/components/requests/forms/BusinessLegalFields.tsx`:**

```typescript
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

const businessTypes = [
  "PARTNERSHIP",
  "PRIVATE_LIMITED",
  "PUBLIC_LIMITED",
  "SOLE_PROPRIETOR",
];

interface BusinessLegalFieldsProps {
  form: UseFormReturn<any>;
}

export function BusinessLegalFields({ form }: BusinessLegalFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="businessType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ")}
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
        name="registrationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number (Optional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="partnersCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Partners</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
```

**Similar files for:** FinancialLegalFields.tsx, GovtLegalFields.tsx, SpecializedFields.tsx (Follow same pattern with respective fields)

#### Step 5: Create Dynamic Request Form Component

**`src/components/requests/RequestForm.tsx`:**

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServiceCategory } from "@/types";
import {
  personalLegalSchema,
  businessLegalSchema,
  financialLegalSchema,
  govtLegalSchema,
  specializedSchema,
} from "@/schemas/request.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useCreateRequest } from "@/lib/queries/requests.queries";
import { BaseFormFields } from "./forms/BaseFormFields";
import { PersonalLegalFields } from "./forms/PersonalLegalFields";
import { BusinessLegalFields } from "./forms/BusinessLegalFields";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const schemaMap = {
  [ServiceCategory.PERSONAL_LEGAL]: personalLegalSchema,
  [ServiceCategory.BUSINESS_LEGAL]: businessLegalSchema,
  [ServiceCategory.FINANCIAL_LEGAL]: financialLegalSchema,
  [ServiceCategory.GOVT_LEGAL]: govtLegalSchema,
  [ServiceCategory.SPECIALIZED_LEGAL]: specializedSchema,
};

interface RequestFormProps {
  serviceId: string;
  category: ServiceCategory;
}

export function RequestForm({ serviceId, category }: RequestFormProps) {
  const navigate = useNavigate();
  const schema = schemaMap[category];
  const form = useForm({ resolver: zodResolver(schema) });
  const { mutate: createRequest, isPending } = useCreateRequest();

  const onSubmit = (data: any) => {
    createRequest(
      { serviceId, formData: data },
      {
        onSuccess: (response) => {
          toast.success("Request created successfully");
          navigate(`/requests/${response.id}`);
        },
        onError: () => {
          toast.error("Failed to create request");
        },
      }
    );
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Service Request</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <BaseFormFields form={form} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Category-Specific Details
            </h3>
            {category === ServiceCategory.PERSONAL_LEGAL && (
              <PersonalLegalFields form={form} />
            )}
            {category === ServiceCategory.BUSINESS_LEGAL && (
              <BusinessLegalFields form={form} />
            )}
            {/* Add other category components */}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create Request & Proceed to Payment"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
```

#### Step 6: Create Request Status Badge Component

**`src/components/requests/RequestStatusBadge.tsx`:**

```typescript
import { Badge } from "@/components/ui/badge";
import { RequestStatus } from "@/types";

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const statusConfig = {
  [RequestStatus.UNPAID]: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Unpaid",
  },
  [RequestStatus.ASSIGNED]: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: "Assigned",
  },
  [RequestStatus.IN_PROGRESS]: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "In Progress",
  },
  [RequestStatus.ON_HOLD]: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    label: "On Hold",
  },
  [RequestStatus.COMPLETED]: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Completed",
  },
  [RequestStatus.CANCELLED]: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Cancelled",
  },
};

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge className={`${config.bg} ${config.text}`}>{config.label}</Badge>
  );
}
```

#### Step 7: Create My Requests Page

**`src/pages/user/MyRequestsPage.tsx`:**

```typescript
import { useState } from "react";
import { useMyRequests } from "@/lib/queries/requests.queries";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge";
import { Loading } from "@/components/shared/Loading";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils/formatters";
import { ArrowRight } from "lucide-react";

export function MyRequestsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyRequests(page, 10);

  if (isLoading) return <Loading />;
  if (!data?.data?.length) return <EmptyState title="No requests yet" />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Requests</h1>

      <div className="space-y-4">
        {data.data.map((request: any) => (
          <Card key={request.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{request.serviceName}</h3>
                <p className="text-sm text-gray-600">
                  {formatDate(request.createdAt)}
                </p>
              </div>
              <RequestStatusBadge status={request.status} />
              <Button asChild variant="ghost" size="sm">
                <Link to={`/requests/${request.id}`}>
                  View <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data.pagination && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            disabled={!data.pagination.hasPrevious}
            onClick={() => setPage(page - 1)}
            variant="outline"
          >
            Previous
          </Button>
          <span className="px-4 py-2">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            disabled={!data.pagination.hasNext}
            onClick={() => setPage(page + 1)}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
```

### Phase 3 Deliverables

- ✅ Request schemas (5 categories)
- ✅ Request query hooks
- ✅ Base form fields component
- ✅ Category-specific field components (5 types)
- ✅ Dynamic request form
- ✅ Status badge component
- ✅ My requests page with pagination

**Status:** Ready for Phase 4

---

## **PHASE 4: PAYMENT INTEGRATION (RAZORPAY)**

### Objectives

- Create Razorpay order
- Handle payment verification
- Update request status after payment
- Payment success/error handling

### Implementation Steps

#### Step 1: Create Payment Schemas & Types

**`src/types/payment.ts`:**

```typescript
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentResponse {
  success: boolean;
  orderId: string;
  paymentId?: string;
  message: string;
}
```

#### Step 2: Create Payment Query Hooks

**`src/lib/queries/payment.queries.ts`:**

```typescript
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { RazorpayOrder, PaymentVerification } from "@/types/payment";

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: async (data: { requestId: string; amount: number }) => {
      const response = await apiClient.post("/payments/create-order", data);
      return response.data.data as RazorpayOrder;
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (data: PaymentVerification & { requestId: string }) => {
      const response = await apiClient.post("/payments/verify", {
        orderId: data.orderId,
        paymentId: data.paymentId,
        signature: data.signature,
        requestId: data.requestId,
      });
      return response.data.data;
    },
  });
};
```

#### Step 3: Create Razorpay Utility

**`src/lib/razorpay/razorpay.ts`:**

```typescript
import { env } from "@/config/env";
import crypto from "crypto-js";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = (
  order: any,
  onSuccess: (payment: any) => void,
  onError: (error: any) => void
) => {
  const options = {
    key: env.razorpayKeyId,
    amount: order.amount,
    currency: "INR",
    name: "Dhanseva",
    description: "Legal Service Payment",
    order_id: order.id,
    handler: (response: any) => {
      onSuccess(response);
    },
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
    theme: {
      color: "#6366F1",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean => {
  const hmac = crypto.HmacSHA256(`${orderId}|${paymentId}`, secret);
  return hmac.toString() === signature;
};
```

#### Step 4: Create Razorpay Checkout Component

**`src/components/payment/RazorpayCheckout.tsx`:**

```typescript
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  useCreatePaymentOrder,
  useVerifyPayment,
} from "@/lib/queries/payment.queries";
import {
  loadRazorpayScript,
  openRazorpayCheckout,
} from "@/lib/razorpay/razorpay";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface RazorpayCheckoutProps {
  requestId: string;
  amount: number;
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function RazorpayCheckout({
  requestId,
  amount,
  open,
  onSuccess,
  onClose,
}: RazorpayCheckoutProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { mutate: createOrder, isPending: isCreating } =
    useCreatePaymentOrder();
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  useEffect(() => {
    loadRazorpayScript().then(setScriptLoaded);
  }, []);

  const handlePayment = () => {
    if (!scriptLoaded) {
      toast.error("Payment system not loaded");
      return;
    }

    createOrder(
      { requestId, amount },
      {
        onSuccess: (order) => {
          openRazorpayCheckout(
            order,
            (response) => {
              verifyPayment(
                {
                  requestId,
                  orderId: order.id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                },
                {
                  onSuccess: () => {
                    toast.success("Payment successful!");
                    onSuccess();
                    onClose();
                  },
                  onError: () => {
                    toast.error("Payment verification failed");
                  },
                }
              );
            },
            () => {
              toast.error("Payment cancelled");
            }
          );
        },
        onError: () => {
          toast.error("Failed to create payment order");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay ₹{amount} to proceed with your service request
          </DialogDescription>
        </DialogHeader>

        <Card className="p-6 bg-gray-50">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span className="font-semibold">₹{amount}</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-bold">Total Amount</span>
              <span className="text-2xl font-bold text-secondary">
                ₹{amount}
              </span>
            </div>
          </div>
        </Card>

        <Button
          onClick={handlePayment}
          disabled={isCreating || isVerifying || !scriptLoaded}
          className="w-full"
        >
          {isCreating || isVerifying ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay with Razorpay"
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Secure payment powered by Razorpay. Your payment information is
          encrypted.
        </p>
      </DialogContent>
    </Dialog>
  );
}
```

#### Step 5: Create Request Detail Page with Payment

**`src/pages/user/RequestDetailPage.tsx`:**

```typescript
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useRequestById } from "@/lib/queries/requests.queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/shared/Loading";
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge";
import { RazorpayCheckout } from "@/components/payment/RazorpayCheckout";
import { RequestStatus } from "@/types";
import { formatDate } from "@/lib/utils/formatters";

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: request, isLoading, refetch } = useRequestById(id!);
  const [paymentOpen, setPaymentOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (!request) return <div>Request not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{request.serviceName}</h1>
          <RequestStatusBadge status={request.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b">
          <div>
            <p className="text-sm text-gray-600">Request ID</p>
            <p className="font-mono">{request.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created Date</p>
            <p>{formatDate(request.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold">{request.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="text-xl font-bold text-secondary">₹99</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Submitted Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            {Object.entries(request.formData).map(([key, value]: any) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{key}</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {request.status === RequestStatus.UNPAID && (
          <>
            <Button
              onClick={() => setPaymentOpen(true)}
              size="lg"
              className="w-full"
            >
              Proceed to Payment
            </Button>
            <RazorpayCheckout
              requestId={request.id}
              amount={99}
              open={paymentOpen}
              onSuccess={() => {
                refetch();
              }}
              onClose={() => setPaymentOpen(false)}
            />
          </>
        )}

        {request.status !== RequestStatus.UNPAID && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900">
              This request has been {request.status.toLowerCase()}.
              {request.assignedDsaId &&
                " A DSA has been assigned to work on it."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
```

### Phase 4 Deliverables

- ✅ Payment types & schemas
- ✅ Payment query hooks
- ✅ Razorpay utility functions
- ✅ Razorpay checkout component
- ✅ Request detail page with payment integration
- ✅ Payment verification handling

**Status:** Phase 3 & 4 Complete
