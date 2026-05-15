// ============================================================================
// 浏览器朗读封装 — 用 Web Speech API（SpeechSynthesis）
// 小朋友模式下默认开启，给 6 岁还不太识字的小朋友念引导语
// ============================================================================
import { storage } from './storage';

let currentUtterance: SpeechSynthesisUtterance | null = null;

function isSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickChineseVoice(): SpeechSynthesisVoice | null {
  if (!isSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  // 优先：女声 + 中文
  const preferred = voices.find((v) => /zh/i.test(v.lang) && /female|f$|婷|Tingting|Mei-Jia|Sin-ji/i.test(v.name));
  if (preferred) return preferred;
  const anyZh = voices.find((v) => /zh/i.test(v.lang));
  return anyZh ?? null;
}

/**
 * 朗读一段话。如果用户没开 speechEnabled，直接 no-op。
 */
export function speak(text: string, opts: { force?: boolean; rate?: number; pitch?: number } = {}): void {
  if (!isSupported()) return;
  const user = storage.getUser();
  if (!opts.force && !user.speechEnabled) return;

  // 停掉上一段
  cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = opts.rate ?? 0.95;
  u.pitch = opts.pitch ?? 1.1;
  const voice = pickChineseVoice();
  if (voice) u.voice = voice;
  currentUtterance = u;
  try {
    window.speechSynthesis.speak(u);
  } catch {
    // 部分浏览器策略限制，静默失败
  }
}

export function cancel(): void {
  if (!isSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {}
  currentUtterance = null;
}

export const speech = { speak, cancel, isSupported };
