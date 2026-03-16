import { useEffect, useRef, useState } from 'react';

interface WeeklyGoalRingProps {
  completed: number;
  goal: number;
  size?: number;
  className?: string;
}

export default function WeeklyGoalRing({
  completed,
  goal,
  size = 160,
  className,
}: WeeklyGoalRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((completed / goal) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;
  const isComplete = completed >= goal;

  const [displayCount, setDisplayCount] = useState(0);

  // Animate the count
  useEffect(() => {
    const duration = 800;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      setDisplayCount(Math.round(t * completed));
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [completed]);

  // Animate the ring
  useEffect(() => {
    if (!circleRef.current) return;
    const circle = circleRef.current;
    circle.style.strokeDashoffset = String(circumference);

    requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 800ms ease-in-out';
      circle.style.strokeDashoffset = String(offset);
    });
  }, [circumference, offset]);

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--color-border-subtle)"
              strokeWidth={strokeWidth}
            />
            <circle
              ref={circleRef}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={isComplete ? 'var(--color-success)' : 'var(--color-accent)'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[32px] leading-none font-mono font-semibold text-text-primary">
              {displayCount}
            </span>
            <span className="text-caption text-text-muted font-sans mt-1">
              of {goal}
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-body text-text-primary font-sans font-medium">
            {isComplete ? '🎯 Goal reached!' : 'Weekly Sessions'}
          </p>
          <p className="text-caption text-text-muted font-sans mt-1">
            {goal - completed > 0
              ? `${goal - completed} more to hit your goal`
              : "You\u0027re on fire! Keep it up!"}
          </p>
        </div>
      </div>
    </div>
  );
}
