import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createSession,
  sendMessage,
  endSession,
  getSession,
  listSessions,
} from '../controllers/session.controller';

const router = Router();

router.post('/sessions', requireAuth, createSession);
router.get('/sessions', requireAuth, listSessions);
router.get('/sessions/:id', requireAuth, getSession);
router.post('/sessions/:id/message', requireAuth, sendMessage);
router.patch('/sessions/:id/end', requireAuth, endSession);

export default router;
