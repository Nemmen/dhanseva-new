'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { requestService } from '@/services/requestService';
import MainLayout from '@/components/layout/MainLayout';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

interface PaymentSuccessPageProps {
  params: { requestId: string };
}

export default function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const router = useRouter();

  // Fetch request details
  const { data: request, isLoading } = useQuery({
    queryKey: ['request', params.requestId],
    queryFn: () => requestService.getById(params.requestId),
  });

  if (isLoading) {
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

  return (
    <MainLayout>
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-600" size={48} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600">
                Your payment has been processed successfully.
              </p>
            </div>

            {/* Payment Details */}
            {request && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Request ID:</span>
                    <span className="font-medium">{request.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{request.service?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-medium text-green-600">₹{request.service?.price}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      PAID
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">📋 What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Your application is now being processed</li>
                <li>✓ You will receive email updates on your application status</li>
                <li>✓ Processing typically takes 3-5 business days</li>
                <li>✓ You can track your request status anytime</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/my-requests/${params.requestId}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                View Request Details
              </Link>
              <Link
                href="/my-requests"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                View All Requests
              </Link>
              <Link
                href="/services"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Apply for Another Service
              </Link>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t text-sm text-gray-600">
              <p>
                Need help? Contact us at{' '}
                <a href="mailto:support@dhanseva.com" className="text-blue-600 hover:text-blue-700">
                  support@dhanseva.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
