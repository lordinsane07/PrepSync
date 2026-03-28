import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getMe,
  updateMe,
  getActivity,
} from '../controllers/user.controller';

const router: Router = Router();

router.get('/users/me', requireAuth, getMe);
router.patch('/users/me', requireAuth, updateMe);
router.get('/users/me/activity', requireAuth, getActivity);

export default router;
