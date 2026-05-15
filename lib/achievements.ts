// ============================================================================
// 成就定义与检查逻辑
// ============================================================================
import type { Achievement } from '@/types';
import { storage } from './storage';

export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_practice', name: '初试身手', description: '完成第 1 次练习', emoji: '🥉' },
  { id: 'practice_10', name: '勤奋学习', description: '累计练习 10 题', emoji: '📚' },
  { id: 'practice_50', name: '牌理精通', description: '累计练习 50 题', emoji: '🎯' },
  { id: 'mastered_10', name: '十公式小手', description: '掌握 10 个公式', emoji: '⭐' },
  { id: 'mastered_oll', name: 'OLL 全掌握', description: '掌握全部 57 个 OLL', emoji: '🏆' },
  { id: 'mastered_pll', name: 'PLL 全掌握', description: '掌握全部 21 个 PLL', emoji: '👑' },
  { id: 'streak_7', name: '一周坚持', description: '连续 7 天练习', emoji: '🔥' },
  { id: 'streak_30', name: '一月不断', description: '连续 30 天练习', emoji: '🚀' },
];

export function ensureAchievementsInit(): Achievement[] {
  const existing = storage.getAchievements();
  if (existing.length === 0) {
    const seeded: Achievement[] = ACHIEVEMENT_DEFS.map((d) => ({ ...d, unlocked: false }));
    storage.setAchievements(seeded);
    return seeded;
  }
  return existing;
}

export function checkAndUnlock(): string[] {
  ensureAchievementsInit();
  const unlocked: string[] = [];
  const sessions = storage.getSessions();
  const totalPractice = sessions.reduce((s, x) => s + x.total, 0);
  const progress = Object.values(storage.getAllProgress());
  const mastered = progress.filter((p) => p.status === 'mastered');
  const masteredOll = mastered.filter((p) => p.formulaId.startsWith('oll-')).length;
  const masteredPll = mastered.filter((p) => p.formulaId.startsWith('pll-')).length;
  const streak = storage.getStreak();

  const checks: Array<[string, boolean]> = [
    ['first_practice', sessions.length >= 1],
    ['practice_10', totalPractice >= 10],
    ['practice_50', totalPractice >= 50],
    ['mastered_10', mastered.length >= 10],
    ['mastered_oll', masteredOll >= 57],
    ['mastered_pll', masteredPll >= 21],
    ['streak_7', streak >= 7],
    ['streak_30', streak >= 30],
  ];

  const all = storage.getAchievements();
  for (const [id, ok] of checks) {
    const item = all.find((a) => a.id === id);
    if (ok && item && !item.unlocked) {
      storage.unlockAchievement(id);
      unlocked.push(id);
    }
  }
  return unlocked;
}
