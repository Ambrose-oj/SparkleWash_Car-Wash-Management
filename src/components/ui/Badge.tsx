import { clsx } from 'clsx';
import type { LeadStatus } from '../../types';

interface BadgeProps {
  status: LeadStatus;
  className?: string;
}

const config: Record<LeadStatus, { label: string; classes: string; dot: string }> = {
  new: {
    label: 'New Lead',
    classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    dot: 'bg-blue-400',
  },
  contacted: {
    label: 'Contacted',
    classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    dot: 'bg-amber-400',
  },
  converted: {
    label: 'Converted',
    classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
};

export function Badge({ status, className }: BadgeProps) {
  const { label, classes, dot } = config[status];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-body',
        classes,
        className
      )}
    >
      <span className={clsx('h-1.5 w-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
}
