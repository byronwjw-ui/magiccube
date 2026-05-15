import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'twisty-player': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          alg?: string;
          'experimental-setup-alg'?: string;
          'experimental-setup-anchor'?: string;
          puzzle?: string;
          visualization?: '2D' | '3D' | 'PG3D' | 'experimental-2D-LL';
          background?: 'none' | 'checkered';
          'control-panel'?: 'none' | 'bottom-row' | 'auto';
          'hint-facelets'?: 'none' | 'floating';
          'back-view'?: 'none' | 'side-by-side' | 'top-right';
          'tempo-scale'?: string;
          'camera-latitude'?: string;
          'camera-longitude'?: string;
          'camera-distance'?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
