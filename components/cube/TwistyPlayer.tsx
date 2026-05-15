'use client';

import { useEffect, useRef } from 'react';

type Visualization = '2D' | '3D' | 'PG3D' | 'experimental-2D-LL';
type Puzzle = '3x3x3' | '2x2x2';

export interface TwistyPlayerProps {
  alg?: string;
  setupAlg?: string;
  visualization?: Visualization;
  background?: 'none' | 'checkered';
  controlPanel?: 'none' | 'bottom-row' | 'auto';
  hintFacelets?: 'none' | 'floating';
  backView?: 'none' | 'side-by-side' | 'top-right';
  tempoScale?: number;
  size?: number;
  className?: string;
  puzzle?: Puzzle;
}

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
  puzzle = '3x3x3',
}: TwistyPlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let player: HTMLElement | null = null;

    (async () => {
      await import('cubing/twisty');
      if (cancelled || !hostRef.current) return;

      hostRef.current.innerHTML = '';
      player = document.createElement('twisty-player');
      player.setAttribute('puzzle', puzzle);
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
  }, [alg, setupAlg, visualization, background, controlPanel, hintFacelets, backView, tempoScale, size, puzzle]);

  return <div ref={hostRef} className={className} />;
}
