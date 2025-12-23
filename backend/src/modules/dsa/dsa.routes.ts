import { Router } from 'express';
import { 
  registerDsa, 
  createRegistrationPayment, 
  verifyRegistrationPayment,
  getDsaRequests, 
  updateDsaRequest, 
  exportDsaRequests 
} from './dsa.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { authLimiter, generalLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Public DSA registration routes (no auth required)
router.post('/register', authLimiter, registerDsa);
router.post('/register/create-payment', authLimiter, createRegistrationPayment);
router.post('/register/verify-payment', authLimiter, verifyRegistrationPayment);

// Protected DSA routes
router.use(authenticate);
router.use(authorize('DSA'));

router.get('/requests', generalLimiter, getDsaRequests);
router.patch('/requests/:id', generalLimiter, updateDsaRequest);
router.get('/export', exportDsaRequests);

export default router;
