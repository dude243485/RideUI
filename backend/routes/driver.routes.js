import { Router } from 'express';
import {
  getMyProfile,
  updateStatusAndHub,
  createDriverProfile,
  listDrivers,
  updateDriverProfile,
  seedDemoDrivers,
  seedManyDrivers,
} from '../controllers/driver.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Demo helpers to seed/activate live drivers
router.post('/seed-demo', seedDemoDrivers);
router.post('/seed-many', seedManyDrivers);

// Driver self actions
router.get('/me', requireAuth, getMyProfile);
router.patch('/status', requireAuth, updateStatusAndHub);
router.post('/', requireAuth, createDriverProfile);

// Admin actions
router.get('/', requireAuth, requireRole('admin'), listDrivers);
router.put('/:id', requireAuth, requireRole('admin'), updateDriverProfile);

export default router;
