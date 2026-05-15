'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { track } from '@/lib/analytics';
import { speech } from '@/lib/speech';
import { cn } from '@/lib/utils';

export default function PathSelect() {
  const router = useRouter();
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    const u = storage.getUser();
    setPicked(u.learningPath ?? null);
  }, []);

  function pick(
    path: 'tutorial' | 'cfop' | 'ortega',
    target: string,
    opts: { kidMode?: boolean } = {},
  ) {
    storage.setLearningPath(path);
    track('path_select', { path });
    if (opts.kidMode) {
      const u = storage.getUser();
      if (!u.kidMode) {
        storage.updateUser({ kidMode: true, speechEnabled: true });
        if (typeof document !== 'undefined') document.documentElement.classList.add('kid-mode');
      }
      speech.speak('欢迎来到小魔方大师，我们一起开始第一课吧', { force: true });
    }
    setPicked(path);
    router.push(target);
  }

  return (
    <section className="mt-12">
      <h2 className="text-center !text-2xl md:!text-3xl">你是？</h2>
      <p className="text-center text-gray-500 mt-2">选一条最适合你的路径，随时可以切换。</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <button
          onClick={() => pick('tutorial', '/tutorial', { kidMode: true })}
          className={cn(
            'card text-left hover:shadow-pop transition border-2',
            picked === 'tutorial' ? 'border-cube-yellow bg-cube-yellow/10' : 'border-transparent',
          )}
        >
          <div className="text-5xl">👶</div>
          <h3 className="mt-2">我是新手</h3>
          <p className="text-gray-600 mt-1">完全没学过、不会还原。推荐 6 岁以上小朋友。</p>
          <div className="mt-3 text-sm text-cube-blue font-semibold">→ 零基础 8 节课</div>
          <div className="mt-2 inline-block px-2 py-0.5 rounded-full bg-cube-green text-white text-xs">自动开启小朋友模式 + 朗读</div>
        </button>

        <button
          onClick={() => pick('ortega', '/learn-2x2')}
          className={cn(
            'card text-left hover:shadow-pop transition border-2',
            picked === 'ortega' ? 'border-cube-yellow bg-cube-yellow/10' : 'border-transparent',
          )}
        >
          <div className="text-5xl">🧊</div>
          <h3 className="mt-2">我玩二阶</h3>
          <p className="text-gray-600 mt-1">想学 2x2 还原或 Ortega 速拧法。</p>
          <div className="mt-3 text-sm text-cube-blue font-semibold">→ Ortega 12 公式</div>
        </button>

        <button
          onClick={() => pick('cfop', '/learn')}
          className={cn(
            'card text-left hover:shadow-pop transition border-2',
            picked === 'cfop' ? 'border-cube-yellow bg-cube-yellow/10' : 'border-transparent',
          )}
        >
          <div className="text-5xl">🧠</div>
          <h3 className="mt-2">我会还原想刷速度</h3>
          <p className="text-gray-600 mt-1">已经会三阶还原，要学 CFOP 高级公式。</p>
          <div className="mt-3 text-sm text-cube-blue font-semibold">→ 57 OLL + 21 PLL</div>
        </button>
      </div>
    </section>
  );
}
