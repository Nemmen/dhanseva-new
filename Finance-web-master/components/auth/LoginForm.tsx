'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginSchema } from '@/schemas/authSchemas';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const userData: any = await login(data.email, data.password);
      
      toast.success('Login successful!');
      
      // Wait a bit longer to ensure cookie is properly set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check for redirect parameter in URL
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      
      // If there's a redirect parameter, use it regardless of role
      // (unless it's a role-restricted area they shouldn't access)
      if (redirect) {
        // Decode the redirect URL
        const decodedRedirect = decodeURIComponent(redirect);
        
        // Check if user is trying to access a role-restricted area
        const isDsaRoute = decodedRedirect.startsWith('/dsa');
        const isEmployeeRoute = decodedRedirect.startsWith('/employee');
        
        // Only block if trying to access wrong role's area
        if (isDsaRoute && userData?.role !== 'DSA') {
          window.location.href = '/';
        } else if (isEmployeeRoute && userData?.role !== 'EMPLOYEE') {
          window.location.href = '/';
        } else {
          // Use window.location.href for full page reload to ensure middleware checks cookies
          window.location.href = decodedRedirect;
        }
      } else {
        // No redirect param - use role-based default routing
        if (userData?.role === 'DSA') {
          window.location.href = '/dsa';
        } else if (userData?.role === 'EMPLOYEE') {
          window.location.href = '/employee';
        } else {
          window.location.href = '/';
        }
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorCode = errorData?.data?.code;
      const errorEmail = errorData?.data?.email;
      
      // Handle DSA-specific error codes
      if (errorCode === 'EMAIL_NOT_VERIFIED' && errorEmail) {
        toast.error('Please verify your email first');
        router.push(`/dsa-register/verify?email=${encodeURIComponent(errorEmail)}`);
        return;
      }
      
      if (errorCode === 'PAYMENT_REQUIRED' && errorEmail) {
        toast.error('Please complete your registration payment');
        router.push(`/dsa-register/payment?email=${encodeURIComponent(errorEmail)}`);
        return;
      }
      
      if (errorCode === 'ACCOUNT_INACTIVE') {
        toast.error('Your account is pending activation');
        return;
      }
      
      toast.error(errorData?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
          placeholder="you@example.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            {...register('rememberMe')}
            type="checkbox"
            id="rememberMe"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={isLoading}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <FiLoader className="animate-spin" size={20} />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </button>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
          Register here
        </Link>
      </p>
    </form>
  );
}
