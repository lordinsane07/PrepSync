import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import type { Domain } from '@prepsync/shared';

const GOALS = [
  { value: 'placement', label: 'Campus Placement', desc: 'Preparing for on-campus interviews' },
  { value: 'switch', label: 'Job Switch', desc: 'Switching to a better company' },
  { value: 'practice', label: 'Regular Practice', desc: 'Staying sharp and consistent' },
] as const;

const DOMAINS: { value: Domain; label: string }[] = [
  { value: 'dsa', label: 'DSA' },
  { value: 'systemDesign', label: 'System Design' },
  { value: 'backend', label: 'Backend' },
  { value: 'conceptual', label: 'Conceptual' },
  { value: 'behavioural', label: 'Behavioural' },
];

const WEEKLY_OPTIONS = [3, 5, 7, 10, 14];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const completeOnboardingAction = useAuthStore((s) => s.completeOnboarding);
  const userName = useAuthStore((s) => s.user?.name || 'there');

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  function toggleDomain(d: Domain) {
    setDomains((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  async function handleComplete(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await completeOnboardingAction(goal, domains, weeklyGoal);
      navigate('/dashboard');
    } catch {
      // Silently navigate — onboarding is optional data
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-[520px]">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: i <= step ? 'var(--color-accent)' : 'var(--color-border-subtle)',
              }}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="animate-page-enter">
            <h1 className="text-display text-text-primary font-sans mb-2">
              Hi {userName.split(' ')[0]} 👋
            </h1>
            <p className="text-body text-text-secondary mb-8">
              What best describes your goal?
            </p>
            <div className="flex flex-col gap-3">
              {GOALS.map((g) => (
                <Card
                  key={g.value}
                  variant={goal === g.value ? 'accent' : 'interactive'}
                  onClick={() => setGoal(g.value)}
                  className={goal === g.value ? 'border-accent/30' : ''}
                >
                  <p className="text-body text-text-primary font-sans font-medium">{g.label}</p>
                  <p className="text-caption text-text-secondary mt-1">{g.desc}</p>
                </Card>
              ))}
            </div>
            <Button
              variant="primary"
              className="w-full mt-6"
              disabled={!goal}
              onClick={() => setStep(1)}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-page-enter">
            <h1 className="text-display text-text-primary font-sans mb-2">
              Pick your focus areas
            </h1>
            <p className="text-body text-text-secondary mb-8">
              Select the domains you want to practice. You can change these later.
            </p>
            <div className="flex flex-wrap gap-3">
              {DOMAINS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => toggleDomain(d.value)}
                  className="transition-all duration-150"
                >
                  <Badge
                    variant="domain"
                    domain={d.value}
                    className={`px-4 py-2 text-label cursor-pointer ${
                      domains.includes(d.value) ? 'ring-2 ring-accent/30' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="secondary" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                disabled={domains.length === 0}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleComplete} className="animate-page-enter">
            <h1 className="text-display text-text-primary font-sans mb-2">
              Set a weekly goal
            </h1>
            <p className="text-body text-text-secondary mb-8">
              How many mock interviews per week?
            </p>
            <div className="flex gap-3">
              {WEEKLY_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setWeeklyGoal(n)}
                  className={`flex-1 py-3 rounded-md border text-body font-mono font-medium transition-all ${
                    weeklyGoal === n
                      ? 'bg-accent-dim border-accent text-accent'
                      : 'bg-bg-elevated border-border-default text-text-secondary hover:border-border-strong'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-caption text-text-muted mt-3 text-center">
              {weeklyGoal <= 3 && 'Light — perfect for busy weeks'}
              {weeklyGoal > 3 && weeklyGoal <= 7 && 'Balanced — great consistency'}
              {weeklyGoal > 7 && 'Intense — prepared to grind 🔥'}
            </p>
            <div className="flex gap-3 mt-8">
              <Button variant="secondary" type="button" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" variant="primary" className="flex-1" isLoading={isLoading}>
                Let's go!
              </Button>
            </div>
          </form>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full text-center text-body text-text-muted hover:text-text-secondary mt-4 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
