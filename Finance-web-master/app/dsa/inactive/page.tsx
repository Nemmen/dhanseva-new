'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiAlertTriangle, FiCreditCard, FiMail, FiLogOut } from 'react-icons/fi';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function DsaInactivePage() {
  const { user, logout } = useAuth();
  const profile = user?.dsaProfile;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle className="text-yellow-600" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Not Active</h1>
        <p className="text-gray-600 mb-6">
          Your DSA account is currently inactive. 
          {!profile?.registrationPaid && ' Please complete your registration payment to activate your account.'}
          {profile?.registrationPaid && !profile?.isActive && ' Your account is pending approval from our team.'}
        </p>

        {!profile?.registrationPaid && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700 mb-3">
              Complete your registration fee of <strong>₹299</strong> to activate your DSA account.
            </p>
            <Link
              href="/dsa/activate"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              <FiCreditCard size={18} />
              Complete Payment
            </Link>
          </div>
        )}

        {profile?.registrationPaid && !profile?.isActive && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-700">
              Your payment has been received. Please wait while our team verifies and activates your account.
              This usually takes 1-2 business days.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <a
            href="mailto:support@dhanseva.com"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            <FiMail size={20} />
            Contact Support
          </a>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to check your account status."
        confirmText="Logout"
        type="warning"
      />
    </div>
  );
}
