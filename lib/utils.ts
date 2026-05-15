import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 计算一个算法的逆，用作 <twisty-player> 的 setup-alg
 * 使魔方初始状态为待解 OLL/PLL 状态。
 *
 * 简化实现：倒序 + 取逆。
 *  - R   → R'
 *  - R'  → R
 *  - R2  → R2保留
 *  - 中括号宽转同理
 */
export function invertAlgorithm(alg: string): string {
  return alg
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .reverse()
    .map((move) => {
      if (move.endsWith("'")) return move.slice(0, -1);
      if (move.endsWith('2')) return move;
      return move + "'";
    })
    .join(' ');
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return Promise.resolve(false);
  }
  return navigator.clipboard.writeText(text).then(
    () => true,
    () => false,
  );
}

export function formatRelativeTime(ts: number): string {
  if (!ts) return '从未练习';
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  return new Date(ts).toLocaleDateString('zh-CN');
}
