import { clsx } from 'clsx';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: AvatarSize;
  isOnline?: boolean;
  colorSeed?: string;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; dot: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-[11px]', dot: 'w-2 h-2 border' },
  md: { container: 'w-10 h-10', text: 'text-label', dot: 'w-[10px] h-[10px] border-[1.5px]' },
  lg: { container: 'w-12 h-12', text: 'text-body', dot: 'w-3 h-3 border-2' },
};

const AVATAR_COLORS = [
  '#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899',
  '#6366F1', '#14B8A6', '#F97316', '#8B5CF6', '#06B6D4',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function Avatar({
  name,
  imageUrl,
  size = 'md',
  isOnline,
  colorSeed,
  className,
}: AvatarProps) {
  const styles = sizeStyles[size];
  const bgColor = getColor(colorSeed || name);

  return (
    <div className={clsx('relative inline-flex shrink-0', className)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className={clsx(styles.container, 'rounded-full object-cover')}
        />
      ) : (
        <div
          className={clsx(
            styles.container,
            'rounded-full flex items-center justify-center font-sans font-medium',
          )}
          style={{ backgroundColor: bgColor }}
        >
          <span className={clsx(styles.text, 'text-white')}>
            {getInitials(name)}
          </span>
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-bg-surface',
            styles.dot,
            isOnline ? 'bg-success' : 'bg-text-muted',
          )}
        />
      )}
    </div>
  );
}
