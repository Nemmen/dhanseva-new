import { redisClient } from '../../config/redis';
import { generateOTP } from '../../utils/generators';
import { emailTemplate } from '../email/template.service';
import { AppError } from '../../middleware/errorHandler';
import { prisma } from '../../config/database';

export class OtpService {
  async sendOtp(email: string) {
    try {
      // Generate OTP
      const otp = generateOTP();
      const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Store in Redis with 5-minute TTL
      await redisClient.setEx(`otp:${email}`, 300, otp);

      // Send email
      await emailTemplate.sendOtpVerification(email, otp, expiryTime.toISOString());

      console.log(`OTP sent to ${email}: ${otp}`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new AppError('Failed to send OTP', 500);
    }
  }

  async verifyOtp(email: string, otp: string) {
    try {
      // Get OTP from Redis
      const storedOtp = await redisClient.get(`otp:${email}`);

      if (!storedOtp) {
        throw new AppError('OTP has expired', 400);
      }

      if (storedOtp !== otp) {
        throw new AppError('Invalid OTP', 400);
      }

      // Delete OTP after verification
      await redisClient.del(`otp:${email}`);

      // Update user's emailVerified status in database
      await prisma.user.update({
        where: { email },
        data: { emailVerified: true },
      });

      console.log(`Email verified for ${email}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error verifying OTP:', error);
      throw new AppError('Failed to verify OTP', 500);
    }
  }
}
