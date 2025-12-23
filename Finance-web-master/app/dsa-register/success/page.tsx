'use client';

import Link from 'next/link';
import { FiCheckCircle, FiArrowRight, FiUser, FiFileText, FiLogIn } from 'react-icons/fi';

export default function DsaRegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <FiCheckCircle className="text-green-600" size={56} />
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Registration Complete! 🎉
        </h1>
        <p className="text-gray-600 mb-8">
          Congratulations! Your DSA account has been successfully activated. You can now start processing service requests.
        </p>

        {/* What's Next */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <FiLogIn className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Login to Dashboard</p>
                <p className="text-sm text-gray-600">Access your DSA dashboard to view assigned requests</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <FiFileText className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Process Requests</p>
                <p className="text-sm text-gray-600">Review and process service requests assigned to you</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <FiUser className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Complete Profile</p>
                <p className="text-sm text-gray-600">Update your profile information for better service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Login to Dashboard
            <FiArrowRight />
          </Link>
          <Link
            href="/"
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Go to Home
          </Link>
        </div>

        {/* Support Info */}
        <p className="mt-8 text-sm text-gray-500">
          Need help? Contact us at{' '}
          <a href="mailto:support@dhanseva.com" className="text-blue-600 hover:underline">
            support@dhanseva.com
          </a>
        </p>
      </div>
    </div>
  );
}
