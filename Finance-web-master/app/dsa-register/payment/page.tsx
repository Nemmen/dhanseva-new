'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { FiCreditCard, FiLoader, FiCheckCircle, FiShield, FiAlertCircle } from 'react-icons/fi';
import api from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const razorpayRef = useRef<any>(null);
  const isOpeningRef = useRef(false);

  // Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => toast.error('Failed to load payment gateway');
    document.body.appendChild(script);

    return () => {
      if (razorpayRef.current) {
        try {
          razorpayRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  const handlePayment = useCallback(async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    if (isOpeningRef.current || isLoading) return;

    try {
      isOpeningRef.current = true;
      setIsLoading(true);

      // Create payment order
      const response: any = await api.post('/dsa/register/create-payment', { email });
      const order = response.data;

      if (!isScriptLoaded || !window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh the page.');
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'DhanSeva',
        description: 'DSA Registration Fee',
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            await api.post('/dsa/register/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email,
            });

            setPaymentSuccess(true);
            toast.success('Payment successful! Your DSA account is now active.');
            
            setTimeout(() => {
              router.push('/dsa-register/success');
            }, 2000);
          } catch (error: any) {
            toast.error(error.message || 'Payment verification failed');
            setIsLoading(false);
            isOpeningRef.current = false;
          }
        },
        prefill: {
          email: email,
        },
        notes: {
          type: 'DSA_REGISTRATION',
          email: email,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            isOpeningRef.current = false;
            toast.info('Payment cancelled');
          },
        },
      };

      if (razorpayRef.current) {
        try {
          razorpayRef.current.close();
        } catch (e) {}
      }

      const razorpay = new window.Razorpay(options);
      razorpayRef.current = razorpay;

      razorpay.on('payment.failed', function (response: any) {
        toast.error(response.error?.description || 'Payment failed');
        setIsLoading(false);
        isOpeningRef.current = false;
      });

      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate payment');
      setIsLoading(false);
      isOpeningRef.current = false;
    }
  }, [email, isLoading, isScriptLoaded, router]);

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invalid Request</h2>
          <p className="text-gray-600 mb-6">No email provided for payment.</p>
          <Link
            href="/dsa-register"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Registration
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FiCheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your DSA account has been activated.</p>
          <div className="flex items-center justify-center text-gray-500">
            <FiLoader className="animate-spin mr-2" />
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiCreditCard className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Registration</h1>
          <p className="text-gray-600 text-sm">
            Pay the one-time registration fee to activate your DSA account
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-lg mb-2">
              ₹299
            </div>
            <p className="text-xs text-gray-600">One-time registration fee (inclusive of all taxes)</p>
          </div>
          
          <div className="border-t border-blue-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Registration Fee</span>
              <span className="font-semibold">₹299.00</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">GST (18%)</span>
              <span className="text-gray-600">Included</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
              <span>Platform Charges</span>
              <span>₹0</span>
            </div>
            <div className="border-t border-blue-200 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Payable</span>
              <span className="text-2xl font-bold text-blue-600">₹299.00</span>
            </div>
          </div>
          
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Note:</strong> This is a one-time, non-refundable registration fee. No recurring charges.
            </p>
          </div>
        </div>

        {/* Email Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            <strong>Email:</strong> {email}
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={isLoading || !isScriptLoaded}
          className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin" />
              Processing...
            </>
          ) : !isScriptLoaded ? (
            <>
              <FiLoader className="animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <FiCreditCard />
              Pay ₹299
            </>
          )}
        </button>

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <FiShield className="text-green-500" />
          <span>Secured by Razorpay</span>
        </div>

        {/* Steps Indicator */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-between text-xs">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</div>
              <span className="mt-1 text-gray-600">Register</span>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</div>
              <span className="mt-1 text-gray-600">Verify</span>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">3</div>
              <span className="mt-1 text-gray-600">Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DsaPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-blue-600" size={48} />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
