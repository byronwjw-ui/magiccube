// ============================================================================
// 小魔方大师 - 核心类型定义
// ============================================================================

export type FormulaCategory = 'OLL' | 'PLL' | 'OLL-2x2' | 'PBL-2x2';

export type FormulaStatus = 'new' | 'learning' | 'mastered';

export type Difficulty = 1 | 2 | 3;

/**
 * 一个公式数据。三阶 OLL 57 + PLL 21 + 二阶 OLL 7 + PBL 5 = 90 个。
 */
export interface Formula {
  /** 唯一 id，如 'oll-1', 'pll-aa', '2oll-1', '2pbl-1' */
  id: string;
  category: FormulaCategory;
  /** 子分类，如 'Sune', 'Dot', 'T-shape', 'G-Perm', 'Ortega-OLL', 'Ortega-PBL' */
  subCategory: string;
  /** 编号：OLL 1-57，PLL 1-21，二阶 OLL 1-7，二阶 PBL 1-5 */
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
  /** 二阶公式 puzzle 类型，默认为 3x3x3 */
  puzzle?: '3x3x3' | '2x2x2';
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
  /** 小朋友模式：放大字体、隐藏 WCA 字母、默认开朗读 */
  kidMode?: boolean;
  /** 朗读引导语（小朋友模式默认开） */
  speechEnabled?: boolean;
  /** 已学/已选学习路径：tutorial=零基础教程；cfop=三阶高手；ortega=二阶 */
  learningPath?: 'tutorial' | 'cfop' | 'ortega' | null;
}

/**
 * 教程进度（每节课的完成情况）
 */
export interface TutorialProgress {
  /** 课程 id：tutorial-1 .. tutorial-8 */
  lessonId: string;
  /** 是否完成 */
  completed: boolean;
  /** 完成时间戳 */
  completedAt?: number;
  /** 获得星星数 0-3 */
  stars: number;
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
  | 'b2b_contact_click'
  | 'path_select'
  | 'kid_mode_toggle'
  | 'tutorial_lesson_start'
  | 'tutorial_lesson_complete'
  | 'speech_toggle';
