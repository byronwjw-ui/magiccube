'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { track } from '@/lib/analytics';
import { speech } from '@/lib/speech';

const NAV = [
  { href: '/', label: '首页' },
  { href: '/tutorial', label: '入门', kid: true },
  { href: '/learn', label: '三阶' },
  { href: '/learn-2x2', label: '二阶' },
  { href: '/practice', label: '练习' },
  { href: '/dashboard', label: '我的' },
  { href: '/pricing', label: 'Pro' },
];

export default function Header() {
  const pathname = usePathname();
  const [kidMode, setKidMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const u = storage.getUser();
    setKidMode(!!u.kidMode);
    setMounted(true);
    applyKidModeClass(!!u.kidMode);
  }, []);

  function applyKidModeClass(on: boolean) {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('kid-mode', on);
  }

  function handleToggle() {
    const u = storage.toggleKidMode();
    setKidMode(!!u.kidMode);
    applyKidModeClass(!!u.kidMode);
    track('kid_mode_toggle', { enabled: !!u.kidMode });
    if (u.kidMode) speech.speak('小朋友模式已打开，可以让爸爸妈妈一起陪你学魔方', { force: true });
    else speech.cancel();
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 font-bold text-cube-blue shrink-0">
          <span className="inline-block w-6 h-6 rounded bg-cube-yellow" />
          小魔方大师
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {NAV.map((n) => {
            const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-sm md:text-base font-medium transition whitespace-nowrap',
                  active ? 'bg-cube-yellow text-cube-blue' : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        {mounted && (
          <button
            onClick={handleToggle}
            title={kidMode ? '当前：小朋友模式（点击关闭）' : '切换到小朋友模式'}
            className={cn(
              'shrink-0 px-2 py-1 rounded-xl text-xs md:text-sm font-semibold transition border',
              kidMode
                ? 'bg-cube-yellow text-cube-blue border-cube-blue'
                : 'bg-white text-gray-500 border-gray-200 hover:border-cube-blue',
            )}
          >
            {kidMode ? '👶 小朋友模式' : '👶 给小朋友'}
          </button>
        )}
      </div>
    </header>
  );
}
