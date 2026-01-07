import { Router } from 'express';
import { getAllRequests, getRequestById, assignDsa, inviteDsa, updateRequestByEmployee, getAllDsas, getActiveDsas, bulkCreateEmployees } from './employee.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { generalLimiter } from '../../middleware/rateLimiter';

const router = Router();

// All employee routes require authentication and EMPLOYEE role
router.use(authenticate);
router.use(authorize('EMPLOYEE'));

// Request management
router.get('/requests', generalLimiter, getAllRequests);
router.get('/requests/:id', generalLimiter, getRequestById);
router.patch('/requests/:id', generalLimiter, updateRequestByEmployee);

// DSA management
router.get('/dsas', generalLimiter, getAllDsas);
router.get('/dsas/active', generalLimiter, getActiveDsas);
router.post('/assign-dsa', generalLimiter, assignDsa);
router.post('/invite-dsa', generalLimiter, inviteDsa);

// Bulk employee creation
router.post('/bulk-create', generalLimiter, bulkCreateEmployees);

export default router;
