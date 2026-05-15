// ============================================================================
// 存储抽象层 — v1 使用 localStorage，未来可无缝切换到后端 API。
//
// 业务代码只能通过 storage.* 访问数据，不允许直接 localStorage。
// ============================================================================
import type { User, UserProgress, PracticeSession, Achievement } from '@/types';

const KEYS = {
  user: 'mc_user',
  anonUid: 'mc_anon_uid',
  progress: 'mc_progress',
  sessions: 'mc_sessions',
  achievements: 'mc_achievements',
} as const;

// ----------------------------------------------------------------------------
// 底层 helper（SSR 安全）
// ----------------------------------------------------------------------------
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 静默失败（隔离模式/超额）
  }
}

// ----------------------------------------------------------------------------
// 匿名 UID
// ----------------------------------------------------------------------------
export function getAnonUid(): string {
  if (!isBrowser()) return 'ssr-anon';
  let uid = window.localStorage.getItem(KEYS.anonUid);
  if (!uid) {
    uid = (crypto as Crypto & { randomUUID?: () => string }).randomUUID?.() ?? `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(KEYS.anonUid, uid);
  }
  return uid;
}

// ----------------------------------------------------------------------------
// User
// ----------------------------------------------------------------------------
const AVATAR_POOL = ['🦊', '🐼', '🐯', '🐰', '🐸', '🐵', '🐨', '🦁'];

function createDefaultUser(): User {
  return {
    id: getAnonUid(),
    nickname: '小魔方手',
    avatar: AVATAR_POOL[Math.floor(Math.random() * AVATAR_POOL.length)],
    isPremium: false,
    createdAt: Date.now(),
  };
}

export function getUser(): User {
  const cached = read<User | null>(KEYS.user, null);
  if (cached) return cached;
  const u = createDefaultUser();
  write(KEYS.user, u);
  return u;
}

export function updateUser(patch: Partial<User>): User {
  const current = getUser();
  const next = { ...current, ...patch };
  write(KEYS.user, next);
  return next;
}

export function getAvatarPool(): string[] {
  return [...AVATAR_POOL];
}

// ----------------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------------
export function getAllProgress(): Record<string, UserProgress> {
  return read<Record<string, UserProgress>>(KEYS.progress, {});
}

export function getProgress(formulaId: string): UserProgress | undefined {
  return getAllProgress()[formulaId];
}

export function upsertProgress(formulaId: string, patch: Partial<UserProgress>): UserProgress {
  const all = getAllProgress();
  const existing = all[formulaId] ?? {
    formulaId,
    status: 'new' as const,
    practiceCount: 0,
    lastPracticedAt: 0,
    successRate: 0,
  };
  const next: UserProgress = { ...existing, ...patch, formulaId };
  all[formulaId] = next;
  write(KEYS.progress, all);
  return next;
}

export function recordPractice(formulaId: string, success: boolean): UserProgress {
  const prev = getProgress(formulaId) ?? {
    formulaId,
    status: 'new' as const,
    practiceCount: 0,
    lastPracticedAt: 0,
    successRate: 0,
  };
  const nextCount = prev.practiceCount + 1;
  const prevSuccess = Math.round(prev.successRate * prev.practiceCount);
  const nextSuccess = prevSuccess + (success ? 1 : 0);
  const nextRate = nextCount > 0 ? nextSuccess / nextCount : 0;
  // 连续成功 >= 3 次 且 准确率 >= 0.8 → mastered
  let status: UserProgress['status'] = prev.status === 'new' ? 'learning' : prev.status;
  if (nextCount >= 3 && nextRate >= 0.8) status = 'mastered';
  return upsertProgress(formulaId, {
    practiceCount: nextCount,
    lastPracticedAt: Date.now(),
    successRate: nextRate,
    status,
  });
}

export function markMastered(formulaId: string): UserProgress {
  return upsertProgress(formulaId, { status: 'mastered', lastPracticedAt: Date.now() });
}

export function markLearning(formulaId: string): UserProgress {
  return upsertProgress(formulaId, { status: 'learning' });
}

// ----------------------------------------------------------------------------
// Sessions (热力图 + 统计)
// ----------------------------------------------------------------------------
export function getSessions(): PracticeSession[] {
  return read<PracticeSession[]>(KEYS.sessions, []);
}

export function addSession(session: PracticeSession): void {
  const all = getSessions();
  all.push(session);
  // 只保留最近 200 场，防止 localStorage 胀
  const trimmed = all.slice(-200);
  write(KEYS.sessions, trimmed);
}

/**
 * 返回最近 N 天的每日练习量（热力图用）
 */
export function getDailyCounts(days: number): Array<{ date: string; count: number }> {
  const map = new Map<string, number>();
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, 0);
  }
  for (const s of getSessions()) {
    if (map.has(s.date)) map.set(s.date, (map.get(s.date) ?? 0) + s.total);
  }
  return [...map.entries()].map(([date, count]) => ({ date, count }));
}

/**
 * 返回连续学习天数（从今天往前数）
 */
export function getStreak(): number {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;
  const daySet = new Set(sessions.map((s) => s.date));
  let streak = 0;
  const cur = new Date();
  // 如果今天没练，从昨天开始算
  if (!daySet.has(cur.toISOString().slice(0, 10))) cur.setDate(cur.getDate() - 1);
  while (daySet.has(cur.toISOString().slice(0, 10))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

// ----------------------------------------------------------------------------
// Achievements
// ----------------------------------------------------------------------------
export function getAchievements(): Achievement[] {
  return read<Achievement[]>(KEYS.achievements, []);
}

export function setAchievements(list: Achievement[]): void {
  write(KEYS.achievements, list);
}

export function unlockAchievement(id: string): void {
  const all = getAchievements();
  const idx = all.findIndex((a) => a.id === id);
  if (idx >= 0 && !all[idx].unlocked) {
    all[idx] = { ...all[idx], unlocked: true, unlockedAt: Date.now() };
    write(KEYS.achievements, all);
  }
}

// ----------------------------------------------------------------------------
// Reset (调试用)
// ----------------------------------------------------------------------------
export function resetAll(): void {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}

// 统一 namespace 导出，方便然一句 import { storage } from '@/lib/storage'
export const storage = {
  getAnonUid,
  getUser,
  updateUser,
  getAvatarPool,
  getAllProgress,
  getProgress,
  upsertProgress,
  recordPractice,
  markMastered,
  markLearning,
  getSessions,
  addSession,
  getDailyCounts,
  getStreak,
  getAchievements,
  setAchievements,
  unlockAchievement,
  resetAll,
};
