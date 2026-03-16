import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

interface ReadinessBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  delay?: number;
  className?: string;
}

export default function ReadinessBar({
  value,
  label,
  showValue = true,
  animated = true,
  delay = 0,
  className,
}: ReadinessBarProps) {
  const [width, setWidth] = useState(animated ? 0 : value);
  const barRef = useRef<HTMLDivElement>(null);
  const clampedValue = Math.max(0, Math.min(100, value));

  useEffect(() => {
    if (!animated) {
      setWidth(clampedValue);
      return;
    }

    const timer = setTimeout(() => {
      setWidth(clampedValue);
    }, delay + 100);

    return () => clearTimeout(timer);
  }, [animated, clampedValue, delay]);

  return (
    <div className={clsx('flex flex-col gap-[6px]', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-body text-text-secondary font-sans">{label}</span>
          )}
          {showValue && (
            <span className="text-code font-mono text-text-primary">
              {clampedValue}
            </span>
          )}
        </div>
      )}
      <div
        className="w-full h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-border-subtle)' }}
      >
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, var(--color-accent), #00A8CC)',
            transition: animated
              ? 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)'
              : 'none',
          }}
        />
      </div>
    </div>
  );
}
