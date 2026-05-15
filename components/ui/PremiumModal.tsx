'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { track } from '@/lib/analytics';

interface Props {
  open: boolean;
  onClose: () => void;
  formulaId?: string;
  feature?: string;
}

export default function PremiumModal({ open, onClose, formulaId, feature }: Props) {
  useEffect(() => {
    if (open) track('premium_modal_show', { formulaId, feature });
  }, [open, formulaId, feature]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-pop animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl text-center">🔒</div>
        <h2 className="text-center mt-3">这个是 Pro 内容</h2>
        <p className="text-center text-gray-600 mt-2">
          解锁全部 78 个公式、计时挑战、弱项强化与详细数据报告。
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/pricing" className="btn-primary text-center" onClick={onClose}>
            查看 Pro 详情
          </Link>
          <button className="btn-ghost" onClick={onClose}>稍后再说</button>
        </div>
      </div>
    </div>
  );
}
