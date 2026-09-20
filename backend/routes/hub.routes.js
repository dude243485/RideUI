import { Router } from 'express';
import {
  listHubs,
  getHubById,
  createHub,
  updateHub,
  deleteHub,
} from '../controllers/hub.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Publicly readable campus hubs for booking UI
router.get('/', listHubs);
router.get('/:id', getHubById);

// Admin-only management
router.post('/', requireAuth, requireRole('admin'), createHub);
router.put('/:id', requireAuth, requireRole('admin'), updateHub);
router.delete('/:id', requireAuth, requireRole('admin'), deleteHub);

export default router;
