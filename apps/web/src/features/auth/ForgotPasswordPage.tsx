import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { forgotPassword } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      // Always show success (no email enumeration)
      setSent(true);
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

        {sent ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-accent-dim flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h1 className="text-display text-text-primary font-sans mb-2">Check your email</h1>
            <p className="text-body text-text-secondary mb-6">
              If an account with <span className="text-text-primary">{email}</span> exists, we've sent a reset link.
            </p>
            <Link to="/login" className="text-accent text-body hover:underline">
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-display text-text-primary font-sans mb-2">Reset your password</h1>
            <p className="text-body text-text-secondary mb-8">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Send reset link
              </Button>
            </form>
            <p className="text-body text-text-secondary mt-6 text-center">
              <Link to="/login" className="text-accent hover:underline">Back to login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
