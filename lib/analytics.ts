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
    ...props,
  };
  // eslint-disable-next-line no-console
  console.log('[analytics]', payload);
  // TODO: 接入真实提供商：
  // mixpanel.track(event, payload);
  // posthog.capture(event, payload);
}

export function identify(traits: Props = {}): void {
  const payload = { uid: typeof window !== 'undefined' ? getAnonUid() : 'ssr', ...traits };
  // eslint-disable-next-line no-console
  console.log('[analytics] identify', payload);
}
