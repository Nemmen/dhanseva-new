'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { requestService } from '@/services/requestService';
import { paymentService } from '@/services/paymentService';
import { useRequireAuth } from '@/hooks/useAuthGuard';
import MainLayout from '@/components/layout/MainLayout';
import PaymentSummary from '@/components/payment/PaymentSummary';
import PaymentStatus from '@/components/payment/PaymentStatus';
import RazorpayCheckout from '@/components/payment/RazorpayCheckout';
import { FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import Link from 'next/link';

interface PaymentPageProps {
  params: { requestId: string };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  useRequireAuth(); // Protect route
  const router = useRouter();
  const [paymentOrder, setPaymentOrder] = useState<any>(null);

  // Fetch request details
  const { data: request, isLoading: requestLoading } = useQuery({
    queryKey: ['request', params.requestId],
    queryFn: () => requestService.getById(params.requestId),
  });

  // Create payment order mutation
  const createOrderMutation = useMutation({
    mutationFn: () => paymentService.createOrder(params.requestId, request?.service?.price || 99),
    onSuccess: (order) => {
      setPaymentOrder(order);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create payment order');
    },
  });

  // Verify payment mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: (paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
      paymentService.verifyPayment(paymentData),
    onSuccess: () => {
      toast.success('Payment successful! Your application is now being processed.');
      router.push(`/payment/${params.requestId}/success`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Payment verification failed');
    },
  });

  const handlePaymentSuccess = (paymentId: string, signature: string) => {
    verifyPaymentMutation.mutate({ 
      razorpay_order_id: paymentOrder.orderId,
      razorpay_payment_id: paymentId, 
      razorpay_signature: signature 
    });
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    toast.error(error.description || 'Payment failed. Please try again.');
  };

  const handleCreateOrder = () => {
    createOrderMutation.mutate();
  };

  if (requestLoading) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <FiLoader className="animate-spin text-blue-600" size={48} />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!request) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="text-center">
            <FiAlertCircle className="mx-auto text-red-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Not Found</h2>
            <p className="text-gray-600 mb-6">
              The service request you're looking for doesn't exist.
            </p>
            <Link
              href="/my-requests"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View My Requests
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Check if already paid
  const isPaid = request?.paid === true;

  return (
    <MainLayout>
      <div className="container-custom py-6 sm:py-8 px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 break-all">Request ID: {request.id.slice(0, 8)}...</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Payment Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
              {isPaid ? (
                // Already Paid
                <div className="text-center py-8 sm:py-12">
                  <FiCheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment Completed</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    This service request has already been paid for.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link
                      href={`/my-requests/${request.id}`}
                      className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                    >
                      View Request Details
                    </Link>
                    <Link
                      href="/#services"
                      className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                    >
                      Browse Services
                    </Link>
                  </div>
                </div>
              ) : (
                // Payment Pending
                <>
                  <div className="mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Service Details</h2>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium text-right ml-2">{request.service?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium text-right ml-2">{request.service?.category || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className="font-semibold">{request.paid ? 'Paid' : 'Unpaid'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                        <span className="text-gray-600">Request Status:</span>
                        <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium">
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="mt-6 sm:mt-8">
                    {paymentOrder ? (
                      <RazorpayCheckout
                        order={paymentOrder}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        disabled={verifyPaymentMutation.isPending}
                      />
                    ) : (
                      <button
                        onClick={handleCreateOrder}
                        disabled={createOrderMutation.isPending}
                        className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
                      >
                        {createOrderMutation.isPending ? (
                          <>
                            <FiLoader className="animate-spin" size={20} />
                            Creating Order...
                          </>
                        ) : (
                          'Proceed to Payment'
                        )}
                      </button>
                    )}
                  </div>

                  {/* Security Note */}
                  <div className="mt-4 sm:mt-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <FiCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
                      <div className="text-xs sm:text-sm text-green-800">
                        <p className="font-semibold mb-1">Secure Payment</p>
                        <p>
                          Your payment is secured by Razorpay. We don't store your card details.
                          All transactions are encrypted and secure.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Payment Summary */}
          {!isPaid && (
            <div className="lg:col-span-1">
              <PaymentSummary
                serviceName={request.service?.name || 'Service'}
                servicePrice={request.service?.price || 99}
              />

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Payment is required to start processing</li>
                  <li>• Service fee is non-refundable</li>
                  <li>• Processing begins after payment</li>
                  <li>• You'll receive email updates</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
