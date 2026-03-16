import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score < 40) return 'var(--color-danger)';
  if (score < 60) return 'var(--color-warning)';
  if (score < 80) return 'var(--color-text-primary)';
  return 'var(--color-accent)';
}

export default function ScoreRing({
  score,
  size = 100,
  strokeWidth = 6,
  animated = true,
  className,
}: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;
  const color = getScoreColor(clampedScore);

  useEffect(() => {
    if (!animated || !circleRef.current) return;

    const circle = circleRef.current;
    circle.style.strokeDashoffset = String(circumference);

    const timer = requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 800ms ease-in-out';
      circle.style.strokeDashoffset = String(offset);
    });

    return () => cancelAnimationFrame(timer);
  }, [animated, circumference, offset]);

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-subtle)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : offset}
        />
      </svg>
      <span
        className="absolute font-mono text-score"
        style={{
          color,
          fontSize: size * 0.35,
          lineHeight: 1,
        }}
        aria-label={`Score: ${clampedScore}`}
      >
        {clampedScore}
      </span>
    </div>
  );
}
