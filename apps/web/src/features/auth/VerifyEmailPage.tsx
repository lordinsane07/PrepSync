import { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent, type FormEvent } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { resendVerification } from '@/services/auth.service';

const OTP_LENGTH = 6;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyAction = useAuthStore((s) => s.verifyEmail);

  const userId = (location.state as { userId?: string })?.userId;
  const email = (location.state as { email?: string })?.email;
  const redirect = (location.state as { redirect?: string })?.redirect;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Auto-redirect if no userId
  useEffect(() => {
    if (!userId) navigate('/signup', { replace: true });
  }, [userId, navigate]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-advance
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every((d) => d !== '') && value) {
      submitOtp(newOtp.join(''));
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();

    if (pasted.length === OTP_LENGTH) {
      submitOtp(pasted);
    }
  }

  async function submitOtp(otpStr: string) {
    if (!userId) return;
    setIsLoading(true);
    setError('');

    try {
      await verifyAction(userId, otpStr);
      navigate(redirect || '/onboarding');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Invalid verification code');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!userId || !canResend) return;
    try {
      await resendVerification(userId);
      setResendTimer(60);
      setCanResend(false);
      setError('');
    } catch {
      setError('Failed to resend code. Please try again.');
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const otpStr = otp.join('');
    if (otpStr.length === OTP_LENGTH) {
      submitOtp(otpStr);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-[420px] text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <span className="text-[11px] font-bold text-text-inverse font-mono">PS</span>
          </div>
          <span className="text-heading text-text-primary font-sans font-semibold">PrepSync</span>
        </Link>

        <h1 className="text-display text-text-primary font-sans mb-2">Check your email</h1>
        <p className="text-body text-text-secondary mb-8">
          We sent a 6-digit code to{' '}
          <span className="text-text-primary font-medium">{email || 'your email'}</span>
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-md bg-danger-dim border border-danger/20 text-body text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-title font-mono bg-bg-elevated border border-border-default rounded-md caret-accent focus:outline-none focus:border-accent-border focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] transition-all text-text-primary"
                autoFocus={i === 0}
              />
            ))}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={otp.some((d) => !d)}
          >
            Verify email
          </Button>
        </form>

        <p className="text-body text-text-secondary mt-6">
          Didn't receive the code?{' '}
          {canResend ? (
            <button onClick={handleResend} className="text-accent hover:underline">
              Resend code
            </button>
          ) : (
            <span className="text-text-muted">
              Resend in <span className="font-mono text-text-secondary">{resendTimer}s</span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
