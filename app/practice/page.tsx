'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import PremiumModal from '@/components/ui/PremiumModal';
import Flashcard, { type FlashcardScope } from './Flashcard';
import { storage } from '@/lib/storage';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

type Mode = 'flashcard' | 'timed' | 'weakness';

export default function PracticePage() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [scope, setScope] = useState<FlashcardScope>('3x3');
  const [premiumOpen, setPremiumOpen] = useState(false);

  function pickMode(m: Mode) {
    if (m === 'flashcard') {
      track('practice_start', { mode: m, scope });
      setMode(m);
      return;
    }
    if (!storage.getUser().isPremium) {
      setPremiumOpen(true);
      return;
    }
    setMode(m);
  }

  if (mode === 'flashcard') {
    return (
      <>
        <Header />
        <Flashcard scope={scope} onExit={() => setMode(null)} />
      </>
    );
  }

  const SCOPES: Array<{ k: FlashcardScope; emoji: string; label: string; sub: string }> = [
    { k: '2x2', emoji: '🧊', label: '二阶', sub: 'Ortega 12 公式' },
    { k: '3x3', emoji: '🧩', label: '三阶', sub: 'OLL 57 + PLL 21' },
    { k: 'all', emoji: '🌲', label: '全部混练', sub: '难度更高' },
  ];

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1>选个练习模式</h1>
        <p className="text-gray-600 mt-1">从最简单的闪卡开始，能识别就掌握。</p>

        <section className="mt-6">
          <div className="text-sm font-semibold text-gray-500">练哪个？</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {SCOPES.map((s) => (
              <button
                key={s.k}
                onClick={() => setScope(s.k)}
                className={cn(
                  'card text-center transition border-2',
                  scope === s.k ? 'border-cube-yellow bg-cube-yellow/10' : 'border-transparent',
                )}
              >
                <div className="text-3xl md:text-4xl">{s.emoji}</div>
                <div className="font-semibold mt-1">{s.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="text-sm font-semibold text-gray-500">怎么练？</div>
          <div className="mt-2 grid md:grid-cols-3 gap-4">
            <button onClick={() => pickMode('flashcard')} className="card text-left hover:shadow-pop transition">
              <div className="text-5xl">🎴</div>
              <h3 className="mt-2">闪卡模式</h3>
              <p className="text-gray-600 mt-1">随机 10 张、看图回想、翻开看答案。</p>
              <span className="inline-block mt-3 px-2 py-0.5 rounded-full bg-cube-green text-white text-xs">免费</span>
            </button>
            <button onClick={() => pickMode('timed')} className="card text-left hover:shadow-pop transition relative">
              <div className="absolute top-3 right-3 text-2xl">🔒</div>
              <div className="text-5xl">⏱️</div>
              <h3 className="mt-2">计时挑战</h3>
              <p className="text-gray-600 mt-1">输入算法、系统判对错、统计反应时间。</p>
              <span className="inline-block mt-3 px-2 py-0.5 rounded-full bg-cube-yellow text-cube-blue text-xs">Pro</span>
            </button>
            <button onClick={() => pickMode('weakness')} className="card text-left hover:shadow-pop transition relative">
              <div className="absolute top-3 right-3 text-2xl">🔒</div>
              <div className="text-5xl">🎯</div>
              <h3 className="mt-2">弱项强化</h3>
              <p className="text-gray-600 mt-1">基于你的准确率，重点推荐不熟的公式。</p>
              <span className="inline-block mt-3 px-2 py-0.5 rounded-full bg-cube-yellow text-cube-blue text-xs">Pro</span>
            </button>
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link href={scope === '2x2' ? '/learn-2x2' : '/learn'} className="text-cube-blue underline">
            还不太熟？去 {scope === '2x2' ? '二阶' : '三阶'} 公式库看动画
          </Link>
        </div>
      </main>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} feature="practice_mode" />
    </>
  );
}
