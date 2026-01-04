import { Router } from 'express';
import { createRequest, getMyRequests, getRequestById, updateRequest, updateDocuments } from './requests.controller';
import { authenticate } from '../../middleware/auth';
import { generalLimiter } from '../../middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', generalLimiter, createRequest);
router.get('/my-requests', generalLimiter, getMyRequests);
router.get('/:id', generalLimiter, getRequestById);
router.patch('/:id', generalLimiter, updateRequest);
router.patch('/:id/documents', generalLimiter, updateDocuments);

export default router;
