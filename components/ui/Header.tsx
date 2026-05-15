'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: '首页' },
  { href: '/learn', label: '学习' },
  { href: '/practice', label: '练习' },
  { href: '/dashboard', label: '我的' },
  { href: '/pricing', label: 'Pro' },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-cube-blue">
          <span className="inline-block w-6 h-6 rounded bg-cube-yellow" />
          小魔方大师
        </Link>
        <nav className="flex items-center gap-1 md:gap-2">
          {NAV.map((n) => {
            const active = n.href === '/' ? pathname === '/' : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-sm md:text-base font-medium transition',
                  active ? 'bg-cube-yellow text-cube-blue' : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
