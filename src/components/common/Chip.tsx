import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type Props = {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'matched' | 'check' | 'gold';
  children?: ReactNode;
};

const variantStyles = {
  default: { bg: '#EAF3FB', color: '#1C6FB8' },
  matched: { bg: '#EAF7EE', color: '#2D8A4E' },
  check: { bg: '#FDF6E3', color: '#D4860A' },
  gold: { bg: '#FDF6E3', color: '#D4860A' },
};

export function Chip({ label, onRemove, variant = 'default', children }: Props) {
  const v = variantStyles[variant];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium"
      style={{ backgroundColor: v.bg, color: v.color }}
    >
      {children}
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 rounded-full hover:opacity-70"
          aria-label={`${label}を解除`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
