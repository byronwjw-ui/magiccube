'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import ProgressRing from '@/components/ui/ProgressRing';
import Heatmap from '@/components/ui/Heatmap';
import AvatarPicker from '@/components/ui/AvatarPicker';
import { storage } from '@/lib/storage';
import { ensureAchievementsInit } from '@/lib/achievements';
import { getFormulaById } from '@/lib/formulas';
import { formatRelativeTime } from '@/lib/utils';
import type { Achievement, User, UserProgress, PracticeSession } from '@/types';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState(0);
  const [daily, setDaily] = useState<Array<{ date: string; count: number }>>([]);
  const [editOpen, setEditOpen] = useState(false);

  function refresh() {
    setUser(storage.getUser());
    setProgress(storage.getAllProgress());
    setSessions(storage.getSessions());
    setAchievements(ensureAchievementsInit());
    setStreak(storage.getStreak());
    setDaily(storage.getDailyCounts(30));
  }

  useEffect(() => {
    refresh();
  }, []);

  const ollMastered = useMemo(
    () => Object.values(progress).filter((p) => p.status === 'mastered' && p.formulaId.startsWith('oll-')).length,
    [progress],
  );
  const pllMastered = useMemo(
    () => Object.values(progress).filter((p) => p.status === 'mastered' && p.formulaId.startsWith('pll-')).length,
    [progress],
  );
  const totalPractice = sessions.reduce((s, x) => s + x.total, 0);
  const recent5 = useMemo(
    () => Object.values(progress)
      .filter((p) => p.lastPracticedAt > 0)
      .sort((a, b) => b.lastPracticedAt - a.lastPracticedAt)
      .slice(0, 5),
    [progress],
  );

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* 顶部身份 */}
        <div className="card flex items-center gap-4">
          <button onClick={() => setEditOpen(true)} className="text-5xl bg-cube-yellow w-16 h-16 rounded-2xl flex items-center justify-center">{user.avatar}</button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="!text-xl">{user.nickname}</h2>
              <button onClick={() => setEditOpen(true)} className="text-xs text-cube-blue underline">修改</button>
            </div>
            <div className="text-sm text-gray-500">UID: {user.id.slice(0, 8)}… {user.isPremium && '· ✨ Pro'}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cube-blue">{totalPractice}</div>
            <div className="text-xs text-gray-500">总练习</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cube-blue">{streak}🔥</div>
            <div className="text-xs text-gray-500">连续天数</div>
          </div>
        </div>

        {/* 进度环 */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="card flex flex-col items-center">
            <ProgressRing
              value={ollMastered / 57}
              label={`${ollMastered}/57`}
              sublabel="OLL 掌握度"
              color="#FFD500"
            />
          </div>
          <div className="card flex flex-col items-center">
            <ProgressRing
              value={pllMastered / 21}
              label={`${pllMastered}/21`}
              sublabel="PLL 掌握度"
              color="#0046AD"
            />
          </div>
        </div>

        {/* 热力图 */}
        <div className="card mt-4">
          <div className="flex items-center justify-between">
            <h3>最近 30 天</h3>
            <Link href="/practice" className="text-sm text-cube-blue underline">继续练习 →</Link>
          </div>
          <div className="mt-3 overflow-x-auto">
            <Heatmap days={daily} />
          </div>
        </div>

        {/* 最近练习 */}
        <div className="card mt-4">
          <h3>最近练习</h3>
          {recent5.length === 0 ? (
            <p className="text-gray-500 mt-2">还没有练习记录。<Link href="/practice" className="text-cube-blue underline">去练一轮</Link></p>
          ) : (
            <ul className="mt-2 divide-y">
              {recent5.map((p) => {
                const f = getFormulaById(p.formulaId);
                if (!f) return null;
                return (
                  <li key={p.formulaId} className="py-2 flex items-center justify-between">
                    <Link href={`/learn/${f.category}/${f.id}`} className="flex-1">
                      <div className="font-semibold">{f.category} #{f.number} {f.name}</div>
                      <div className="text-xs text-gray-500">{formatRelativeTime(p.lastPracticedAt)} · {Math.round(p.successRate * 100)}% 准确</div>
                    </Link>
                    <span className="text-sm text-gray-500">{p.practiceCount} 次</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 成就 */}
        <div className="card mt-4">
          <h3>成就徽章</h3>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`rounded-2xl p-3 text-center ${a.unlocked ? 'bg-cube-yellow/40' : 'bg-gray-100 opacity-60'}`}
              >
                <div className="text-3xl">{a.emoji}</div>
                <div className="text-sm font-semibold mt-1">{a.name}</div>
                <div className="text-xs text-gray-600">{a.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => { if (confirm('确认清空所有本地数据？')) { storage.resetAll(); refresh(); } }}
            className="text-xs text-gray-400 underline"
          >
            重置本地数据
          </button>
        </div>
      </main>

      {editOpen && (
        <AvatarPicker
          current={user.avatar}
          nickname={user.nickname}
          onClose={() => setEditOpen(false)}
          onSave={(next) => { storage.updateUser(next); setUser(storage.getUser()); setEditOpen(false); }}
        />
      )}
    </>
  );
}
