import { Router } from 'express';
import {
  estimateRide,
  requestRide,
  respondToRide,
  getRideById,
  getRides,
  completeRide,
  cancelRide,
} from '../controllers/ride.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Fare estimate & driver suggestions - open or auth
router.post('/estimate', estimateRide);

// Booking flow
router.post('/', requireAuth, requestRide);
router.get('/', requireAuth, getRides);
router.get('/:id', requireAuth, getRideById);
router.patch('/:id/respond', requireAuth, respondToRide);
router.patch('/:id/complete', requireAuth, completeRide);
router.patch('/:id/cancel', requireAuth, cancelRide);

export default router;
