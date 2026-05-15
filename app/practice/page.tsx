'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import PremiumModal from '@/components/ui/PremiumModal';
import Flashcard from './Flashcard';
import { storage } from '@/lib/storage';
import { track } from '@/lib/analytics';

type Mode = 'flashcard' | 'timed' | 'weakness';

export default function PracticePage() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [premiumOpen, setPremiumOpen] = useState(false);

  function pickMode(m: Mode) {
    if (m === 'flashcard') {
      track('practice_start', { mode: m });
      setMode(m);
      return;
    }
    // 计时与弱项：VIP
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
        <Flashcard onExit={() => setMode(null)} />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1>选个练习模式</h1>
        <p className="text-gray-600 mt-1">从最简单的闪卡开始，能识别就掌握。</p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <button onClick={() => pickMode('flashcard')} className="card text-left hover:shadow-pop transition">
            <div className="text-5xl">🎴</div>
            <h3 className="mt-2">闪卡模式</h3>
            <p className="text-gray-600 mt-1">随机 10 张、看图回忆、翻开看答案。</p>
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

        <div className="mt-10 text-center">
          <Link href="/learn" className="text-cube-blue underline">还不太熟？去公式库看看动画</Link>
        </div>
      </main>
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} feature="practice_mode" />
    </>
  );
}
