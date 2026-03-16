import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  accentColor?: string;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor,
  className,
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        'bg-bg-surface border border-border-subtle rounded-lg p-5 flex flex-col gap-3',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-caption text-text-muted font-sans uppercase tracking-[0.04em]">
          {title}
        </span>
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center"
          style={{ backgroundColor: accentColor ? `${accentColor}15` : 'var(--color-accent-dim)' }}
        >
          <span style={{ color: accentColor || 'var(--color-accent)' }}>{icon}</span>
        </div>
      </div>

      <div>
        <p
          className="text-[28px] leading-none font-semibold font-mono"
          style={{ color: accentColor || 'var(--color-text-primary)' }}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-caption text-text-muted font-sans mt-1">{subtitle}</p>
        )}
      </div>

      {trend && (
        <div className="flex items-center gap-1">
          <span
            className={clsx(
              'text-caption font-mono font-medium',
              trend.value >= 0 ? 'text-success' : 'text-danger',
            )}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}
          </span>
          <span className="text-caption text-text-muted">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
