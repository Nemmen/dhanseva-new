import api, { ApiResponse } from '@/lib/api';

export const otpService = {
  /**
   * Send OTP to email
   */
  sendOtp: async (email: string): Promise<ApiResponse> => {
    return api.post('/otp/send', { email });
  },

  /**
   * Verify OTP
   */
  verifyOtp: async (email: string, otp: string): Promise<ApiResponse> => {
    return api.post('/otp/verify', { email, otp });
  },
};
