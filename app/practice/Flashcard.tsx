'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import CubeView from '@/components/cube/CubeView';
import { ALL_FORMULAS } from '@/lib/formulas';
import { storage } from '@/lib/storage';
import { checkAndUnlock, ensureAchievementsInit } from '@/lib/achievements';
import { track } from '@/lib/analytics';
import type { Formula, PracticeSession } from '@/types';

const ROUND_SIZE = 10;

export type FlashcardScope = '3x3' | '2x2' | 'all';

function pickRound(scope: FlashcardScope): Formula[] {
  const isPremium = storage.getUser().isPremium;
  const all = ALL_FORMULAS.filter((f) => isPremium || !f.isPremium);
  let pool: Formula[];
  if (scope === '3x3') {
    pool = all.filter((f) => f.category === 'OLL' || f.category === 'PLL');
  } else if (scope === '2x2') {
    pool = all.filter((f) => f.category === 'OLL-2x2' || f.category === 'PBL-2x2');
  } else {
    pool = all;
  }
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(ROUND_SIZE, arr.length));
}

export default function Flashcard({
  scope = 'all',
  onExit,
}: {
  scope?: FlashcardScope;
  onExit: () => void;
}) {
  const [round, setRound] = useState<Formula[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    ensureAchievementsInit();
    setRound(pickRound(scope));
  }, [scope]);

  const current = round[idx];
  const progress = round.length === 0 ? 0 : (idx / round.length) * 100;
  const isTwo = !!current && (current.category === 'OLL-2x2' || current.category === 'PBL-2x2');
  const puzzle: '3x3x3' | '2x2x2' = isTwo ? '2x2x2' : '3x3x3';
  const previewViz: '3D' | 'experimental-2D-LL' = isTwo ? '3D' : 'experimental-2D-LL';

  function answer(success: boolean) {
    if (!current) return;
    storage.recordPractice(current.id, success);
    const nextResults = [...results, success];
    setResults(nextResults);
    if (idx + 1 >= round.length) {
      finishRound(nextResults);
    } else {
      setIdx(idx + 1);
      setFlipped(false);
    }
  }

  function finishRound(finalResults: boolean[]) {
    const correct = finalResults.filter(Boolean).length;
    const today = new Date().toISOString().slice(0, 10);
    const session: PracticeSession = {
      date: today,
      total: round.length,
      correct,
      formulaIds: round.map((f) => f.id),
      timestamp: Date.now(),
    };
    storage.addSession(session);
    checkAndUnlock();
    track('practice_complete', { total: round.length, correct, rate: correct / round.length, scope });
    setDone(true);
    if (correct / round.length >= 0.7) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }

  function restart() {
    setIdx(0);
    setFlipped(false);
    setResults([]);
    setDone(false);
    setRound(pickRound(scope));
  }

  if (done) {
    const correct = results.filter(Boolean).length;
    const rate = round.length === 0 ? 0 : correct / round.length;
    const stars = rate >= 0.9 ? 3 : rate >= 0.7 ? 2 : rate >= 0.5 ? 1 : 0;
    const encourage = rate >= 0.9 ? '太棒了！你是魔方小高手 🏆'
      : rate >= 0.7 ? '不错哦，继续加油 💪'
      : rate >= 0.5 ? '还需要多练习，加油 🔥'
      : '不难，多看几遍动画就会了 📚';
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 text-center">
        <div className="text-6xl">{stars >= 2 ? '🎉' : '💪'}</div>
        <h1 className="mt-3">本轮成绩</h1>
        <div className="mt-2 text-3xl">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="card">
            <div className="text-2xl font-bold text-cube-blue">{correct}/{round.length}</div>
            <div className="text-xs text-gray-500">掌握数</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-cube-blue">{Math.round(rate * 100)}%</div>
            <div className="text-xs text-gray-500">准确率</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-cube-blue">+{correct * 10}</div>
            <div className="text-xs text-gray-500">获得经验</div>
          </div>
        </div>
        <p className="mt-6 text-lg">{encourage}</p>
        <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center">
          <button onClick={restart} className="btn-primary">🔄 再来一轮</button>
          <button onClick={onExit} className="btn-ghost">退出</button>
        </div>
      </main>
    );
  }

  if (!current) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 text-center text-gray-500">
        准备中…如果一直看不到卡片，可能是免费公式不够，请选择「全部」或者购买 Pro。
      </main>
    );
  }

  const scopeLabel = scope === '3x3' ? '三阶' : scope === '2x2' ? '二阶' : '全部';

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm text-gray-500">← 退出</button>
        <div className="text-sm text-gray-500">{scopeLabel} · {idx + 1} / {round.length}</div>
      </div>
      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-cube-yellow transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 card min-h-[420px] flex flex-col items-center justify-center">
        <div className="text-xs text-gray-400">{current.category} #{current.number}</div>
        {!flipped ? (
          <>
            <div className="mt-3 flex items-center justify-center">
              <CubeView
                alg={current.algorithm}
                setupAlg={current.setupMoves}
                visualization={previewViz}
                controlPanel="none"
                puzzle={puzzle}
                size={220}
              />
            </div>
            <p className="mt-4 text-gray-500">试试回想该公式…</p>
            <button onClick={() => setFlipped(true)} className="btn-secondary mt-4">👀 翻开看答案</button>
          </>
        ) : (
          <div className="w-full animate-flip-in">
            <div className="flex items-center justify-center">
              <CubeView
                alg={current.algorithm}
                setupAlg={current.setupMoves}
                visualization="3D"
                controlPanel="bottom-row"
                puzzle={puzzle}
                size={240}
              />
            </div>
            <div className="text-center mt-4">
              <div className="text-lg font-semibold">{current.name}</div>
              <div className="alg-text mt-2 break-words wca-hide-on-kid">{current.algorithm}</div>
            </div>
          </div>
        )}
      </div>

      {flipped && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => answer(false)} className="btn" style={{ background: '#FF5800', color: 'white' }}>还不熟</button>
          <button onClick={() => answer(true)} className="btn" style={{ background: '#009B48', color: 'white' }}>已掌握</button>
        </div>
      )}
    </main>
  );
}
