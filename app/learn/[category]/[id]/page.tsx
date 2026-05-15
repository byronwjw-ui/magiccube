'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import CubeView from '@/components/cube/CubeView';
import StatusBadge from '@/components/ui/StatusBadge';
import PremiumModal from '@/components/ui/PremiumModal';
import { getAdjacentFormulas, getFormulaById } from '@/lib/formulas';
import { storage } from '@/lib/storage';
import { track } from '@/lib/analytics';
import { copyToClipboard, formatRelativeTime } from '@/lib/utils';
import type { UserProgress } from '@/types';

export default function FormulaDetailPage() {
  const params = useParams<{ category: string; id: string }>();
  const router = useRouter();
  const formula = useMemo(() => getFormulaById(params.id), [params.id]);
  const [progress, setProgress] = useState<UserProgress | undefined>();
  const [copied, setCopied] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);

  useEffect(() => {
    if (!formula) return;
    if (formula.isPremium && !storage.getUser().isPremium) {
      setPremiumOpen(true);
      return;
    }
    track('formula_view', { formulaId: formula.id, category: formula.category });
    setProgress(storage.getProgress(formula.id));
  }, [formula]);

  if (!formula) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10 text-center">
          <h2>没找到这个公式</h2>
          <Link href="/learn" className="btn-primary mt-4 inline-block">返回公式库</Link>
        </main>
      </>
    );
  }

  const { prev, next } = getAdjacentFormulas(formula.id);

  function handleCopy() {
    copyToClipboard(formula!.algorithm).then((ok) => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    });
  }

  function handleMastered() {
    if (!formula) return;
    storage.markMastered(formula.id);
    setProgress(storage.getProgress(formula.id));
    track('formula_mastered', { formulaId: formula.id });
  }

  function handleRelearn() {
    if (!formula) return;
    storage.markLearning(formula.id);
    setProgress(storage.getProgress(formula.id));
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/learn" className="text-sm text-gray-500">← 返回公式库</Link>
        <div className="mt-2 flex items-center gap-2">
          <h1 className="!text-3xl">{formula.name}</h1>
          <StatusBadge status={progress?.status ?? 'new'} />
          {formula.isPremium && <span className="text-2xl">🔒</span>}
        </div>
        <div className="text-gray-500">{formula.category} #{formula.number} · {formula.subCategory} · 难度 {'★'.repeat(formula.difficulty)}</div>

        {/* 魔方动画 */}
        <div className="card mt-4 flex items-center justify-center">
          <CubeView
            alg={formula.algorithm}
            setupAlg={formula.setupMoves}
            visualization="3D"
            controlPanel="bottom-row"
            backView="top-right"
            size={320}
          />
        </div>

        {/* 公式 */}
        <div className="card mt-4">
          <div className="text-sm text-gray-500">主公式</div>
          <div className="alg-text mt-2 break-words">{formula.algorithm}</div>
          <button onClick={handleCopy} className="btn-ghost mt-3">
            {copied ? '✅ 已复制' : '📋 复制公式'}
          </button>
          {formula.alternativeAlgorithms && formula.alternativeAlgorithms.length > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-500">备选公式</div>
              <ul className="mt-2 space-y-1">
                {formula.alternativeAlgorithms.map((a, i) => (
                  <li key={i} className="alg-text !text-base text-gray-700">{a}</li>
                ))}
              </ul>
            </div>
          )}
          {formula.tip && (
            <div className="mt-4 p-3 rounded-xl bg-cube-yellow/30 text-sm">💡 {formula.tip}</div>
          )}
        </div>

        {/* 状态操作 */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={handleMastered} className="btn" style={{ background: '#009B48', color: 'white' }}>✅ 标记为已掌握</button>
          <button onClick={handleRelearn} className="btn-ghost">🔄 重新学习</button>
        </div>

        {/* 练习历史 */}
        <div className="card mt-4">
          <h3>练习记录</h3>
          <div className="mt-2 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-cube-blue">{progress?.practiceCount ?? 0}</div>
              <div className="text-xs text-gray-500">总练习次数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cube-blue">{Math.round((progress?.successRate ?? 0) * 100)}%</div>
              <div className="text-xs text-gray-500">准确率</div>
            </div>
            <div>
              <div className="text-sm font-bold text-cube-blue">{formatRelativeTime(progress?.lastPracticedAt ?? 0)}</div>
              <div className="text-xs text-gray-500">上次练习</div>
            </div>
          </div>
        </div>

        {/* 上/下一个 */}
        <div className="mt-6 flex justify-between">
          {prev ? (
            <Link href={`/learn/${prev.category}/${prev.id}`} className="btn-ghost">← {prev.name}</Link>
          ) : <div />}
          {next ? (
            <Link href={`/learn/${next.category}/${next.id}`} className="btn-ghost">{next.name} →</Link>
          ) : <div />}
        </div>
      </main>
      <PremiumModal
        open={premiumOpen}
        onClose={() => { setPremiumOpen(false); router.push('/learn'); }}
        formulaId={formula.id}
      />
    </>
  );
}
