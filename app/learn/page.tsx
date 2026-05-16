'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import StatusBadge from '@/components/ui/StatusBadge';
import PremiumModal from '@/components/ui/PremiumModal';
import CubeView from '@/components/cube/CubeView';
import { ALL_FORMULAS, getSubCategories } from '@/lib/formulas';
import { storage } from '@/lib/storage';
import { speech } from '@/lib/speech';
import type { Formula, FormulaCategory, UserProgress } from '@/types';
import { cn } from '@/lib/utils';

type TopTab = 'flow' | 'OLL' | 'PLL';

export default function LearnPage() {
  const [topTab, setTopTab] = useState<TopTab>('flow');
  const [search, setSearch] = useState('');
  const [sub, setSub] = useState<string>('ALL');
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [lockedId, setLockedId] = useState<string | undefined>();

  const formulaTab: FormulaCategory = topTab === 'PLL' ? 'PLL' : 'OLL';

  useEffect(() => {
    setProgress(storage.getAllProgress());
    const u = storage.getUser();
    if (u.kidMode) speech.speak('三阶公式比较多，我们先看学习路线，再决定学 O L L 还是 P L L。');
  }, []);

  useEffect(() => {
    setSub('ALL');
    setSearch('');
  }, [topTab]);

  const subCategories = useMemo(() => ['ALL', ...getSubCategories(formulaTab)], [formulaTab]);

  const filtered = useMemo(() => {
    return ALL_FORMULAS.filter((f) => f.category === formulaTab)
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
  }, [formulaTab, sub, search]);

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
        <div className="text-sm text-cube-blue">
          <Link href="/">← 返回首页</Link>
        </div>
        <h1 className="mt-2">三阶 CFOP</h1>
        <p className="text-gray-600 mt-1">先看路线，再学 OLL / PLL。三阶比二阶复杂，但一旦学会就能真正开始提速。</p>

        {/* 顶层结构：像二阶一样，先有学习路线 */}
        <div className="mt-4 inline-flex bg-white rounded-2xl p-1 shadow-card flex-wrap">
          {[
            { k: 'flow', label: '📖 学习路线' },
            { k: 'OLL', label: 'OLL · 57' },
            { k: 'PLL', label: 'PLL · 21' },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTopTab(t.k as TopTab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm md:text-base font-semibold transition',
                topTab === t.k ? 'bg-cube-yellow text-cube-blue' : 'text-gray-600',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 学习路线 */}
        {topTab === 'flow' && (
          <section className="mt-6 space-y-4">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="text-3xl">1️⃣</div>
                <h3>先学会还原，再学公式</h3>
              </div>
              <p className="text-gray-600 mt-2">如果你还不会三阶还原，请先去「入门」里的三阶教程。OLL 和 PLL 是给已经会还原的人学的。</p>
              <Link href="/tutorial" className="btn-primary mt-3 inline-block">去三阶入门</Link>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="text-3xl">2️⃣</div>
                <h3>OLL：先把顶面全变黄</h3>
              </div>
              <p className="text-gray-600 mt-2">OLL = Orientation of the Last Layer。目标是：顶面 9 块全部变成黄色。共 57 个公式。</p>
              <div className="mt-3 flex items-center justify-center bg-gray-50 rounded-2xl p-3">
                <CubeView
                  alg="R U R' U R U2 R'"
                  setupAlg="R U2' R' U' R U' R'"
                  visualization="3D"
                  controlPanel="none"
                  size={180}
                />
              </div>
              <div className="mt-3 text-sm text-gray-500">推荐先学：Sune、Anti-Sune、T、P、H 这几个高频 OLL。</div>
              <button onClick={() => setTopTab('OLL')} className="btn-primary mt-3">查看 57 个 OLL →</button>
            </div>

            <div className="card">
              <div className="flex items-center gap-3">
                <div className="text-3xl">3️⃣</div>
                <h3>PLL：最后一层归位</h3>
              </div>
              <p className="text-gray-600 mt-2">PLL = Permutation of the Last Layer。目标是：顶层颜色已经朝上，再把角块和棱块换到正确位置。共 21 个公式。</p>
              <div className="mt-3 flex items-center justify-center bg-gray-50 rounded-2xl p-3">
                <CubeView
                  alg="R U' R U R U R U' R' U' R2"
                  setupAlg="R2' U R U R' U' R' U' R' U R'"
                  visualization="3D"
                  controlPanel="none"
                  size={180}
                />
              </div>
              <div className="mt-3 text-sm text-gray-500">推荐先学：Ua、Ub、H、Z、T 这几个最常见的 PLL。</div>
              <button onClick={() => setTopTab('PLL')} className="btn-primary mt-3">查看 21 个 PLL →</button>
            </div>

            <div className="card bg-cube-yellow/20">
              <div className="font-bold">🎯 推荐路径</div>
              <ol className="mt-2 list-decimal pl-5 text-gray-700 space-y-1">
                <li>先学会三阶基础还原（层先法）</li>
                <li>PLL 先学：Ua → Ub → H → Z → T</li>
                <li>OLL 先学：Sune → Anti-Sune → T → P → H</li>
                <li>公式熟了再去练习模式刷闪卡</li>
              </ol>
            </div>
          </section>
        )}

        {/* OLL / PLL 公式库 */}
        {topTab !== 'flow' && (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
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

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`搜索${topTab}编号或名称，如 ${topTab === 'OLL' ? '27、Sune' : 'Ua、T Perm'}…`}
              className="mt-4 w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-cube-blue"
            />

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
                        visualization="3D"
                        controlPanel="none"
                        background="none"
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
              })}
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-10">没有匹配的公式</div>
              )}
            </div>
          </>
        )}
      </main>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} formulaId={lockedId} />
    </>
  );
}
