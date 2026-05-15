import type { FormulaStatus } from '@/types';
import { cn } from '@/lib/utils';

const MAP: Record<FormulaStatus, { label: string; cls: string }> = {
  new: { label: '未学', cls: 'bg-gray-200 text-gray-700' },
  learning: { label: '学习中', cls: 'bg-cube-yellow text-cube-blue' },
  mastered: { label: '已掌握', cls: 'bg-cube-green text-white' },
};

export default function StatusBadge({ status }: { status: FormulaStatus }) {
  const item = MAP[status];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', item.cls)}>
      {item.label}
    </span>
  );
}
