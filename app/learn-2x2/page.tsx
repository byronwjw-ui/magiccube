'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import CubeView from '@/components/cube/CubeView';
import StatusBadge from '@/components/ui/StatusBadge';
import PremiumModal from '@/components/ui/PremiumModal';
import { TWO_OLL, TWO_PBL } from '@/lib/formulas';
import { storage } from '@/lib/storage';
import { speech } from '@/lib/speech';
import type { Formula, UserProgress } from '@/types';
import { cn } from '@/lib/utils';

export default function LearnTwoPage() {
  const [tab, setTab] = useState<'flow' | 'oll' | 'pbl'>('flow');
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [premiumOpen, setPremiumOpen] = useState(false);

  useEffect(() => {
    setProgress(storage.getAllProgress());
    const u = storage.getUser();
    if (u.kidMode) speech.speak('二阶魔方用 Ortega 法只需要十二个公式');
  }, []);

  function onClickFormula(e: React.MouseEvent, f: Formula) {
    if (f.isPremium && !storage.getUser().isPremium) {
      e.preventDefault();
      setPremiumOpen(true);
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-sm text-cube-blue">
          <Link href="/">← 返回首页</Link>
        </div>
        <h1 className="mt-2">二阶魔方 · Ortega 法</h1>
        <p className="text-gray-600 mt-1">三步还原：底面 → 顶面朝向 (OLL) → 上下两层同时归位 (PBL)。共 12 个公式。</p>

        {/* Tab */}
        <div className="mt-4 inline-flex bg-white rounded-2xl p-1 shadow-card flex-wrap">
          {[
            { k: 'flow', label: '📖 还原流程' },
            { k: 'oll', label: `OLL · ${TWO_OLL.length}` },
            { k: 'pbl', label: `PBL · ${TWO_PBL.length}` },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm md:text-base font-semibold transition',
                tab === t.k ? 'bg-cube-yellow text-cube-blue' : 'text-gray-600',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 流程 */}
        {tab === 'flow' && (
          <section className="mt-6 space-y-4">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="text-3xl">1️⃣</div>
                <h3>底面：随便还原一面</h3>
              </div>
              <p className="text-gray-600 mt-2">选一个颜色作为底（习惯用白色），把 4 个那个颜色的角块拼到一面。侧面不需要对齐中心，只要底面颜色一致就行。</p>
              <div className="mt-3 text-sm text-gray-500">💡 技巧：一般 5-15 步可还原，多拼几次就熟。</div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="text-3xl">2️⃣</div>
                <h3>OLL：顶面黄色朝上</h3>
              </div>
              <p className="text-gray-600 mt-2">让 4 个黄色面朝上（不要求位置对）。共 7 个 case，免费提供 Sune / Anti-Sune。</p>
              <button onClick={() => setTab('oll')} className="btn-primary mt-3">查看 7 个 OLL →</button>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="text-3xl">3️⃣</div>
                <h3>PBL：上下两层同时归位</h3>
              </div>
              <p className="text-gray-600 mt-2">一个公式同时调上下层的 4 个角，还原完成。共 5 个 case。</p>
              <button onClick={() => setTab('pbl')} className="btn-primary mt-3">查看 5 个 PBL →</button>
            </div>
            <div className="card bg-cube-yellow/20">
              <div className="font-bold">🎯 推荐路径</div>
              <ol className="mt-2 list-decimal pl-5 text-gray-700 space-y-1">
                <li>先背熟 Sune 和 Anti-Sune（与三阶完全一样）</li>
                <li>背熟“顶对换·底对换”=R2 F2 R2（3 步公式）</li>
                <li>背熟“顶邻换·底对换”（最常出现的 PBL）</li>
                <li>多拼几次该会了，遇到不会的 case 再查</li>
              </ol>
            </div>
          </section>
        )}

        {/* OLL 列表 */}
        {tab === 'oll' && (
          <section className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {TWO_OLL.map((f) => renderCard(f, progress, onClickFormula))}
          </section>
        )}
        {tab === 'pbl' && (
          <section className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {TWO_PBL.map((f) => renderCard(f, progress, onClickFormula))}
          </section>
        )}
      </main>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} feature="2x2_premium" />
    </>
  );
}

function renderCard(
  f: Formula,
  progress: Record<string, UserProgress>,
  onClickFormula: (e: React.MouseEvent, f: Formula) => void,
) {
  const p = progress[f.id];
  const status = p?.status ?? 'new';
  const locked = f.isPremium && !storage.getUser().isPremium;
  return (
    <Link
      key={f.id}
      href={`/learn-2x2/${f.id}`}
      onClick={(e) => onClickFormula(e, f)}
      className="card relative hover:shadow-pop transition"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1">
        {locked && <span className="text-lg">🔒</span>}
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center justify-center h-28 md:h-32 bg-gray-50 rounded-xl overflow-hidden">
        <CubeView
          alg={f.algorithm}
          setupAlg={f.setupMoves}
          visualization="3D"
          controlPanel="none"
          puzzle="2x2x2"
          size={110}
        />
      </div>
      <div className="mt-3">
        <div className="text-xs text-gray-500">{f.category} #{f.number}</div>
        <div className="font-semibold truncate">{f.name}</div>
        <div className="alg-text !text-xs text-gray-500 truncate wca-hide-on-kid">{f.algorithm}</div>
      </div>
    </Link>
  );
}
