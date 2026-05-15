'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import { LESSONS_2X2 } from '@/lib/tutorial/lessons2x2';
import { storage } from '@/lib/storage';
import { speech } from '@/lib/speech';
import type { TutorialProgress } from '@/types';
import { cn } from '@/lib/utils';

export default function Tutorial2x2IndexPage() {
  const [progress, setProgress] = useState<Record<string, TutorialProgress>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(storage.getAllTutorialProgress());
    setMounted(true);
    const u = storage.getUser();
    if (u.kidMode) speech.speak('二阶魔方比三阶简单。我们从第一课开始。');
  }, []);

  const totalDone = Object.values(progress).filter((p) => p.completed && p.lessonId.startsWith('tutorial2-')).length;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-sm text-cube-blue">
          <Link href="/">← 返回首页</Link>
        </div>
        <h1 className="mt-2">二阶入门 · 4 节课</h1>
        <p className="text-gray-600 mt-1">
          Ortega 法，只需 12 个公式。比三阶简单，适合 6 岁以上小朋友起步。
        </p>

        <div className="card mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm text-gray-500">学习进度</div>
            <div className="mt-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-cube-yellow transition-all"
                style={{ width: `${(totalDone / LESSONS_2X2.length) * 100}%` }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold text-cube-blue">{totalDone}/{LESSONS_2X2.length}</div>
        </div>

        <div className="mt-6 space-y-3">
          {LESSONS_2X2.map((lesson, idx) => {
            const p = progress[lesson.id];
            const done = !!p?.completed;
            const stars = p?.stars ?? 0;
            const prevDone = idx === 0 || progress[LESSONS_2X2[idx - 1].id]?.completed;
            return (
              <Link
                key={lesson.id}
                href={`/tutorial-2x2/${lesson.id}`}
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

        {totalDone === LESSONS_2X2.length && (
          <div className="card mt-6 bg-cube-yellow text-center">
            <div className="text-5xl">🏆</div>
            <h2 className="mt-2">恭喜！你会还原二阶啦！</h2>
            <p className="text-cube-blue mt-2">现在可以挑战三阶入门。</p>
            <Link href="/tutorial" className="btn-primary mt-3 inline-block">去三阶入门</Link>
          </div>
        )}
      </main>
    </>
  );
}
