import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { PageWrapper } from '@/components/layout';
import { ToastProvider } from '@/components/ui';
import {
  SignupPage,
  LoginPage,
  VerifyEmailPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  OnboardingPage,
} from '@/features/auth';
import { DashboardPage } from '@/features/dashboard';
import { AIRoomPage, EvaluationReportPage } from '@/features/ai-room';
import { PeerRoomPage, JoinRoomPage } from '@/features/peer-room';
import { DomainGroupsPage } from '@/features/groups';
import { DMsPage } from '@/features/dms';
import { SessionHistoryPage } from '@/features/history';
import { SettingsPage } from '@/features/settings';
import AuthGuard from '@/components/guards/AuthGuard';

// Placeholder for protected pages — replaced as features are built
function PlaceholderPage({ title }: { title: string }) {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-display text-text-primary font-sans mb-2">{title}</h2>
        <p className="text-body text-text-secondary">This page is under construction.</p>
      </div>
    </PageWrapper>
  );
}

// Landing page
function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(var(--color-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        <p className="text-[11px] uppercase tracking-[0.08em] text-accent font-sans font-medium mb-4">
          Interview simulation platform
        </p>
        <h1 className="text-[52px] leading-[1.1] font-semibold text-text-primary font-sans mb-6">
          Get interview-ready.<br />Not just LeetCode-ready.
        </h1>
        <p className="text-heading text-text-secondary font-sans mb-8 max-w-lg mx-auto">
          Practice with AI interviewers, collaborate with peers, track your readiness — all in one tab.
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <a
            href="/signup"
            className="inline-flex items-center px-6 py-3 bg-accent text-text-inverse font-sans font-medium rounded-md hover:bg-[#00BBDF] transition-colors"
          >
            Start for free
          </a>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-3 text-text-secondary font-sans font-medium hover:text-text-primary transition-colors"
          >
            See how it works →
          </a>
        </div>
        <p className="text-caption text-text-muted font-sans">
          No credit card. No setup. Start in 60 seconds.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Auth callback (magic link / Google OAuth) */}
        <Route path="/auth/callback" element={<PlaceholderPage title="Authenticating..." />} />
        <Route path="/auth/magic" element={<PlaceholderPage title="Signing in..." />} />

        {/* Peer room join (public — supports guests) */}
        <Route path="/room/:inviteCode" element={<JoinRoomPage />} />

        {/* Protected routes (inside app layout + auth guard) */}
        <Route
          element={
            <AuthGuard requireOnboarding>
              <AppLayout />
            </AuthGuard>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ai-room/:sessionId" element={<AIRoomPage />} />
          <Route path="/ai-room/:sessionId/report" element={<EvaluationReportPage />} />
          <Route path="/peer-room" element={<PeerRoomPage />} />
          <Route path="/groups" element={<DomainGroupsPage />} />
          <Route path="/groups/:groupId" element={<DomainGroupsPage />} />
          <Route path="/dms" element={<DMsPage />} />
          <Route path="/dms/:threadId" element={<DMsPage />} />
          <Route path="/history" element={<SessionHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
}
