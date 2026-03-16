import { type HTMLAttributes, type ReactNode } from 'react';
import { clsx } from 'clsx';

type CardVariant = 'base' | 'interactive' | 'accent';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  base: 'bg-bg-surface border border-border-subtle',
  interactive:
    'bg-bg-surface border border-border-subtle hover:border-border-default cursor-pointer transition-colors duration-150',
  accent:
    'bg-bg-surface border border-border-subtle border-l-2 border-l-accent',
};

export default function Card({
  variant = 'base',
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg p-6',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
