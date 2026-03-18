import { Router } from 'express';
import { sendMagicLink, verifyMagicLink } from '../controllers/magicLink.controller';

const router = Router();

router.post('/auth/magic-link', sendMagicLink);
router.post('/auth/magic-link/verify', verifyMagicLink);

export default router;
