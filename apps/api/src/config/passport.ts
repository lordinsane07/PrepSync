import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import { env } from './env';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: env.GOOGLE_CALLBACK_URL || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error('No email found from Google profile'), undefined);
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
          // If user exists but doesn't have googleId (signed up via email earlier), link them
          if (!user.googleId) {
            user.googleId = profile.id;
            // Also mark as verified if they weren't already
            if (!user.emailVerified) {
              user.emailVerified = true;
            }
            if (!user.avatarUrl && profile.photos?.[0]?.value) {
              user.avatarUrl = profile.photos[0].value;
            }
            await user.save();
          }
          return done(null, user);
        }

        // New user — create account
        user = await User.create({
          email,
          name: profile.displayName || email.split('@')[0],
          googleId: profile.id,
          avatarUrl: profile.photos?.[0]?.value,
          emailVerified: true, // Google verifies emails
          onboardingComplete: false,
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
