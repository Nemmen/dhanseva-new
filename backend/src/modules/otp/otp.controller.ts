import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { OtpService } from './otp.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';

const otpService = new OtpService();

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  await otpService.sendOtp(email);
  return sendSuccess(res, { expiresIn: 300, message: 'OTP valid for 5 minutes' }, 'OTP sent successfully', 200);
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new AppError('Email and OTP are required', 400);
  }

  await otpService.verifyOtp(email, otp);
  return sendSuccess(res, null, 'OTP verified successfully', 200);
});
