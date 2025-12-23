'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { PaymentOrder } from '@/types/payment.types';
import { FiCreditCard, FiLoader } from 'react-icons/fi';
import { toast } from 'sonner';

interface RazorpayCheckoutProps {
  order: PaymentOrder;
  onSuccess: (paymentId: string, signature: string) => void;
  onFailure: (error: any) => void;
  disabled?: boolean;
  autoOpen?: boolean; // Auto-open payment modal when order is ready
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayCheckout({
  order,
  onSuccess,
  onFailure,
  disabled = false,
  autoOpen = true,
}: RazorpayCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const razorpayInstanceRef = useRef<any>(null);
  const isOpeningRef = useRef(false);
  const hasAutoOpenedRef = useRef(false);

  useEffect(() => {
    // Check if Razorpay script is already loaded
    if (window.Razorpay) {
      setIsScriptLoaded(true);
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      toast.error('Failed to load payment gateway. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup - close any open Razorpay instance
      if (razorpayInstanceRef.current) {
        try {
          razorpayInstanceRef.current.close();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  const openPaymentModal = useCallback(() => {
    // Prevent multiple opens
    if (isOpeningRef.current || isProcessing) {
      return;
    }

    if (!isScriptLoaded || !window.Razorpay) {
      toast.error('Payment gateway not loaded. Please try again.');
      return;
    }

    isOpeningRef.current = true;
    setIsProcessing(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Rr5VUBDcqjo2dh',
      amount: order.amount,
      currency: order.currency,
      name: 'DhanSeva',
      description: 'Service Payment',
      order_id: order.orderId,
      handler: function (response: any) {
        setIsProcessing(false);
        isOpeningRef.current = false;
        onSuccess(response.razorpay_payment_id, response.razorpay_signature);
      },
      prefill: {
        email: order.notes?.email || '',
        contact: order.notes?.phone || '',
      },
      notes: order.notes,
      theme: {
        color: '#2563eb',
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          isOpeningRef.current = false;
          toast.info('Payment cancelled');
        },
      },
    };

    try {
      // Close existing instance if any
      if (razorpayInstanceRef.current) {
        try {
          razorpayInstanceRef.current.close();
        } catch (e) {
          // Ignore
        }
      }

      const razorpay = new window.Razorpay(options);
      razorpayInstanceRef.current = razorpay;
      
      razorpay.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        isOpeningRef.current = false;
        onFailure(response.error);
      });

      razorpay.open();
    } catch (error) {
      setIsProcessing(false);
      isOpeningRef.current = false;
      onFailure(error);
    }
  }, [isScriptLoaded, isProcessing, order, onSuccess, onFailure]);

  // Auto-open payment modal when script is loaded and order is available
  useEffect(() => {
    if (autoOpen && isScriptLoaded && order && !hasAutoOpenedRef.current && !disabled) {
      hasAutoOpenedRef.current = true;
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        openPaymentModal();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoOpen, isScriptLoaded, order, disabled, openPaymentModal]);

  return (
    <button
      onClick={openPaymentModal}
      disabled={disabled || isProcessing || !isScriptLoaded}
      className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
    >
      {isProcessing ? (
        <>
          <FiLoader className="animate-spin" size={20} />
          <span className="hidden sm:inline">Processing...</span>
          <span className="sm:hidden">Wait...</span>
        </>
      ) : !isScriptLoaded ? (
        <>
          <FiLoader className="animate-spin" size={20} />
          <span className="hidden sm:inline">Loading Payment Gateway...</span>
          <span className="sm:hidden">Loading...</span>
        </>
      ) : (
        <>
          <FiCreditCard size={20} />
          Pay ₹{(order.amount / 100).toFixed(2)}
        </>
      )}
    </button>
  );
}
