import { Router } from 'express';
import { sendOtp, verifyOtp } from './otp.controller';
import { validate } from '../../middleware/validate';
import { sendOtpSchema, verifyOtpSchema } from '../../utils/schemas';
import { otpLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/send', otpLimiter, validate(sendOtpSchema), sendOtp);
router.post('/verify', validate(verifyOtpSchema), verifyOtp);

export default router;
