import { useState, type FormEvent } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { resetPassword } from '@/services/auth.service';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const userId = searchParams.get('uid') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ token, userId, newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to reset password. The link may be expired.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-[420px]">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <span className="text-[11px] font-bold text-text-inverse font-mono">PS</span>
          </div>
          <span className="text-heading text-text-primary font-sans font-semibold">PrepSync</span>
        </Link>

        {success ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-success-dim flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="text-display text-text-primary font-sans mb-2">Password reset!</h1>
            <p className="text-body text-text-secondary">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-display text-text-primary font-sans mb-2">Set new password</h1>
            <p className="text-body text-text-secondary mb-8">
              Choose a strong password for your account.
            </p>

            {error && (
              <div className="mb-6 px-4 py-3 rounded-md bg-danger-dim border border-danger/20 text-body text-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="New password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a new password"
                autoComplete="new-password"
              />
              <Input
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Reset password
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
