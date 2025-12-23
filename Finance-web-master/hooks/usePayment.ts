'use client';

import { useMutation } from '@tanstack/react-query';
import { paymentService } from '@/services/paymentService';
import { RazorpayPaymentResponse } from '@/types/payment.types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UsePaymentOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to handle Razorpay payment flow
 */
export function usePayment(options?: UsePaymentOptions) {
  const router = useRouter();

  const createOrderMutation = useMutation({
    mutationFn: ({ requestId, amount }: { requestId: string; amount: number }) =>
      paymentService.createOrder(requestId, amount),
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: paymentService.verifyPayment,
    onSuccess: (data) => {
      toast.success('Payment successful!');
      options?.onSuccess?.();
      router.push('/my-requests?payment=success');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Payment verification failed');
      options?.onError?.(error);
    },
  });

  const initiatePayment = async (requestId: string, amount: number, userEmail: string, userPhone?: string) => {
    try {
      // Load Razorpay script
      const scriptLoaded = await paymentService.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Please try again.');
      }

      // Create order
      const orderData = await createOrderMutation.mutateAsync({ requestId, amount });

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DhanSeva',
        description: 'Service Processing Fee',
        order_id: orderData.orderId,
        handler: function (response: RazorpayPaymentResponse) {
          // Verify payment
          verifyPaymentMutation.mutate({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          email: userEmail,
          contact: userPhone || '',
        },
        theme: {
          color: '#2563EB', // Primary blue
        },
        modal: {
          ondismiss: function () {
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate payment');
      options?.onError?.(error);
    }
  };

  return {
    initiatePayment,
    isCreatingOrder: createOrderMutation.isPending,
    isVerifyingPayment: verifyPaymentMutation.isPending,
    isProcessing: createOrderMutation.isPending || verifyPaymentMutation.isPending,
  };
}
