import { Router } from 'express';
import {
  register,
  verifyEmail,
  resendVerification,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  sendMagicLink,
  verifyMagicLink,
  completeOnboarding,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  refreshLimiter,
  resendLimiter,
} from '../middleware/rateLimiter';

const router = Router();

// Registration
router.post('/auth/register', registerLimiter, register);
router.post('/auth/verify-email', verifyEmail);
router.post('/auth/resend-verification', resendLimiter, resendVerification);

// Login
router.post('/auth/login', loginLimiter, login);
router.post('/auth/refresh', refreshLimiter, refresh);
router.post('/auth/logout', logout);

// Password reset
router.post('/auth/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/auth/reset-password', resetPassword);

// Magic link
router.post('/auth/magic-link', sendMagicLink);
router.get('/auth/magic', verifyMagicLink);

// Google OAuth (will be added when configured)
// router.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'email', 'profile'] }));
// router.get('/auth/google/callback', passport.authenticate('google', { session: false }), googleCallback);

// Onboarding (requires auth)
router.post('/auth/onboarding', requireAuth, completeOnboarding);

export default router;
