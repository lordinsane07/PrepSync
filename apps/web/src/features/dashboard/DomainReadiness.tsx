import type { Domain } from '@prepsync/shared';
import { DOMAIN_LABELS } from '@prepsync/shared';

interface DomainReadinessProps {
  data: Record<Domain, number>;
  className?: string;
}

const DOMAINS: Domain[] = ['dsa', 'systemDesign', 'backend', 'conceptual', 'behavioural'];

const DOMAIN_COLORS: Record<Domain, string> = {
  dsa: '#7C3AED',
  systemDesign: '#0EA5E9',
  backend: '#10B981',
  conceptual: '#F59E0B',
  behavioural: '#EC4899',
};

function getDomainBarStyle(domain: Domain) {
  const color = DOMAIN_COLORS[domain];
  return {
    background: `linear-gradient(90deg, ${color}, ${color}90)`,
  };
}

export default function DomainReadiness({ data, className }: DomainReadinessProps) {
  return (
    <div className={className}>
      <h3 className="text-heading text-text-primary font-sans font-semibold mb-4">
        Domain Readiness
      </h3>
      <div className="flex flex-col gap-4">
        {DOMAINS.map((domain, index) => (
          <div key={domain} className="flex items-center gap-4">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: DOMAIN_COLORS[domain] }}
            />
            <div className="w-[120px] shrink-0">
              <span className="text-body text-text-secondary font-sans">
                {DOMAIN_LABELS[domain]}
              </span>
            </div>
            <div className="flex-1">
              <div className="w-full h-2 rounded-full overflow-hidden bg-[var(--color-border-subtle)]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${data[domain]}%`,
                    ...getDomainBarStyle(domain),
                    transitionDelay: `${index * 100}ms`,
                  }}
                />
              </div>
            </div>
            <span className="text-code font-mono text-text-primary w-8 text-right">
              {data[domain]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
