import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  listGroups,
  getMessages,
  sendMessage,
  createPoll,
  votePoll,
  deleteMessage,
} from '../controllers/group.controller';

const router = Router();

router.get('/groups', requireAuth, listGroups);
router.get('/groups/:id/messages', requireAuth, getMessages);
router.post('/groups/:id/messages', requireAuth, sendMessage);
router.post('/groups/:id/polls', requireAuth, createPoll);
router.post('/groups/:id/polls/:pollId/vote', requireAuth, votePoll);
router.delete('/groups/:id/messages/:msgId', requireAuth, deleteMessage);

export default router;
