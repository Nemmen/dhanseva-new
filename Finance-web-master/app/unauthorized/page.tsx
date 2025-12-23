'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FiShield, FiHome, FiLogIn, FiArrowLeft } from 'react-icons/fi';

export default function UnauthorizedPage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiShield className="text-red-600" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          {isAuthenticated
            ? `You don't have permission to access this page. Your role (${user?.role}) doesn't allow access to this area.`
            : 'You need to be logged in to access this page.'}
        </p>

        <div className="space-y-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <FiHome size={20} />
                Go to Home
              </Link>
              {user?.role === 'DSA' && (
                <Link
                  href="/dsa"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <FiArrowLeft size={20} />
                  Go to DSA Dashboard
                </Link>
              )}
              {user?.role === 'USER' && (
                <Link
                  href="/my-requests"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <FiArrowLeft size={20} />
                  Go to My Requests
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <FiLogIn size={20} />
                Login
              </Link>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                <FiHome size={20} />
                Go to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
