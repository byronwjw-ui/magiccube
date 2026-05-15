'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import StatusBadge from '@/components/ui/StatusBadge';
import PremiumModal from '@/components/ui/PremiumModal';
import CubeView from '@/components/cube/CubeView';
import { ALL_FORMULAS, getSubCategories } from '@/lib/formulas';
import { storage } from '@/lib/storage';
import type { Formula, FormulaCategory, UserProgress } from '@/types';
import { cn } from '@/lib/utils';

export default function LearnPage() {
  const [tab, setTab] = useState<FormulaCategory>('OLL');
  const [search, setSearch] = useState('');
  const [sub, setSub] = useState<string>('ALL');
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [lockedId, setLockedId] = useState<string | undefined>();

  useEffect(() => {
    setProgress(storage.getAllProgress());
  }, []);

  const subCategories = useMemo(() => ['ALL', ...getSubCategories(tab)], [tab]);

  const filtered = useMemo(() => {
    return ALL_FORMULAS.filter((f) => f.category === tab)
      .filter((f) => (sub === 'ALL' ? true : f.subCategory === sub))
      .filter((f) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          String(f.number).includes(q) ||
          f.id.includes(q)
        );
      })
      .sort((a, b) => a.number - b.number);
  }, [tab, sub, search]);

  function onClickFormula(e: React.MouseEvent, f: Formula) {
    if (f.isPremium && !storage.getUser().isPremium) {
      e.preventDefault();
      setLockedId(f.id);
      setPremiumOpen(true);
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1>公式库</h1>
        <p className="text-gray-600 mt-1">点击公式查看动画详情。锁号 🔒 = Pro 专享。</p>

        {/* Tab */}
        <div className="mt-4 inline-flex bg-white rounded-2xl p-1 shadow-card">
          {(['OLL', 'PLL'] as FormulaCategory[]).map((c) => (
            <button
              key={c}
              onClick={() => { setTab(c); setSub('ALL'); }}
              className={cn(
                'px-5 py-2 rounded-xl text-sm md:text-base font-semibold transition',
                tab === c ? 'bg-cube-yellow text-cube-blue' : 'text-gray-600',
              )}
            >
              {c} · {c === 'OLL' ? 57 : 21} 个
            </button>
          ))}
        </div>

        {/* 子分类过滤 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {subCategories.map((s) => (
            <button
              key={s}
              onClick={() => setSub(s)}
              className={cn(
                'px-3 py-1 rounded-full text-sm border transition',
                sub === s
                  ? 'bg-cube-blue text-white border-cube-blue'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-cube-blue',
              )}
            >
              {s === 'ALL' ? '全部' : s}
            </button>
          ))}
        </div>

        {/* 搜索 */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索编号或名称，如 27、Sune、Ua…"
          className="mt-4 w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-cube-blue"
        />

        {/* 列表 */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((f) => {
            const p = progress[f.id];
            const status = p?.status ?? 'new';
            const locked = f.isPremium && !storage.getUser().isPremium;
            return (
              <Link
                key={f.id}
                href={`/learn/${f.category}/${f.id}`}
                onClick={(e) => onClickFormula(e, f)}
                className="card relative hover:shadow-pop transition group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {locked && <span className="text-lg" title="Pro">🔒</span>}
                  <StatusBadge status={status} />
                </div>
                <div className="flex items-center justify-center h-28 md:h-32 bg-gray-50 rounded-xl overflow-hidden">
                  <CubeView
                    alg={f.algorithm}
                    setupAlg={f.setupMoves}
                    visualization="experimental-2D-LL"
                    controlPanel="none"
                    background="none"
                    size={110}
                  />
                </div>
                <div className="mt-3">
                  <div className="text-xs text-gray-500">{f.category} #{f.number}</div>
                  <div className="font-semibold truncate">{f.name}</div>
                  <div className="alg-text !text-xs text-gray-500 truncate">{f.algorithm}</div>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-10">没有匹配的公式</div>
          )}
        </div>
      </main>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} formulaId={lockedId} />
    </>
  );
}
