import { useEffect, useRef, useState } from 'react';
import type { Domain } from '@prepsync/shared';
import { DOMAIN_LABELS } from '@prepsync/shared';

interface WeaknessRadarProps {
  data: Record<Domain, number>;
  size?: number;
  animated?: boolean;
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

export default function WeaknessRadar({
  data,
  size = 300,
  animated = true,
  className,
}: WeaknessRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(animated ? 0 : 1);

  useEffect(() => {
    if (!animated) return;
    const start = performance.now();
    const duration = 800;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [animated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const maxRadius = size * 0.38;
    const numAxes = DOMAINS.length;
    const angleStep = (2 * Math.PI) / numAxes;
    const startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, size, size);

    // Draw grid circles
    for (let ring = 1; ring <= 4; ring++) {
      const r = (ring / 4) * maxRadius;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(30, 35, 48, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const x = cx + maxRadius * Math.cos(angle);
      const y = cy + maxRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(30, 35, 48, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Labels
      const labelR = maxRadius + 20;
      const lx = cx + labelR * Math.cos(angle);
      const ly = cy + labelR * Math.sin(angle);

      ctx.font = '11px "DM Sans", sans-serif';
      ctx.fillStyle = '#8B91A8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(DOMAIN_LABELS[DOMAINS[i]], lx, ly);
    }

    // Draw data polygon
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const value = (data[DOMAINS[i]] / 100) * progress;
      const r = value * maxRadius;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Fill with gradient
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0.03)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = 'var(--color-accent)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const value = (data[DOMAINS[i]] / 100) * progress;
      const r = value * maxRadius;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = DOMAIN_COLORS[DOMAINS[i]];
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = '#0A0B0E';
      ctx.fill();
    }
  }, [data, size, progress]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
      />
    </div>
  );
}
