// Payment status
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

// Payment interface
export interface Payment {
  id: string;
  requestId: string;
  userId: string;
  amount: number; // in paise
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

// Razorpay order response
export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  customerId: string;
  notes?: Record<string, string>;
  createdAt: string;
}

// Alias for backward compatibility
export type PaymentOrder = RazorpayOrderResponse;

// Razorpay payment response
export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Payment verification request
export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Payment verification response
export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    paymentId: string;
    amount: number;
    status: string;
    verifiedAt: string;
  };
}
