import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">DhanSeva</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Your Financial Services Partner</p>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-lg shadow-xl p-5 sm:p-8">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>

        {/* Footer Link */}
        <div className="mt-4 sm:mt-6 text-center">
          <Link href="/" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
