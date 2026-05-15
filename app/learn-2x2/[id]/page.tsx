'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import CubeView from '@/components/cube/CubeView';
import StatusBadge from '@/components/ui/StatusBadge';
import PremiumModal from '@/components/ui/PremiumModal';
import { getFormulaById, TWO_FORMULAS } from '@/lib/formulas';
import { storage } from '@/lib/storage';
import { speech } from '@/lib/speech';
import { track } from '@/lib/analytics';
import { copyToClipboard, formatRelativeTime } from '@/lib/utils';
import type { UserProgress } from '@/types';

export default function TwoFormulaDetailPage() {
  const params = useParams<{ id: string }>();
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
    if (storage.getUser().kidMode && formula.tip) speech.speak(formula.tip);
  }, [formula]);

  if (!formula) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-10 text-center">
          <h2>没找到这个公式</h2>
          <Link href="/learn-2x2" className="btn-primary mt-4 inline-block">返回二阶</Link>
        </main>
      </>
    );
  }

  const list = TWO_FORMULAS.filter((f) => f.category === formula.category).sort((a, b) => a.number - b.number);
  const idx = list.findIndex((f) => f.id === formula.id);
  const prev = idx > 0 ? list[idx - 1] : undefined;
  const next = idx < list.length - 1 ? list[idx + 1] : undefined;

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
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/learn-2x2" className="text-sm text-cube-blue">← 返回二阶</Link>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <h1 className="!text-3xl">{formula.name}</h1>
          <StatusBadge status={progress?.status ?? 'new'} />
          {formula.isPremium && <span className="text-2xl">🔒</span>}
        </div>
        <div className="text-gray-500">{formula.category} #{formula.number} · {formula.subCategory} · 难度 {'★'.repeat(formula.difficulty)}</div>

        <div className="card mt-4 flex items-center justify-center">
          <CubeView
            alg={formula.algorithm}
            setupAlg={formula.setupMoves}
            visualization="3D"
            controlPanel="bottom-row"
            puzzle="2x2x2"
            size={320}
          />
        </div>

        <div className="card mt-4">
          <div className="text-sm text-gray-500">主公式</div>
          <div className="alg-text mt-2 break-words wca-hide-on-kid">{formula.algorithm}</div>
          <div className="text-sm text-cube-blue md:hidden block">小朋友模式下字母会隐藏，请看动画跳转</div>
          <button onClick={handleCopy} className="btn-ghost mt-3">
            {copied ? '✅ 已复制' : '📋 复制公式'}
          </button>
          {formula.tip && (
            <div className="mt-4 p-3 rounded-xl bg-cube-yellow/30 text-sm">💡 {formula.tip}</div>
          )}
          {formula.alternativeAlgorithms && formula.alternativeAlgorithms.length > 0 && (
            <div className="mt-4 wca-hide-on-kid">
              <div className="text-sm text-gray-500">备选公式</div>
              <ul className="mt-2 space-y-1">
                {formula.alternativeAlgorithms.map((a, i) => (
                  <li key={i} className="alg-text !text-base text-gray-700">{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={handleMastered} className="btn" style={{ background: '#009B48', color: 'white' }}>✅ 标记为已掌握</button>
          <button onClick={() => storage.markLearning(formula.id)} className="btn-ghost">🔄 重新学习</button>
        </div>

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

        <div className="mt-6 flex justify-between">
          {prev ? (
            <Link href={`/learn-2x2/${prev.id}`} className="btn-ghost">← {prev.name}</Link>
          ) : <div />}
          {next ? (
            <Link href={`/learn-2x2/${next.id}`} className="btn-ghost">{next.name} →</Link>
          ) : <div />}
        </div>
      </main>
      <PremiumModal
        open={premiumOpen}
        onClose={() => { setPremiumOpen(false); router.push('/learn-2x2'); }}
        formulaId={formula.id}
      />
    </>
  );
}
