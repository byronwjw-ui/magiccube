'use client';

import dynamic from 'next/dynamic';
import type { TwistyPlayerProps } from './TwistyPlayer';

/**
 * SSR-safe 入口。所有页面都应该从这里导入魔方可视化。
 */
const CubeView = dynamic<TwistyPlayerProps>(() => import('./TwistyPlayer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full min-h-[180px] bg-gray-100 rounded-2xl">
      <span className="text-sm text-gray-500">魔方加载中…</span>
    </div>
  ),
});

export default CubeView;
