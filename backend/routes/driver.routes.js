import { Router } from 'express';
import {
  getMyProfile,
  updateStatusAndHub,
  createDriverProfile,
  listDrivers,
  updateDriverProfile,
} from '../controllers/driver.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Driver self actions
router.get('/me', requireAuth, getMyProfile);
router.patch('/status', requireAuth, updateStatusAndHub);
router.post('/', requireAuth, createDriverProfile);

// Admin actions
router.get('/', requireAuth, requireRole('admin'), listDrivers);
router.put('/:id', requireAuth, requireRole('admin'), updateDriverProfile);

export default router;
