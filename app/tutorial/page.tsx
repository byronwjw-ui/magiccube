'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import { LESSONS } from '@/lib/tutorial/lessons';
import { storage } from '@/lib/storage';
import { speech } from '@/lib/speech';
import type { TutorialProgress } from '@/types';
import { cn } from '@/lib/utils';

export default function TutorialIndexPage() {
  const [progress, setProgress] = useState<Record<string, TutorialProgress>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(storage.getAllTutorialProgress());
    setMounted(true);
    const u = storage.getUser();
    if (u.kidMode) speech.speak('一起来学魔方吧。我们从第一课开始，认识魔方。');
  }, []);

  const totalDone = Object.values(progress).filter((p) => p.completed).length;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-sm text-cube-blue">
          <Link href="/">← 返回首页</Link>
        </div>
        <h1 className="mt-2">零基础入门 · 8 节课</h1>
        <p className="text-gray-600 mt-1">
          层先法 (Layer by Layer)，每节 5-10 分钟。学完你就会还原魔方啦 🎉
        </p>

        {/* 进度条 */}
        <div className="card mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm text-gray-500">学习进度</div>
            <div className="mt-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-cube-yellow transition-all"
                style={{ width: `${(totalDone / LESSONS.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold text-cube-blue">{totalDone}/{LESSONS.length}</div>
        </div>

        {/* 课程列表 */}
        <div className="mt-6 space-y-3">
          {LESSONS.map((lesson, idx) => {
            const p = progress[lesson.id];
            const done = !!p?.completed;
            const stars = p?.stars ?? 0;
            // 前一节没完成且不是第一节 → 半锁定（仍可点，但提示）
            const prevDone = idx === 0 || progress[LESSONS[idx - 1].id]?.completed;
            return (
              <Link
                key={lesson.id}
                href={`/tutorial/${lesson.id}`}
                className={cn(
                  'card flex items-center gap-4 hover:shadow-pop transition',
                  done && 'border-2 border-cube-green',
                  !prevDone && !done && mounted && 'opacity-70',
                )}
              >
                <div className="text-4xl md:text-5xl shrink-0">{lesson.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500">第 {lesson.number} 课 · {lesson.durationMin} 分钟</div>
                  <div className="font-bold text-lg">{lesson.title}</div>
                  <div className="text-sm text-gray-600 truncate">{lesson.subtitle}</div>
                </div>
                <div className="text-right shrink-0">
                  {done ? (
                    <div className="text-cube-yellow text-xl">{'⭐'.repeat(stars)}</div>
                  ) : (
                    <div className="text-cube-blue font-semibold text-sm">开始 →</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* 完成所有课的奖励 */}
        {totalDone === LESSONS.length && (
          <div className="card mt-6 bg-cube-yellow text-center">
            <div className="text-5xl">🏆</div>
            <h2 className="mt-2">恭喜！你学会还原魔方啦！</h2>
            <p className="text-cube-blue mt-2">现在可以挑战二阶或者三阶速度公式。</p>
            <div className="mt-4 flex gap-3 justify-center">
              <Link href="/learn-2x2" className="btn-primary">🧊 试试二阶</Link>
              <Link href="/learn" className="btn-ghost">🧠 三阶高级</Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
