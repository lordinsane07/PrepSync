import { Router } from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth';
import {
  createRoom,
  getRoomByCode,
  joinRoom,
  endRoom,
  switchRole,
} from '../controllers/room.controller';

const router = Router();

router.post('/rooms', requireAuth, createRoom);
router.get('/rooms/:inviteCode', optionalAuth, getRoomByCode);
router.post('/rooms/:id/join', optionalAuth, joinRoom);
router.patch('/rooms/:id/end', optionalAuth, endRoom);
router.patch('/rooms/:id/role', requireAuth, switchRole);

export default router;
