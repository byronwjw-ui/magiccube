'use client';

import { useEffect, useRef } from 'react';

type Visualization = '2D' | '3D' | 'PG3D' | 'experimental-2D-LL';

export interface TwistyPlayerProps {
  alg?: string;
  setupAlg?: string;
  visualization?: Visualization;
  background?: 'none' | 'checkered';
  controlPanel?: 'none' | 'bottom-row' | 'auto';
  hintFacelets?: 'none' | 'floating';
  backView?: 'none' | 'side-by-side' | 'top-right';
  tempoScale?: number;
  size?: number; // px
  className?: string;
}

/**
 * cubing.js <twisty-player> 的 React 包装
 *
 * 重要：由于是 Web Component，必须在客户端使用。
 * 父组件请使用 next/dynamic(..., { ssr: false }) 加载。
 */
export default function TwistyPlayer({
  alg = '',
  setupAlg = '',
  visualization = '3D',
  background = 'none',
  controlPanel = 'bottom-row',
  hintFacelets = 'floating',
  backView = 'none',
  tempoScale = 1,
  size = 280,
  className,
}: TwistyPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let player: HTMLElement | null = null;

    (async () => {
      // 注册 custom element
      await import('cubing/twisty');
      if (cancelled || !hostRef.current) return;

      // 清理旧实例
      hostRef.current.innerHTML = '';
      player = document.createElement('twisty-player');
      player.setAttribute('puzzle', '3x3x3');
      player.setAttribute('visualization', visualization);
      player.setAttribute('background', background);
      player.setAttribute('control-panel', controlPanel);
      player.setAttribute('hint-facelets', hintFacelets);
      player.setAttribute('back-view', backView);
      player.setAttribute('tempo-scale', String(tempoScale));
      if (alg) player.setAttribute('alg', alg);
      if (setupAlg) player.setAttribute('experimental-setup-alg', setupAlg);
      player.style.width = `${size}px`;
      player.style.height = `${size}px`;
      player.style.maxWidth = '100%';
      hostRef.current.appendChild(player);
    })();

    return () => {
      cancelled = true;
      if (player && player.parentElement) player.parentElement.removeChild(player);
    };
  }, [alg, setupAlg, visualization, background, controlPanel, hintFacelets, backView, tempoScale, size]);

  return <div ref={hostRef} className={className} />;
}
