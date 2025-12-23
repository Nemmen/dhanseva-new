'use client';

import { useAuth } from '@/context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function DsaProfilePage() {
  const { user } = useAuth();
  const profile = user?.dsaProfile;

  if (!profile) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
        <p className="text-gray-600">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          View and manage your DSA profile information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {profile.fullName?.charAt(0).toUpperCase() || 'D'}
              </span>
            </div>
            <div className="text-white">
              <h2 className="text-xl sm:text-2xl font-bold">{profile.fullName}</h2>
              <p className="text-blue-100">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {profile.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 bg-opacity-30 text-green-100 text-xs rounded-full">
                    <FiCheckCircle size={14} /> Active DSA
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500 bg-opacity-30 text-yellow-100 text-xs rounded-full">
                    <FiAlertCircle size={14} /> Pending Activation
                  </span>
                )}
                {profile.registrationPaid && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-white bg-opacity-20 text-white text-xs rounded-full">
                    <FiCheckCircle size={14} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiUser className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{profile.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiMail className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiPhone className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">{profile.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiPhone className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">WhatsApp</p>
                <p className="font-medium text-gray-900">{profile.whatsapp || profile.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiMapPin className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">
                  {profile.address !== 'N/A' && profile.address}
                  {profile.city && `, ${profile.city}`}
                  {profile.state && `, ${profile.state}`}
                  {profile.pincode && profile.pincode !== '000000' && ` - ${profile.pincode}`}
                  {(!profile.address || profile.address === 'N/A') && 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiCalendar className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${profile.isActive ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              {profile.isActive ? (
                <FiCheckCircle className="text-green-600" />
              ) : (
                <FiAlertCircle className="text-yellow-600" />
              )}
              <span className="font-medium text-gray-900">Account Status</span>
            </div>
            <p className={`text-sm ${profile.isActive ? 'text-green-700' : 'text-yellow-700'}`}>
              {profile.isActive ? 'Active' : 'Pending Activation'}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${profile.registrationPaid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              {profile.registrationPaid ? (
                <FiCheckCircle className="text-green-600" />
              ) : (
                <FiAlertCircle className="text-red-600" />
              )}
              <span className="font-medium text-gray-900">Registration Fee</span>
            </div>
            <p className={`text-sm ${profile.registrationPaid ? 'text-green-700' : 'text-red-700'}`}>
              {profile.registrationPaid ? 'Paid' : 'Pending'}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${user?.emailVerified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              {user?.emailVerified ? (
                <FiCheckCircle className="text-green-600" />
              ) : (
                <FiAlertCircle className="text-yellow-600" />
              )}
              <span className="font-medium text-gray-900">Email Verification</span>
            </div>
            <p className={`text-sm ${user?.emailVerified ? 'text-green-700' : 'text-yellow-700'}`}>
              {user?.emailVerified ? 'Verified' : 'Not Verified'}
            </p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-sm text-gray-600 mb-4">
          If you need to update your profile information or have any questions, please contact our support team.
        </p>
        <a
          href="mailto:support@dhanseva.com"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <FiMail size={18} />
          Contact Support
        </a>
      </div>
    </div>
  );
}
