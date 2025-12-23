'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { FiMail, FiLoader, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import api from '@/lib/api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsVerifying(true);
      await api.post('/otp/verify', { email, otp: otpCode });
      
      setIsVerified(true);
      toast.success('Email verified successfully!');
      
      // Redirect to payment after short delay
      setTimeout(() => {
        router.push(`/dsa-register/payment?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      setIsResending(true);
      await api.post('/otp/send', { email });
      toast.success('OTP sent successfully!');
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invalid Request</h2>
          <p className="text-gray-600 mb-6">No email provided for verification.</p>
          <Link
            href="/dsa-register"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isVerified ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {isVerified ? (
              <FiCheckCircle className="text-green-600" size={32} />
            ) : (
              <FiMail className="text-blue-600" size={32} />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isVerified ? 'Email Verified!' : 'Verify Your Email'}
          </h1>
          <p className="text-gray-600 text-sm">
            {isVerified ? (
              'Redirecting to payment...'
            ) : (
              <>
                We've sent a 6-digit code to<br />
                <strong>{email}</strong>
              </>
            )}
          </p>
        </div>

        {!isVerified && (
          <>
            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  disabled={isVerifying}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.join('').length !== 6}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
            >
              {isVerifying ? (
                <>
                  <FiLoader className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <FiArrowRight />
                </>
              )}
            </button>

            {/* Resend */}
            <p className="text-center text-sm text-gray-600">
              Didn't receive the code?{' '}
              {resendCooldown > 0 ? (
                <span className="text-gray-400">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-blue-600 font-medium hover:underline disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </p>
          </>
        )}

        {isVerified && (
          <div className="flex items-center justify-center">
            <FiLoader className="animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Redirecting to payment...</span>
          </div>
        )}

        {/* Steps Indicator */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-between text-xs">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">✓</div>
              <span className="mt-1 text-gray-600">Register</span>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                isVerified ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {isVerified ? '✓' : '2'}
              </div>
              <span className="mt-1 text-gray-600">Verify</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${isVerified ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">3</div>
              <span className="mt-1 text-gray-600">Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DsaVerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-blue-600" size={48} />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
