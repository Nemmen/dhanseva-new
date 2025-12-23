import api, { ApiResponse } from '@/lib/api';
import {
  RazorpayOrderResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
} from '@/types/payment.types';

export const paymentService = {
  /**
   * Create Razorpay payment order
   */
  createOrder: async (requestId: string, amount: number): Promise<RazorpayOrderResponse> => {
    const response: ApiResponse<RazorpayOrderResponse> = await api.post('/payments/create-order', {
      requestId,
      amount,
    });
    return response.data!;
  },

  /**
   * Verify Razorpay payment signature
   */
  verifyPayment: async (data: PaymentVerificationRequest): Promise<PaymentVerificationResponse> => {
    return api.post('/payments/verify', data);
  },

  /**
   * Load Razorpay script
   */
  loadRazorpayScript: (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if script already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  },
};

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
