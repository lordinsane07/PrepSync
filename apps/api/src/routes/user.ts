import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  getMe,
  updateMe,
} from '../controllers/user.controller';

const router = Router();

router.get('/users/me', requireAuth, getMe);
router.patch('/users/me', requireAuth, updateMe);

export default router;
