// ============================================================================
// 埋点封装 — v1 仅 console.log，未来可接 Mixpanel / PostHog / GA4。
// ============================================================================
import type { AnalyticsEvent } from '@/types';
import { getAnonUid } from './storage';

type Props = Record<string, string | number | boolean | null | undefined>;

export function track(event: AnalyticsEvent, props: Props = {}): void {
  const payload = {
    event,
    uid: typeof window !== 'undefined' ? getAnonUid() : 'ssr',
    ts: Date.now(),
    ...payload_safe(props),
  };
  // eslint-disable-next-line no-console
  console.log('[analytics]', payload);
}

function payload_safe(props: Props): Props {
  // 简单清理 undefined，便于阅读
  const out: Props = {};
  for (const [k, v] of Object.entries(props)) if (typeof v !== 'undefined') out[k] = v;
  return out;
}

export function identify(traits: Props = {}): void {
  const payload = { uid: typeof window !== 'undefined' ? getAnonUid() : 'ssr', ...traits };
  // eslint-disable-next-line no-console
  console.log('[analytics] identify', payload);
}
