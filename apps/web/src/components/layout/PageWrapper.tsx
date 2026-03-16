import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main
      className={clsx(
        'p-8 max-w-[1100px] mx-auto animate-page-enter',
        className,
      )}
    >
      {children}
    </main>
  );
}
