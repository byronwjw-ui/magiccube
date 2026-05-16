'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { track } from '@/lib/analytics';
import { speech } from '@/lib/speech';
import { cn } from '@/lib/utils';
import type { LearningPath } from '@/types';

export default function PathSelect() {
  const router = useRouter();
  const [picked, setPicked] = useState<LearningPath>(null);

  useEffect(() => {
    const u = storage.getUser();
    setPicked(u.learningPath ?? null);
  }, []);

  function pick(
    path: LearningPath,
    target: string,
    opts: { kidMode?: boolean } = {},
  ) {
    storage.setLearningPath(path);
    track('path_select', { path: path ?? 'none' });
    if (opts.kidMode) {
      const u = storage.getUser();
      if (!u.kidMode) {
        storage.updateUser({ kidMode: true, speechEnabled: true });
        if (typeof document !== 'undefined') document.documentElement.classList.add('kid-mode');
      }
      speech.speak('欢迎来到小魔方大师，我们一起开始学习', { force: true });
    }
    setPicked(path);
    router.push(target);
  }

  return (
    <section className="mt-12">
      <h2 className="text-center !text-2xl md:!text-3xl">你是？</h2>
      <p className="text-center text-gray-500 mt-2">选一条最适合你的路径，随时可以切换。</p>

      <div className="mt-6">
        <div className="text-center text-sm font-semibold text-cube-blue mb-3">👶 我是新手，从哪里开始？</div>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => pick('tutorial-2x2', '/tutorial-2x2', { kidMode: true })}
            className={cn(
              'card text-left hover:shadow-pop transition border-2',
              picked === 'tutorial-2x2' ? 'border-cube-yellow bg-cube-yellow/10' : 'border-transparent',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="text-5xl">🧊</div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-cube-green text-white text-xs">推荐 · 更简单</span>
            </div>
            <h3 className="mt-2">从二阶入门</h3>
            <p className="text-gray-600 mt-1 text-sm">8 个角块，4 节课学会还原。适合 6 岁以上，拼 5-15 分钟能还原一次。</p>
          </button>
          <button
            onClick={() => pick('tutorial', '/tutorial', { kidMode: true })}
            className={cn(
              'card text-left hover:shadow-pop transition border-2',
              picked === 'tutorial' ? 'border-cube-yellow bg-cube-yellow/10' : 'border-transparent',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="text-5xl">🧩</div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-cube-blue text-white text-xs">经典 · 8 节课</span>
            </div>
            <h3 className="mt-2">从三阶入门</h3>
            <p className="text-gray-600 mt-1 text-sm">26 个块，层先法 8 节课学会还原。难点多一些，学会后用途广。</p>
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-center text-sm font-semibold text-gray-500 mb-3">🧠 已经会还原？</div>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => pick('ortega', '/learn-2x2')}
            className={cn(
              'card text-left hover:shadow-pop transition border-2',
              picked === 'ortega' ? 'border-cube-yellow bg-cube-yellow/10' : 'border-transparent',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">🧊</div>
              <div>
                <h3>二阶 Ortega 公式库</h3>
                <p className="text-gray-600 mt-1 text-sm">7 个 OLL + 5 个 PBL，刷二阶速度。</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => pick('cfop', '/learn')}
            className={cn(
              'card text-left hover:shadow-pop transition border-2',
              picked === 'cfop' ? 'border-cube-yellow bg-cube-yellow/10' : 'border-transparent',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">🏆</div>
              <div>
                <h3>三阶 CFOP 公式库</h3>
                <p className="text-gray-600 mt-1 text-sm">57 个 OLL + 21 个 PLL，刷三阶速度。</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
