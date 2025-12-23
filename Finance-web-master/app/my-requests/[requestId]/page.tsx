'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { requestService } from '@/services/requestService';
import { useRequireAuth } from '@/hooks/useAuthGuard';
import MainLayout from '@/components/layout/MainLayout';
import PaymentStatus from '@/components/payment/PaymentStatus';
import StatusTimeline from '@/components/requests/StatusTimeline';
import { FiArrowLeft, FiLoader, FiDownload, FiExternalLink } from 'react-icons/fi';
import { format } from 'date-fns';
import Link from 'next/link';

interface RequestDetailPageProps {
  params: { requestId: string };
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  useRequireAuth(); // Protect route
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

  if (!request) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Not Found</h2>
            <Link href="/my-requests" className="text-blue-600 hover:text-blue-700">
              Back to My Requests
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formData = request.formData as any;

  return (
    <MainLayout>
      <div className="container-custom py-6 sm:py-8 px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <FiArrowLeft />
            Back
          </button>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">{request.service?.name}</h1>
              <p className="text-xs sm:text-base text-gray-600 mt-1 sm:mt-2 break-all">ID: {request.id.slice(0, 8)}...</p>
            </div>
            {!request.paid && (
              <Link
                href={`/payment/${request.id}`}
                className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm sm:text-base"
              >
                Pay Now
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Service Details */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Service Information</h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-right ml-2">{request.service?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-right ml-2">{request.service?.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">₹{request.service?.price}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                  <span className="text-gray-600">Applied On:</span>
                  <span className="font-medium text-right">
                    {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium text-right">
                    {format(new Date(request.updatedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-sm sm:text-base">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    request.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Data */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
              
              <div className="space-y-6">
                {/* Personal Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Full Name:</span>
                      <p className="font-medium">{formData?.fullName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{formData?.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium">{formData?.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date of Birth:</span>
                      <p className="font-medium">{formData?.dateOfBirth}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
                  <p className="text-sm text-gray-700">
                    {formData?.address}, {formData?.city}, {formData?.state} - {formData?.pinCode}
                  </p>
                </div>

                {/* Employment */}
                {formData?.employmentType && (
                  <div className="pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-3">Employment Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Employment Type:</span>
                        <p className="font-medium">{formData?.employmentType}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Income:</span>
                        <p className="font-medium">₹{formData?.monthlyIncome}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {formData?.aadhaarCard && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiDownload className="text-gray-600" />
                          <span className="text-sm font-medium">Aadhaar Card</span>
                        </div>
                        <a
                          href={formData.aadhaarCard}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Aadhaar Card"
                          aria-label="View Aadhaar Card document in new tab"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FiExternalLink />
                        </a>
                      </div>
                    )}
                    {formData?.panCard && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiDownload className="text-gray-600" />
                          <span className="text-sm font-medium">PAN Card</span>
                        </div>
                        <a
                          href={formData.panCard}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View PAN Card"
                          aria-label="View PAN Card document in new tab"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FiExternalLink />
                        </a>
                      </div>
                    )}
                    {formData?.incomeProof && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FiDownload className="text-gray-600" />
                          <span className="text-sm font-medium">Income Proof</span>
                        </div>
                        <a
                          href={formData.incomeProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Income Proof"
                          aria-label="View Income Proof document in new tab"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FiExternalLink />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Status Timeline */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <StatusTimeline
                status={request.status}
                createdAt={request.createdAt}
                updatedAt={request.updatedAt}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
