import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Spinner } from '@/components/ui';

interface AuthGuardProps {
  children: ReactNode;
  requireOnboarding?: boolean;
}

export default function AuthGuard({ children, requireOnboarding = false }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, refreshAuth } = useAuthStore();
  const location = useLocation();

  // Try to refresh auth on mount
  useEffect(() => {
    if (!isAuthenticated && isLoading) {
      refreshAuth();
    }
  }, [isAuthenticated, isLoading, refreshAuth]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Require onboarding
  if (requireOnboarding && user && !user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
