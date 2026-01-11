'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import OTPInput from '@/components/auth/OTPInput';
import { otpService } from '@/services/otpService';
import { toast } from 'sonner';
import { FiLoader, FiCheckCircle } from 'react-icons/fi';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpSent, setOtpSent] = useState(false);

  // Send OTP automatically on component mount
  useEffect(() => {
    const sendInitialOTP = async () => {
      if (email && !otpSent) {
        try {
          await otpService.sendOtp(email);
          setOtpSent(true);
          toast.success('OTP sent to your email!');
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to send OTP.');
        }
      }
    };
    
    sendInitialOTP();
  }, [email, otpSent]);
  // Timer for resend button
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Auto-verify when OTP is complete
  const handleOTPComplete = async (completedOtp: string) => {
    if (completedOtp.length === 6) {
      await verifyOTP(completedOtp);
    }
  };

  const verifyOTP = async (otpToVerify: string) => {
    if (!email) {
      toast.error('Email not found. Please register again.');
      router.push('/register');
      return;
    }

    try {
      setIsVerifying(true);
      await otpService.verifyOtp(email, otpToVerify);
      toast.success('Email verified successfully!');
      
      // Show success state briefly before redirecting
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email not found. Please register again.');
      router.push('/register');
      return;
    }

    try {
      setIsResending(true);
      await otpService.sendOtp(email);
      toast.success('OTP sent successfully! Check your email.');
      setTimer(60);
      setCanResend(false);
      setOtp('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <AuthLayout title="Email Required">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Email address is required for verification.</p>
          <button
            onClick={() => router.push('/register')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Go to Register
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`We've sent a 6-digit code to ${email}`}
    >
      <div className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Enter OTP
          </label>
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleOTPComplete}
            disabled={isVerifying}
          />
        </div>

        {/* Verifying State */}
        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <FiLoader className="animate-spin" size={20} />
            <span>Verifying OTP...</span>
          </div>
        )}

        {/* Resend OTP */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50"
            >
              {isResending ? 'Resending...' : 'Resend OTP'}
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              Resend OTP in {timer}s
            </p>
          )}
        </div>

        {/* Info Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Check your spam folder if you don't see the email. 
            The OTP is valid for 10 minutes.
          </p>
        </div>

        {/* Change Email */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-600">
            Wrong email?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Register again
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Loading...">
        <div className="flex justify-center py-8">
          <FiLoader className="animate-spin" size={40} />
        </div>
      </AuthLayout>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
