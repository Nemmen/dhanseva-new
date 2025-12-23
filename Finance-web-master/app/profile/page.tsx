'use client';

import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/hooks/useAuthGuard';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { FiUser, FiMail, FiCalendar, FiShield, FiLogOut } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function ProfilePage() {
  useRequireAuth(); // Protect route
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container-custom py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'USER':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'DSA':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'EMPLOYEE':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'USER':
        return 'Customer';
      case 'DSA':
        return 'DSA Agent';
      case 'EMPLOYEE':
        return 'Employee';
      default:
        return role;
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">My Profile</h1>
          <p className="text-xl text-blue-100">
            Manage your account information and settings
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                {/* Avatar */}
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="text-blue-600" size={48} />
                </div>

                {/* User Info */}
                <h2 className="text-xl font-bold text-gray-900 mb-2">{user.email}</h2>
                <span
                  className={`inline-block px-4 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </span>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FiCalendar size={16} />
                    <span>Member since {format(new Date(user.createdAt), 'MMM yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiShield size={16} />
                    <span>Email {user.emailVerified ? 'Verified' : 'Not Verified'}</span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </div>

            {/* Account Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMail className="inline mr-2" />
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {/* User ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiShield className="inline mr-2" />
                      Account Type
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">{getRoleLabel(user.role)}</p>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Status
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                        />
                        <span className="text-gray-900">
                          {user.emailVerified ? 'Active & Verified' : 'Active - Email Not Verified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Created At */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="inline mr-2" />
                      Account Created
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">
                        {format(new Date(user.createdAt), 'MMMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Updated
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900">
                        {format(new Date(user.updatedAt), 'MMMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Future Features */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold text-gray-900 mb-4">Coming Soon</h3>
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-left"
                    >
                      ✏️ Edit Profile (Coming Soon)
                    </button>
                    <button
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-left"
                    >
                      🔒 Change Password (Coming Soon)
                    </button>
                    <button
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-left"
                    >
                      🗑️ Delete Account (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your profile."
        confirmText="Logout"
        type="warning"
      />
    </MainLayout>
  );
}
