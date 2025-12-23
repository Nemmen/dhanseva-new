import { Router } from 'express';
import { getAllServices, getServiceById, getServicesByCategory } from './services.controller';
import { cacheControl } from '../../middleware/cache';

const router = Router();

router.get('/', cacheControl(3600), getAllServices);
router.get('/category/:category', cacheControl(3600), getServicesByCategory);
router.get('/:id', cacheControl(3600), getServiceById);

export default router;
