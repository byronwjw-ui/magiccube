// ============================================================================
// 小魔方大师 - 核心类型定义
// ============================================================================

export type FormulaCategory = 'OLL' | 'PLL';

export type FormulaStatus = 'new' | 'learning' | 'mastered';

export type Difficulty = 1 | 2 | 3;

/**
 * 一个公式数据。OLL 57 个 + PLL 21 个 = 78 个。
 */
export interface Formula {
  /** 唯一 id，如 'oll-1', 'pll-aa' */
  id: string;
  category: FormulaCategory;
  /** 子分类，如 'Sune', 'Dot', 'T-shape', 'G-Perm' 等，用于列表过滤 */
  subCategory: string;
  /** OLL 1-57，PLL 1-21（以 PLL 标准顺序） */
  number: number;
  /** 中文名称，默认保留社区英文名如 'Sune' */
  name: string;
  /** 主公式，标准 WCA notation */
  algorithm: string;
  /** 备选公式（镜像、左手版、速拧版等） */
  alternativeAlgorithms?: string[];
  /** 还原打乱，一般为 algorithm 的逆，用于 <twisty-player> setup-alg */
  setupMoves?: string;
  difficulty: Difficulty;
  /** 是否 VIP。免费选 OLL 10 个 + PLL 5 个（高频入门公式） */
  isPremium: boolean;
  /** 补充说明/记忆口诀 */
  tip?: string;
}

/**
 * 用户对某公式的进度。
 * 预留 classroomId 供未来 B 端机构版使用。
 */
export interface UserProgress {
  formulaId: string;
  status: FormulaStatus;
  practiceCount: number;
  /** 最近一次练习的时间戳（ms） */
  lastPracticedAt: number;
  /** 练习准确率 0~1 */
  successRate: number;
  /** 机构/课堂 ID，B 端预留 */
  classroomId?: string;
}

/**
 * 匿名或登录用户。v1 都是匿名。
 */
export interface User {
  id: string;
  nickname: string;
  /** emoji 头像 */
  avatar: string;
  isPremium: boolean;
  createdAt: number;
}

/**
 * 一次练习会话的单条记录，用于热力图 + 统计。
 */
export interface PracticeSession {
  /** YYYY-MM-DD */
  date: string;
  /** 本场总题数 */
  total: number;
  /** “已掌握”数 */
  correct: number;
  /** 本场涉及的公式 id */
  formulaIds: string[];
  timestamp: number;
}

/**
 * 成就徽章。
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  /** 是否已获得 */
  unlocked: boolean;
  unlockedAt?: number;
}

/**
 * 埋点事件名枚举。
 */
export type AnalyticsEvent =
  | 'formula_view'
  | 'formula_mastered'
  | 'practice_start'
  | 'practice_complete'
  | 'premium_modal_show'
  | 'pricing_view'
  | 'pricing_cta_click'
  | 'b2b_contact_click';
