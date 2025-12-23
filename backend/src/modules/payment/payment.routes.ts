import { Router } from 'express';
import { createOrder, verifyPayment } from './payment.controller';
import { authenticate } from '../../middleware/auth';
import { paymentLimiter } from '../../middleware/rateLimiter';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

router.post('/create-order', paymentLimiter, createOrder);
router.post('/verify', paymentLimiter, verifyPayment);

export default router;
